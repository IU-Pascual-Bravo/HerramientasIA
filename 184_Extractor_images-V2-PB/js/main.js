// --- Configuración Inicial ---
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
const CORS_PROXIES = [
    "https://corsproxy.io/?",
    "https://api.allorigins.win/raw?url=",
    "https://api.codetabs.com/v1/proxy?quest=",
    "https://proxy.cors.sh/"
];
let currentProxyIndex = 0;

// --- PLANTILLA DE PRESENTACION (del Modelo) ---
const TEMPLATE_MODELO = 
`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=yes,minimal-ui">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <title>Presentador de diapositivas</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            height: 100%;
            overflow: hidden;
            background-color: #1a1a1a;
        }
        .presentation {
            position: relative;
            background-color: #1a1a1a;
            color: white;
            box-sizing: border-box;
        }
        /* SIZE: será reemplazado por la selección del usuario (horizontal/vertical) */
        %%PRESENTATION_STYLE%%
        .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            padding-bottom: 40px;
            box-sizing: border-box;
            opacity: 0;
            pointer-events: none;
        }
        .slide.active {
            opacity: 1;
            z-index: 1;
            pointer-events: auto;
        }
        .slide h2 {
            font-size: 2.3em;
            margin-bottom: 20px;
            text-align: center;
        }
        .slide p {
            font-size: 1.2em;
            max-width: 800px;
            text-align: center;
            margin-bottom: 20px;
        }
        .slide img, .slide video {
            max-width: 100%;
            max-height: 85%;
            object-fit: contain;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
        }
        .slide iframe {
            width: calc(100% - 120px);
            height: 85%;
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
        }
        .slide-link-badge {
            position: absolute;
            bottom: 55px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(33,150,243,0.85);
            color: white;
            font-size: 0.8em;
            padding: 4px 12px;
            border-radius: 20px;
            cursor: pointer;
            z-index: 2;
            backdrop-filter: blur(4px);
            white-space: nowrap;
        }
        .slide-link-badge:hover {
            background: rgba(33,150,243,1);
        }
        .nav-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: rgba(255,255,255,0.2);
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
            font-size: 1.5em;
            border-radius: 50%;
            z-index: 2;
        }
        .nav-button:hover {
            background-color: rgba(255,255,255,0.3);
        }
        #prevBtn {
            left: 20px;
        }
        #nextBtn {
            right: 20px;
        }
        .indicators {
            position: absolute;
            bottom: 35px; /* Subido un poco para dejar espacio al footer */
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            z-index: 2;
        }
        .indicator {
            width: 12px;
            height: 12px;
            background-color: rgba(255,255,255,0.3);
            border-radius: 50%;
            margin: 0 5px;
            cursor: pointer;
        }
        .indicator.active {
            background-color: white;
        }
        
        /* Estilo del footer DE LA PRESENTACIÓN GENERADA */
        footer {
            position: absolute;
            bottom: 5px;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.4);
            z-index: 3;
            pointer-events: none;
            font-family: sans-serif;
        }
        /* Estilos para lupa/zoom */
        .zoom-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .zoom-btn:hover {
            background: rgba(0, 0, 0, 0.8);
        }
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .lightbox.open {
            display: flex;
        }
        .lightbox img {
            max-width: 90vw;
            max-height: 90vh;
            border-radius: 8px;
        }
        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 24px;
        }
        /* Fullscreen para iframes HTML */
        .fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            padding: 20px;
            box-sizing: border-box;
        }
        .fullscreen.open {
            display: flex;
        }
        .fullscreen iframe {
            width: 95vw;
            height: 95vh;
            border: none;
            border-radius: 8px;
            background: white;
        }
    </style>
</head>
<body>
    <div class="presentation">
        <div id="slideContainer">
            <!-- Las diapositivas se generarán dinámicamente aquí -->
        </div>
        
        <button id="prevBtn" class="nav-button">&#10094;</button>
        <button id="nextBtn" class="nav-button">&#10095;</button>
        
        <div class="indicators"></div>

        <!-- FOOTER EN EL HTML GENERADO -->
        <footer>Diseñado por Juan Guillermo Rivera Berrío con tecnología Gemini 3 Pro</footer>
    </div>

    <!-- Lightbox para zoom de imágenes -->
    <div id="lightbox" class="lightbox">
        <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
        <img id="lightboxImg" src="" alt="Imagen ampliada">
    </div>

    <!-- Fullscreen para iframes HTML -->
    <div id="fullscreen" class="fullscreen">
        <button class="lightbox-close" onclick="closeHtmlFullscreen()">&times;</button>
        <iframe id="fullscreenIframe" src=""></iframe>
    </div>

<script type="module">
    const slideContainer = document.getElementById('slideContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelector('.indicators');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const fullscreen = document.getElementById('fullscreen');
    const fullscreenIframe = document.getElementById('fullscreenIframe');

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('open');
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
    }

    function openHtmlFullscreen(b64Url) {
        const b64 = b64Url.split(',')[1];
        fullscreenIframe.srcdoc = decodeURIComponent(escape(atob(b64)));
        fullscreen.classList.add('open');
    }

    function closeHtmlFullscreen() {
        fullscreen.classList.remove('open');
        fullscreenIframe.srcdoc = '';
    }

    // Exponer funciones globalmente para onclick
    window.openLightbox = openLightbox;
    window.closeLightbox = closeLightbox;
    window.openHtmlFullscreen = openHtmlFullscreen;
    window.closeHtmlFullscreen = closeHtmlFullscreen;

    let slides = [];
    let currentSlide = 0;

    const transitions = [
        { name: 'fade',           duration: '0.6s', easing: 'ease-in-out' },
        { name: 'slideLeft',      duration: '0.5s', easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name: 'slideRight',     duration: '0.5s', easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name: 'slideUp',        duration: '0.5s', easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name: 'slideDown',      duration: '0.5s', easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name: 'rotate',         duration: '0.7s', easing: 'ease-in-out' },
        { name: 'scale',          duration: '0.5s', easing: 'ease-out' },
        { name: 'flipX',          duration: '0.7s', easing: 'ease-in-out' },
        { name: 'flipY',          duration: '0.7s', easing: 'ease-in-out' },
        { name: 'zoomBlur',       duration: '0.6s', easing: 'ease-out' },
        { name: 'swingIn',        duration: '0.7s', easing: 'ease-out' },
        { name: 'bounceIn',       duration: '0.8s', easing: 'cubic-bezier(0.34,1.56,0.64,1)' },
        { name: 'glitch',         duration: '0.5s', easing: 'steps(4, end)' },
        { name: 'spiralIn',       duration: '0.7s', easing: 'ease-out' },
        { name: 'dropIn',         duration: '0.6s', easing: 'cubic-bezier(0.34,1.56,0.64,1)' },
        { name: 'unfold',         duration: '0.6s', easing: 'ease-in-out' },
        { name: 'skewIn',         duration: '0.55s', easing: 'ease-out' },
        { name: 'slideTopLeft',   duration: '0.55s', easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name: 'slideBottomRight',duration: '0.55s', easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name: 'flipDiagonal',   duration: '0.75s', easing: 'ease-in-out' },
        { name: 'rotateScale',    duration: '0.7s', easing: 'ease-in-out' },
        { name: 'blurIn',         duration: '0.6s', easing: 'ease-out' },
        { name: 'lightSpeed',     duration: '0.6s', easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name: 'jackInTheBox',   duration: '0.8s', easing: 'cubic-bezier(0.68,-0.55,0.27,1.55)' },
        { name: 'perspectiveFlip',duration: '0.8s', easing: 'ease-in-out' },
    ];

    function initSlides() {
        // Crear diapositivas dinámicamente
        mediaItems.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide' + (index === 0 ? ' active' : '');

            if (item.type === 'video') {
                const video = document.createElement('video');
                video.src = item.url;
                video.controls = true;
                video.autoplay = false;
                video.style.maxWidth = '100%';
                video.style.height = 'auto';
                video.style.borderRadius = '10px';
                video.style.boxShadow = '0 4px 8px rgba(0,0,0,0.5)';
                slide.appendChild(video);
            } else if (item.type === 'html') {
                const iframe = document.createElement('iframe');
                // Decodificar base64 → texto HTML
                const b64 = item.url.split(',')[1];
                iframe.srcdoc = decodeURIComponent(escape(atob(b64)));
                iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
                slide.appendChild(iframe);
            } else {
                const img = document.createElement('img');
                img.src = item.url;
                img.alt = 'Imagen ' + (index + 1);
                img.onerror = function () {
                    this.style.display = 'none';
                    const errorMsg = document.createElement('p');
                    errorMsg.textContent = 'Imagen ' + (index + 1) + ' no encontrada';
                    slide.appendChild(errorMsg);
                };
                slide.appendChild(img);

                // Botón de lupa para zoom de imagen
                if (item.type === 'image') {
                    const zoomBtn = document.createElement('button');
                    zoomBtn.className = 'zoom-btn';
                    zoomBtn.innerHTML = '&#x1F50D;';
                    zoomBtn.title = 'Ampliar imagen';
                    zoomBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        openLightbox(item.url);
                    });
                    slide.appendChild(zoomBtn);
                }
            }

            // Si es un iframe (HTML), agregar botón para ver en fullscreen
            if (item.type === 'html') {
                const zoomBtn = document.createElement('button');
                zoomBtn.className = 'zoom-btn';
                zoomBtn.innerHTML = '&#x1F50D;';
                zoomBtn.title = 'Ver en pantalla completa';
                zoomBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openHtmlFullscreen(item.url);
                });
                slide.appendChild(zoomBtn);
            }

            // Badge de enlace si existe
            if (item.link) {
                const badge = document.createElement('span');
                badge.className = 'slide-link-badge';
                badge.textContent = '🔗 Ver enlace';
                badge.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const w = 900, h = 600;
                    const left = Math.round((screen.width - w) / 2);
                    const top = Math.round((screen.height - h) / 2);
                    window.open(item.link, '_blank', "noopener,noreferrer,width=" + w + ",height=" + h + ",left=" + left + ",top=" + top);
                });
                slide.appendChild(badge);
            }

            slideContainer.appendChild(slide);
        });

        slides = document.querySelectorAll('.slide');

        updateIndicators();
        updateButtonState();
    }

    function showSlide(index) {
        slides[currentSlide].style.animation = '';
        slides[currentSlide].classList.remove('active');
        slides[index].classList.add('active');
        currentSlide = index;

        updateIndicators();
        applyRandomTransition();
        updateButtonState();
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            showSlide(currentSlide + 1);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    }

    function updateIndicators() {
        indicators.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('indicator');
            if (index === currentSlide) dot.classList.add('active');
            dot.addEventListener('click', () => showSlide(index));
            indicators.appendChild(dot);
        });
    }

    function updateButtonState() {
        prevBtn.disabled = (currentSlide === 0);
        nextBtn.disabled = (currentSlide === slides.length - 1);
    }

    function applyRandomTransition() {
        const t = transitions[Math.floor(Math.random() * transitions.length)];
        const el = slides[currentSlide];
        el.style.animation = 'none';
        el.offsetHeight; // forzar reflow
        el.style.animation = t.name + " " + t.duration + " " + t.easing + " forwards";
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Lightbox y fullscreen: cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            closeHtmlFullscreen();
        }
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    // Lightbox: cerrar al hacer clic fuera de la imagen
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Fullscreen: cerrar al hacer clic fuera del iframe
    fullscreen.addEventListener('click', (e) => {
        if (e.target === fullscreen) closeHtmlFullscreen();
    });

    // Add transition animations
    var transitionCSS = "" +
        "@keyframes fade        { from { opacity: 0; } to { opacity: 1; } }" +
        "@keyframes slideLeft   { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }" +
        "@keyframes slideRight  { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }" +
        "@keyframes slideUp     { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }" +
        "@keyframes slideDown   { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }" +
        "@keyframes rotate      { from { transform: rotate(180deg) scale(0); opacity: 0; } to { transform: rotate(0deg) scale(1); opacity: 1; } }" +
        "@keyframes scale       { from { transform: scale(0.2); opacity: 0; } to { transform: scale(1); opacity: 1; } }" +
        "@keyframes flipX       { from { transform: perspective(600px) rotateX(90deg); opacity: 0; } to { transform: perspective(600px) rotateX(0deg); opacity: 1; } }" +
        "@keyframes flipY       { from { transform: perspective(600px) rotateY(90deg); opacity: 0; } to { transform: perspective(600px) rotateY(0deg); opacity: 1; } }" +
        "@keyframes zoomBlur    { from { transform: scale(1.4); filter: blur(18px); opacity: 0; } to { transform: scale(1); filter: blur(0); opacity: 1; } }" +
        "@keyframes swingIn     { from { transform: perspective(600px) rotateY(-70deg) translateX(-60px); opacity: 0; } to { transform: perspective(600px) rotateY(0deg) translateX(0); opacity: 1; } }" +
        "@keyframes bounceIn    { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }" +
        "@keyframes glitch      { 0%   { transform: translate(-4px, 0) skewX(-3deg); opacity: 0.6; } 25%  { transform: translate(4px, -2px) skewX(3deg); opacity: 0.8; } 50%  { transform: translate(-2px, 2px) skewX(-1deg); opacity: 0.9; } 75%  { transform: translate(2px, 0) skewX(1deg); opacity: 1; } 100% { transform: translate(0, 0) skewX(0); opacity: 1; } }" +
        "@keyframes spiralIn    { from { transform: rotate(360deg) scale(0); opacity: 0; } to { transform: rotate(0deg) scale(1); opacity: 1; } }" +
        "@keyframes dropIn      { from { transform: translateY(-80px) scale(0.8); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }" +
        "@keyframes unfold      { 0%   { transform: scaleY(0) translateY(-50%); opacity: 0; } 60%  { transform: scaleY(1.05) translateY(0); opacity: 1; } 100% { transform: scaleY(1) translateY(0); opacity: 1; } }" +
        "@keyframes skewIn      { from { transform: skew(-20deg, -8deg) scale(0.9); opacity: 0; } to { transform: skew(0,0) scale(1); opacity: 1; } }" +
        "@keyframes slideTopLeft { from { transform: translate(-50%, -50%); opacity: 0; } to { transform: translate(0,0); opacity: 1; } }" +
        "@keyframes slideBottomRight { from { transform: translate(50%, 50%); opacity: 0; } to { transform: translate(0,0); opacity: 1; } }" +
        "@keyframes flipDiagonal { from { transform: rotate3d(1,1,0,120deg) scale(0.6); opacity: 0; } to { transform: rotate3d(0,0,0,0deg) scale(1); opacity: 1; } }" +
        "@keyframes rotateScale  { from { transform: rotate(180deg) scale(0); opacity: 0; } to { transform: rotate(0deg) scale(1); opacity: 1; } }" +
        "@keyframes blurIn       { from { filter: blur(30px); opacity: 0; transform: scale(1.05); } to { filter: blur(0); opacity: 1; transform: scale(1); } }" +
        "@keyframes lightSpeed   { from { transform: translateX(100%) skewX(-30deg); opacity: 0; } to { transform: translateX(0) skewX(0); opacity: 1; } }" +
        "@keyframes jackInTheBox { 0% {opacity:0;transform:scale(.1) rotate(30deg);transform-origin:center bottom;} 50%{transform:rotate(-10deg);} 70%{transform:rotate(3deg);} 100%{opacity:1;transform:scale(1) rotate(0);} }" +
        "@keyframes perspectiveFlip { from { transform: perspective(800px) rotateY(90deg); opacity: 0; } to { transform: perspective(800px) rotateY(0deg); opacity: 1; } }";
    
    const style = document.createElement('style');
    style.textContent = transitionCSS;
    document.head.appendChild(style);

    // ----------- MEDIOS INYECTADOS -----------
    const mediaItems = [
        // PLACEHOLDER_FOR_MEDIA
    ];

    // Ajuste de tamaño responsivo: calcula ancho desde la altura del viewport
    function resizePresentation() {
        const pres = document.querySelector('.presentation');
        if (!pres) return;
        const style = getComputedStyle(pres);
        const aspectWVal = style.getPropertyValue('--aspect-w');
        const aspectHVal = style.getPropertyValue('--aspect-h');
        const aspectW = (aspectWVal !== "" && !isNaN(parseFloat(aspectWVal))) ? parseFloat(aspectWVal) : 16;
        const aspectH = (aspectHVal !== "" && !isNaN(parseFloat(aspectHVal))) ? parseFloat(aspectHVal) : 9;
        const ratio = aspectW / aspectH;
        const maxWRaw = style.getPropertyValue('--preset-maxw') || '';
        const maxW = maxWRaw ? parseInt(maxWRaw) : 1280;

        // Si es modo responsive (proporción 0), no intervenimos con JS
        if (aspectW === 0 || isNaN(ratio)) {
            return;
        }

        // Cálculo de espacio reservado (márgenes y otros elementos fuera del presentador)
        let reservedH = 40; // Base: margen superior (20px) + margen inferior (20px)
        const possibleSelectors = ['.controls', '.top-controls', '#topControls', '.page-controls', '.page-footer', 'body > footer', '#pageFooter', '.controls-wrapper'];
        possibleSelectors.forEach(sel => {
            const el = document.querySelector(sel);
            if (el && !pres.contains(el) && el.offsetParent !== null) {
                reservedH += el.offsetHeight || 0;
            }
        });

        const availH = Math.max(200, window.innerHeight - reservedH);
        const availW = Math.max(200, document.documentElement.clientWidth - 40); // 20px de margen a cada lado

        let targetW, targetH;

        // Determinar si limitar por ancho o por alto basándose en la relación de aspecto
        if (availW / availH > ratio) {
            // El viewport es más ancho que la proporción -> limitar por altura
            targetH = availH;
            targetW = targetH * ratio;
        } else {
            // El viewport es más alto que la proporción -> limitar por ancho
            targetW = availW;
            targetH = targetW / ratio;
        }

        // No exceder el ancho máximo definido para el preset
        if (targetW > maxW) {
            targetW = maxW;
            targetH = targetW / ratio;
        }

        // Aplicar dimensiones
        pres.style.width = Math.round(targetW) + 'px';
        pres.style.height = Math.round(targetH) + 'px';
        pres.style.maxWidth = 'none'; 
        pres.style.minWidth = 'none';
        pres.style.margin = '0'; // Flexbox en body maneja el centrado
        pres.style.overflow = 'hidden';

        // Asegurar que las diapositivas ocupen todo el contenedor calculado
        const slds = pres.querySelectorAll('.slide');
        slds.forEach(s => { 
            s.style.height = pres.clientHeight + 'px'; 
            s.style.width = pres.clientWidth + 'px';
            s.style.padding = '20px';
            s.style.paddingBottom = '50px';
        });
    }

    window.addEventListener('resize', resizePresentation);
    window.addEventListener('orientationchange', resizePresentation);
    window.addEventListener('load', resizePresentation);
    document.addEventListener('DOMContentLoaded', resizePresentation);

    initSlides();
    // run after slides created and after media load
    // Asegurar redimensionamiento después de que se carguen las imágenes/videos
    setTimeout(()=>{
        const pres = document.querySelector('.presentation');
        if (!pres) return;
        const imgs = Array.from(pres.querySelectorAll('img'));
        
        imgs.forEach(img => {
            if (!img.complete) img.addEventListener('load', () => resizePresentation());
        });
        pres.querySelectorAll('video').forEach(v => {
            v.addEventListener('loadedmetadata', () => resizePresentation());
        });
        
        resizePresentation();
    }, 100);
<\/script>
</body>
</html>
`;

function getProxyUrl(url) {
    return CORS_PROXIES[currentProxyIndex] + encodeURIComponent(url);
}

// --- Elementos DOM ---
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const folderInput = document.getElementById("folderInput"); // Nuevo
const urlInput = document.getElementById("urlInput");
const urlBtn = document.getElementById("urlBtn");

// --- Elementos de video ---
const videoInput = document.getElementById("videoInput");
const videoBtn = document.getElementById("videoBtn");
const videoIntervalInput = document.getElementById("videoInterval");
const videoInfo = document.getElementById("videoInfo");
let selectedVideoFile = null;

const preview = document.getElementById("preview");
const loadingIndicator = document.getElementById("loading");

const qualityRange = document.getElementById("qualityRange");
const qualityValue = document.getElementById("qualityValue");
const scaleRange = document.getElementById("scaleRange");
const scaleValue = document.getElementById("scaleValue");
const compressToggle = document.getElementById("compressToggle");
const formatSelect = document.getElementById("formatSelect");
const applyBtn = document.getElementById("applyBtn");
const originalSizeLabel = document.getElementById("originalSize");
const compressedSizeLabel = document.getElementById("compressedSize");
const downloadZipBtn = document.getElementById("downloadZip");

// --- Elementos de presentación ---
const presentationSection = document.getElementById("presentationSection");
const sizeSelector = document.getElementById("sizeSelector");
const generatePresentationBtn = document.getElementById("generatePresentationBtn");

let sourceImages = []; 
let currentFileName = "extraccion";

// --- Eventos UI ---
qualityRange.oninput = () => qualityValue.textContent = qualityRange.value;
scaleRange.oninput = () => scaleValue.textContent = scaleRange.value + "x";

[qualityRange, scaleRange, formatSelect, compressToggle].forEach(el => el.onchange = processImages);
applyBtn.onclick = processImages;
generatePresentationBtn.onclick = generarPresentacion;

document.getElementById("autoCompress").onclick = async () => {
    compressToggle.checked = true;
    formatSelect.value = "image/webp";
    qualityRange.value = 0.7;
    scaleRange.value = 0.8;
    qualityValue.textContent = "0.7";
    scaleValue.textContent = "0.8x";
    await processImages();
};

// --- Manejo Archivos y Carpetas ---
dropZone.ondragover = e => { e.preventDefault(); dropZone.style.background = "#eef"; };
dropZone.ondragleave = () => dropZone.style.background = "#f8fafc";
dropZone.ondrop = e => {
    e.preventDefault();
    dropZone.style.background = "#f8fafc";
    if(e.dataTransfer.files.length) handleMultipleFiles(e.dataTransfer.files);
};

fileInput.onchange = e => { if(e.target.files.length) handleMultipleFiles(e.target.files); };
folderInput.onchange = e => { if(e.target.files.length) handleMultipleFiles(e.target.files); };

// --- Eventos de Video ---
videoBtn.onclick = () => {
    if (selectedVideoFile) {
        handleVideo(selectedVideoFile);
    } else {
        alert("Primero selecciona un video con el botón 'Subir Video' de arriba.");
    }
};
videoInput.onchange = e => {
    const file = e.target.files[0];
    e.target.value = "";
    if (file) {
        selectedVideoFile = file;
        videoInfo.textContent = `🎬 Video: ${file.name}`;
        handleVideo(file);
    }
};
videoIntervalInput.onchange = () => {
    if (selectedVideoFile) handleVideo(selectedVideoFile);
};

// Función unificada para manejar archivos (PDF, PPTX, HTML o Imágenes sueltas/carpetas)
async function handleMultipleFiles(files) {
    sourceImages = [];
    preview.innerHTML = "";
    downloadZipBtn.style.display = "none";
    presentationSection.style.display = "none";
    loadingIndicator.style.display = "block";
    loadingIndicator.textContent = "⚙️ Analizando archivos...";

    const fileList = Array.from(files);
    
    // Si es un solo archivo especial, mantenemos el nombre del archivo para el ZIP
    if (fileList.length === 1) {
        currentFileName = fileList[0].name.split('.').slice(0, -1).join('.');
    } else {
        currentFileName = "coleccion_imagenes";
    }

    try {
        for (const file of fileList) {
            const ext = file.name.split('.').pop().toLowerCase();
            
            if (ext === 'pdf') {
                await extractFromPDF(file);
            } else if (ext === 'pptx') {
                await extractFromPPTX(file);
            } else if (ext === 'html' || ext === 'htm') {
                await extractFromHTMLFile(file);
            } else if (['jpg', 'jpeg', 'png', 'webp', 'bmp'].includes(ext)) {
                await processSingleImageFile(file);
            } else if (['mp4', 'webm'].includes(ext) || /^video\//.test(file.type)) {
                await extractVideoFrames(file);
            }
        }

        if (sourceImages.length === 0) {
            alert("No se encontraron imágenes válidas.");
            loadingIndicator.style.display = "none";
        } else {
            await processImages();
        }
    } catch (err) {
        alert("Error: " + err.message);
        loadingIndicator.style.display = "none";
    }
}

// --- NUEVA FUNCIÓN: Procesar archivos de imagen directamente (para carpetas/archivos sueltos) ---
async function processSingleImageFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const img = await loadImage(e.target.result);
                const canvas = imageToCanvas(img);
                sourceImages.push({
                    id: Math.random().toString(36).substr(2, 9),
                    sourceName: file.name,
                    canvas: canvas,
                    originalSize: file.size
                });
                resolve();
            } catch (err) {
                console.error("Error cargando imagen:", file.name);
                resolve();
            }
        };
        reader.readAsDataURL(file);
    });
}

// --- VIDEO: Extracción de fotogramas ---
const MAX_VIDEO_DURATION = 9000; // 150 minutos en segundos

async function handleVideo(file) {
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["mp4", "webm"].includes(ext) && !/^video\//.test(file.type)) {
        alert("Formato no soportado. Sube un video MP4 o WebM.");
        return;
    }

    sourceImages = [];
    preview.innerHTML = "";
    downloadZipBtn.style.display = "none";
    presentationSection.style.display = "none";
    loadingIndicator.style.display = "block";
    loadingIndicator.textContent = "🎬 Cargando video...";
    currentFileName = file.name.split(".").slice(0, -1).join(".") || "video";

    try {
        await extractVideoFrames(file);
        if (!sourceImages.length) {
            alert("No se pudieron extraer fotogramas del video.");
        } else {
            await processImages();
        }
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        loadingIndicator.style.display = "none";
    }
}

function extractVideoFrames(file) {
    return new Promise((resolve, reject) => {
        const interval = Math.max(1, parseInt(videoIntervalInput.value) || 20);
        const url = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";
        video.src = url;

        video.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("No se pudo leer el video. Verifica que sea un MP4 o WebM válido."));
        };

        video.onloadedmetadata = () => {
            if (!isFinite(video.duration) || video.duration > MAX_VIDEO_DURATION) {
                URL.revokeObjectURL(url);
                reject(new Error("El video supera los 150 minutos de duración permitida."));
                return;
            }

            const timestamps = [];
            for (let t = 0; t + 0.01 < video.duration; t += interval) {
                timestamps.push(t);
            }
            if (!timestamps.length) timestamps.push(0);

            const baseName = file.name.split(".").slice(0, -1).join(".") || "video";
            let idx = 0;

            const nextFrame = () => {
                if (idx >= timestamps.length) {
                    URL.revokeObjectURL(url);
                    resolve();
                    return;
                }
                loadingIndicator.textContent = `🎬 Extrayendo fotograma ${idx + 1} de ${timestamps.length} (${Math.round(timestamps[idx])}s)...`;

                video.onseeked = () => {
                    if (!video.videoWidth || !video.videoHeight) {
                        idx++;
                        setTimeout(nextFrame, 0);
                        return;
                    }
                    const canvas = document.createElement("canvas");
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext("2d").drawImage(video, 0, 0);
                    sourceImages.push({
                        id: `video_${idx}_${Math.random().toString(36).substr(2, 5)}`,
                        sourceName: `${baseName}_${Math.round(timestamps[idx])}s`,
                        canvas: canvas,
                        originalSize: estimateSize(canvas.toDataURL())
                    });
                    idx++;
                    setTimeout(nextFrame, 0);
                };

                video.currentTime = timestamps[idx];
            };

            nextFrame();
        };
    });
}

// 1. PDF - EXTRACTOR
async function extractFromPDF(file) {
    loadingIndicator.textContent = "📄 Analizando objetos internos del PDF...";
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(buffer).promise;
    
    let totalImagesFound = 0;

    for (let i = 1; i <= pdf.numPages; i++) {
        try {
            const page = await pdf.getPage(i);
            const ops = await page.getOperatorList();
            
            for (let j = 0; j < ops.fnArray.length; j++) {
                if (ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
                    const imgName = ops.argsArray[j][0];
                    
                    try {
                        const imgObj = await page.objs.get(imgName);
                        
                        if (imgObj) {
                            if (imgObj.bitmap) {
                                const canvas = document.createElement('canvas');
                                canvas.width = imgObj.width;
                                canvas.height = imgObj.height;
                                const ctx = canvas.getContext('2d');
                                ctx.drawImage(imgObj.bitmap, 0, 0);
                                
                                sourceImages.push({
                                    id: `pdf_${i}_${totalImagesFound++}`,
                                    sourceName: `Pag${i}_Img${totalImagesFound}`,
                                    canvas: canvas,
                                    originalSize: estimateSize(canvas.toDataURL()) 
                                });
                            } 
                            else if (imgObj.data) {
                                const canvas = normalizeImageData(imgObj);
                                if (canvas) {
                                    sourceImages.push({
                                        id: `pdf_${i}_${totalImagesFound++}`,
                                        sourceName: `Pag${i}_Img${totalImagesFound}`,
                                        canvas: canvas,
                                        originalSize: estimateSize(canvas.toDataURL()) 
                                    });
                                }
                            }
                        }
                    } catch (innerErr) {
                        console.warn(`Saltando objeto en pág ${i}:`, innerErr);
                    }
                }
            }
        } catch (pageErr) {
            console.warn(`Error leyendo página ${i}`, pageErr);
        }
    }
}

// 2. PPTX - EXTRACTOR
async function extractFromPPTX(file) {
    loadingIndicator.textContent = "📊 Analizando PPTX: " + file.name;
    const zip = await JSZip.loadAsync(file);
    const mediaFiles = Object.keys(zip.files).filter(path => path.startsWith("ppt/media/"));
    
    // Extensiones de imagen soportadas por navegadores comunes
    const supportedExts = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif'];

    for (const path of mediaFiles) {
        if (zip.files[path].dir) continue;
        
        const ext = path.split('.').pop().toLowerCase();
        if (!supportedExts.includes(ext)) {
            console.warn("Saltando formato no soportado en PPTX:", path);
            continue;
        }

        try {
            const blob = await zip.files[path].async("blob");
            const bitmap = await createImageBitmap(blob);
            const canvas = document.createElement("canvas");
            canvas.width = bitmap.width; canvas.height = bitmap.height;
            canvas.getContext("2d").drawImage(bitmap, 0, 0);
            sourceImages.push({ 
                id: path, 
                sourceName: path.split("/").pop(), 
                canvas: canvas, 
                originalSize: blob.size 
            });
        } catch (err) {
            console.error("Error decodificando imagen de PPTX:", path, err);
            // Seguimos con la siguiente imagen en lugar de romper todo el proceso
        }
    }
}

// 3. HTML / URL - EXTRACTORES
async function extractFromHTMLFile(file) {
    const text = await file.text();
    await parseAndExtractImages(text, null); 
}

urlBtn.onclick = async () => {
    const url = urlInput.value.trim();
    if(!url) return alert("Ingresa una URL");
    loadingIndicator.style.display = "block";
    loadingIndicator.textContent = "🌐 Conectando con la web...";
    
    async function tryFetch(u) {
        for (let i = 0; i < CORS_PROXIES.length; i++) {
            currentProxyIndex = i;
            try {
                const resp = await fetch(getProxyUrl(u));
                if (resp.ok) return resp;
            } catch (e) {}
        }
        throw new Error("No se pudo conectar con la web a través de ningún proxy.");
    }

    try {
        const resp = await tryFetch(url);
        const html = await resp.text();
        sourceImages = [];
        presentationSection.style.display = "none";
        await parseAndExtractImages(html, url);
        if (sourceImages.length > 0) {
            await processImages();
        } else {
            alert("No se encontraron imágenes procesables en esta URL.");
            loadingIndicator.style.display = "none";
        }
    } catch (e) { 
        alert("Error al extraer de la web: " + e.message); 
        loadingIndicator.style.display="none"; 
    }
};

async function parseAndExtractImages(htmlContent, baseUrl) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const imgs = Array.from(doc.querySelectorAll("img"));
    
    const uniqueSrcs = new Set();
    for(const img of imgs) {
        let src = img.getAttribute("src") || img.getAttribute("data-src") || img.getAttribute("srcset");
        if (!src) continue;
        
        if (src.includes(",")) src = src.split(",")[0].split(" ")[0];

        try {
            if (baseUrl && !src.startsWith("data:")) src = new URL(src, baseUrl).href;
            if (!src.endsWith(".svg") && !uniqueSrcs.has(src)) uniqueSrcs.add(src);
        } catch(e) {}
    }

    const srcsArray = Array.from(uniqueSrcs);
    const total = srcsArray.length;
    let count = 0;
    let successfulCount = 0;

    // Función interna para procesar una sola imagen con reintentos
    async function processSingleImage(src) {
        count++;
        loadingIndicator.textContent = `🖼️ Procesando imágenes... (${successfulCount} exitosas de ${total})`;
        
        if (src.startsWith("data:")) {
            try {
                const img = await loadImage(src);
                const cvs = imageToCanvas(img);
                successfulCount++;
                sourceImages.push({
                    id: `web_${Math.random().toString(36).substr(2, 5)}`,
                    sourceName: "web_img",
                    canvas: cvs,
                    originalSize: estimateSize(src)
                });
            } catch(e) {}
            return;
        }

        // Estrategias de descarga: Directa -> Proxy 1 -> Proxy 2 ...
        const strategies = [
            (url) => fetch(url), // Directo (a veces funciona si hay CORS abierto)
            (url) => fetch("https://corsproxy.io/?" + encodeURIComponent(url)),
            (url) => fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(url)),
            (url) => fetch("https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(url))
        ];

        for (const strategy of strategies) {
            try {
                const res = await strategy(src);
                if (!res.ok) continue;
                const blob = await res.blob();
                if (blob.size < 4000) return; 
                
                const bitmap = await createImageBitmap(blob);
                const cvs = document.createElement("canvas");
                cvs.width = bitmap.width; cvs.height = bitmap.height;
                cvs.getContext("2d").drawImage(bitmap, 0, 0);
                
                successfulCount++;
                sourceImages.push({ 
                    id: `web_${Math.random().toString(36).substr(2, 5)}`, 
                    sourceName: "web_img", 
                    canvas: cvs, 
                    originalSize: blob.size 
                });
                return; // Éxito, salimos de las estrategias para esta imagen
            } catch (e) {
                // Siguiente estrategia
            }
        }
    }

    // Procesar en paralelo con límite de concurrencia (5 imágenes a la vez)
    const concurrency = 5;
    for (let i = 0; i < srcsArray.length; i += concurrency) {
        if (sourceImages.length >= 100) break; // Límite de seguridad
        const chunk = srcsArray.slice(i, i + concurrency);
        await Promise.all(chunk.map(src => processSingleImage(src)));
    }
}

// --- PROCESAMIENTO Y COMPRESIÓN ---
async function processImages() {
    if (!sourceImages.length) return;
    loadingIndicator.style.display = "block";
    loadingIndicator.textContent = "⚙️ Optimizando imágenes...";
    
    // Pequeño retardo para dejar que el loading indicator se muestre
    await new Promise(r => setTimeout(r, 100));

    preview.innerHTML = "";
    let totalOriginal = 0, totalCompressed = 0;
    const zip = new JSZip();
    const config = {
        quality: parseFloat(qualityRange.value),
        scale: parseFloat(scaleRange.value),
        format: formatSelect.value,
        enabled: compressToggle.checked
    };
    const ext = config.format.split("/")[1];

    let processedCount = 0;
    for (const item of sourceImages) {
        processedCount++;
        if (processedCount % 10 === 0) {
            loadingIndicator.textContent = `⚙️ Optimizando ${processedCount} de ${sourceImages.length}...`;
            // Ceder tiempo al hilo principal para no congelar la UI
            await new Promise(r => setTimeout(r, 0));
        }

        const finalData = compressCanvas(item.canvas, config);
        item.optimizedDataUrl = finalData;
        const finalSize = estimateSize(finalData);
        totalOriginal += item.originalSize;
        totalCompressed += finalSize;
        
        let cleanName = item.sourceName.split('.')[0];
        const filename = `${cleanName}_opt.${ext}`;
        
        addCard(item, finalData, item.originalSize, finalSize, filename);
        zip.file(filename, finalData.split(",")[1], {base64: true});
    }

    originalSizeLabel.textContent = formatBytes(totalOriginal);
    compressedSizeLabel.textContent = formatBytes(totalCompressed);
    downloadZipBtn.style.display = "block";
    presentationSection.style.display = "block";
    downloadZipBtn.onclick = async () => {
        const content = await zip.generateAsync({type:"blob"});
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = `${currentFileName}_optimizado.zip`;
        a.click();
    };
    loadingIndicator.style.display = "none";
}

// --- HELPERS ---
function normalizeImageData(imgObj) {
    try {
        const width = imgObj.width;
        const height = imgObj.height;
        const rawData = imgObj.data;
        const kind = imgObj.kind || -1; // ImageKind: 1=GRAY, 2=RGB, 3=RGBA

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        let finalData;

        // Validamos el tamaño esperado vs real
        if (kind === 2 || rawData.length === width * height * 3) {
            finalData = new Uint8ClampedArray(width * height * 4);
            for (let i = 0, j = 0; i < rawData.length; i += 3, j += 4) {
                finalData[j] = rawData[i];     // R
                finalData[j + 1] = rawData[i + 1]; // G
                finalData[j + 2] = rawData[i + 2]; // B
                finalData[j + 3] = 255;        // Alpha
            }
        } 
        else if (kind === 1 || rawData.length === width * height) {
            finalData = new Uint8ClampedArray(width * height * 4);
            for (let i = 0, j = 0; i < rawData.length; i++, j += 4) {
                finalData[j] = rawData[i];     // R
                finalData[j + 1] = rawData[i]; // G
                finalData[j + 2] = rawData[i]; // B
                finalData[j + 3] = 255;        // Alpha
            }
        }
        else if (kind === 3 || rawData.length === width * height * 4) {
            finalData = new Uint8ClampedArray(rawData);
        } 
        else {
            console.warn("Formato de color no soportado:", kind, rawData.length);
            return null;
        }

        const imageData = new ImageData(finalData, width, height);
        ctx.putImageData(imageData, 0, 0);
        return canvas;

    } catch (e) {
        console.error("Error normalizando imagen:", e);
        return null;
    }
}

function compressCanvas(canvas, cfg) {
    if (!cfg.enabled) return canvas.toDataURL("image/png");
    const w = Math.max(1, Math.floor(canvas.width * cfg.scale));
    const h = Math.max(1, Math.floor(canvas.height * cfg.scale));
    const tCanvas = document.createElement("canvas");
    tCanvas.width = w; tCanvas.height = h;
    const ctx = tCanvas.getContext("2d");
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(canvas, 0, 0, w, h);
    return tCanvas.toDataURL(cfg.format, cfg.quality);
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function imageToCanvas(img) {
    const c = document.createElement("canvas");
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    c.getContext("2d").drawImage(img, 0, 0);
    return c;
}

function addCard(item, imgData, orig, comp, filename) {
    const savings = orig > 0 ? Math.round((1 - (comp / orig)) * 100) : 0;
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
        <div style="font-weight:bold; font-size:0.9em; margin-bottom:5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${filename}</div>
        <img src="${imgData}">
        <div class="card-info">
            <div>Antes: ${formatBytes(orig)}</div>
            <div>Ahora: <b>${formatBytes(comp)}</b></div>
            <span class="badge ${savings > 0 ? 'badge-green' : 'badge-gray'}">
                ${savings > 0 ? `-${savings}%` : 'Original'}
            </span>
        </div>
        <button class="secondary full-width" style="margin-top:10px; cursor:pointer;" onclick="downloadItem('${imgData}', '${filename}')">⬇ Bajar</button>
    `;
    preview.appendChild(div);
}

function estimateSize(b64) { return Math.round((b64.length * 3) / 4); }
function formatBytes(b) { 
    if(b===0) return '0 B'; 
    const k=1024; const i=Math.floor(Math.log(b)/Math.log(k)); 
    return parseFloat((b/Math.pow(k,i)).toFixed(1))+' '+['B','KB','MB','GB'][i]; 
}

// Función para descargar una sola imagen
function downloadItem(url, name) {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// --- GENERAR PRESENTACIÓN (adaptado del Modelo) ---
async function generarPresentacion() {
    if (!sourceImages.length) {
        alert("No hay imágenes para generar la presentación.");
        return;
    }

    const btn = generatePresentationBtn;
    const originalText = btn.innerText;
    btn.innerText = "⏳ Generando presentación...";
    btn.disabled = true;

    try {
        const mediaItems = [];
        const useOptimized = document.getElementById("useOptimizedCheck").checked;

        for (const item of sourceImages) {
            const dataUrl = useOptimized && item.optimizedDataUrl
                ? item.optimizedDataUrl
                : item.canvas.toDataURL("image/png");
            mediaItems.push({ url: dataUrl, type: 'image' });
        }

        let arrayContent = "";
        mediaItems.forEach((item) => {
            arrayContent += "        { url: '" + item.url + "', type: '" + item.type + "' },\n";
        });

        let htmlText = TEMPLATE_MODELO;

        const regex = /const mediaItems\s*=\s*\[[\s\S]*?\];/;
        const newArrayDefinition = "const mediaItems = [\n" + arrayContent + "    ];";
        htmlText = htmlText.replace(regex, newArrayDefinition);

        const sizeSel = sizeSelector.value;
        let sizeStyles = '';

        function makeSize(maxW, ratioW, ratioH) {
            if (ratioW === 0) {
                return "/* Preset: Full Responsive (Original) */\n\
.presentation { --preset-maxw: 9999px; --aspect-w: 0; --aspect-h: 0; width: 100%; height: 100%; margin: 0; box-shadow: none; position: relative; }\n\
.presentation .slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; padding: 20px !important; padding-bottom: 40px !important; box-sizing: border-box; }\n\
.presentation img, .presentation video { max-width: 100%; max-height: 85%; object-fit: contain; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.5); }\n\
.presentation iframe { width: calc(100% - 120px); height: 85%; border: none; border-radius: 10px; }\n\
footer { bottom: 5px; position: absolute; width: 100%; text-align: center; }\n\
.indicators { bottom: 35px; position: absolute; width: 100%; display: flex; justify-content: center; }\n\
.slide-link-badge { bottom: 55px; }";
            }
            return "/* Preset: dinamico con ratio fijo + centrado Flexbox */\n\
body, html { display: flex !important; align-items: center; justify-content: center; }\n\
.presentation { --preset-maxw: " + maxW + "px; --aspect-w: " + ratioW + "; --aspect-h: " + ratioH + "; display:block; box-shadow: 0 0 50px rgba(0,0,0,0.5); }\n\
.presentation .slide { height: 100%; padding: 40px; padding-bottom: 85px; box-sizing: border-box; }\n\
.presentation img, .presentation video { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }\n\
.presentation iframe { width: 100%; height: 100%; border: none; border-radius: 10px; }";
        }

        switch (sizeSel) {
            case 'responsive':
                sizeStyles = makeSize(0, 0, 0);
                break;
            case 'horizontal':
                sizeStyles = makeSize(1280, 16, 9);
                break;
            case 'ppt-4-3':
                sizeStyles = makeSize(1024, 4, 3);
                break;
            case 'square-1-1':
                sizeStyles = makeSize(900, 1, 1);
                break;
            case 'ig-post-4-5':
                sizeStyles = makeSize(900, 4, 5);
                break;
            case 'tiktok-9-16':
                sizeStyles = makeSize(720, 9, 16);
                break;
            case 'poster-3-2':
                sizeStyles = makeSize(1000, 3, 2);
                break;
            case 'a4-portrait':
                sizeStyles = makeSize(794, 210, 297);
                break;
            case 'vertical':
            default:
                sizeStyles = makeSize(900, 3, 4);
                break;
        }

        htmlText = htmlText.replace('%%PRESENTATION_STYLE%%', sizeStyles);

        const blob = new Blob([htmlText], {type:"text/html"});
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "presentacion_slides.html";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (err) {
        alert("Error al generar la presentación: " + err.message);
        console.error(err);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}