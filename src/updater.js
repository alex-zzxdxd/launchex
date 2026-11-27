// Cambia esta URL por la ubicación HTTPS definitiva de latest.json.
const VERSION_URL = 'https://raw.githubusercontent.com/alex-zzxdxd/launchex/main/latest.json';
const APK_INSTALLER = window.Capacitor?.registerPlugin?.('ApkInstaller');

const modal = document.getElementById('update-modal');
const versionLabel = document.getElementById('update-version');
const errorLabel = document.getElementById('update-error');
const installButton = document.getElementById('update-install');
const dismissButton = document.getElementById('update-dismiss');

function compareVersions(leftVersion, rightVersion) {
  const versionPattern = /^v?(\d+)\.(\d+)\.(\d+)$/;
  const leftMatch = leftVersion.match(versionPattern);
  const rightMatch = rightVersion.match(versionPattern);
  if (!leftMatch || !rightMatch) {
    throw new Error('El formato de versión debe ser major.minor.patch');
  }

  for (let index = 1; index <= 3; index++) {
    const difference = Number(leftMatch[index]) - Number(rightMatch[index]);
    if (difference !== 0) return Math.sign(difference);
  }
  return 0;
}

function isAllowedApkUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  const hostname = url.hostname.toLowerCase();
  return url.protocol === 'https:'
    && !url.username
    && !url.password
    && (!url.port || url.port === '443')
    && (hostname === 'github.com'
      || hostname === 'githubusercontent.com'
      || hostname.endsWith('.githubusercontent.com'));
}

function showUpdate(version) {
  versionLabel.textContent = version;
  modal.hidden = false;
  installButton.disabled = false;
  installButton.textContent = 'Actualizar';
  errorLabel.hidden = true;
  errorLabel.textContent = '';
}

function showUpdateError(error) {
  errorLabel.textContent = error instanceof Error
    ? error.message
    : 'No se pudo completar la actualización. Inténtalo nuevamente.';
  errorLabel.hidden = false;
  installButton.disabled = false;
  installButton.textContent = 'Reintentar';
}

async function checkForUpdate() {
  if (window.Capacitor?.getPlatform?.() !== 'android' || !APK_INSTALLER) return;

  try {
    await APK_INSTALLER.cleanResidualApks();
    const response = await fetch(VERSION_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`No se pudo consultar la versión (HTTP ${response.status})`);
    }

    const latest = await response.json();
    if (typeof latest.version !== 'string'
        || typeof latest.apkUrl !== 'string'
        || !isAllowedApkUrl(latest.apkUrl)) {
      throw new Error('El JSON de actualización tiene una versión o URL de APK no válida');
    }

    const installed = await APK_INSTALLER.getAppVersion();
    if (compareVersions(latest.version, installed.versionName) > 0) {
      showUpdate(latest.version);
      installButton.addEventListener('click', async () => {
        installButton.disabled = true;
        installButton.textContent = 'Descargando...';
        errorLabel.hidden = true;
        try {
          await APK_INSTALLER.downloadApk({ url: latest.apkUrl });
          installButton.textContent = 'Abriendo instalador...';
          await APK_INSTALLER.installApk();
        } catch (error) {
          showUpdateError(error);
        }
      });
    }
  } catch (error) {
    console.error('Error al comprobar actualizaciones de Launchex:', error);
  }
}

dismissButton.addEventListener('click', () => {
  modal.hidden = true;
});

void checkForUpdate();
