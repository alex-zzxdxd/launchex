package com.alex.launchex;

import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.util.Locale;

@CapacitorPlugin(name = "ApkInstaller")
public class ApkInstallerPlugin extends Plugin {
    private static final String APK_NAME = "launchex-update.apk";
    private static final int MAX_REDIRECTS = 5;
    private static final long MAX_APK_SIZE = 500L * 1024L * 1024L;

    @PluginMethod
    public void getAppVersion(PluginCall call) {
        try {
            PackageInfo info = getContext().getPackageManager()
                .getPackageInfo(getContext().getPackageName(), 0);

            JSObject result = new JSObject();
            result.put("versionName", info.versionName);
            call.resolve(result);
        } catch (PackageManager.NameNotFoundException e) {
            call.reject("No se pudo leer la versión instalada", e);
        }
    }

    @PluginMethod
    public void cleanResidualApks(PluginCall call) {
        try {
            File updateDirectory = getUpdateDirectory();
            if (updateDirectory.exists()) {
                File[] files = updateDirectory.listFiles();
                if (files == null) {
                    throw new IOException("No se pudo listar la caché de actualizaciones");
                }

                for (File file : files) {
                    String name = file.getName().toLowerCase(Locale.ROOT);
                    if (file.isFile()
                            && (name.endsWith(".apk") || name.endsWith(".apk.part"))
                            && !file.delete()) {
                        throw new IOException("No se pudo eliminar " + file.getName());
                    }
                }
            }
            call.resolve();
        } catch (IOException | SecurityException e) {
            call.reject("No se pudo limpiar la caché de actualizaciones", e);
        }
    }

    @PluginMethod
    public void downloadApk(PluginCall call) {
        String apkUrl = call.getString("url");
        if (apkUrl == null || !isAllowedUrl(apkUrl)) {
            call.reject("La URL del APK debe ser HTTPS y pertenecer a GitHub");
            return;
        }

        new Thread(() -> {
            File partialFile = null;
            try {
                File updateDirectory = getUpdateDirectory();
                if (!updateDirectory.exists() && !updateDirectory.mkdirs()) {
                    throw new IOException("No se pudo crear la caché de actualizaciones");
                }

                File apkFile = new File(updateDirectory, APK_NAME);
                partialFile = new File(updateDirectory, APK_NAME + ".part");
                download(apkUrl, partialFile);

                try (FileInputStream input = new FileInputStream(partialFile)) {
                    if (input.read() != 'P' || input.read() != 'K') {
                        throw new IOException("El archivo descargado no parece ser un APK válido");
                    }
                }

                if (apkFile.exists() && !apkFile.delete()) {
                    throw new IOException("No se pudo reemplazar el APK anterior");
                }
                if (!partialFile.renameTo(apkFile)) {
                    throw new IOException("No se pudo guardar el APK descargado");
                }

                JSObject result = new JSObject();
                result.put("fileName", APK_NAME);
                call.resolve(result);
            } catch (Exception e) {
                if (partialFile != null && partialFile.exists() && !partialFile.delete()) {
                    e.addSuppressed(new IOException("No se pudo eliminar la descarga incompleta"));
                }
                call.reject("No se pudo descargar el APK: " + e.getMessage(), e);
            }
        }, "launchex-apk-download").start();
    }

    @PluginMethod
    public void installApk(PluginCall call) {
        try {
            File apkFile = new File(getUpdateDirectory(), APK_NAME);
            if (!apkFile.isFile()) {
                call.reject("No hay un APK descargado para instalar");
                return;
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                    && !getContext().getPackageManager().canRequestPackageInstalls()) {
                Intent settingsIntent = new Intent(
                    Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    Uri.parse("package:" + getContext().getPackageName())
                );
                getActivity().startActivity(settingsIntent);
                call.reject("Permite a Launchex instalar apps y vuelve a pulsar Actualizar");
                return;
            }

            Uri apkUri = FileProvider.getUriForFile(
                getContext(),
                getContext().getPackageName() + ".fileprovider",
                apkFile
            );
            Intent installIntent = new Intent(Intent.ACTION_VIEW);
            installIntent.setDataAndType(
                apkUri,
                "application/vnd.android.package-archive"
            );
            installIntent.addFlags(
                Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK
            );
            getContext().startActivity(installIntent);
            call.resolve();
        } catch (IOException | IllegalArgumentException | SecurityException
                | android.content.ActivityNotFoundException e) {
            call.reject("No se pudo abrir el instalador de Android", e);
        }
    }

    private File getUpdateDirectory() throws IOException {
        File directory = new File(getContext().getCacheDir(), "updates").getCanonicalFile();
        File cacheDirectory = getContext().getCacheDir().getCanonicalFile();
        if (!directory.getPath().startsWith(cacheDirectory.getPath() + File.separator)) {
            throw new IOException("La ruta de caché no es válida");
        }
        return directory;
    }

    private void download(String sourceUrl, File destination) throws IOException {
        String currentUrl = sourceUrl;

        for (int redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
            if (!isAllowedUrl(currentUrl)) {
                throw new IOException("Redirección a un host no permitido");
            }

            HttpURLConnection connection =
                (HttpURLConnection) URI.create(currentUrl).toURL().openConnection();
            connection.setInstanceFollowRedirects(false);
            connection.setConnectTimeout(20000);
            connection.setReadTimeout(30000);

            try {
                int responseCode = connection.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_MOVED_PERM
                        || responseCode == HttpURLConnection.HTTP_MOVED_TEMP
                        || responseCode == HttpURLConnection.HTTP_SEE_OTHER
                        || responseCode == 307
                        || responseCode == 308) {
                    String location = connection.getHeaderField("Location");
                    if (location == null || redirectCount == MAX_REDIRECTS) {
                        throw new IOException("La descarga excedió el límite de redirecciones");
                    }
                    currentUrl = URI.create(currentUrl).resolve(location).toString();
                    continue;
                }

                if (responseCode < 200 || responseCode >= 300) {
                    throw new IOException("El servidor respondió HTTP " + responseCode);
                }

                long contentLength = connection.getContentLength();
                if (contentLength > MAX_APK_SIZE) {
                    throw new IOException("El APK excede el tamaño máximo permitido");
                }

                try (InputStream input = connection.getInputStream();
                     FileOutputStream output = new FileOutputStream(destination)) {
                    byte[] buffer = new byte[64 * 1024];
                    long totalBytes = 0;
                    int bytesRead;
                    while ((bytesRead = input.read(buffer)) != -1) {
                        totalBytes += bytesRead;
                        if (totalBytes > MAX_APK_SIZE) {
                            throw new IOException("El APK excede el tamaño máximo permitido");
                        }
                        output.write(buffer, 0, bytesRead);
                    }
                    if (totalBytes == 0) {
                        throw new IOException("El servidor devolvió un archivo vacío");
                    }
                }
                return;
            } finally {
                connection.disconnect();
            }
        }

        throw new IOException("No se pudo completar la descarga");
    }

    private boolean isAllowedUrl(String value) {
        try {
            URI uri = URI.create(value);
            String scheme = uri.getScheme();
            String host = uri.getHost();
            if (!"https".equalsIgnoreCase(scheme) || host == null || uri.getUserInfo() != null) {
                return false;
            }

            if (uri.getPort() != -1 && uri.getPort() != 443) {
                return false;
            }

            String normalizedHost = host.toLowerCase(Locale.ROOT);
            return "github.com".equals(normalizedHost)
                || "githubusercontent.com".equals(normalizedHost)
                || normalizedHost.endsWith(".githubusercontent.com");
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
