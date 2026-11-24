const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getMediaFiles: () => ipcRenderer.invoke('launchex:get-media-files'),
  launchMinecraft: () => ipcRenderer.invoke('launchex:launch-minecraft'),
  setMinecraftPriority: () => ipcRenderer.invoke('launchex:set-minecraft-priority'),
  clearCache: () => ipcRenderer.invoke('launchex:clear-cache'),
  openDiscord: () => ipcRenderer.invoke('launchex:open-discord'),
  getDownloadedTracks: () => ipcRenderer.invoke('launchex:get-downloaded-tracks'),
  downloadTrack: track => ipcRenderer.invoke('launchex:download-track', track),
  deleteTracks: fileNames => ipcRenderer.invoke('launchex:delete-tracks', fileNames),
  onTrackDownloadProgress: callback => {
    if (typeof callback !== 'function') {
      throw new TypeError('El callback de progreso debe ser una función.');
    }

    const listener = (_event, progress) => callback(progress);
    ipcRenderer.on('launchex:track-download-progress', listener);
    return () => ipcRenderer.removeListener('launchex:track-download-progress', listener);
  }
});