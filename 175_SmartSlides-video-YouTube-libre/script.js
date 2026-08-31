document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const getApiKeyBtn = document.getElementById('getApiKeyBtn');
    const modelSelector = document.getElementById('model_selector');
    const imgModelSelect = document.getElementById('img_model');
    const slideCountInput = document.getElementById('slideCount');
    const youtubeUrlInput = document.getElementById('youtube-url');
    const youtubeStatus = document.getElementById('youtube-status');
    const createJsonBtn = document.getElementById('createJsonBtn');
    const loadingIndicator = document.getElementById('loading-indicator');
    const jsonOutput = document.getElementById('json_output');
    const copyJsonBtn = document.getElementById('copyJsonBtn');
    const generateSlidesBtn = document.getElementById('generateSlidesBtn');
    const pdfPlaceholder = document.getElementById('pdf-placeholder');
    const slideViewer = document.getElementById('slide-viewer');
    const slideGrid = document.getElementById('slide-grid');
    const slideProgress = document.getElementById('slide-progress');
    const downloadSection = document.getElementById('download-section');
    const topicInput = document.getElementById('topicInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const paletaBtn = document.getElementById('paletaBtn');

    let youtubeUrl = '';
    let youtubeVideoInfo = null;
    let isProcessing = false;

    let slidesData = [];
    let slideImageUrls = [];
    let currentSlideIndex = -1;
    let isGeneratingSlide = false;
    let paused = false;
    let resumeGeneration = null;

    let currentPaletteIndex = -1;
    let currentColors = ['#0B1026', '#4F46E5', '#06B6D4', '#FFFFFF'];

    const visualStyles = [
        { es: "Profesional Moderno", en: "Modern Professional", fr: "Professionnel Moderne", description: "Diseño corporativo contemporáneo, limpio y sofisticado; tipografía sans-serif elegante; paleta azul, blanco y gris con acentos cian; composición minimalista basada en cuadrículas; amplios espacios en blanco; iconografía moderna; imágenes de alta calidad; aspecto tecnológico, confiable y ejecutivo.", tone: "profesional, moderno, corporativo, tecnológico, elegante" },
        { es: "Infográfico Colorido", en: "Colorful Infographic", fr: "Infographie Colorée", description: "Diseño visualmente atractivo y dinámico inspirado en infografías modernas; colores vibrantes y contrastantes; iconografía clara; diagramas, estadísticas y elementos gráficos destacados; jerarquía tipográfica fuerte; composición modular fácil de escanear; apariencia educativa, amigable y profesional.", tone: "educativo, visual, dinámico, colorido, informativo" },
        { es: "Corporativo Minimalista", en: "Minimalist Corporate", fr: "Corporatif Minimaliste", description: "Diseño elegante y depurado con enfoque en simplicidad extrema; paleta sobria azul, gris y blanco; tipografía moderna de alta legibilidad; amplios márgenes; pocos elementos decorativos; gráficos discretos; composición equilibrada y ejecutiva; apariencia premium y profesional.", tone: "minimalista, corporativo, elegante, sobrio, ejecutivo" },
        { es: "Tecnológico Futurista", en: "Futuristic Tech", fr: "Technologique Futuriste", description: "Diseño inspirado en interfaces del futuro; fondos oscuros con gradientes azul, violeta y cian; efectos neón, hologramas y paneles digitales; líneas de circuito, patrones geométricos y visualizaciones de datos; alto contraste; apariencia innovadora, tecnológica y avanzada.", tone: "futurista, tecnológico, innovador, impactante, digital" },
        { es: "Académico Serio", en: "Serious Academic", fr: "Académique Sérieux", description: "Diseño académico formal y riguroso; tipografía clara y altamente legible; paleta sobria en azul oscuro, gris y blanco; gráficos científicos limpios; tablas, diagramas y referencias visuales ordenadas; composición estructurada; apariencia profesional orientada a educación superior e investigación.", tone: "académico, científico, formal, riguroso, profesional" },
        { es: "Creativo Artístico", en: "Artistic Creative", fr: "Créatif Artistique", description: "Diseño expresivo y visualmente llamativo; combinación de ilustraciones, texturas, formas orgánicas y composiciones asimétricas; paleta rica y armoniosa; tipografías con personalidad; uso creativo del espacio; apariencia inspiradora, moderna y original.", tone: "creativo, artístico, inspirador, expresivo, innovador" },
        { es: "Pizarra / Sketch", en: "Whiteboard / Sketch", fr: "Tableau Blanc / Sketch", description: "Diseño inspirado en apuntes dibujados a mano; fondo tipo pizarra o papel de bocetos; ilustraciones sketch, flechas, diagramas y anotaciones manuscritas; apariencia informal pero organizada; sensación de explicación paso a paso; estilo educativo y cercano.", tone: "didáctico, informal, creativo, explicativo, dinámico" },
        { es: "Vintage / Retro", en: "Vintage / Retro", fr: "Vintage / Rétro", description: "Diseño inspirado en carteles y publicaciones clásicas de mediados del siglo XX; paleta de colores envejecidos; texturas de papel antiguo; tipografías retro; ilustraciones estilizadas; composición nostálgica y elegante; apariencia auténtica y memorable.", tone: "retro, nostálgico, clásico, elegante, distintivo" },
        { es: "Memphis Design", en: "Memphis Design", fr: "Memphis Design", description: "Diseño inspirado en el movimiento Memphis de los años 80; colores brillantes y contrastantes; formas geométricas abstractas como círculos, triángulos, zigzags y patrones decorativos; composiciones dinámicas y divertidas; tipografía audaz; elementos visuales superpuestos; apariencia energética, creativa y altamente llamativa.", tone: "vibrante, creativo, divertido, atrevido, geométrico" },
        { es: "Isométrico 3D", en: "Isometric 3D", fr: "Isométrique 3D", description: "Diseño basado en ilustraciones isométricas tridimensionales; objetos, edificios, personas y procesos representados con perspectiva isométrica; sombras suaves y profundidad visual; paleta moderna y profesional; composición clara orientada a explicar conceptos complejos; apariencia tecnológica, moderna y visualmente inmersiva.", tone: "tecnológico, tridimensional, moderno, explicativo, profesional" },
        { es: "Nature / Eco", en: "Nature / Eco", fr: "Nature / Éco", description: "Diseño inspirado en la naturaleza y la sostenibilidad; paleta de verdes, azules suaves, tonos tierra y colores orgánicos; ilustraciones de plantas, paisajes, hojas y elementos naturales; texturas suaves y formas fluidas; composición armoniosa y relajante; apariencia ecológica, fresca y responsable.", tone: "natural, ecológico, orgánico, sostenible, armonioso" },
        { es: "Comic / Historieta", en: "Comic / Storyboard", fr: "Comic / Bande Dessinée", description: "Diseño inspirado en cómics y novelas gráficas; uso de paneles, viñetas y marcos visuales; ilustraciones expresivas; bocadillos de diálogo, efectos sonoros visuales y elementos narrativos; colores vivos y contrastantes; tipografía dinámica; apariencia entretenida, educativa y visualmente atractiva.", tone: "divertido, narrativo, dinámico, creativo, visual" },
        { es: "Apple Keynote", en: "Apple Keynote", fr: "Apple Keynote", description: "Diseño premium inspirado en presentaciones de productos tecnológicos de alta gama; minimalismo elegante; fondos limpios con amplios espacios en blanco o negro profundo; imágenes protagonistas de gran tamaño; tipografía moderna y refinada; uso limitado de colores de acento; composición centrada en la simplicidad y el impacto visual.", tone: "premium, elegante, minimalista, sofisticado, innovador" },
        { es: "Glassmorphism", en: "Glassmorphism", fr: "Glassmorphisme", description: "Diseño moderno basado en paneles translúcidos con efecto de vidrio esmerilado; fondos con gradientes suaves y colores vibrantes; transparencias, desenfoques y reflejos sutiles; sombras delicadas para generar profundidad; tipografía limpia y moderna; apariencia tecnológica, elegante y futurista.", tone: "moderno, elegante, futurista, ligero, tecnológico" }
    ];

    const colorPalettes = [
        { name: 'Azul Profesional', colors: ['#0B1026', '#4F46E5', '#06B6D4', '#FFFFFF'] },
        { name: 'Verde Corporativo', colors: ['#0D2818', '#1B6B3D', '#52B788', '#F5FFF5'] },
        { name: 'Borgoña Académico', colors: ['#2D0A0A', '#8B1A1A', '#D4AF37', '#FFFDF5'] },
        { name: 'Púrpura Ejecutivo', colors: ['#1A0A2E', '#6C3FB7', '#D4A5F0', '#F8F4FF'] },
        { name: 'Azul Marino Clásico', colors: ['#0A1628', '#1D3557', '#457B9D', '#F1FAEE'] },
        { name: 'Verde Bosque', colors: ['#0D1B0E', '#2D6A4F', '#95D5B2', '#F5FFF5'] },
        { name: 'Pizarra Moderna', colors: ['#1A1A2E', '#16213E', '#E94560', '#F5F5F5'] },
        { name: 'Cobre Elegante', colors: ['#1A0F0A', '#8B4513', '#D4A04A', '#FFF8E7'] }
    ];

    function applyColors(colors) {
        if (!colors || colors.length < 2) return;
        currentColors = colors;
        document.documentElement.style.setProperty('--bg-start', colors[0]);
        document.documentElement.style.setProperty('--bg-end', colors[1]);
        document.documentElement.style.setProperty('--accent', colors[2] || '#06B6D4');
        document.documentElement.style.setProperty('--container-bg', colors[3] || '#FFFFFF');
    }

    function updatePaletteButton(palette) {
        if (!palette) return;
        const name = palette.name;
        const dot = palette.colors[0];
        paletaBtn.innerHTML = `🎨 ${name} <span class="palette-indicator" style="background:${dot};"></span>`;
    }

    // ----- API Key (managed server-side) -----
    // No API key in frontend - all requests go through backend proxy

    // ----- Models (authorized list, no external fetch needed) -----
    // Models are set in HTML directly - no need to fetch from external APIs

    // ----- Mutual exclusion: YouTube URL <-> Topic -----
    function updateMutualExclusion() {
        const hasVideo = youtubeUrl.trim().length > 0;
        const hasTopic = topicInput.value.trim().length > 0;
        topicInput.disabled = hasVideo;
        descriptionInput.disabled = hasVideo;
        youtubeUrlInput.disabled = hasTopic;
        createJsonBtn.disabled = !(hasVideo || hasTopic);
    }

    function extractYoutubeId(url) {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
            /^([a-zA-Z0-9_-]{11})$/
        ];
        for (const p of patterns) {
            const match = url.match(p);
            if (match) return match[1];
        }
        return null;
    }

    async function fetchYoutubeVideoInfo(url) {
        const videoId = extractYoutubeId(url);
        if (!videoId) return null;
        try {
            const resp = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
            if (!resp.ok) return null;
            const data = await resp.json();
            return {
                id: videoId,
                title: data.title || 'Video sin título',
                author: data.author_name || 'Autor desconocido'
            };
        } catch (e) {
            return { id: videoId, title: '', author: '' };
        }
    }

    // ----- YouTube URL Input -----
    youtubeUrlInput.addEventListener('input', handleYoutubeUrlInput);

    topicInput.addEventListener('input', updateMutualExclusion);
    descriptionInput.addEventListener('input', updateMutualExclusion);

    function handleYoutubeUrlInput() {
        const url = youtubeUrlInput.value.trim();
        if (!url) {
            youtubeUrl = '';
            youtubeVideoInfo = null;
            youtubeStatus.textContent = '';
            showPlaceholderDefault();
            updateMutualExclusion();
            return;
        }
        const isValid = extractYoutubeId(url) !== null;
        if (isValid) {
            const videoId = extractYoutubeId(url);
            youtubeUrl = url;
            youtubeStatus.textContent = 'Obteniendo información del video...';
            youtubeStatus.style.color = 'orange';
            resetAll();
            showPlaceholderVideo(videoId);
            fetchYoutubeVideoInfo(url).then(info => {
                youtubeVideoInfo = info;
                if (info && info.title) {
                    youtubeStatus.textContent = `Video: "${info.title}" - ${info.author}`;
                    youtubeStatus.style.color = '#28a745';
                } else {
                    youtubeStatus.textContent = 'Video detectado. ¡Listo!';
                    youtubeStatus.style.color = '#28a745';
                }
                createJsonBtn.disabled = false;
            });
        } else {
            youtubeUrl = '';
            youtubeVideoInfo = null;
            youtubeStatus.textContent = 'Ingresa un enlace válido de YouTube';
            youtubeStatus.style.color = '#dc3545';
            createJsonBtn.disabled = true;
            showPlaceholderDefault();
            updateMutualExclusion();
        }
    }

    function showPlaceholderVideo(videoId) {
        pdfPlaceholder.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" referrerpolicy="strict-origin-when-cross-origin" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius:4px;"></iframe>`;
        pdfPlaceholder.style.display = 'flex';
        pdfPlaceholder.style.padding = '0';
        pdfPlaceholder.style.overflow = 'hidden';
    }

    function showPlaceholderMessage(html, isError) {
        pdfPlaceholder.innerHTML = `<div style="text-align:center;padding:40px;color:${isError ? '#dc3545' : '#333'};font-size:${isError ? '16px' : '18px'};line-height:1.6;">${html}</div>`;
        pdfPlaceholder.style.display = 'flex';
        pdfPlaceholder.style.padding = '0';
        pdfPlaceholder.style.overflow = 'auto';
    }

    function showPlaceholderDefault() {
        pdfPlaceholder.innerHTML = 'Ingresa un enlace de YouTube para comenzar';
        pdfPlaceholder.style.display = 'flex';
        pdfPlaceholder.style.padding = '0';
        pdfPlaceholder.style.overflow = 'auto';
    }

    function resetAll() {
        youtubeUrl = youtubeUrlInput.value.trim();
        const id = youtubeUrl ? extractYoutubeId(youtubeUrl) : null;
        if (!id) {
            youtubeUrl = '';
            youtubeVideoInfo = null;
            showPlaceholderDefault();
        }
        createJsonBtn.disabled = true;
        generateSlidesBtn.disabled = true;
        slideViewer.style.display = 'none';
        slideGrid.innerHTML = '';
        slideProgress.style.display = 'none';
        downloadSection.style.display = 'none';
        slidesData = [];
        slideImageUrls = [];
        currentSlideIndex = -1;
        updateMutualExclusion();
    }

    // ----- Create JSON Prompting -----
    createJsonBtn.addEventListener('click', handleCreateJson);

    async function handleCreateJson() {
        const topic = topicInput.value.trim();
        if (!youtubeUrl && !topic) {
            alert('Por favor, ingresa un enlace de YouTube o un tema central.');
            return;
        }
        if (isProcessing) return;

        // Clear topic/description when using YouTube to avoid confusion
        if (youtubeUrl) {
            topicInput.value = '';
            descriptionInput.value = '';
        }

        isProcessing = true;
        createJsonBtn.disabled = true;
        loadingIndicator.style.display = 'block';
        jsonOutput.value = '';
        generateSlidesBtn.disabled = true;
        showPlaceholderMessage(youtubeUrl ? 'Generando JSON prompting a partir del video...<br><small>Esto puede tomar unos segundos</small>' : 'Generando JSON prompting...<br><small>Esto puede tomar unos segundos</small>', false);

        const model = modelSelector.value || 'gemini-2.0-flash';
        const numSlides = parseInt(slideCountInput.value, 10) || 10;

        const systemPrompt = 'Eres un asistente experto en crear JSON prompting para generar presentaciones de diapositivas.';

        const aspectDesc = getAspectRatioDescription();
        const styleData = getSelectedStyleData();
        let userPrompt;
        if (youtubeUrl) {
            const videoTitle = youtubeVideoInfo?.title || '';
            const videoAuthor = youtubeVideoInfo?.author || '';
            userPrompt = `Analiza DETALLADAMENTE el siguiente video de YouTube y crea los JSON prompting con ${numSlides} diapositivas basadas EXCLUSIVAMENTE en el contenido del video.

INFORMACIÓN DEL VIDEO:
- Título: "${videoTitle}"
- Canal/Autor: ${videoAuthor}
- URL: ${youtubeUrl}

Debes mirar, escuchar y analizar el contenido completo del video. Extrae los puntos clave, conceptos principales y detalles importantes del video para crear las diapositivas.

Estructura requerida:
1. La primera diapositiva es el título de la presentación basada en el video, en texto dinámico e impactante.
2. Las demás diapositivas incluyen un texto corto con diseño llamativo y una imagen relacionada con el contenido del video.
3. Texto máximo por diapositiva: 20 palabras.
4. Imágenes ocupando entre 60% y 75% del espacio visual.
5. Estilo visual: "${styleData.es}". Aplica este estilo de diseño consistentemente en todas las diapositivas.
   Descripción del estilo: ${styleData.description}
   Tono del estilo: ${styleData.tone}
   La estructura JSON debe incluir en el objeto "theme" los campos "style", "description" y "tone" con estos valores.
6. La estructura JSON debe ser bien clara para generar las diapositivas con una IA.
7. Las diapositivas se mostrarán en formato ${aspectDesc}. Ajusta la descripción visual (image_prompt) de cada diapositiva para que el contenido se distribuya correctamente en todo el lienzo, aprovechando al máximo el espacio disponible.

IMPORTANTE: NO inventes contenido. TODO el contenido de las diapositivas debe estar basado EXCLUSIVAMENTE en lo que se ve y se dice en el video.

Video de YouTube:
${youtubeUrl}

Genera únicamente el JSON con la estructura solicitada, sin explicaciones adicionales.`;
        } else {
            const desc = descriptionInput.value.trim();
            userPrompt = `Crea un JSON prompting con ${numSlides} diapositivas para una presentación sobre: "${topic}"${desc ? `\nEnfoque: ${desc}` : ''}

El JSON debe incluir:

1. La primera diapositiva es el título de la presentación en texto dinámico e impactante.
2. Las demás diapositivas incluyen un texto corto con diseño llamativo y una imagen relacionada con el texto.
3. Texto máximo por diapositiva: 20 palabras.
4. Imágenes ocupando entre 60% y 75% del espacio visual.
5. Estilo visual: "${styleData.es}". Aplica este estilo de diseño consistentemente en todas las diapositivas.
   Descripción del estilo: ${styleData.description}
   Tono del estilo: ${styleData.tone}
   La estructura JSON debe incluir en el objeto "theme" los campos "style", "description" y "tone" con estos valores.
6. La estructura JSON debe ser bien clara para generar las diapositivas con una IA.
7. Las diapositivas se mostrarán en formato ${aspectDesc}. Ajusta la descripción visual (image_prompt) de cada diapositiva para que el contenido se distribuya correctamente en todo el lienzo, aprovechando al máximo el espacio disponible.
8. Las diapositivas deben tener contenido educativo y profesional.

Genera únicamente el JSON con la estructura solicitada, sin explicaciones adicionales.`;
        }

        try {
            const response = await fetch('https://node.proyectodescartes.org/api/ia/text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: userPrompt,
                    model: model,
                    system: systemPrompt,
                    json: false
                })
            });

            if (!response.ok) {
                let errorBody = '';
                try { errorBody = await response.text(); } catch (e) {}
                throw new Error(`Error de API: ${response.status} ${response.statusText}. ${errorBody.substring(0, 200)}`);
            }

            let content = await response.text();

            const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) {
                content = jsonMatch[1].trim();
            }

            jsonOutput.value = content;
            generateSlidesBtn.disabled = false;
            showPlaceholderMessage('JSON generado correctamente.<br><small>Revisa el editor JSON y haz clic en "Generar diapositivas"</small>', false);
            if (youtubeUrl && youtubeVideoInfo?.id) {
                showPlaceholderVideo(youtubeVideoInfo.id);
            }
        } catch (error) {
            const errMsg = `Error: ${error.message}`;
            jsonOutput.value = errMsg;
            const isImageError = errMsg.toLowerCase().includes('image') && errMsg.toLowerCase().includes('not support');
            if (isImageError) {
                showPlaceholderMessage(`<strong>El modelo no puede procesar el video directamente</strong><br>${errMsg.replace(/\n/g, '<br>')}<br><br><strong>Sugerencia:</strong> Usa el campo "Tema Central" para describir manualmente el contenido del video y genera la presentación desde ahí.`, true);
            } else {
                showPlaceholderMessage(`<strong>Error al generar JSON</strong><br>${errMsg.replace(/\n/g, '<br>')}<br><br><small>Verifica que el video sea accesible o prueba con otro video</small>`, true);
            }
        } finally {
            isProcessing = false;
            createJsonBtn.disabled = false;
            loadingIndicator.style.display = 'none';
        }
    }

    // ----- Copy JSON -----
    copyJsonBtn.addEventListener('click', () => {
        const text = jsonOutput.value;
        if (!text) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                const prev = copyJsonBtn.textContent;
                copyJsonBtn.textContent = 'Copiado';
                setTimeout(() => { copyJsonBtn.textContent = prev; }, 1200);
            }).catch(() => fallbackCopy(text));
        } else {
            fallbackCopy(text);
        }
    });

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
    }

    // ----- Paleta de colores -----
    paletaBtn.addEventListener('click', () => {
        currentPaletteIndex = (currentPaletteIndex + 1) % colorPalettes.length;
        const palette = colorPalettes[currentPaletteIndex];
        applyColors(palette.colors);
        updatePaletteButton(palette);

        if (jsonOutput.value.trim()) {
            try {
                const parsed = JSON.parse(jsonOutput.value);
                if (parsed?.presentation) {
                    if (!parsed.presentation.theme) parsed.presentation.theme = {};
                    parsed.presentation.theme.colors = palette.colors;
                    jsonOutput.value = JSON.stringify(parsed, null, 2);
                }
            } catch (e) {}
        }
    });

    // ----- Estilo visual -----
    function applyStyleToJson(styleName) {
        const text = jsonOutput.value.trim();
        if (!text) return;
        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (e) {
            const match = text.match(/\{[\s\S]*\}/);
            if (match) try { parsed = JSON.parse(match[0]); } catch (e2) { return; }
            if (!parsed) return;
        }
        const target = parsed?.presentation || parsed;
        if (!target) return;
        const data = visualStyles.find(s => s.es === styleName) || visualStyles[0];
        if (!target.theme) target.theme = {};
        target.theme.style = styleName;
        target.theme.description = data.description;
        target.theme.tone = data.tone;
        target.style = styleName;
        jsonOutput.value = JSON.stringify(parsed, null, 2);
    }

    document.getElementById('visual_style').addEventListener('change', function () {
        applyStyleToJson(this.value);
    });
    document.getElementById('visual_style').addEventListener('input', function () {
        applyStyleToJson(this.value);
    });

    // Apply default palette on load
    (function initPalette() {
        currentPaletteIndex = 0;
        const palette = colorPalettes[0];
        applyColors(palette.colors);
        updatePaletteButton(palette);
    })();

    // ----- Pause / Resume -----
    document.getElementById('pauseResumeBtn').addEventListener('click', () => {
        if (paused) {
            if (resumeGeneration) resumeGeneration();
        } else {
            paused = true;
            document.getElementById('pauseResumeBtn').textContent = 'Reanudar generación de imágenes';
        }
    });

    // ----- Generate Slides (Grid) -----
    generateSlidesBtn.addEventListener('click', handleGenerateSlides);

    const modalOverlay = document.getElementById('img-modal');
    const modalImg = document.getElementById('modal-img');
    const modalClose = document.getElementById('modal-close');

    modalOverlay.addEventListener('click', () => { modalOverlay.style.display = 'none'; });
    modalClose.addEventListener('click', (e) => { e.stopPropagation(); modalOverlay.style.display = 'none'; });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modalOverlay.style.display = 'none'; });

    function buildSlideCard(index, imgUrl, errorMsg) {
        const card = document.createElement('div');
        card.className = 'slide-card';
        card.dataset.index = index;

        if (imgUrl) {
            const img = document.createElement('img');
            img.className = 'card-img';
            img.src = imgUrl;
            img.alt = `Diapositiva ${index + 1}`;
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                modalImg.src = imgUrl;
                modalOverlay.style.display = 'flex';
            });
            card.appendChild(img);
        } else if (errorMsg) {
            const errDiv = document.createElement('div');
            errDiv.className = 'card-error';
            errDiv.textContent = errorMsg;
            card.appendChild(errDiv);
        } else {
            const errDiv = document.createElement('div');
            errDiv.className = 'card-error';
            errDiv.textContent = 'Generando...';
            card.appendChild(errDiv);
        }

        const footer = document.createElement('div');
        footer.className = 'card-footer';

        const label = document.createElement('span');
        label.className = 'card-label';
        label.textContent = `Diapositiva ${index + 1}`;
        footer.appendChild(label);

        const regenBtn = document.createElement('button');
        regenBtn.className = 'regenerate-btn';
        regenBtn.textContent = 'Regenerar';
        regenBtn.dataset.index = index;
        regenBtn.addEventListener('click', () => regenerateSlide(parseInt(regenBtn.dataset.index)));
        footer.appendChild(regenBtn);

        card.appendChild(footer);
        return card;
    }

    async function handleGenerateSlides() {
        const jsonText = jsonOutput.value.trim();
        if (!jsonText) { alert('Primero genera el JSON prompting.'); return; }

        let parsed;
        try {
            parsed = JSON.parse(jsonText);
        } catch (e) {
            alert('El JSON no es válido. Revisa el formato.');
            return;
        }

        const slides = parsed?.presentation?.slides || parsed?.slides || [];
        if (!slides.length) { alert('No se encontraron diapositivas en el JSON.'); return; }

        const themeColors = parsed?.presentation?.theme?.colors || ['#0B1026', '#4F46E5', '#06B6D4', '#FFFFFF'];
        applyColors(themeColors);

        slidesData = slides;
        slideImageUrls = new Array(slides.length).fill(null);

        pdfPlaceholder.style.display = 'none';
        slideViewer.style.display = 'flex';
        slideGrid.innerHTML = '';
        slideProgress.style.display = 'block';
        slideProgress.textContent = 'Generando diapositivas...';
        document.getElementById('pause-section').style.display = 'block';
        paused = false;
        resumeGeneration = null;
        downloadSection.style.display = 'none';
        generateSlidesBtn.disabled = true;

        for (let i = 0; i < slides.length; i++) {
            if (paused) {
                slideProgress.textContent = `⏸️ Generación pausada en diapositiva ${i} de ${slides.length} - presiona "Reanudar" para continuar`;
                await new Promise(resolve => { resumeGeneration = resolve; });
                paused = false;
                document.getElementById('pauseResumeBtn').textContent = 'Pausar generación de imágenes';
            }

            slideProgress.textContent = `Generando diapositiva ${i + 1} de ${slides.length}...`;

            const placeholderCard = buildSlideCard(i);
            slideGrid.appendChild(placeholderCard);

            const result = await generateSingleSlide(i);

            const cards = slideGrid.querySelectorAll('.slide-card');
            const oldCard = cards[cards.length - 1];
            const newCard = buildSlideCard(i, result.url, result.error);
            newCard.dataset.index = i;

            const regenBtn = newCard.querySelector('.regenerate-btn');
            if (regenBtn) {
                regenBtn.addEventListener('click', () => regenerateSlide(i));
            }

            slideGrid.replaceChild(newCard, oldCard);
            slideImageUrls[i] = result.url;
        }

        slideProgress.style.display = 'none';
        document.getElementById('pause-section').style.display = 'none';
        downloadSection.style.display = 'flex';
        generateSlidesBtn.disabled = false;
    }

    async function generateSingleSlide(index) {
        const slide = slidesData[index];
        const imgModel = imgModelSelect.value || 'flux';
        const dims = getAspectRatioDims();
        const seed = Math.floor(Math.random() * 9999999) + 1;
        const imagePrompt = buildImagePrompt(slide, index);

        try {
            const response = await fetch('https://node.proyectodescartes.org/api/ia/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: imagePrompt,
                    model: imgModel,
                    seed: seed,
                    width: dims.w,
                    height: dims.h
                })
            });

            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            return { url, error: null };
        } catch (err) {
            return { url: null, error: err.message };
        }
    }

    function buildImagePrompt(slide, index) {
        const slideTitle = slide.title || slide.titulo || '';
        const slideText = slide.text || slide.texto || '';
        const imagePrompt = slide.image_prompt || slide.imagen || slide.descripcion_visual || '';

        const colorNames = [
            `#${currentColors[0].replace('#','')} background`,
            `#${currentColors[1].replace('#','')}`,
            `#${currentColors[2].replace('#','')} accent`
        ];
        const styleData = getSelectedStyleData();
        let prompt = `Professional presentation slide, ${styleData.en} style, ${styleData.tone} tone, color scheme: ${colorNames.join(', ')}, `;
        const aspectVal = document.getElementById('aspect_ratio').value;
        if (aspectVal === 'A4' || aspectVal === '9:16') {
            prompt += `VERTICAL PORTRAIT slide layout, content stacked vertically, full-height portrait composition, `;
        } else {
            prompt += `horizontal landscape slide layout, `;
        }
        if (index === 0) {
            prompt += `title slide, dynamic typography, impactful design, `;
        }
        prompt += `CRITICAL: The image MUST include readable text rendered directly onto the slide, `;
        prompt += `text must be clearly visible and well formatted, `;
        prompt += `do NOT generate an image without text on it, `;
        prompt += `image occupies 60-75% of visual space, text occupies the remaining area, `;
        if (slideTitle) prompt += `title text to include: "${slideTitle}", `;
        if (slideText) prompt += `body text to include: "${slideText}", `;
        if (imagePrompt) prompt += `visual content: ${imagePrompt}, `;
        prompt += `high quality, sharp text, professional layout`;

        return prompt;
    }

    function getAspectRatioDims() {
        const val = document.getElementById('aspect_ratio').value;
        switch (val) {
            case '16:9': return { w: 1920, h: 1080 };
            case '4:3': return { w: 1024, h: 768 };
            case 'A4': return { w: 794, h: 1123 };
            case '9:16': return { w: 1080, h: 1920 };
            default: return { w: 1920, h: 1080 };
        }
    }

    function getSelectedStyleData() {
        const el = document.getElementById('visual_style');
        const name = el ? el.value : 'Profesional Moderno';
        return visualStyles.find(s => s.es === name) || visualStyles[0];
    }

    function getAspectRatioDescription() {
        const val = document.getElementById('aspect_ratio').value;
        switch (val) {
            case '16:9': return 'panorámico horizontal (16:9)';
            case '4:3': return 'estándar horizontal (4:3)';
            case 'A4': return 'vertical A4 (retrato)';
            case '9:16': return 'vertical para móvil (9:16)';
            default: return 'panorámico horizontal';
        }
    }

    // ----- Regenerate single slide in the grid -----
    async function regenerateSlide(index) {
        const jsonText = jsonOutput.value.trim();
        if (!jsonText) { alert('El JSON está vacío. Edítalo primero.'); return; }
        let parsed;
        try { parsed = JSON.parse(jsonText); } catch (e) { alert('El JSON no es válido.'); return; }
        const slides = parsed?.presentation?.slides || parsed?.slides || [];
        if (!slides.length) { alert('No hay diapositivas en el JSON.'); return; }
        slidesData = slides;

        const cards = slideGrid.querySelectorAll('.slide-card');
        let targetCard = null;
        for (const c of cards) {
            if (parseInt(c.dataset.index) === index) {
                targetCard = c;
                break;
            }
        }
        if (!targetCard) return;

        const regenBtns = targetCard.querySelectorAll('.regenerate-btn');
        regenBtns.forEach(b => b.disabled = true);

        const result = await generateSingleSlide(index);

        const newCard = buildSlideCard(index, result.url, result.error);
        const newRegenBtn = newCard.querySelector('.regenerate-btn');
        if (newRegenBtn) {
            newRegenBtn.addEventListener('click', () => regenerateSlide(index));
        }
        slideGrid.replaceChild(newCard, targetCard);
        slideImageUrls[index] = result.url;
    }

    // ----- Download ZIP -----
    document.getElementById('btn-zip').addEventListener('click', async () => {
        const btn = document.getElementById('btn-zip');
        const orig = btn.textContent;
        btn.textContent = 'Empaquetando ZIP...';
        btn.disabled = true;
        try {
            const zip = new JSZip();
            const keys = Object.keys(slideImageUrls);
            for (const k of keys) {
                const url = slideImageUrls[k];
                if (!url) continue;
                const resp = await fetch(url);
                const blob = await resp.blob();
                zip.file(`diapositiva_${parseInt(k) + 1}.jpg`, blob);
            }
            const content = await zip.generateAsync({ type: 'blob' });
            const blobUrl = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'diapositivas.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        } catch (e) {
            alert('Error al crear el ZIP.');
        } finally {
            btn.textContent = orig;
            btn.disabled = false;
        }
    });

    // ----- Download Presentación HTML -----
    document.getElementById('btn-presenter').addEventListener('click', async () => {
        const btn = document.getElementById('btn-presenter');
        const orig = btn.textContent;
        btn.textContent = 'Generando presentación...';
        btn.disabled = true;
        try {
            const base64Images = [];
            for (const k of Object.keys(slideImageUrls)) {
                const url = slideImageUrls[k];
                if (!url) continue;
                const resp = await fetch(url);
                const blob = await resp.blob();
                const b64 = await blobToBase64(blob);
                base64Images.push(b64);
            }

            let html = getPresenterTemplate();
            let arrayContent = '';
            base64Images.forEach(img => {
                arrayContent += `        '${img}',\n`;
            });
            html = html.replace(/const imageUrls\s*=\s*\[[\s\S]*?\];/,
                `const imageUrls = [\n${arrayContent}    ];`);

            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'presentacion_interactiva.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            alert('Error al crear la presentación.');
        } finally {
            btn.textContent = orig;
            btn.disabled = false;
        }
    });

    // ----- Download Galería HTML -----
    document.getElementById('btn-gallery').addEventListener('click', async () => {
        const btn = document.getElementById('btn-gallery');
        const orig = btn.textContent;
        btn.textContent = 'Generando galería...';
        btn.disabled = true;
        try {
            const base64Images = [];
            for (const k of Object.keys(slideImageUrls)) {
                const url = slideImageUrls[k];
                if (!url) continue;
                const resp = await fetch(url);
                const blob = await resp.blob();
                const b64 = await blobToBase64(blob);
                base64Images.push(b64);
            }

            const html = buildGalleryHtml(base64Images);
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'galeria_diapositivas.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            alert('Error al crear la galería.');
        } finally {
            btn.textContent = orig;
            btn.disabled = false;
        }
    });

    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    function getPresenterTemplate() {
        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Presentación Interactiva</title>
    <style>
        body,html{margin:0;padding:0;font-family:Arial,sans-serif;height:100%;overflow:hidden;background:#1a1a1a;color:white}
        .slide{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:20px;box-sizing:border-box;opacity:0;transition:all 0.5s}
        .slide.active{opacity:1;z-index:1}
        .slide img{max-width:100%;max-height:90%;object-fit:contain;border-radius:10px;box-shadow:0 4px 8px rgba(0,0,0,0.5)}
        .nav-button{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.2);color:white;border:none;padding:15px;cursor:pointer;font-size:1.5em;border-radius:50%;z-index:2}
        .nav-button:hover{background:rgba(255,255,255,0.3)}
        #prevBtn{left:20px} #nextBtn{right:20px}
        .indicators{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;z-index:2}
        .indicator{width:12px;height:12px;background:rgba(255,255,255,0.3);border-radius:50%;margin:0 5px;cursor:pointer}
        .indicator.active{background:white}
        footer{position:absolute;bottom:5px;left:0;width:100%;text-align:center;font-size:0.75rem;color:rgba(255,255,255,0.4);z-index:3;pointer-events:none}
        @keyframes fade{from{opacity:0}to{opacity:1}}
        @keyframes slideLeft{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes slideRight{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes slideDown{from{transform:translateY(-100%)}to{transform:translateY(0)}}
        @keyframes rotate{from{transform:rotate(-15deg) scale(0.8);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}
        @keyframes scale{from{transform:scale(0)}to{transform:scale(1)}}
        @keyframes flipX{from{transform:perspective(600px) rotateX(-90deg);opacity:0}to{transform:perspective(600px) rotateX(0);opacity:1}}
        @keyframes flipY{from{transform:perspective(600px) rotateY(-90deg);opacity:0}to{transform:perspective(600px) rotateY(0);opacity:1}}
        @keyframes zoomBlur{from{transform:scale(1.3);filter:blur(8px);opacity:0}to{transform:scale(1);filter:blur(0);opacity:1}}
        @keyframes swingIn{from{transform:perspective(400px) rotateX(-60deg);transform-origin:top;opacity:0}to{transform:perspective(400px) rotateX(0);opacity:1}}
        @keyframes bounceIn{0%{transform:scale(0);opacity:0}50%{transform:scale(1.15)}70%{transform:scale(0.95)}100%{transform:scale(1);opacity:1}}
        @keyframes glitch{0%{transform:translate(0)}20%{transform:translate(-3px,2px) skewX(-2deg)}40%{transform:translate(3px,-1px) skewX(2deg)}60%{transform:translate(-2px,-2px) skewX(1deg)}80%{transform:translate(2px,1px) skewX(-1deg)}100%{transform:translate(0)}}
        @keyframes spiralIn{from{transform:rotate(180deg) scale(0);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}
        @keyframes dropIn{from{transform:translateY(-200px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes unfold{from{transform:scaleY(0);transform-origin:top;opacity:0}to{transform:scaleY(1);opacity:1}}
        @keyframes skewIn{from{transform:skewX(-30deg) scale(0.8);opacity:0}to{transform:skewX(0) scale(1);opacity:1}}
        @keyframes slideTopLeft{from{transform:translate(-100%,-100%);opacity:0}to{transform:translate(0,0);opacity:1}}
        @keyframes slideBottomRight{from{transform:translate(100%,100%);opacity:0}to{transform:translate(0,0);opacity:1}}
        @keyframes flipDiagonal{from{transform:perspective(600px) rotate3d(1,1,0,-90deg);opacity:0}to{transform:perspective(600px) rotate3d(1,1,0,0);opacity:1}}
        @keyframes rotateScale{from{transform:rotate(-180deg) scale(0.3);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}
        @keyframes blurIn{from{filter:blur(20px);opacity:0}to{filter:blur(0);opacity:1}}
        @keyframes lightSpeed{from{transform:translateX(100%) skewX(-30deg);opacity:0}to{transform:translateX(0) skewX(0);opacity:1}}
        @keyframes jackInTheBox{0%{transform:scale(0.1) rotate(30deg);transform-origin:bottom;opacity:0}50%{transform:rotate(-10deg) scale(0.7)}70%{transform:rotate(3deg) scale(0.9)}100%{transform:scale(1) rotate(0);opacity:1}}
        @keyframes perspectiveFlip{from{transform:perspective(600px) rotateY(90deg) scale(0.5);opacity:0}to{transform:perspective(600px) rotateY(0) scale(1);opacity:1}}
    </style>
</head>
<body>
    <div class="presentation">
        <div id="slideContainer"></div>
        <button id="prevBtn" class="nav-button">&#10094;</button>
        <button id="nextBtn" class="nav-button">&#10095;</button>
        <div class="indicators"></div>
        <footer>Generado con SlideVision AI</footer>
    </div>
<script>
    const slideContainer = document.getElementById('slideContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelector('.indicators');
    let slides = [], currentSlide = 0;
    const transitions = [
        { name:'fade',          duration:'0.6s', easing:'ease-in-out' },
        { name:'slideLeft',     duration:'0.5s', easing:'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name:'slideRight',    duration:'0.5s', easing:'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name:'slideUp',       duration:'0.5s', easing:'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name:'slideDown',     duration:'0.5s', easing:'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name:'rotate',        duration:'0.7s', easing:'ease-in-out' },
        { name:'scale',         duration:'0.5s', easing:'ease-out' },
        { name:'flipX',         duration:'0.7s', easing:'ease-in-out' },
        { name:'flipY',         duration:'0.7s', easing:'ease-in-out' },
        { name:'zoomBlur',      duration:'0.6s', easing:'ease-out' },
        { name:'swingIn',       duration:'0.7s', easing:'ease-out' },
        { name:'bounceIn',      duration:'0.8s', easing:'cubic-bezier(0.34,1.56,0.64,1)' },
        { name:'glitch',        duration:'0.5s', easing:'steps(4,end)' },
        { name:'spiralIn',      duration:'0.7s', easing:'ease-out' },
        { name:'dropIn',        duration:'0.6s', easing:'cubic-bezier(0.34,1.56,0.64,1)' },
        { name:'unfold',        duration:'0.6s', easing:'ease-in-out' },
        { name:'skewIn',        duration:'0.55s', easing:'ease-out' },
        { name:'slideTopLeft',  duration:'0.55s', easing:'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name:'slideBottomRight',duration:'0.55s', easing:'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name:'flipDiagonal',  duration:'0.75s', easing:'ease-in-out' },
        { name:'rotateScale',   duration:'0.7s', easing:'ease-in-out' },
        { name:'blurIn',        duration:'0.6s', easing:'ease-out' },
        { name:'lightSpeed',    duration:'0.6s', easing:'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name:'jackInTheBox',  duration:'0.8s', easing:'cubic-bezier(0.68,-0.55,0.27,1.55)' },
        { name:'perspectiveFlip',duration:'0.8s', easing:'ease-in-out' }
    ];

    function initSlides() {
        imageUrls.forEach((url, i) => {
            const s = document.createElement('div');
            s.className = 'slide' + (i===0?' active':'');
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Diapositiva ' + (i+1);
            img.onerror = function(){this.style.display='none'};
            s.appendChild(img);
            slideContainer.appendChild(s);
        });
        slides = document.querySelectorAll('.slide');
        updateIndicators();
    }

    function showSlide(i) {
        slides[currentSlide].classList.remove('active');
        slides[i].classList.add('active');
        currentSlide = i;
        updateIndicators();
        const t = transitions[Math.floor(Math.random()*transitions.length)];
        slides[i].style.animation = t.name + ' ' + t.duration + ' ' + t.easing;
    }

    function nextS() { if(currentSlide < slides.length-1) showSlide(currentSlide+1); }
    function prevS() { if(currentSlide > 0) showSlide(currentSlide-1); }

    function updateIndicators() {
        indicators.innerHTML = '';
        slides.forEach((_, i) => {
            const d = document.createElement('div');
            d.className = 'indicator' + (i===currentSlide?' active':'');
            d.onclick = () => showSlide(i);
            indicators.appendChild(d);
        });
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === slides.length-1;
    }

    prevBtn.onclick = prevS;
    nextBtn.onclick = nextS;
    document.addEventListener('keydown', e => {
        if(e.key==='ArrowRight') nextS();
        if(e.key==='ArrowLeft') prevS();
    });

    const imageUrls = [
        // PLACEHOLDER_FOR_IMAGES
    ];
    initSlides();
<\/script>
</body>
</html>`;
    }

    function buildGalleryHtml(base64Images) {
        const imagesHtml = base64Images.map((img, i) => `
        <div class="panel" onclick="openModal('${img}')">
            <img src="${img}" alt="Diapositiva ${i+1}">
        </div>`).join('');

        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Galería de Diapositivas</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Segoe UI',sans-serif;background:#f5f5f5;padding:20px}
        .header{text-align:center;margin-bottom:30px;padding:20px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;color:white}
        .header h1{font-size:2.5em}
        .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;max-width:1400px;margin:0 auto}
        .panel{background:white;border:4px solid #2c3e50;border-radius:8px;overflow:hidden;cursor:pointer;transition:transform 0.2s}
        .panel:hover{transform:scale(1.02)}
        .panel img{width:100%;height:auto;display:block}
        .modal{display:none;position:fixed;z-index:1000;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);cursor:pointer}
        .modal.active{display:flex;align-items:center;justify-content:center}
        .modal img{max-width:95%;max-height:95%;object-fit:contain;border-radius:8px}
        @media(max-width:768px){.grid{grid-template-columns:1fr}}
    </style>
</head>
<body>
    <div class="header"><h1>Galería de Diapositivas</h1></div>
    <div class="grid">${imagesHtml}</div>
    <div class="modal" id="modal" onclick="closeModal()"><img id="modal-img"></div>
<script>
    function openModal(src){document.getElementById('modal').classList.add('active');document.getElementById('modal-img').src=src}
    function closeModal(){document.getElementById('modal').classList.remove('active')}
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal()});
<\/script>
</body>
</html>`;
    }

    // ----- Nueva presentación -----
    document.getElementById('btn-new-presentation').addEventListener('click', () => {
        if (confirm('¿Iniciar una nueva presentación? Se perderá el progreso actual.')) {
            resetAll();
            youtubeUrlInput.value = '';
            youtubeUrl = '';
            youtubeVideoInfo = null;
            youtubeStatus.textContent = '';
            jsonOutput.value = '';
        }
    });

    // ----- Save API Key (removed - managed server-side) -----
});
