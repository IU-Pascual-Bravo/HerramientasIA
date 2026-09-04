const puzzleContainer = document.getElementById('puzzleContainer');
const resetButton = document.getElementById('resetButton');
const messageContainer = document.getElementById('messageContainer');
const message = document.getElementById('message');
const playAgainButton = document.getElementById('playAgainButton');
const loadingMessage = document.getElementById('loadingMessage');
const promptInput = document.getElementById('promptInput');
const loadUrlButton = document.getElementById('loadUrlButton');
const downloadButton = document.getElementById('downloadButton');
const saveButton = document.getElementById('saveButton');
const galleryButton = document.getElementById('galleryButton');
const savedCount = document.getElementById('savedCount');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const sizeSelectors = document.querySelectorAll('.size-selector');

let savedPuzzles = [];
let videoUrl = '';
let videoBase64 = '';
let hexGrid = [];
let rotations = [];
let scale = 1;
let rings = 1;
let R = 0;
let isUploading = false;
let videoNaturalWidth = 1024;
let videoNaturalHeight = 1024;
let videoElements = [];

sizeSelectors.forEach(selector => {
  selector.addEventListener('click', () => {
    sizeSelectors.forEach(s => s.classList.remove('active'));
    selector.classList.add('active');
    rings = parseInt(selector.dataset.rings);
    initPuzzle();
  });
});

uploadButton.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) uploadVideoFile(e.target.files[0]);
  e.target.value = '';
});
async function uploadVideoFile(file) {
  if (isUploading) return;
  isUploading = true;
  const originalText = uploadButton.textContent;
  uploadButton.textContent = 'Procesando...';
  uploadButton.disabled = true;
  messageContainer.style.display = 'none';
  const loader = document.getElementById('loadingMessage');
  if (loader) {
    loader.style.display = 'block';
    loader.textContent = 'Procesando video...';
  }
  
  try {
    videoUrl = URL.createObjectURL(file);
    videoBase64 = '';
    promptInput.value = '';
    initPuzzle();
  } catch (error) {
    alert('Error al procesar el video. Intenta de nuevo.');
    if (loader) loader.textContent = 'Error al procesar el video.';
  } finally {
    isUploading = false;
    uploadButton.textContent = originalText;
    uploadButton.disabled = false;
  }
}

loadUrlButton.addEventListener('click', () => {
  const url = promptInput.value.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    alert('Por favor, ingresa una URL valida (debe empezar con http:// o https://)');
    return;
  }
  videoUrl = url;
  videoBase64 = '';
  initPuzzle();
});

function createPuzzlePieces() {
  puzzleContainer.innerHTML = '';
  videoElements = [];
  hexGrid = [];
  for (let q = -rings; q <= rings; q++) {
    let r1 = Math.max(-rings, -q - rings);
    let r2 = Math.min(rings, -q + rings);
    for (let r = r1; r <= r2; r++) hexGrid.push({q, r});
  }
  const totalPieces = hexGrid.length;
  rotations = Array.from({ length: totalPieces }, () => Math.floor(Math.random() * 6) * 60);
  const availableWidth = window.innerWidth - 40;
  const maxSize = Math.min(availableWidth, 400);
  const K = rings;
  const Rx = maxSize / (2 * Math.sqrt(3) * K + 2);
  const Ry = maxSize / (3 * K + 2);
  R = Math.min(Rx, Ry);
  puzzleContainer.style.width = `${maxSize}px`;
  puzzleContainer.style.height = `${maxSize}px`;
  const CX = maxSize / 2;
  const CY = maxSize / 2;
  const scaleFactor = maxSize / Math.min(videoNaturalWidth, videoNaturalHeight);
  const bgWidth = videoNaturalWidth * scaleFactor;
  const bgHeight = videoNaturalHeight * scaleFactor;
  const bgOffsetX = (bgWidth - maxSize) / 2;
  const bgOffsetY = (bgHeight - maxSize) / 2;

  for (let i = 0; i < totalPieces; i++) {
    const pieceWrapper = document.createElement('div');
    pieceWrapper.className = 'puzzle-piece';
    pieceWrapper.style.width = `${2 * R}px`;
    pieceWrapper.style.height = `${2 * R}px`;

    const video = document.createElement('video');
    video.src = videoUrl;
    if (videoUrl.startsWith('http')) video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.style.position = 'absolute';
    video.style.width = `${bgWidth}px`;
    video.style.height = `${bgHeight}px`;
    video.style.objectFit = 'cover';
    video.style.pointerEvents = 'none';

    updateVideoPiecePosition(pieceWrapper, video, i, CX, CY, bgOffsetX, bgOffsetY);

    pieceWrapper.appendChild(video);
    pieceWrapper.addEventListener('click', () => rotatePiece(pieceWrapper, i));
    puzzleContainer.appendChild(pieceWrapper);
    videoElements.push(video);
    video.play().catch(() => {});
  }

  setTimeout(() => {
    videoElements.forEach(v => {
      v.currentTime = 0;
      v.play().catch(() => {});
    });
  }, 100);

  loadingMessage.style.display = 'none';
}

function updateVideoPiecePosition(pieceWrapper, video, index, CX, CY, bgOffsetX, bgOffsetY) {
  const {q, r} = hexGrid[index];
  const centerX = CX + Math.sqrt(3) * R * (q + r / 2);
  const centerY = CY + 1.5 * R * r;
  const left = centerX - R;
  const top = centerY - R;
  pieceWrapper.style.left = `${left}px`;
  pieceWrapper.style.top = `${top}px`;
  video.style.left = `${-(left + bgOffsetX)}px`;
  video.style.top = `${-(top + bgOffsetY)}px`;
  pieceWrapper.style.setProperty('--rot', `${rotations[index]}deg`);
}

function rotatePiece(pieceWrapper, index) {
  rotations[index] += 60;
  pieceWrapper.style.setProperty('--rot', `${rotations[index]}deg`);
  checkWin();
}

function showConfetti() {
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800'];
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `position:fixed;width:10px;height:10px;background:${colors[Math.floor(Math.random()*colors.length)]};left:${Math.random()*100}vw;top:-20px;border-radius:50%;pointer-events:none;z-index:1000;animation:confettiFall ${2+Math.random()*2}s linear forwards`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
}

function showFullVideo() {
  puzzleContainer.querySelectorAll('.puzzle-piece').forEach(p => p.style.opacity = '0');
  const video = document.createElement('video');
  video.src = videoUrl;
  if (videoUrl.startsWith('http')) video.crossOrigin = 'anonymous';
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;animation:fadeIn 0.5s ease forwards;z-index:10';
  puzzleContainer.appendChild(video);
  video.play().catch(() => {});
}

function checkWin() {
  if (rotations.every(rotation => rotation % 360 === 0)) {
    setTimeout(() => {
      message.textContent = '¡Felicidades! Puzzle completado.';
      messageContainer.style.display = 'flex';
      showFullVideo();
      showConfetti();
    }, 300);
  }
}

async function initPuzzle() {
  messageContainer.style.display = 'none';
  const loader = document.getElementById('loadingMessage');
  if (loader) loader.style.display = 'block';
  
  if (!videoUrl) {
    videoUrl = 'modelo.mp4';
    videoBase64 = '';
    // Intentamos cargar el base64 en background para que esté listo al descargar/guardar
    fetch('modelo.mp4').then(r => r.blob()).then(blob => {
      const reader = new FileReader();
      reader.onloadend = () => { videoBase64 = reader.result; };
      reader.readAsDataURL(blob);
    }).catch(err => console.warn('No se pudo convertir modelo.mp4 a Base64 localmente:', err));
  }
  
  scale = 1;
  puzzleContainer.style.transform = `scale(${scale})`;
  try {
    const video = document.createElement('video');
    if (videoUrl.startsWith('http')) video.crossOrigin = 'anonymous';
    video.onloadedmetadata = () => {
      videoNaturalWidth = video.videoWidth || 1024;
      videoNaturalHeight = video.videoHeight || 1024;
      createPuzzlePieces();
    };
    video.onerror = () => {
      console.error('Error cargando video:', videoUrl);
      videoNaturalWidth = 1024;
      videoNaturalHeight = 1024;
      createPuzzlePieces();
    };
    video.src = videoUrl;
    video.load();
  } catch (error) {
    if (loader) loader.textContent = 'Error al cargar el video.';
    console.error('Error en initPuzzle:', error);
  }
}

async function convertVideoToBase64() {
  if (!videoUrl) return '';
  if (videoBase64) return videoBase64;
  try {
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        videoBase64 = reader.result;
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn('Error al convertir video a Base64:', e);
    return videoUrl;
  }
}

async function buildPuzzleHtml() {
  const cssStyles = `* { box-sizing: border-box; } body { font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px 10px; background-color: #f0f0f0; overflow-x: hidden; } .main-content { display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: center; gap: 30px; margin-bottom: 20px; width: 100%; max-width: 800px; } .puzzle-container { position: relative; background-color: #333; border-radius: 8px; overflow: hidden; transition: transform 0.3s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.3); max-width: 100%; } .puzzle-piece { position: absolute; cursor: pointer; clip-path: polygon(50% 0%, 93.301% 25%, 93.301% 75%, 50% 100%, 6.699% 75%, 6.699% 25%); transform: scale(var(--scale, 0.98)) rotate(var(--rot, 0deg)); transition: transform 0.3s ease; overflow: hidden; } .puzzle-piece:hover { --scale: 1.05; z-index: 2; } .puzzle-piece video { position: absolute; object-fit: cover; pointer-events: none; } @keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } h1 { margin-top: 10px; margin-bottom: 20px; color: #333; text-align: center; font-size: clamp(24px, 5vw, 36px); } button { padding: 10px 20px; font-size: 16px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease, transform 0.1s ease; } button:hover { background-color: #45a049; } button:active { transform: scale(0.95); } #messageContainer { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background-color: rgba(255,255,255,0.95); padding: 15px 30px; border-radius: 50px; text-align: center; font-size: 18px; font-weight: bold; color: #333; display: none; flex-direction: row; align-items: center; gap: 20px; z-index: 100; box-shadow: 0 5px 20px rgba(0,0,0,0.3); max-width: 90%; } #messageContainer p { margin: 0; } #playAgainButton { background-color: #2196F3; } #playAgainButton:hover { background-color: #1976D2; } .button-container { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 15px; } footer { margin-top: 20px; color: #666; font-size: 14px; text-align: center; }`;

  const videoData = await convertVideoToBase64();

  const scriptContent = `
    const puzzleContainer = document.getElementById('puzzleContainer');
    const messageContainer = document.getElementById('messageContainer');
    const message = document.getElementById('message');
    const playAgainButton = document.getElementById('playAgainButton');
    const resetButton = document.getElementById('resetButton');
    let videoBase64 = "${videoData}";
    let videoUrl = videoBase64;
    const rings = ${rings};
    let hexGrid = [], rotations = [], scale = 1, R = 0;
    let videoElements = [];
    let videoNaturalWidth = 1024, videoNaturalHeight = 1024;
    async function init() {
      // Convertimos el base64 a un Blob URL local para mejor performance y evitar problemas de menus contextuales
      if (videoBase64.startsWith('data:video')) {
        try {
          const response = await fetch(videoBase64);
          const blob = await response.blob();
          videoUrl = URL.createObjectURL(blob);
        } catch (e) {
          videoUrl = videoBase64;
        }
      }
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.onloadedmetadata = () => {
        videoNaturalWidth = video.videoWidth || 1024;
        videoNaturalHeight = video.videoHeight || 1024;
        createPuzzlePieces();
      };
      video.onerror = () => { createPuzzlePieces(); };
      video.src = videoUrl;
    }
    function createPuzzlePieces() {
      puzzleContainer.innerHTML = ''; hexGrid = []; videoElements = [];
      for (let q = -rings; q <= rings; q++) {
        let r1 = Math.max(-rings, -q-rings), r2 = Math.min(rings, -q+rings);
        for (let r = r1; r <= r2; r++) hexGrid.push({q, r});
      }
      const totalPieces = hexGrid.length;
      rotations = Array.from({length: totalPieces}, () => Math.floor(Math.random()*6)*60);
      const maxSize = Math.min(window.innerWidth - 40, 400);
      const K = rings;
      R = Math.min(maxSize/(2*Math.sqrt(3)*K+2), maxSize/(3*K+2));
      const CX = maxSize/2, CY = maxSize/2;
      const sf = maxSize/Math.min(videoNaturalWidth, videoNaturalHeight);
      const bgW = videoNaturalWidth*sf, bgH = videoNaturalHeight*sf;
      const bgOX = (bgW-maxSize)/2, bgOY = (bgH-maxSize)/2;
      puzzleContainer.style.width = maxSize+'px'; puzzleContainer.style.height = maxSize+'px';
      for (let i = 0; i < totalPieces; i++) {
        const pieceWrapper = document.createElement('div');
        pieceWrapper.className = 'puzzle-piece';
        pieceWrapper.style.width = (2*R)+'px'; pieceWrapper.style.height = (2*R)+'px';
        const video = document.createElement('video');
        video.src = videoUrl;
        if (videoUrl.startsWith('http')) video.crossOrigin = 'anonymous';
        video.loop = true; video.muted = true; video.playsInline = true; video.autoplay = true;
        video.style.width = bgW+'px'; video.style.height = bgH+'px';
        const {q, r} = hexGrid[i];
        const cx = CX+Math.sqrt(3)*R*(q+r/2), cy = CY+1.5*R*r;
        pieceWrapper.style.left = (cx-R)+'px'; pieceWrapper.style.top = (cy-R)+'px';
        video.style.left = -(cx-R+bgOX)+'px'; video.style.top = -(cy-R+bgOY)+'px';
        pieceWrapper.style.setProperty('--rot', rotations[i]+'deg');
        pieceWrapper.appendChild(video);
        pieceWrapper.addEventListener('click', () => { rotations[i]+=60; pieceWrapper.style.setProperty('--rot', rotations[i]+'deg'); checkWin(); });
        puzzleContainer.appendChild(pieceWrapper);
        videoElements.push(video);
        video.play().catch(()=>{});
      }
      setTimeout(() => { videoElements.forEach(v => { v.currentTime = 0; v.play().catch(()=>{}); }); }, 100);
    }
    function checkWin() {
      if (rotations.every(r => r%360===0)) {
        setTimeout(() => {
          message.textContent = '¡Felicidades! Puzzle completado.';
          messageContainer.style.display = 'flex';
          puzzleContainer.querySelectorAll('.puzzle-piece').forEach(p => p.style.opacity='0');
          const video = document.createElement('video');
          video.src = videoUrl; video.loop = true; video.muted = true; video.playsInline = true; video.autoplay = true;
          video.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;animation:fadeIn 0.5s ease forwards;z-index:10';
          puzzleContainer.appendChild(video);
          video.play().catch(()=>{});
          const colors=['#f44336','#e91e63','#9c27b0','#3f51b5','#2196f3','#4caf50','#ffeb3b','#ff9800'];
          for(let i=0;i<50;i++){const c=document.createElement('div');c.style.cssText='position:fixed;width:10px;height:10px;background:'+colors[Math.floor(Math.random()*colors.length)]+';left:'+(Math.random()*100)+'vw;top:-20px;border-radius:50%;pointer-events:none;z-index:1000;animation:confettiFall '+(2+Math.random()*2)+'s linear forwards';document.body.appendChild(c);setTimeout(()=>c.remove(),4000);}
        }, 300);
      }
    }
    resetButton.addEventListener('click', createPuzzlePieces);
    playAgainButton.addEventListener('click', () => { messageContainer.style.display='none'; createPuzzlePieces(); });
    puzzleContainer.addEventListener('wheel', (e) => { e.preventDefault(); scale=Math.max(0.5,Math.min(2,scale+(e.deltaY>0?-0.1:0.1))); puzzleContainer.style.transform='scale('+scale+')'; });
    window.addEventListener('resize', createPuzzlePieces);
    init();
  `;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Puzzle Hexagonal de Video</title><style>${cssStyles}</style></head><body><h1>Puzzle Hexagonal de Video</h1><div class="main-content"><div class="puzzle-container" id="puzzleContainer"></div></div><div id="messageContainer"><p id="message"></p><button id="playAgainButton">Jugar de nuevo</button></div><div class="button-container"><button id="resetButton">Reiniciar Puzzle</button></div><footer>Diseñado por Juan Guillermo Rivera Berrio con tecnologia Gemini 3.1 Pro</footer><script>${scriptContent}<\/script></body></html>`;
}

async function downloadPuzzle() {
  const htmlContent = await buildPuzzleHtml();
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const pieceCount = rings === 1 ? 7 : rings === 2 ? 19 : rings === 3 ? 37 : 61;
  a.download = `puzzle_hex_${pieceCount}_piezas.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function savePuzzle() {
  if (!videoUrl) {
    alert('No hay ningun puzzle generado para guardar.');
    return;
  }
  const originalText = saveButton.textContent;
  saveButton.textContent = 'Guardando...';
  saveButton.disabled = true;
  try {
    const htmlContent = await buildPuzzleHtml();
    const pieceCount = rings === 1 ? 7 : rings === 2 ? 19 : rings === 3 ? 37 : 61;
    savedPuzzles.push({ html: htmlContent, pieceCount });
    savedCount.style.display = 'block';
    savedCount.textContent = `Puzzles guardados: ${savedPuzzles.length}`;
    saveButton.textContent = '¡Guardado!';
    setTimeout(() => { saveButton.textContent = originalText; }, 1500);
  } catch (err) {
    alert('Error al guardar el puzzle.');
    saveButton.textContent = originalText;
  } finally {
    saveButton.disabled = false;
  }
}

function generateGallery() {
  if (savedPuzzles.length === 0) {
    alert('No hay puzzles guardados. Guarda al menos uno primero.');
    return;
  }
  const panelsHtml = savedPuzzles.map((p, i) => {
    const num = i + 1;
    const escaped = p.html.replace(/"/g, '&quot;');
    const fullWidth = (savedPuzzles.length % 2 !== 0 && i === savedPuzzles.length - 1) ? ' full-width' : '';
    return `<div class="comic-panel${fullWidth}" data-index="${i}"><div class="panel-number">${num}</div><div class="panel-info">${p.pieceCount} piezas</div><button class="zoom-btn" onclick="openZoom(${i})" title="Ampliar">&#x26F6;</button><button class="play-pause-btn" onclick="togglePlayPause(${i})" title="Play/Pause">&#x23f8;</button><iframe srcdoc="${escaped}" scrolling="no" frameborder="0" id="frame-${i}"></iframe></div>`;
  }).join('\n');
  const puzzleDataJson = JSON.stringify(savedPuzzles.map(p => ({ html: p.html, pieceCount: p.pieceCount })))
    .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Puzles hexagonales</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .gallery-title { font-size: 3rem; font-weight: 900; color: white; text-align: center; margin-bottom: 2rem; text-shadow: 4px 4px 8px rgba(0,0,0,0.3); text-transform: uppercase; letter-spacing: 2px; }
    .gallery-container { max-width: 1400px; width: 100%; background: rgba(255,255,255,0.95); border-radius: 25px; padding: 2rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .comic-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .comic-panel { position: relative; aspect-ratio: 1/1; border: 4px solid #333; border-radius: 15px; overflow: hidden; background: #333; box-shadow: 0 8px 25px rgba(0,0,0,0.15); transition: transform 0.3s ease, box-shadow 0.3s ease; }
    .comic-panel:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 15px 40px rgba(0,0,0,0.25); }
    .comic-panel.full-width { grid-column: 1/-1; aspect-ratio: 2/1; }
    .panel-number { position: absolute; top: 12px; left: 12px; background: linear-gradient(45deg, #667eea, #764ba2); color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 700; z-index: 10; box-shadow: 0 4px 12px rgba(102,126,234,0.4); }
    .panel-info { position: absolute; bottom: 10px; right: 12px; background: rgba(0,0,0,0.55); color: white; font-size: 0.8rem; padding: 3px 8px; border-radius: 10px; z-index: 10; }
    .zoom-btn { position: absolute; top: 10px; right: 50px; z-index: 10; background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 6px; width: 32px; height: 32px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
    .zoom-btn:hover { background: rgba(102,126,234,0.9); }
    .play-pause-btn { position: absolute; top: 10px; right: 10px; z-index: 10; background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 6px; width: 32px; height: 32px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
    .play-pause-btn:hover { background: rgba(102,126,234,0.9); }
    .comic-panel iframe { width: 100%; height: 100%; border: none; display: block; }
    .footer { text-align: center; color: rgba(255,255,255,0.9); font-size: 0.9rem; margin-top: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
    .zoom-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: none; align-items: center; justify-content: center; z-index: 9999; padding: 1rem; }
    .zoom-overlay.open { display: flex; }
    .zoom-modal { position: relative; width: min(90vw, 90vh); height: min(90vw, 90vh); background: #333; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
    .zoom-modal iframe { width: 100%; height: 100%; border: none; display: block; }
    .zoom-close { position: absolute; top: 10px; right: 10px; z-index: 10; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 36px; height: 36px; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
    .zoom-close:hover { background: #e53935; }
    @media (max-width: 768px) { .comic-grid { grid-template-columns: 1fr; gap: 1rem; } .gallery-title { font-size: 2rem; } body { padding: 1rem; } .gallery-container { padding: 1rem; } .comic-panel.full-width { grid-column: 1; aspect-ratio: 1/1; } .zoom-btn { right: 50px; } .play-pause-btn { right: 10px; } }
  </style>
</head>
<body>
  <h1 class="gallery-title">Puzles hexagonales</h1>
  <div class="gallery-container">
    <div class="comic-grid">${panelsHtml}</div>
  </div>
  <p class="footer">Diseñado por Juan Guillermo Rivera Berrio con tecnologia Gemini 3.1 Pro</p>
  <div class="zoom-overlay" id="zoomOverlay">
    <div class="zoom-modal">
      <button class="zoom-close" id="zoomClose" title="Cerrar">&times;</button>
      <iframe id="zoomFrame" srcdoc="" frameborder="0"></iframe>
    </div>
  </div>
  <script>
    const puzzles = ${puzzleDataJson};
    const overlay = document.getElementById('zoomOverlay');
    const zoomFrame = document.getElementById('zoomFrame');
    const playStates = {};
    function openZoom(index) {
      zoomFrame.srcdoc = puzzles[index].html;
      overlay.classList.add('open');
    }
    function togglePlayPause(index) {
      const frame = document.getElementById('frame-' + index);
      if (!frame || !frame.contentDocument) return;
      const videos = frame.contentDocument.querySelectorAll('video');
      const btn = document.querySelector('.comic-panel[data-index="' + index + '"] .play-pause-btn');
      let isPlaying = false;
      videos.forEach(v => {
        if (v.paused) {
          v.play().catch(() => {});
        } else {
          v.pause();
          isPlaying = true;
        }
      });
      if (btn) btn.innerHTML = isPlaying ? '&#x25b6;' : '&#x23f8;';
    }
    document.getElementById('zoomClose').addEventListener('click', closeZoom);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeZoom(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeZoom(); });
    function closeZoom() {
      overlay.classList.remove('open');
      zoomFrame.srcdoc = '';
    }
  <\/script>
</body>
</html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'galeria_puzles_hexagonales.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

resetButton.addEventListener('click', () => { messageContainer.style.display = 'none'; createPuzzlePieces(); });
playAgainButton.addEventListener('click', () => { messageContainer.style.display = 'none'; createPuzzlePieces(); });

downloadButton.addEventListener('click', async () => {
  const originalText = downloadButton.textContent;
  downloadButton.textContent = 'Procesando...';
  downloadButton.disabled = true;
  try { await downloadPuzzle(); }
  finally { downloadButton.textContent = originalText; downloadButton.disabled = false; }
});

saveButton.addEventListener('click', savePuzzle);
galleryButton.addEventListener('click', generateGallery);

puzzleContainer.addEventListener('wheel', (e) => {
  e.preventDefault();
  scale = Math.max(0.5, Math.min(2, scale + (e.deltaY > 0 ? -0.1 : 0.1)));
  puzzleContainer.style.transform = `scale(${scale})`;
});

window.addEventListener('resize', () => {
  if (videoUrl && puzzleContainer.innerHTML !== '<div id="loadingMessage">Cargando video de ejemplo...</div>' && puzzleContainer.innerHTML !== '<div id="loadingMessage">Subiendo video...</div>') {
    createPuzzlePieces();
  }
});

initPuzzle();
