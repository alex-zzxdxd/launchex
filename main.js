const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { execFile } = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');
const { pathToFileURL } = require('url');
const { randomUUID } = require('crypto');
const { Transform } = require('stream');
const { pipeline } = require('stream/promises');

const mediaExtensions = new Set(['.mp4', '.webm', '.png', '.jpg', '.jpeg', '.webp', '.gif']);
const discordInviteUrl = 'https://discord.gg/j5pFWK98c9';
const allowedTrackRedirectHosts = new Set([
  'github.com',
  'release-assets.githubusercontent.com',
  'objects.githubusercontent.com'
]);
const maximumTrackDownloadSize = 50 * 1024 * 1024;
let mainWindow;
const activeTrackDownloads = new Set();

function getMusicDirectory() {
  return path.join(app.getPath('userData'), 'music');
}

function assertTrustedSender(event) {
  if (!mainWindow || event.sender !== mainWindow.webContents
    || event.senderFrame !== mainWindow.webContents.mainFrame) {
    throw new Error('Solicitud IPC no autorizada.');
  }
}

function validateTrackFileName(fileName) {
  if (typeof fileName !== 'string'
    || fileName.length > 128
    || path.basename(fileName) !== fileName
    || !/^[a-z0-9][a-z0-9 ._()-]*\.(?:mp3|ogg|flac)$/i.test(fileName)
    || /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])\./i.test(fileName)) {
    throw new Error('El nombre del archivo de canción no es válido.');
  }
  return fileName;
}

function getTrackFilePath(fileName) {
  return path.join(getMusicDirectory(), validateTrackFileName(fileName));
}

function validateTrackUrl(rawUrl, fileName, isRedirect = false) {
  if (typeof rawUrl !== 'string' || rawUrl.length > 4096) {
    throw new Error('La URL de la canción no es válida.');
  }

  const url = new URL(rawUrl);
  if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443')) {
    throw new Error('La canción debe descargarse mediante HTTPS.');
  }

  if (isRedirect) {
    if (!allowedTrackRedirectHosts.has(url.hostname.toLowerCase())) {
      throw new Error('GitHub redirigió la descarga a un host no permitido.');
    }
    return url;
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(url.pathname);
  } catch {
    throw new Error('La URL de la canción tiene una ruta inválida.');
  }
  const expectedPath = `/alex-zzxdxd/launchex/releases/download/music-store/${fileName}`;
  if (url.hostname.toLowerCase() !== 'github.com' || decodedPath !== expectedPath) {
    throw new Error('La URL debe apuntar al archivo del catálogo en GitHub Releases.');
  }
  return url;
}

function getTrackResponse(rawUrl, fileName, redirectCount = 0) {
  const url = validateTrackUrl(rawUrl, fileName, redirectCount > 0);
  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      headers: { 'User-Agent': 'Launchex-Music-Catalog' }
    }, response => {
      const status = response.statusCode || 0;
      if ([301, 302, 303, 307, 308].includes(status)) {
        const location = response.headers.location;
        response.resume();
        if (!location || redirectCount >= 5) {
          reject(new Error('La descarga excedió el límite de redirecciones.'));
          return;
        }
        try {
          getTrackResponse(new URL(location, url).href, fileName, redirectCount + 1)
            .then(resolve, reject);
        } catch (error) {
          reject(error);
        }
        return;
      }

      if (status !== 200) {
        response.resume();
        reject(new Error(`GitHub respondió con estado HTTP ${status}.`));
        return;
      }

      const contentLength = Number(response.headers['content-length']);
      if (Number.isFinite(contentLength) && contentLength > maximumTrackDownloadSize) {
        response.destroy();
        reject(new Error('La canción supera el límite de descarga de 50 MB.'));
        return;
      }
      resolve(response);
    });

    request.setTimeout(30000, () => request.destroy(new Error('Tiempo de espera de descarga agotado.')));
    request.on('error', reject);
  });
}

function sendTrackDownloadProgress(webContents, progress) {
  if (!webContents.isDestroyed()) {
    webContents.send('launchex:track-download-progress', progress);
  }
}

async function downloadTrackToDisk(fileName, url, targetPath, webContents) {
  const response = await getTrackResponse(url, fileName);
  const responseLength = Number(response.headers['content-length']);
  const totalBytes = Number.isFinite(responseLength) && responseLength > 0 ? responseLength : 0;
  let downloadedBytes = 0;
  let lastPercent = -1;

  sendTrackDownloadProgress(webContents, { fileName, percent: 0, downloadedBytes, totalBytes });
  const progressStream = new Transform({
    transform(chunk, encoding, callback) {
      downloadedBytes += chunk.length;
      if (downloadedBytes > maximumTrackDownloadSize) {
        callback(new Error('La canción supera el límite de descarga de 50 MB.'));
        return;
      }

      const percent = totalBytes
        ? Math.min(99, Math.floor((downloadedBytes / totalBytes) * 100))
        : 0;
      if (percent !== lastPercent) {
        lastPercent = percent;
        sendTrackDownloadProgress(webContents, { fileName, percent, downloadedBytes, totalBytes });
      }
      callback(null, chunk);
    }
  });

  await pipeline(response, progressStream, fs.createWriteStream(targetPath, { flags: 'wx' }));
  sendTrackDownloadProgress(webContents, { fileName, percent: 100, downloadedBytes, totalBytes });
}

async function getDownloadedTracks() {
  let entries;
  try {
    entries = await fs.promises.readdir(getMusicDirectory(), { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }

  return entries
    .filter(entry => entry.isFile() && /\.(?:mp3|ogg|flac)$/i.test(entry.name))
    .map(entry => ({
      fileName: entry.name,
      url: pathToFileURL(path.join(getMusicDirectory(), entry.name)).href
    }))
    .sort((first, second) => first.fileName.localeCompare(second.fileName));
}

async function listMediaFiles(directory, relativeDirectory = '') {
  const entries = await fs.promises.readdir(directory, { withFileTypes: true });
  const mediaFiles = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    const relativePath = path.posix.join(relativeDirectory, entry.name);

    if (entry.isDirectory()) {
      mediaFiles.push(...await listMediaFiles(fullPath, relativePath));
    } else if (entry.isFile()) {
      const extension = path.extname(entry.name).toLowerCase();
      if (mediaExtensions.has(extension)) {
        mediaFiles.push({
          name: entry.name,
          relativePath,
          extension,
          url: pathToFileURL(fullPath).href
        });
      }
    }
  }

  return mediaFiles;
}

function registerIpcHandlers() {
  ipcMain.handle('launchex:get-media-files', async event => {
    assertTrustedSender(event);
    try {
      const assetsDirectory = path.join(__dirname, 'src', 'assets');
      return await listMediaFiles(assetsDirectory);
    } catch (error) {
      console.error('No se pudieron leer los archivos multimedia:', error);
      throw new Error('No se pudieron cargar los fondos disponibles.');
    }
  });

  ipcMain.handle('launchex:launch-minecraft', async event => {
    assertTrustedSender(event);
    try {
      const localAppData = process.env.LOCALAPPDATA
        || path.join(app.getPath('home'), 'AppData', 'Local');
      const packagePath = path.join(
        localAppData,
        'Packages',
        'Microsoft.MinecraftUWP_8wekyb3d8bbwe'
      );
      await fs.promises.access(packagePath);
      await shell.openExternal('minecraft://');
      return { success: true, message: '¡Juego abierto con éxito!' };
    } catch (error) {
      if (error.code === 'ENOENT') {
        return {
          success: false,
          message: 'No se encontró Minecraft Bedrock instalado en esta PC.'
        };
      }
      console.error('No se pudo iniciar Minecraft:', error);
      throw new Error('Error al abrir el juego automáticamente.');
    }
  });

  ipcMain.handle('launchex:set-minecraft-priority', async event => {
    assertTrustedSender(event);
    const command = `try {
  $processes = Get-Process -Name "Minecraft.Windows" -ErrorAction SilentlyContinue
  if (-not $processes) { throw "Minecraft no está en ejecución." }
  $processes | ForEach-Object { $_.PriorityClass = "High" }
  Write-Output "Prioridad alta aplicada con éxito."
} catch {
  [Console]::Error.WriteLine($_.Exception.Message)
  exit 1
}`;

    try {
      const { stdout } = await new Promise((resolve, reject) => {
        execFile('powershell.exe', [
          '-NoProfile',
          '-NonInteractive',
          '-ExecutionPolicy',
          'Bypass',
          '-Command',
          command
        ], { windowsHide: true }, (error, output, stderr) => {
          if (error) {
            reject(new Error(stderr.trim() || error.message));
            return;
          }
          resolve({ stdout: output });
        });
      });
      return { success: true, message: stdout.trim() };
    } catch (error) {
      console.error('No se pudo cambiar la prioridad de Minecraft:', error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle('launchex:clear-cache', async event => {
    assertTrustedSender(event);
    const userDataDirectory = path.resolve(app.getPath('userData'));
    const cacheDirectories = ['Cache', 'Code Cache'].map(name =>
      path.resolve(userDataDirectory, name)
    );

    try {
      for (const cacheDirectory of cacheDirectories) {
        if (path.dirname(cacheDirectory) !== userDataDirectory) {
          throw new Error('La ruta de caché no es válida.');
        }
        await fs.promises.rm(cacheDirectory, { recursive: true, force: true });
        await fs.promises.mkdir(cacheDirectory, { recursive: true });
      }
      return { success: true, message: 'La caché de la aplicación se limpió correctamente.' };
    } catch (error) {
      console.error('No se pudo limpiar la caché:', error);
      throw new Error('No se pudo limpiar toda la caché de la aplicación.');
    }
  });

  ipcMain.handle('launchex:open-discord', async event => {
    assertTrustedSender(event);
    await shell.openExternal(discordInviteUrl);
  });

  ipcMain.handle('launchex:get-downloaded-tracks', async event => {
    assertTrustedSender(event);
    return getDownloadedTracks();
  });

  ipcMain.handle('launchex:download-track', async (event, track) => {
    assertTrustedSender(event);
    if (!track || typeof track !== 'object' || Array.isArray(track)
      || Object.keys(track).some(key => !['fileName', 'url'].includes(key))) {
      throw new Error('Los datos de descarga de la canción no son válidos.');
    }

    const fileName = validateTrackFileName(track.fileName);
    validateTrackUrl(track.url, fileName);
    const downloadKey = fileName.toLowerCase();
    if (activeTrackDownloads.has(downloadKey)) {
      throw new Error('Esta canción ya se está descargando.');
    }
    activeTrackDownloads.add(downloadKey);

    const targetPath = getTrackFilePath(fileName);
    const temporaryPath = `${targetPath}.${randomUUID()}.part`;
    try {
      await fs.promises.mkdir(getMusicDirectory(), { recursive: true });
      try {
        await fs.promises.access(targetPath);
        throw new Error('La canción ya está descargada.');
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }

      await downloadTrackToDisk(fileName, track.url, temporaryPath, event.sender);
      await fs.promises.rename(temporaryPath, targetPath);
      return { success: true, fileName };
    } catch (error) {
      await fs.promises.rm(temporaryPath, { force: true }).catch(cleanupError => {
        console.error('No se pudo limpiar el archivo temporal de la canción:', cleanupError);
      });
      console.error(`No se pudo descargar ${fileName}:`, error);
      throw new Error(error.message || 'No se pudo descargar la canción.');
    } finally {
      activeTrackDownloads.delete(downloadKey);
    }
  });

  ipcMain.handle('launchex:delete-tracks', (event, fileNames) => {
    assertTrustedSender(event);
    const requestedNames = Array.isArray(fileNames) ? fileNames : [fileNames];
    if (!requestedNames.length || requestedNames.length > 100) {
      throw new Error('La selección de canciones no es válida.');
    }

    const musicDirectory = path.resolve(getMusicDirectory());
    let musicDirectoryStats;
    try {
      musicDirectoryStats = fs.lstatSync(musicDirectory);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('La carpeta de música no existe.');
      }
      throw error;
    }
    if (!musicDirectoryStats.isDirectory() || musicDirectoryStats.isSymbolicLink()) {
      throw new Error('La ubicación de música no es una carpeta segura.');
    }

    const uniqueNames = new Map();
    requestedNames.map(validateTrackFileName).forEach(fileName => {
      if (!uniqueNames.has(fileName.toLowerCase())) uniqueNames.set(fileName.toLowerCase(), fileName);
    });
    const targets = [...uniqueNames.values()].map(fileName => {
      const targetPath = path.resolve(musicDirectory, fileName);
      if (path.dirname(targetPath) !== musicDirectory) {
        throw new Error('La ruta de la canción queda fuera del almacenamiento musical.');
      }
      return { fileName, targetPath };
    });
    const result = { deleted: [], failures: [] };

    for (const { fileName, targetPath } of targets) {
      if (activeTrackDownloads.has(fileName.toLowerCase())) {
        result.failures.push({
          fileName,
          message: 'No se puede eliminar una canción mientras se descarga.'
        });
        continue;
      }

      try {
        fs.unlinkSync(targetPath);
        result.deleted.push(fileName);
      } catch (error) {
        console.error(`No se pudo eliminar ${fileName}:`, error);
        result.failures.push({
          fileName,
          message: error.code === 'ENOENT'
            ? 'La canción no existe en el almacenamiento local.'
            : 'No se pudo eliminar la canción.'
        });
      }
    }

    return result;
  });
}

function configureAutoUpdater() {
  if (!app.isPackaged) return;

  const { autoUpdater } = require('electron-updater');
  let lastLoggedProgress = -1;

  autoUpdater.on('checking-for-update', () => {
    console.info('Buscando actualizaciones de Launchex...');
  });
  autoUpdater.on('update-available', info => {
    console.info(`Actualización disponible: ${info.version}`);
  });
  autoUpdater.on('update-not-available', info => {
    console.info(`Launchex está actualizado (versión ${info.version}).`);
  });
  autoUpdater.on('download-progress', progress => {
    const percent = Math.floor(progress.percent);
    if (percent !== lastLoggedProgress) {
      lastLoggedProgress = percent;
      console.info(`Descargando actualización: ${percent}%`);
    }
  });
  autoUpdater.on('update-downloaded', info => {
    console.info(`Actualización ${info.version} descargada; se instalará al cerrar Launchex.`);
  });
  autoUpdater.on('error', error => {
    console.error('Error en el actualizador de Launchex:', error);
  });

  autoUpdater.checkForUpdatesAndNotify().catch(error => {
    console.error('No se pudo comprobar si hay actualizaciones:', error);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    minWidth: 900,
    minHeight: 600,
    resizable: true,
    maximizable: true,
    frame: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.setMenu(null);

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  const indexUrl = pathToFileURL(path.join(__dirname, 'src', 'index.html')).href;
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url !== indexUrl) {
      event.preventDefault();
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

registerIpcHandlers();
app.whenReady().then(() => {
  createWindow();
  configureAutoUpdater();
}).catch(error => {
  console.error('No se pudo iniciar Launchex:', error);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
