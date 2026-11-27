import { supabase } from './supabase.js';

function isAndroidCapacitor() {
  return window.Capacitor?.getPlatform?.() === 'android';
}

function getElectronApiMethod(methodName) {
  if (isAndroidCapacitor()) return null;

  const electronApi = window.electronAPI;
  if (!electronApi || typeof electronApi[methodName] !== 'function') return null;
  return electronApi[methodName].bind(electronApi);
}

function showDesktopOnlyMessage() {
  statusText.textContent = 'Esta función solo está disponible en la aplicación de escritorio.';
}

const MUSIC_CATALOG = [
  {
    id: 'atrevete-te-te',
    title: 'Atrévete-Te-Te (Clean Version)',
    artist: 'Calle 13',
    sizeText: '~27 MB',
    fileName: 'Atrevete.te.te.Clean.Version.-.Calle.13.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/Atrevete.te.te.Clean.Version.-.Calle.13.flac'
  },
  {
    id: 'breakin-dishes',
    title: 'Breakin’ Dishes',
    artist: 'Rihanna',
    sizeText: '~25.8 MB',
    fileName: 'Breakin.Dishes.-.Rihanna.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/Breakin.Dishes.-.Rihanna.flac'
  },
  {
    id: 'downtown',
    title: 'Downtown',
    artist: 'Anitta & J Balvin',
    sizeText: '~23.8 MB',
    fileName: 'Downtown.-.Anitta.J.Balvin.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/Downtown.-.Anitta.J.Balvin.flac'
  },
  {
    id: 'from-the-start',
    title: 'From the Start',
    artist: 'Laufey',
    sizeText: '~18.9 MB',
    fileName: 'From.The.Start.-.Laufey.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/From.The.Start.-.Laufey.flac'
  },
  {
    id: 'fuera-del-planeta-remix',
    title: 'Fuera del Planeta (Remix)',
    artist: 'Eloy, Jowell, Randy, Zion',
    sizeText: '~25.4 MB',
    fileName: 'Fuera.del.Planeta.Remix.-.Eloy.Jowell.Randy.Zion.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/Fuera.del.Planeta.Remix.-.Eloy.Jowell.Randy.Zion.flac'
  },
  {
    id: 'habits',
    title: 'Habits',
    artist: "Scott Bradlee's Postmodern Jukebox feat. Haley Reinhart",
    sizeText: '~21.6 MB',
    fileName: 'Habits.feat.Haley.Reinhart.-.Scott.Bradlee.s.Postmodern.Jukebox.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/Habits.feat.Haley.Reinhart.-.Scott.Bradlee.s.Postmodern.Jukebox.flac'
  },
  {
    id: 'here',
    title: 'Here',
    artist: 'Alessia Cara',
    sizeText: '~25.7 MB',
    fileName: 'Here.-.Alessia.Cara.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/Here.-.Alessia.Cara.flac'
  },
  {
    id: 'hot-girl-bummer',
    title: 'hot girl bummer',
    artist: 'blackbear',
    sizeText: '~21 MB',
    fileName: 'hot.girl.bummer.-.blackbear.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/hot.girl.bummer.-.blackbear.flac'
  },
  {
    id: 'i-wanna-be-yours',
    title: 'I Wanna Be Yours',
    artist: 'Arctic Monkeys',
    sizeText: '~17.5 MB',
    fileName: 'I.Wanna.Be.Yours.-.Arctic.Monkeys.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/I.Wanna.Be.Yours.-.Arctic.Monkeys.flac'
  },
  {
    id: 'love-me-not',
    title: 'Love Me Not',
    artist: 'Ravyn Lenae',
    sizeText: '~24 MB',
    fileName: 'Love.Me.Not.-.Ravyn.Lenae.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/Love.Me.Not.-.Ravyn.Lenae.flac'
  },
  {
    id: 'new-jeans',
    title: 'New Jeans',
    artist: 'NewJeans',
    sizeText: '~11.4 MB',
    fileName: 'New.Jeans.-.NewJeans.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/New.Jeans.-.NewJeans.flac'
  },
  {
    id: 'night-dancer',
    title: 'NIGHT DANCER',
    artist: 'imase',
    sizeText: '~23 MB',
    fileName: 'NIGHT.DANCER.-.IMASE.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/NIGHT.DANCER.-.IMASE.flac'
  },
  {
    id: 'untouchable-slowed-reverb',
    title: 'Untouchable (Slowed + Reverb)',
    artist: 'Farizki',
    sizeText: '~22.7 MB',
    fileName: 'No.Slowed.Reverb.-.Untouchable.Untouchable.-.Farizki.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/No.Slowed.Reverb.-.Untouchable.Untouchable.-.Farizki.flac'
  },
  {
    id: 'nuevo-fan',
    title: 'Nuevo Fan',
    artist: 'Rabelay',
    sizeText: '~24.8 MB',
    fileName: 'Nuevo.Fan.-.Rabelay.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/Nuevo.Fan.-.Rabelay.flac'
  },
  {
    id: 'nuts',
    title: 'nuts (feat. rainy bear)',
    artist: 'Lil Peep',
    sizeText: '~9.46 MB',
    fileName: 'nuts.feat.rainy.bear.-.Lil.Peep.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/nuts.feat.rainy.bear.-.Lil.Peep.flac'
  },
  {
    id: 'paparazzi-dubstep',
    title: 'Paparazzi (Dubstep Super Slowed)',
    artist: 'Alximo',
    sizeText: '~21.6 MB',
    fileName: 'Paparazzi.Dubstep.Super.Slowed.-.Alximo.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/Paparazzi.Dubstep.Super.Slowed.-.Alximo.flac'
  },
  {
    id: 'snowman',
    title: 'Snowman',
    artist: 'Sia',
    sizeText: '~19 MB',
    fileName: 'Snowman.-.Sia.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/Snowman.-.Sia.flac'
  },
  {
    id: 'the-perfect-pair',
    title: 'The Perfect Pair',
    artist: 'beabadoobee',
    sizeText: '~20.7 MB',
    fileName: 'The.Perfect.Pair.-.beabadoobee.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/The.Perfect.Pair.-.beabadoobee.flac'
  },
  {
    id: 'verte-de-cerca',
    title: 'Verte De Cerca',
    artist: 'Airbag',
    sizeText: '~23.2 MB',
    fileName: 'Verte.De.Cerca.-.Airbag.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/Verte.De.Cerca.-.Airbag.flac'
  },
  {
    id: 'wild-side',
    title: 'Wild Side (Anime Version)',
    artist: 'ALI',
    sizeText: '~11.6 MB',
    fileName: 'Wild.Side.Anime.Version.-.ALI.flac',
    url: 'https://github.com/alex-zzxdxd/launchex/releases/download/music-store/Wild.Side.Anime.Version.-.ALI.flac'
  }
];

const DISCORD_INVITE_URL = 'https://discord.gg/j5pFWK98c9';

// --- VIDEO Y AUDIO DE FONDO ---
const backgroundVideo = document.getElementById('bg-video');
const audioToggleBtn = document.getElementById('audio-toggle-btn');
const statusText = document.getElementById('status-text');
const backgroundPickerBtn = document.getElementById('background-picker-btn');
const backgroundPickerMenu = document.getElementById('background-picker-menu');
const backgroundPickerList = document.getElementById('background-picker-list');
const backgroundViewToggle = document.getElementById('background-view-toggle');
const backgroundViewIcon = document.getElementById('background-view-icon');
const backgroundStorageKey = 'launchex_bg';
const legacyBackgroundStorageKey = 'launchex-selected-background';
const backgroundViewStorageKey = 'launchex-background-view';
const mobileBackgroundPaths = [
  'background.mp4',
  'gato mar.webp',
  'nutrias.webp',
  're.jpg',
  'reviil medio cuerpo.webp',
  'rolplayers.webp',
  'icons/icon-48.webp',
  'icons/icon-72.webp',
  'icons/icon-96.webp',
  'icons/icon-128.webp',
  'icons/icon-192.webp',
  'icons/icon-256.webp',
  'icons/icon-512.webp'
];
const backgroundThumbnailCache = new Map();
const backgroundThumbnailPromises = new Map();
const backgroundPickerItems = new Map();
const videoThumbnailQueue = [];
const maxConcurrentVideoThumbnails = 2;
let activeVideoThumbnailCount = 0;
const accentCanvas = document.createElement('canvas');
accentCanvas.width = 10;
accentCanvas.height = 10;
accentCanvas.hidden = true;
document.body.appendChild(accentCanvas);
let backgroundFiles = [];
let backgroundViewMode = 'list';
let togglePointerStart = null;
let suppressNextToggleClick = false;
let currentBackgroundType = 'video';
const iconSoundOn = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>`;
const iconSoundOff = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>`;
let isAudioEnabled = false;

backgroundVideo.volume = 0.4;
backgroundVideo.muted = true;

function updateAudioButton() {
  audioToggleBtn.classList.toggle('muted', !isAudioEnabled);
  audioToggleBtn.innerHTML = isAudioEnabled ? iconSoundOn : iconSoundOff;
  audioToggleBtn.title = isAudioEnabled ? 'Silenciar audio' : 'Activar audio';
  audioToggleBtn.setAttribute('aria-label', audioToggleBtn.title);
  audioToggleBtn.setAttribute('aria-pressed', String(isAudioEnabled));
}

updateAudioButton();

audioToggleBtn.addEventListener('click', async () => {
  isAudioEnabled = !isAudioEnabled;
  backgroundVideo.muted = !isAudioEnabled;

  if (isAudioEnabled && currentBackgroundType === 'video') {
    try {
      await backgroundVideo.play();
    } catch (error) {
      isAudioEnabled = false;
      backgroundVideo.muted = true;
      updateAudioButton();
      audioToggleBtn.title = 'No se pudo reproducir el video. Comprueba el archivo.';
      audioToggleBtn.setAttribute('aria-label', audioToggleBtn.title);
      console.error('No se pudo reproducir el video de fondo:', error);
      return;
    }
  }

  updateAudioButton();
});

function showBackgroundPickerMessage(message) {
  backgroundPickerList.textContent = '';
  const messageElement = document.createElement('p');
  messageElement.className = 'background-menu-message';
  messageElement.textContent = message;
  backgroundPickerList.appendChild(messageElement);
}

function updateAccentFromMedia(media) {
  const width = media.videoWidth || media.naturalWidth;
  const height = media.videoHeight || media.naturalHeight;
  if (!width || !height) return;

  const context = accentCanvas.getContext('2d', { willReadFrequently: true });
  if (!context) return;

  try {
    context.drawImage(media, 0, 0, accentCanvas.width, accentCanvas.height);
    const pixels = context.getImageData(0, 0, accentCanvas.width, accentCanvas.height).data;
    const totals = [0, 0, 0];
    let sampleCount = 0;
    let redSampleCount = 0;

    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] < 128) continue;
      const red = pixels[index];
      const green = pixels[index + 1];
      const blue = pixels[index + 2];
      totals[0] += red;
      totals[1] += green;
      totals[2] += blue;
      if (red > 70 && red > green * 1.15 && red > blue * 1.15) redSampleCount++;
      sampleCount++;
    }

    if (!sampleCount) return;

    const extractedColor = totals.map(total => Math.round(total / sampleCount));
    const perceivedLuminance = color => 0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2];
    const hasRedTone = redSampleCount / sampleCount >= 0.2
      || (extractedColor[0] > extractedColor[1] * 1.15 && extractedColor[0] > extractedColor[2] * 1.15);
    const isDark = perceivedLuminance(extractedColor) < 100 && Math.max(...extractedColor) < 155;
    const accent = hasRedTone || isDark ? [239, 68, 68] : extractedColor;
    const rootStyle = document.documentElement.style;

    rootStyle.setProperty('--accent-color', `rgb(${accent.join(', ')})`);
    rootStyle.setProperty('--accent-glow', `rgba(${accent.join(', ')}, 0.35)`);
    rootStyle.setProperty('--accent-contrast', '#FFFFFF');
    rootStyle.setProperty('--accent-hover', `rgb(${accent.join(', ')})`);
  } catch (error) {
    console.error('No se pudo adaptar el color de la interfaz al fondo:', error);
  }
}

function createVideoThumbnail(backgroundFile) {
  return new Promise(resolve => {
    const video = document.createElement('video');
    let isFinished = false;
    const timeout = setTimeout(() => finish(null), 8000);

    function finish(thumbnail) {
      if (isFinished) return;
      isFinished = true;
      clearTimeout(timeout);
      try {
        video.pause();
        video.removeAttribute('src');
        video.load();
      } catch (error) {
        console.error(`No se pudo liberar el video de ${backgroundFile.name}:`, error);
      }
      resolve(thumbnail);
    }

    function captureFrame() {
      if (video.readyState < 2) return;

      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 90;
      const context = canvas.getContext('2d');
      if (!context) {
        finish(null);
        return;
      }

      try {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        finish(canvas.toDataURL('image/jpeg', 0.78));
      } catch (error) {
        console.error(`No se pudo generar la miniatura de ${backgroundFile.name}:`, error);
        finish(null);
      }
    }

    video.muted = true;
    video.preload = 'auto';
    video.playsInline = true;
    video.addEventListener('loadedmetadata', () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = Math.min(1, video.duration / 2);
      } else {
        captureFrame();
      }
    }, { once: true });
    video.addEventListener('seeked', captureFrame, { once: true });
    video.addEventListener('loadeddata', () => {
      if (video.currentTime === 0 || !Number.isFinite(video.duration)) captureFrame();
    }, { once: true });
    video.addEventListener('error', () => finish(null), { once: true });
    video.src = backgroundFile.url;
    video.load();
  });
}

function getVideoThumbnail(backgroundFile) {
  const key = backgroundFile.relativePath;
  if (backgroundThumbnailCache.has(key)) {
    return Promise.resolve(backgroundThumbnailCache.get(key));
  }

  const existingPromise = backgroundThumbnailPromises.get(key);
  if (existingPromise) return existingPromise;

  const thumbnailPromise = new Promise(resolve => {
    const startCapture = () => {
      activeVideoThumbnailCount++;
      createVideoThumbnail(backgroundFile)
        .then(thumbnailUrl => {
          backgroundThumbnailCache.set(key, thumbnailUrl);
          resolve(thumbnailUrl);
        })
        .catch(error => {
          console.error(`No se pudo generar la miniatura de ${backgroundFile.name}:`, error);
          backgroundThumbnailCache.set(key, null);
          resolve(null);
        })
        .finally(() => {
          activeVideoThumbnailCount--;
          backgroundThumbnailPromises.delete(key);
          const nextCapture = videoThumbnailQueue.shift();
          if (nextCapture) nextCapture();
        });
    };

    if (activeVideoThumbnailCount < maxConcurrentVideoThumbnails) {
      startCapture();
    } else {
      videoThumbnailQueue.push(startCapture);
    }
  });

  backgroundThumbnailPromises.set(key, thumbnailPromise);
  return thumbnailPromise;
}

function getCleanBackgroundName(backgroundFile) {
  const extensionIndex = backgroundFile.name.lastIndexOf('.');
  return backgroundFile.name.slice(0, extensionIndex < 0 ? undefined : extensionIndex)
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || backgroundFile.name;
}

function getMobileBackgroundFiles() {
  return mobileBackgroundPaths.map(relativePath => {
    const name = relativePath.slice(relativePath.lastIndexOf('/') + 1);
    const extension = name.slice(name.lastIndexOf('.')).toLowerCase();
    return {
      name,
      relativePath,
      extension,
      url: new URL(`assets/${relativePath}`, document.baseURI).href
    };
  });
}

function getSavedBackgroundPath() {
  const savedPath = localStorage.getItem(backgroundStorageKey);
  if (savedPath) return savedPath;

  const legacySavedPath = localStorage.getItem(legacyBackgroundStorageKey);
  if (legacySavedPath) localStorage.setItem(backgroundStorageKey, legacySavedPath);
  return legacySavedPath;
}

function updateBackgroundPickerView(persist = true) {
  const isGrid = backgroundViewMode === 'grid';
  backgroundPickerList.classList.toggle('is-grid', isGrid);
  backgroundViewToggle.classList.toggle('is-grid', isGrid);
  backgroundViewToggle.setAttribute('aria-checked', String(isGrid));
  backgroundViewToggle.setAttribute('aria-label', isGrid ? 'Cambiar vista a lista' : 'Cambiar vista a miniaturas');
  backgroundViewIcon.innerHTML = isGrid
    ? '<rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect>'
    : '<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>';

  backgroundFiles.forEach(backgroundFile => {
    const button = backgroundPickerItems.get(backgroundFile.relativePath);
    if (!button) return;

    button.classList.toggle('is-thumbnail', isGrid);
    button.replaceChildren();
    button.setAttribute('aria-label', getCleanBackgroundName(backgroundFile));
    button.setAttribute('aria-pressed', String(localStorage.getItem(backgroundStorageKey) === backgroundFile.relativePath));

    if (!isGrid) {
      const name = document.createElement('span');
      name.textContent = getCleanBackgroundName(backgroundFile);
      button.appendChild(name);
      return;
    }

    const thumbnail = document.createElement('img');
    thumbnail.className = 'background-thumbnail';
    thumbnail.alt = '';
    thumbnail.loading = 'lazy';
    const extension = backgroundFile.extension;

    if (extension === '.mp4' || extension === '.webm') {
      if (backgroundThumbnailCache.has(backgroundFile.relativePath)) {
        const cachedThumbnail = backgroundThumbnailCache.get(backgroundFile.relativePath);
        if (cachedThumbnail) thumbnail.src = cachedThumbnail;
        else thumbnail.classList.add('thumbnail-unavailable');
      } else {
        getVideoThumbnail(backgroundFile).then(thumbnailUrl => {
          if (thumbnailUrl) {
            thumbnail.src = thumbnailUrl;
          } else {
            thumbnail.classList.add('thumbnail-unavailable');
          }
        });
      }
    } else {
      thumbnail.src = backgroundFile.url;
      thumbnail.addEventListener('error', () => thumbnail.classList.add('thumbnail-unavailable'), { once: true });
    }

    button.appendChild(thumbnail);
  });

  if (persist) localStorage.setItem(backgroundViewStorageKey, backgroundViewMode);
}

function setBackgroundViewMode(mode, persist = true) {
  backgroundViewMode = mode;
  updateBackgroundPickerView(persist);
}

async function applyBackground(backgroundFile) {
  const fileUrl = backgroundFile.url;
  const extension = backgroundFile.extension;

  if (extension === '.mp4' || extension === '.webm') {
    currentBackgroundType = 'video';
    document.body.style.backgroundImage = '';
    document.body.style.backgroundSize = '';
    document.body.style.backgroundPosition = '';
    backgroundVideo.style.display = 'block';
    backgroundVideo.loop = true;
    backgroundVideo.muted = !isAudioEnabled;
    backgroundVideo.src = fileUrl;
    backgroundVideo.load();

    try {
      await backgroundVideo.play();
      updateAccentFromMedia(backgroundVideo);
    } catch (error) {
      console.error('No se pudo reproducir el fondo seleccionado:', error);
      statusText.textContent = 'No se pudo reproducir el fondo seleccionado.';
      return;
    }
  } else {
    currentBackgroundType = 'image';
    backgroundVideo.pause();
    backgroundVideo.style.display = 'none';
    document.body.style.backgroundImage = `url("${fileUrl}")`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';

    const backgroundImage = new Image();
    backgroundImage.addEventListener('load', () => updateAccentFromMedia(backgroundImage), { once: true });
    backgroundImage.addEventListener('error', error => console.error('No se pudo cargar la imagen de fondo:', error), { once: true });
    backgroundImage.src = fileUrl;
  }

  localStorage.setItem(backgroundStorageKey, backgroundFile.relativePath);
  updateBackgroundPickerView(false);
}

async function initializeBackgroundPicker() {
  if (isAndroidCapacitor()) {
    backgroundFiles = getMobileBackgroundFiles();
  } else {
    const getMediaFiles = getElectronApiMethod('getMediaFiles');
    if (!getMediaFiles) {
      showBackgroundPickerMessage('La selección de fondos solo está disponible en la aplicación de escritorio.');
      return;
    }

    try {
      backgroundFiles = await getMediaFiles();
    } catch (error) {
      console.error('No se pudieron leer los fondos de la carpeta assets:', error);
      showBackgroundPickerMessage(error.message || 'No se pudieron cargar los fondos disponibles.');
      return;
    }
  }

  backgroundFiles.sort((first, second) => first.relativePath.localeCompare(second.relativePath));
  if (backgroundFiles.length === 0) {
    showBackgroundPickerMessage('No hay archivos de imagen o video en assets.');
    return;
  }

  backgroundPickerItems.clear();
  backgroundPickerList.textContent = '';
  backgroundFiles.forEach(backgroundFile => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'background-menu-item';
    button.setAttribute('role', 'menuitemradio');
    button.setAttribute('aria-pressed', 'false');
    button.dataset.backgroundPath = backgroundFile.relativePath;
    button.title = getCleanBackgroundName(backgroundFile);
    button.addEventListener('click', async () => {
      await applyBackground(backgroundFile);
      backgroundPickerMenu.hidden = true;
      backgroundPickerBtn.setAttribute('aria-expanded', 'false');
    });
    backgroundPickerItems.set(backgroundFile.relativePath, button);
    backgroundPickerList.appendChild(button);
  });

  const savedViewMode = localStorage.getItem(backgroundViewStorageKey);
  setBackgroundViewMode(savedViewMode === 'grid' ? 'grid' : 'list', false);

  const savedPath = getSavedBackgroundPath();
  const selectedBackground = backgroundFiles.find(file => file.relativePath === savedPath)
    || backgroundFiles.find(file => file.relativePath === 'background.mp4')
    || backgroundFiles[0];
  applyBackground(selectedBackground);
}

backgroundViewToggle.addEventListener('click', () => {
  if (suppressNextToggleClick) {
    suppressNextToggleClick = false;
    return;
  }
  setBackgroundViewMode(backgroundViewMode === 'list' ? 'grid' : 'list');
});

backgroundViewToggle.addEventListener('pointerdown', event => {
  togglePointerStart = event.clientX;
  backgroundViewToggle.setPointerCapture(event.pointerId);
});

backgroundViewToggle.addEventListener('pointerup', event => {
  if (togglePointerStart !== null && Math.abs(event.clientX - togglePointerStart) > 4) {
    const bounds = backgroundViewToggle.getBoundingClientRect();
    setBackgroundViewMode(event.clientX < bounds.left + bounds.width / 2 ? 'list' : 'grid');
    suppressNextToggleClick = true;
    setTimeout(() => {
      suppressNextToggleClick = false;
    }, 250);
  }
  togglePointerStart = null;
});

backgroundViewToggle.addEventListener('pointercancel', () => {
  togglePointerStart = null;
});

backgroundPickerBtn.addEventListener('click', () => {
  backgroundPickerMenu.hidden = !backgroundPickerMenu.hidden;
  backgroundPickerBtn.setAttribute('aria-expanded', String(!backgroundPickerMenu.hidden));
});

document.addEventListener('click', event => {
  if (!backgroundPickerBtn.contains(event.target) && !backgroundPickerMenu.contains(event.target)) {
    backgroundPickerMenu.hidden = true;
    backgroundPickerBtn.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !backgroundPickerMenu.hidden) {
    backgroundPickerMenu.hidden = true;
    backgroundPickerBtn.setAttribute('aria-expanded', 'false');
    backgroundPickerBtn.focus();
  }
});

initializeBackgroundPicker();

// --- ELEMENTOS DE LA INTERFAZ GENERAL Y BOTONES PRINCIPALES ---
const navDedsafio = document.getElementById('nav-dedsafio');
const navFps = document.getElementById('nav-fps');
const navNotes = document.getElementById('nav-notes');
const viewDedsafio = document.getElementById('view-dedsafio');
const viewFps = document.getElementById('view-fps');
const viewNotes = document.getElementById('view-notes');

const playBtn = document.getElementById('btn-play');
const discordBtn = document.getElementById('btn-discord');
const btnOptHigh = document.getElementById('btn-opt-high');
const btnClearCache = document.getElementById('btn-clear-cache');

// --- LÓGICA DEL BOTÓN JUGAR AHORA (MINECRAFT BEDROCK) ---
if (playBtn) {
  playBtn.addEventListener('click', async () => {
    if (isAndroidCapacitor()) {
      statusText.textContent = 'Abriendo Minecraft...';
      window.location.href = 'minecraft://';
      return;
    }

    const launchGame = getElectronApiMethod('launchGame')
      || getElectronApiMethod('launchMinecraft');
    if (!launchGame) {
      showDesktopOnlyMessage();
      return;
    }

    statusText.textContent = 'Verificando archivos del servidor...';
    playBtn.disabled = true;
    playBtn.style.opacity = '0.6';

    try {
      statusText.textContent = 'Iniciando Dedsafío 3...';
      const result = await launchGame();
      statusText.textContent = result.message;
      if (!result.success) alert(result.message);
    } catch (error) {
      console.error('Error al iniciar Minecraft:', error);
      statusText.textContent = error.message || 'Error al abrir el juego automáticamente.';
    } finally {
      resetPlayButton();
    }
  });
}

function resetPlayButton() {
  setTimeout(() => {
    if (playBtn) {
      playBtn.disabled = false;
      playBtn.style.opacity = '1';
    }
    if (statusText.textContent.includes('Juego abierto') || statusText.textContent.includes('Minecraft')) {
      statusText.textContent = 'Listo para jugar';
    }
  }, 4000);
}

// --- LÓGICA DEL BOTÓN DE DISCORD ---
if (discordBtn) {
  discordBtn.addEventListener('click', async () => {
    if (isAndroidCapacitor()) {
      window.open(DISCORD_INVITE_URL, '_blank');
      return;
    }

    const openDiscord = getElectronApiMethod('openDiscord');
    if (!openDiscord) {
      showDesktopOnlyMessage();
      return;
    }

    try {
      await openDiscord();
    } catch (error) {
      console.error('No se pudo abrir Discord:', error);
      statusText.textContent = error.message || 'No se pudo abrir Discord.';
    }
  });
}

// --- LÓGICA DE LOS BOTONES DE AJUSTES DE FPS ---
if (btnOptHigh) {
  btnOptHigh.addEventListener('click', async () => {
    if (isAndroidCapacitor()) {
      statusText.textContent = 'Android administra automáticamente los recursos del juego.';
      return;
    }

    const setMinecraftPriority = getElectronApiMethod('setMinecraftPriority');
    if (!setMinecraftPriority) {
      showDesktopOnlyMessage();
      return;
    }

    btnOptHigh.disabled = true;
    statusText.textContent = 'Aplicando prioridad alta al proceso...';
    try {
      const result = await setMinecraftPriority();
      statusText.textContent = result.message;
    } catch (error) {
      console.error('No se pudo cambiar la prioridad de Minecraft:', error);
      statusText.textContent = error.message || 'No se pudo cambiar la prioridad del juego.';
    } finally {
      btnOptHigh.disabled = false;
    }
  });
}

if (btnClearCache) {
  btnClearCache.addEventListener('click', async () => {
    if (isAndroidCapacitor()) {
      const apkInstaller = window.Capacitor?.Plugins?.ApkInstaller;
      if (typeof apkInstaller?.cleanResidualApks !== 'function') {
        statusText.textContent = 'La limpieza de APKs no está disponible en esta versión.';
        return;
      }

      btnClearCache.disabled = true;
      statusText.textContent = 'Limpiando APKs temporales del actualizador...';
      try {
        await apkInstaller.cleanResidualApks();
        statusText.textContent = 'APKs temporales eliminados.';
      } catch (error) {
        console.error('No se pudieron limpiar los APKs temporales:', error);
        statusText.textContent = error.message || 'No se pudieron limpiar los APKs temporales.';
      } finally {
        btnClearCache.disabled = false;
      }
      return;
    }

    const clearCache = getElectronApiMethod('clearCache');
    if (!clearCache) {
      showDesktopOnlyMessage();
      return;
    }

    btnClearCache.disabled = true;
    statusText.textContent = 'Limpiando archivos temporales de caché...';
    try {
      const result = await clearCache();
      statusText.textContent = result.message;
    } catch (error) {
      console.error('No se pudo limpiar la caché:', error);
      statusText.textContent = error.message || 'No se pudo limpiar la caché.';
    } finally {
      btnClearCache.disabled = false;
    }
  });
}

// --- CATÁLOGO DE MÚSICA ---
const musicExtensionBtn = document.getElementById('music-extension-btn');
const musicPlayerPanel = document.getElementById('music-player-panel');
const musicPlayerClose = document.getElementById('music-player-close');
const musicCurrentTitle = document.getElementById('music-current-title');
const musicTrackList = document.getElementById('music-track-list');
const musicTrackCount = document.getElementById('music-track-count');
const musicDeleteSelectedButton = document.getElementById('music-delete-selected');
const musicPlayPauseBtn = document.getElementById('music-play-pause');
const musicPreviousBtn = document.getElementById('music-previous');
const musicNextBtn = document.getElementById('music-next');
const musicSeek = document.getElementById('music-seek');
const musicCurrentTime = document.getElementById('music-current-time');
const musicDuration = document.getElementById('music-duration');
const musicVolume = document.getElementById('music-volume');
const musicAudio = new Audio();
musicAudio.preload = 'none';

let musicTracks = [];
let currentMusicTrackIndex = -1;
const downloadingMusicTracks = new Set();
const musicDownloadProgress = new Map();
const selectedMusicTracks = new Set();
let musicDeletionInProgress = false;

function formatMusicTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function updateMusicPlaybackControls() {
  const isPlaying = !musicAudio.paused;
  musicPlayPauseBtn.textContent = isPlaying ? 'Ⅱ' : '▶';
  musicPlayPauseBtn.setAttribute('aria-label', isPlaying ? 'Pausar' : 'Reproducir');
}

function updateMusicTimeline() {
  const duration = musicAudio.duration;
  const currentTime = musicAudio.currentTime;
  musicCurrentTime.textContent = formatMusicTime(currentTime);
  musicDuration.textContent = formatMusicTime(duration);
  musicSeek.value = Number.isFinite(duration) && duration > 0
    ? String((currentTime / duration) * 100)
    : '0';
}

async function playMusicTrack(index) {
  if (!musicTracks.length) return;
  currentMusicTrackIndex = (index + musicTracks.length) % musicTracks.length;
  const track = musicTracks[currentMusicTrackIndex];

  musicAudio.pause();
  musicAudio.src = track.url;
  musicAudio.load();
  musicCurrentTitle.textContent = `${track.title} — ${track.artist}`;
  updateMusicTimeline();

  try {
    await musicAudio.play();
  } catch (error) {
    console.error(`No se pudo reproducir ${track.title}:`, error);
    musicCurrentTitle.textContent = `${track.title} (error de reproducción)`;
  }
}

function renderMusicCatalog(downloadedFileNames) {
  const downloadedTracks = new Map(downloadedFileNames.map(track => [track.fileName, track]));
  musicTrackCount.textContent = `${musicTracks.length}/${MUSIC_CATALOG.length}`;
  musicTrackList.replaceChildren();
  musicDeleteSelectedButton.disabled = selectedMusicTracks.size === 0 || musicDeletionInProgress;

  MUSIC_CATALOG.forEach(catalogTrack => {
    const downloadedTrack = downloadedTracks.get(catalogTrack.fileName);
    const isDownloading = downloadingMusicTracks.has(catalogTrack.fileName);
    const card = document.createElement('article');
    card.className = 'music-track-card';

    const info = document.createElement('div');
    info.className = 'music-track-info';
    const title = document.createElement('strong');
    title.className = 'music-track-title';
    title.textContent = catalogTrack.title;
    const artist = document.createElement('span');
    artist.className = 'music-track-artist';
    artist.textContent = catalogTrack.artist;
    const size = document.createElement('span');
    size.className = 'music-track-size';
    size.textContent = catalogTrack.sizeText;
    info.append(title, artist, size);

    const actions = document.createElement('div');
    actions.className = 'music-track-actions';
    if (downloadedTrack) {
      const selectLabel = document.createElement('label');
      selectLabel.className = 'music-track-select';
      const selectCheckbox = document.createElement('input');
      selectCheckbox.type = 'checkbox';
      selectCheckbox.checked = selectedMusicTracks.has(catalogTrack.fileName);
      selectCheckbox.disabled = musicDeletionInProgress;
      selectCheckbox.setAttribute('aria-label', `Seleccionar ${catalogTrack.title} para borrar`);
      selectCheckbox.addEventListener('change', () => {
        if (selectCheckbox.checked) {
          selectedMusicTracks.add(catalogTrack.fileName);
        } else {
          selectedMusicTracks.delete(catalogTrack.fileName);
        }
        musicDeleteSelectedButton.disabled = selectedMusicTracks.size === 0 || musicDeletionInProgress;
      });
      selectLabel.appendChild(selectCheckbox);
      actions.appendChild(selectLabel);

      const playButton = document.createElement('button');
      playButton.type = 'button';
      playButton.className = 'music-track-action';
      playButton.textContent = 'Reproducir';
      playButton.addEventListener('click', () => {
        const index = musicTracks.findIndex(track => track.fileName === catalogTrack.fileName);
        if (index >= 0) playMusicTrack(index);
      });

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'music-track-action music-delete-action';
      deleteButton.textContent = 'Eliminar';
      deleteButton.disabled = musicDeletionInProgress;
      deleteButton.addEventListener('click', () => removeMusicTracks(
        [catalogTrack.fileName],
        `¿Deseas eliminar "${catalogTrack.title}"?`
      ));
      actions.append(playButton, deleteButton);
    } else {
      const downloadButton = document.createElement('button');
      downloadButton.type = 'button';
      downloadButton.className = 'music-track-action';
      downloadButton.textContent = isDownloading ? 'Descargando...' : 'Descargar';
      downloadButton.disabled = isDownloading;
      downloadButton.addEventListener('click', () => downloadMusicTrack(catalogTrack));
      actions.appendChild(downloadButton);
    }

    card.append(info, actions);
    if (isDownloading) {
      const progress = document.createElement('progress');
      progress.className = 'music-download-progress';
      progress.max = 100;
      progress.value = musicDownloadProgress.get(catalogTrack.fileName) || 0;
      card.appendChild(progress);
      const status = document.createElement('span');
      status.className = 'music-track-download-status';
      status.textContent = `${progress.value}%`;
      card.appendChild(status);
    }
    musicTrackList.appendChild(card);
  });
}

async function loadMusicCatalog() {
  const getDownloadedTracks = getElectronApiMethod('getDownloadedTracks');
  if (!getDownloadedTracks) {
    musicTrackCount.textContent = `0/${MUSIC_CATALOG.length}`;
    musicTrackList.textContent = 'La biblioteca de música solo está disponible en la aplicación de escritorio.';
    return;
  }

  try {
    const downloadedTracks = await getDownloadedTracks();
    const downloadedByName = new Map(downloadedTracks.map(track => [track.fileName, track]));
    for (const fileName of selectedMusicTracks) {
      if (!downloadedByName.has(fileName)) selectedMusicTracks.delete(fileName);
    }
    const currentFileName = musicTracks[currentMusicTrackIndex]?.fileName;
    musicTracks = MUSIC_CATALOG
      .filter(track => downloadedByName.has(track.fileName))
      .map(track => ({ ...track, url: downloadedByName.get(track.fileName).url }));
    currentMusicTrackIndex = musicTracks.findIndex(track => track.fileName === currentFileName);
    if (currentFileName && currentMusicTrackIndex < 0) {
      musicAudio.pause();
      musicAudio.removeAttribute('src');
      musicAudio.load();
      musicCurrentTitle.textContent = 'Selecciona una canción';
      musicCurrentTime.textContent = '0:00';
      musicDuration.textContent = '0:00';
      musicSeek.value = '0';
      updateMusicPlaybackControls();
    }
    renderMusicCatalog(downloadedTracks);
  } catch (error) {
    console.error('No se pudo cargar el catálogo de canciones descargadas:', error);
    musicTrackList.textContent = '';
    const errorMessage = document.createElement('p');
    errorMessage.className = 'music-empty-message';
    errorMessage.textContent = error.message || 'No se pudo cargar el catálogo de canciones.';
    musicTrackList.appendChild(errorMessage);
  }
}

async function downloadMusicTrack(track) {
  const downloadTrack = getElectronApiMethod('downloadTrack');
  if (!downloadTrack) {
    showDesktopOnlyMessage();
    return;
  }

  downloadingMusicTracks.add(track.fileName);
  musicDownloadProgress.set(track.fileName, 0);
  renderMusicCatalog(musicTracks);
  try {
    await downloadTrack({ fileName: track.fileName, url: track.url });
    await loadMusicCatalog();
  } catch (error) {
    console.error(`No se pudo descargar ${track.title}:`, error);
    statusText.textContent = error.message || `No se pudo descargar ${track.title}.`;
  } finally {
    downloadingMusicTracks.delete(track.fileName);
    musicDownloadProgress.delete(track.fileName);
    await loadMusicCatalog();
  }
}

async function removeMusicTracks(fileNames, confirmationMessage = '¿Deseas eliminar las canciones seleccionadas?') {
  const uniqueFileNames = [...new Set(fileNames)];
  if (!uniqueFileNames.length) return;

  const deleteTracks = getElectronApiMethod('deleteTracks');
  if (!deleteTracks) {
    showDesktopOnlyMessage();
    return;
  }
  if (!window.confirm(confirmationMessage)) return;

  musicDeletionInProgress = true;
  musicDeleteSelectedButton.disabled = true;
  if (uniqueFileNames.includes(musicTracks[currentMusicTrackIndex]?.fileName)) {
    musicAudio.pause();
    musicAudio.removeAttribute('src');
    musicAudio.load();
    currentMusicTrackIndex = -1;
    musicCurrentTitle.textContent = 'Selecciona una canción';
    musicCurrentTime.textContent = '0:00';
    musicDuration.textContent = '0:00';
    musicSeek.value = '0';
    updateMusicPlaybackControls();
  }

  try {
    await loadMusicCatalog();
    const result = await deleteTracks(uniqueFileNames);
    if (!result || !Array.isArray(result.deleted) || !Array.isArray(result.failures)) {
      throw new Error('La respuesta del borrado de canciones no es válida.');
    }
    result.deleted.forEach(fileName => selectedMusicTracks.delete(fileName));
    if (result.failures.length) {
      console.error('Algunas canciones no se pudieron eliminar:', result.failures);
      const firstFailure = result.failures[0];
      statusText.textContent = `Se eliminaron ${result.deleted.length}; no se pudieron eliminar ${result.failures.length}. ${firstFailure.fileName}: ${firstFailure.message}`;
    } else {
      statusText.textContent = `Se eliminaron ${result.deleted.length} canción(es).`;
    }
  } catch (error) {
    console.error('No se pudieron eliminar las canciones seleccionadas:', error);
    statusText.textContent = error.message || 'No se pudieron eliminar las canciones seleccionadas.';
  } finally {
    musicDeletionInProgress = false;
    await loadMusicCatalog();
  }
}

musicDeleteSelectedButton.addEventListener('click', () => {
  removeMusicTracks([...selectedMusicTracks]);
});

const onTrackDownloadProgress = getElectronApiMethod('onTrackDownloadProgress');
if (onTrackDownloadProgress) {
  const unsubscribeTrackDownloadProgress = onTrackDownloadProgress(progress => {
    if (!progress || !downloadingMusicTracks.has(progress.fileName)) return;
    const percent = Math.max(0, Math.min(100, Number(progress.percent) || 0));
    musicDownloadProgress.set(progress.fileName, percent);
    window.requestAnimationFrame(() => renderMusicCatalog(musicTracks));
  });
  if (typeof unsubscribeTrackDownloadProgress === 'function') {
    window.addEventListener('beforeunload', unsubscribeTrackDownloadProgress, { once: true });
  }
}

musicExtensionBtn.addEventListener('click', async () => {
  musicExtensionBtn.disabled = true;
  musicPlayerPanel.hidden = false;
  await loadMusicCatalog();
  musicExtensionBtn.disabled = false;
});

musicPlayerClose.addEventListener('click', () => {
  musicPlayerPanel.hidden = true;
});

musicPlayPauseBtn.addEventListener('click', async () => {
  if (currentMusicTrackIndex < 0) {
    await playMusicTrack(0);
  } else if (musicAudio.paused) {
    try {
      await musicAudio.play();
    } catch (error) {
      console.error('No se pudo reanudar la canción:', error);
    }
  } else {
    musicAudio.pause();
  }
});

musicPreviousBtn.addEventListener('click', () => {
  if (!musicTracks.length) return;
  if (musicAudio.currentTime > 3) {
    musicAudio.currentTime = 0;
  } else {
    playMusicTrack(currentMusicTrackIndex < 0
      ? musicTracks.length - 1
      : currentMusicTrackIndex - 1);
  }
});

musicNextBtn.addEventListener('click', () => {
  if (musicTracks.length) playMusicTrack(currentMusicTrackIndex + 1);
});

musicSeek.addEventListener('input', () => {
  if (Number.isFinite(musicAudio.duration) && musicAudio.duration > 0) {
    musicAudio.currentTime = (Number(musicSeek.value) / 100) * musicAudio.duration;
  }
});

musicVolume.addEventListener('input', () => {
  musicAudio.volume = Number(musicVolume.value);
});

musicAudio.addEventListener('timeupdate', updateMusicTimeline);
musicAudio.addEventListener('loadedmetadata', updateMusicTimeline);
musicAudio.addEventListener('play', updateMusicPlaybackControls);
musicAudio.addEventListener('pause', updateMusicPlaybackControls);
musicAudio.addEventListener('ended', () => {
  if (musicTracks.length) playMusicTrack(currentMusicTrackIndex + 1);
});
musicAudio.addEventListener('error', () => {
  if (currentMusicTrackIndex >= 0) {
    console.error('No se pudo leer el archivo de audio:', musicTracks[currentMusicTrackIndex].name);
  }
});
musicAudio.volume = Number(musicVolume.value);

// --- ELEMENTOS DE AUTENTICACIÓN ---
const authContainer = document.getElementById('auth-container');
const notesDashboard = document.getElementById('notes-dashboard');
const authTitle = document.getElementById('auth-title');
const authUsernameInput = document.getElementById('auth-username');
const authEmailInput = document.getElementById('auth-email');
const authPasswordInput = document.getElementById('auth-password');
const btnAuthSubmit = document.getElementById('btn-auth-submit');
const authToggleLink = document.getElementById('auth-toggle-link');
const authToggleText = document.getElementById('auth-toggle-text');
const btnLogout = document.getElementById('btn-logout');

// --- ELEMENTOS DE GRUPOS ---
const noGroupSection = document.getElementById('no-group-section');
const hasGroupSection = document.getElementById('has-group-section');
const groupTitleHeader = document.getElementById('group-title-header');
const displayGroupCode = document.getElementById('display-group-code');
const inputNewGroupName = document.getElementById('input-new-group-name');
const btnCreateGroup = document.getElementById('btn-create-group');
const inputJoinCode = document.getElementById('input-join-code');
const btnJoinGroup = document.getElementById('btn-join-group');
const btnLeaveGroup = document.getElementById('btn-leave-group');

// --- ELEMENTOS DE NOTAS Y SLIDER ---
const noteInput = document.getElementById('note-input');
const noteExpireRange = document.getElementById('note-expire-range');
const expireLabel = document.getElementById('expire-label');
const btnCreateNote = document.getElementById('btn-create-note');
const taskCharCount = document.getElementById('task-char-count');
const taskInputMaxHeight = 120;
const taskInputMaxLength = 500;

let isRegistering = false;
let currentGroup = null;

// --- NAVEGACIÓN ENTRE VISTAS ---
navDedsafio.addEventListener('click', () => switchView(viewDedsafio, navDedsafio));
navFps.addEventListener('click', () => switchView(viewFps, navFps));
navNotes.addEventListener('click', () => {
  switchView(viewNotes, navNotes);
  checkUserSession();
});

function switchView(activeView, activeBtn) {
  [viewDedsafio, viewFps, viewNotes].forEach(v => v.style.display = 'none');
  [navDedsafio, navFps, navNotes].forEach(b => b.classList.remove('active'));
  activeView.style.display = 'block';
  activeBtn.classList.add('active');
}

// --- AUTENTICACIÓN ---
authToggleLink.addEventListener('click', (e) => {
  e.preventDefault();
  isRegistering = !isRegistering;
  if (isRegistering) {
    authTitle.textContent = 'Crear Cuenta';
    btnAuthSubmit.textContent = 'Registrarse';
    authUsernameInput.style.display = 'block';
    authToggleText.textContent = '¿Ya tienes cuenta?';
    authToggleLink.textContent = 'Inicia sesión';
  } else {
    authTitle.textContent = 'Iniciar Sesión';
    btnAuthSubmit.textContent = 'Entrar';
    authUsernameInput.style.display = 'none';
    authToggleText.textContent = '¿No tienes cuenta?';
    authToggleLink.textContent = 'Regístrate aquí';
  }
});

btnAuthSubmit.addEventListener('click', async () => {
  const email = authEmailInput.value.trim();
  const password = authPasswordInput.value.trim();
  const username = authUsernameInput.value.trim();

  if (!email || !password) {
    alert('Por favor completa todos los campos.');
    return;
  }

  if (isRegistering && !username) {
    alert('Por favor ingresa un nombre de usuario.');
    return;
  }

  btnAuthSubmit.disabled = true;
  try {
    if (isRegistering) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error('No se pudo crear el usuario.');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, username }]);
      if (profileError) throw new Error(`Error al guardar el perfil: ${profileError.message}`);

      alert('¡Cuenta creada con éxito! Revisa tu correo o inicia sesión.');
      isRegistering = false;
      authTitle.textContent = 'Iniciar Sesión';
      btnAuthSubmit.textContent = 'Entrar';
      authUsernameInput.style.display = 'none';
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(`Credenciales incorrectas: ${error.message}`);

      if (data.user) {
        const { data: existingProfile, error: profileQueryError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle();
        if (profileQueryError) throw new Error(`Error al consultar el perfil: ${profileQueryError.message}`);

        if (!existingProfile) {
          const defaultUsername = email.split('@')[0];
          const { error: profileInsertError } = await supabase
            .from('profiles')
            .insert([{ id: data.user.id, username: defaultUsername }]);
          if (profileInsertError) {
            throw new Error(`Error al crear el perfil: ${profileInsertError.message}`);
          }
        }

        await checkUserSession();
      }
    }
  } catch (error) {
    console.error('Error en autenticación o perfil:', error);
    alert(error.message || 'No se pudo completar la operación de cuenta.');
  } finally {
    btnAuthSubmit.disabled = false;
  }
});

btnLogout.addEventListener('click', async () => {
  await supabase.auth.signOut();
  authContainer.style.display = 'block';
  notesDashboard.style.display = 'none';
  btnLogout.hidden = true;
  currentGroup = null;
  taskListRequestId++;
});

async function checkUserSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    btnLogout.hidden = !session;
    if (session) {
      authContainer.style.display = 'none';
      notesDashboard.style.display = 'block';
      await checkUserGroup(session.user.id);
    } else {
      authContainer.style.display = 'block';
      notesDashboard.style.display = 'none';
      currentGroup = null;
    }
  } catch (error) {
    console.error('No se pudo verificar la sesión:', error);
    statusText.textContent = error.message || 'No se pudo verificar la sesión.';
  }
}

// --- GESTIÓN DE GRUPOS ---
async function checkUserGroup(userId) {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .select('group_id, groups(id, name, code)')
      .eq('user_id', userId)
      .eq('status', 'accepted')
      .maybeSingle();
    if (error) throw error;

    if (data && data.groups) {
      currentGroup = data.groups;
      groupTitleHeader.textContent = currentGroup.name;
      displayGroupCode.textContent = currentGroup.code;
      noGroupSection.style.display = 'none';
      hasGroupSection.style.display = 'flex';
      btnLeaveGroup.style.display = 'inline-block';
    } else {
      currentGroup = null;
      groupTitleHeader.textContent = 'Sin Grupo Activo';
      noGroupSection.style.display = 'flex';
      hasGroupSection.style.display = 'none';
      btnLeaveGroup.style.display = 'none';
    }
  } catch (error) {
    console.error('No se pudo consultar el grupo del usuario:', error);
    statusText.textContent = error.message || 'No se pudo cargar el grupo.';
  }
}

btnCreateGroup.addEventListener('click', async () => {
  const groupName = inputNewGroupName.value.trim();
  if (!groupName) {
    alert('Poné un nombre para el grupo.');
    return;
  }

  btnCreateGroup.disabled = true;
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('Inicia sesión antes de crear un grupo.');

    let groupData = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const inviteCode = generateInviteCode();
      const { data: existingGroup, error: lookupError } = await supabase
        .from('groups')
        .select('id')
        .eq('code', inviteCode)
        .maybeSingle();
      if (lookupError) throw new Error(`Error al verificar el código: ${lookupError.message}`);
      if (existingGroup) continue;

      const { data, error: groupError } = await supabase
        .from('groups')
        .insert([{ name: groupName, code: inviteCode, created_by: user.id }])
        .select()
        .single();
      if (groupError) {
        if (groupError.code === '23505') continue;
        throw new Error(`Error al crear el grupo: ${groupError.message}`);
      }
      if (!data) throw new Error('La base de datos no devolvió el grupo creado.');
      groupData = data;
      break;
    }

    if (!groupData) {
      throw new Error('No se pudo generar un código de invitación único. Inténtalo de nuevo.');
    }

    const { error: memberError } = await supabase
      .from('group_members')
      .insert([{ group_id: groupData.id, user_id: user.id, status: 'accepted' }]);
    if (memberError) throw new Error(`Error al unirte al grupo creado: ${memberError.message}`);

    inputNewGroupName.value = '';
    await checkUserGroup(user.id);
  } catch (error) {
    console.error('No se pudo crear el grupo:', error);
    alert(error.message || 'No se pudo crear el grupo.');
  } finally {
    btnCreateGroup.disabled = false;
  }
});

function generateInviteCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const maxByte = Math.floor(256 / alphabet.length) * alphabet.length;
  const code = [];

  while (code.length < 6) {
    const randomBytes = new Uint8Array(16);
    window.crypto.getRandomValues(randomBytes);
    randomBytes.forEach(byte => {
      if (byte < maxByte && code.length < 6) {
        code.push(alphabet[byte % alphabet.length]);
      }
    });
  }

  return code.join('');
}

btnJoinGroup.addEventListener('click', async () => {
  const code = inputJoinCode.value.trim().toUpperCase();
  if (!code) {
    alert('Ingresá un código válido.');
    return;
  }

  btnJoinGroup.disabled = true;
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('Inicia sesión antes de unirte a un grupo.');

    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .select('id, name')
      .eq('code', code)
      .maybeSingle();
    if (groupError) throw new Error(`Error al buscar el grupo: ${groupError.message}`);
    if (!groupData) throw new Error('No se encontró ningún grupo con ese código.');

    const { error: joinError } = await supabase
      .from('group_members')
      .insert([{ group_id: groupData.id, user_id: user.id, status: 'accepted' }]);
    if (joinError) throw new Error(`No se pudo unir al grupo: ${joinError.message}`);

    inputJoinCode.value = '';
    alert(`¡Te uniste a ${groupData.name} con éxito!`);
    await checkUserGroup(user.id);
  } catch (error) {
    console.error('No se pudo unir al grupo:', error);
    alert(error.message || 'No se pudo unir al grupo.');
  } finally {
    btnJoinGroup.disabled = false;
  }
});

btnLeaveGroup.addEventListener('click', async () => {
  if (!currentGroup) return;
  btnLeaveGroup.disabled = true;
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('Inicia sesión antes de salir del grupo.');

    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', currentGroup.id)
      .eq('user_id', user.id);
    if (error) throw error;

    await checkUserGroup(user.id);
  } catch (error) {
    console.error('No se pudo salir del grupo:', error);
    alert(error.message || 'Error al salir del grupo.');
  } finally {
    btnLeaveGroup.disabled = false;
  }
});

// --- SLIDER Y TAREAS ---
noteExpireRange.addEventListener('input', (e) => {
  const days = e.target.value;
  expireLabel.textContent = `${days} ${days == 1 ? 'día' : 'días'}`;
});

function resizeTaskInput() {
  noteInput.style.height = 'auto';
  noteInput.style.height = `${Math.min(noteInput.scrollHeight, taskInputMaxHeight)}px`;
  noteInput.style.overflowY = noteInput.scrollHeight > taskInputMaxHeight ? 'auto' : 'hidden';
  taskCharCount.textContent = `${noteInput.value.length}/${taskInputMaxLength}`;
}

noteInput.addEventListener('input', resizeTaskInput);
resizeTaskInput();

async function createGroupTask() {
  if (btnCreateNote.disabled) return;

  const content = noteInput.value.trim();
  if (!content) {
    alert('Escribe el contenido de la tarea.');
    return;
  }

  if (!currentGroup) {
    alert('No estás en ningún grupo.');
    return;
  }

  btnCreateNote.disabled = true;
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('Inicia sesión antes de crear una tarea.');

    const daysValid = Number.parseInt(noteExpireRange.value, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysValid);

    const { error } = await supabase
      .from('group_notes')
      .insert([{
        group_id: currentGroup.id,
        user_id: user.id,
        content,
        expires_at: expiresAt.toISOString()
      }]);
    if (error) throw new Error(`Error al crear la tarea: ${error.message}`);

    noteInput.value = '';
    resizeTaskInput();
    isPanelOpen = true;
    sideTasksPanel.style.right = '0';
    await loadSideGroupNotes(currentGroup.id);
  } catch (error) {
    console.error('No se pudo crear la tarea:', error);
    alert(error.message || 'No se pudo crear la tarea.');
  } finally {
    btnCreateNote.disabled = false;
  }
}

btnCreateNote.addEventListener('click', createGroupTask);

function submitTaskOnEnter(event) {
  if (event.key === 'Enter' && !event.isComposing) {
    event.preventDefault();
    createGroupTask();
  }
}

noteInput.addEventListener('keydown', submitTaskOnEnter);
noteExpireRange.addEventListener('keydown', submitTaskOnEnter);

// --- PANEL LATERAL DE TAREAS Y CONTADOR ---
const tasksPanelBtn = document.getElementById('tasks-panel-btn');
const sideTasksPanel = document.getElementById('side-tasks-panel');
const closeTasksPanel = document.getElementById('close-tasks-panel');
const sideTasksList = document.getElementById('side-tasks-list');

let isPanelOpen = false;
let taskListRequestId = 0;

tasksPanelBtn.addEventListener('click', () => {
  isPanelOpen = !isPanelOpen;
  sideTasksPanel.style.right = isPanelOpen ? '0' : '-350px';
  if (isPanelOpen && currentGroup) {
    loadSideGroupNotes(currentGroup.id);
  } else {
    taskListRequestId++;
  }
});

closeTasksPanel.addEventListener('click', () => {
  isPanelOpen = false;
  taskListRequestId++;
  sideTasksPanel.style.right = '-350px';
});

async function purgeExpiredTasks(groupId, nowIso) {
  const { error } = await supabase
    .from('group_notes')
    .delete()
    .eq('group_id', groupId)
    .lte('expires_at', nowIso);

  if (error) {
    console.error('Error al purgar tareas expiradas:', error);
  }
}

async function loadSideGroupNotes(groupId) {
  const requestId = ++taskListRequestId;
  sideTasksList.innerHTML = '<p style="color: #a0a0b8; font-size: 13px; text-align: center;">Sincronizando tareas...</p>';
  const nowIso = new Date().toISOString();
  await purgeExpiredTasks(groupId, nowIso);
  if (requestId !== taskListRequestId || !currentGroup || currentGroup.id !== groupId) return;

  const { data, error } = await supabase
    .from('group_notes')
    .select('*')
    .eq('group_id', groupId)
    .gt('expires_at', nowIso)
    .order('created_at', { ascending: false });

  if (requestId !== taskListRequestId || !currentGroup || currentGroup.id !== groupId) return;

  if (error) {
    console.error('Error cargando notas:', error);
    sideTasksList.textContent = '';
    const errorMessage = document.createElement('p');
    errorMessage.style.cssText = 'color: #f87171; font-size: 13px; text-align: center;';
    errorMessage.textContent = `Error: ${error.message}`;
    sideTasksList.appendChild(errorMessage);
    return;
  }

  if (!data || data.length === 0) {
    sideTasksList.innerHTML = '<p style="color: #a0a0b8; font-size: 13px; text-align: center;">No hay tareas activas en este grupo.</p>';
    return;
  }

  sideTasksList.innerHTML = '';
  data.forEach(note => {
    const noteEl = document.createElement('div');
    noteEl.style.cssText = 'background: rgba(0,0,0,0.4); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 8px;';

    const noteHeader = document.createElement('div');
    noteHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: flex-start;';

    const content = document.createElement('span');
    content.style.cssText = 'color: #fff; font-size: 13px; word-break: break-word; max-width: 85%;';
    content.textContent = note.content;

    const deleteButton = document.createElement('button');
    deleteButton.style.cssText = 'background: transparent; border: none; color: #f87171; cursor: pointer; font-size: 13px;';
    deleteButton.title = 'Borrar';
    deleteButton.textContent = '✕';
    deleteButton.addEventListener('click', () => deleteNoteFromSide(note.id));

    noteHeader.append(content, deleteButton);

    const noteFooter = document.createElement('div');
    noteFooter.style.cssText = 'display: flex; justify-content: flex-end; align-items: center; font-size: 11px; color: #a0a0b8; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 6px;';

    const countdown = document.createElement('span');
    countdown.className = 'countdown-timer';
    countdown.dataset.expires = note.expires_at;
    countdown.style.cssText = 'color: var(--accent-color); font-weight: 600;';
    countdown.textContent = 'Calculando...';

    noteFooter.appendChild(countdown);
    noteEl.append(noteHeader, noteFooter);
    sideTasksList.appendChild(noteEl);
  });
}

async function deleteNoteFromSide(noteId) {
  const { error } = await supabase.from('group_notes').delete().eq('id', noteId);
  if (error) {
    console.error('Error borrando nota:', error);
    alert('Error al borrar la tarea: ' + error.message);
    return;
  }
  if (currentGroup) loadSideGroupNotes(currentGroup.id);
}

// Actualizar los contadores hacia atrás cada 1 segundo
setInterval(() => {
  if (!isPanelOpen) return;
  const timers = document.querySelectorAll('.countdown-timer');
  timers.forEach(timer => {
    const expiresAt = new Date(timer.getAttribute('data-expires')).getTime();
    const now = new Date().getTime();
    const distance = expiresAt - now;

    if (distance < 0) {
      timer.textContent = 'Expirada';
      timer.style.color = '#f87171';
    } else {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        timer.textContent = `${days}d ${hours}h ${minutes}m`;
      } else {
        timer.textContent = `${hours}h ${minutes}m ${seconds}s`;
      }
    }
  });
}, 1000);