// --- CONFIGURACIÓN BASE ---
const BACKEND_URL = "https://node.proyectodescartes.org/api/ia/image";
const AUTHORIZED_MODELS = [
    { name: "flux", description: "Flux", output_modalities: ["image"], input_modalities: ["text"] },
    { name: "zimage", description: "Zimage", output_modalities: ["image"], input_modalities: ["text"] },
    { name: "gptimage", description: "GPT Image", output_modalities: ["image"], input_modalities: ["text"] },
    { name: "klein", description: "Klein", output_modalities: ["image"], input_modalities: ["text"] }
];

let currentImageUrl = "";
let hasGenerated = false;
let galleryImages = [];

// --- VARIABLES PARA PAN & ZOOM ---
let scale = 1;
let pointX = 0;
let pointY = 0;
let startX = 0;
let startY = 0;
let isDragging = false;

// --- CATEGORÍAS Y ESTILOS (100 estilos en 10 categorías) ---
const CATEGORIES = [
    {
        name: "Fotografía y estilos de cámara",
        tema: "Un día en Tokio: calles, retratos, cafés, paisajes urbanos y escenas documentales.",
        styles: [
            { name: "Fotografía callejera", desc: "momento espontáneo, luz natural, entorno urbano, emociones auténticas" },
            { name: "Fotografía de retrato en estudio", desc: "iluminación con softbox, fondo neutro, enfoque nítido, aspecto profesional" },
            { name: "Fotografía de estilo de vida", desc: "poses naturales, tonos cálidos, ambiente cotidiano, ambiente relajado" },
            { name: "Fotografía de alto contraste", desc: "iluminación brillante, sombras mínimas, fondo blanco limpio" },
            { name: "Fotografía de bajo contraste", desc: "sombras profundas, contraste dramático, atmósfera melancólica" },
            { name: "Fotografía macro", desc: "primer plano extremo, detalles de textura fina, poca profundidad de campo" },
            { name: "Fotografía de paisajes", desc: "vista gran angular, luz natural, paisaje extenso" },
            { name: "Fotografía editorial", desc: "estilo revista de moda, iluminación controlada, composición cuidada" },
            { name: "Fotografía documental", desc: "realismo crudo, sujetos sin poses, enfoque narrativo" },
            { name: "Fotografía en blanco y negro", desc: "fuerte contraste, estética atemporal, tonos inspirados en el cine" }
        ]
    },
    {
        name: "Cine y películas",
        tema: "El detective desaparecido: una historia visual que permita explorar noir, thriller, cine independiente y escenas épicas.",
        styles: [
            { name: "Retrato cinematográfico", desc: "iluminación lateral dramática, poca profundidad de campo, gradación de color con un toque melancólico" },
            { name: "Estética de fotograma de película", desc: "encuadre narrativo, composición cinematográfica, grano sutil" },
            { name: "Estilo neo-noir", desc: "iluminación de alto contraste, escena nocturna urbana, ambiente misterioso" },
            { name: "Iluminación cinematográfica de la hora dorada", desc: "reflejos cálidos, sombras suaves, ambiente onírico" },
            { name: "Estilo de thriller oscuro", desc: "colores desaturados, sombras intensas, tono de suspense" },
            { name: "Plano general épico", desc: "escala cinematográfica, cielo dramático, composición heroica" },
            { name: "Estética de cine independiente", desc: "iluminación natural, colores apagados, encuadre íntimo" },
            { name: "Aspecto cinematográfico histórico", desc: "iluminación fiel a la época, tonos texturizados, sensación de cine clásico" },
            { name: "Estilo cinematográfico anamórfico", desc: "encuadre amplio, destello de lente suave, profundidad cinematográfica" },
            { name: "Cine de autor", desc: "diálogos minimalistas, simbolismo visual, ambiente contemplativo" }
        ]
    },
    {
        name: "Ilustración y arte tradicional",
        tema: "El bosque encantado: criaturas mágicas representadas en acuarela, óleo, carboncillo, tinta y pastel.",
        styles: [
            { name: "Pintura a la acuarela", desc: "veladuras suaves, textura de papel visible, mezcla de colores delicada" },
            { name: "Pintura al óleo", desc: "pinceladas ricas, textura en capas, estilo clásico de bellas artes" },
            { name: "Boceto a lápiz", desc: "líneas dibujadas a mano, sombreado ligero, aspecto artístico inacabado" },
            { name: "Ilustración a tinta", desc: "trazo grueso, alto contraste, detalle gráfico" },
            { name: "Dibujo a carboncillo", desc: "textura rugosa, trazos expresivos, sombreado dramático" },
            { name: "Dibujo al pastel", desc: "bordes suaves, textura empolvada, colores apagados" },
            { name: "Pintura al gouache", desc: "pintura opaca, acabado mate, estilo ilustrativo" },
            { name: "Ilustración pintada a mano", desc: "imperfecciones orgánicas, estilo artístico tradicional" },
            { name: "Ilustración de libro infantil", desc: "colores alegres, formas suaves, ambiente fantasioso" },
            { name: "Ilustración fantástica de cuento de hadas", desc: "entornos detallados, atmósfera mágica" }
        ]
    },
    {
        name: "Diseño y estilos gráficos",
        tema: "La ciudad inteligente del futuro: ideal para infografías, iconos, interfaces y diseño editorial.",
        styles: [
            { name: "Ilustración vectorial minimalista", desc: "diseño plano, paleta de colores limitada, líneas limpias" },
            { name: "Estilo infográfico moderno", desc: "diseño claro, iconos sencillos, claridad visual" },
            { name: "Ilustración editorial", desc: "diseño conceptual, formas llamativas, estilo listo para revista" },
            { name: "Ilustración de interfaz de usuario plana", desc: "degradados suaves, formas amigables, estilo tecnológico moderno" },
            { name: "Estilo de diseño de póster", desc: "influencia de tipografía llamativa, composición fuerte" },
            { name: "Ilustración corporativa", desc: "colores neutros, tono profesional, imágenes nítidas" },
            { name: "Ilustración lineal", desc: "líneas de grosor uniforme, formas simples, diseño elegante" },
            { name: "Ilustración geométrica", desc: "formas definidas, composición equilibrada, estética moderna" },
            { name: "Ilustración de marca", desc: "sistema de color coherente, aspecto comercial pulido" },
            { name: "Ilustración estilo icono", desc: "formas simplificadas, alta legibilidad, detalles mínimos" }
        ]
    },
    {
        name: "Arte 3D, isométrico y videojuegos",
        tema: "Miniatura de una ciudad sostenible: perfecta para dioramas, renders 3D, voxel e ilustraciones isométricas.",
        styles: [
            { name: "Ilustración isométrica en 3D", desc: "escena en miniatura, sombras suaves, colores pastel" },
            { name: "Renderizado 3D estilizado", desc: "superficies lisas, proporciones lúdicas, iluminación limpia" },
            { name: "Renderizado 3D realista", desc: "materiales detallados, iluminación natural, acabado fotorrealista" },
            { name: "Estilo 3D de baja poligonalidad", desc: "geometría simplificada, sombreado plano, inspirado en videojuegos" },
            { name: "Escena de diorama", desc: "mundo diminuto y detallado, iluminación controlada, aspecto coleccionable" },
            { name: "Estilo artístico de juegos para móviles", desc: "colores brillantes, personajes amigables, diseño limpio" },
            { name: "Renderizado cinematográfico de videojuego de consola", desc: "iluminación espectacular, texturas realistas" },
            { name: "Renderizado 3D estilo arcilla", desc: "formas suaves, apariencia artesanal" },
            { name: "Estilo artístico voxel", desc: "formas cúbicas, estética 3D pixelada" },
            { name: "Visualización arquitectónica en 3D", desc: "iluminación realista, materiales limpios, diseño moderno" }
        ]
    },
    {
        name: "Retro y vintage",
        tema: "Viaje a través de las décadas: años 50, 70, 80 y 90 con distintos tratamientos visuales.",
        styles: [
            { name: "Fotografía instantánea Polaroid", desc: "colores desvaídos, viñeta suave, marco con borde blanco" },
            { name: "Fotografía analógica de los años 70", desc: "tonos cálidos, grano ligero, ambiente nostálgico" },
            { name: "Synthwave retro de los años 80", desc: "colores neón, nostalgia futurista, degradados llamativos" },
            { name: "Estética de revista de los años 90", desc: "colores saturados, estilo editorial llamativo" },
            { name: "Estilo postal vintage", desc: "colores apagados, textura desgastada, nostalgia viajera" },
            { name: "Glamour del viejo Hollywood", desc: "iluminación clásica, estilo elegante, look atemporal" },
            { name: "Estilo de cómic retro", desc: "puntos de semitono, contornos marcados, sensación de impresión vintage" },
            { name: "Estética VHS", desc: "líneas de escaneo, distorsión de color, artefactos analógicos" },
            { name: "Fotografía antigua en tonos sepia", desc: "textura envejecida, ambiente histórico" },
            { name: "Ilustración moderna de mediados de siglo", desc: "formas simples, paleta de colores apagados, diseño retro" }
        ]
    },
    {
        name: "Futurista y ciencia ficción",
        tema: "Colonia humana en Marte en 2150: ciberpunk, laboratorios IA, ciudades utópicas y mundos alienígenas.",
        styles: [
            { name: "Estética ciberpunk", desc: "luces de neón, noche urbana, paisaje urbano futurista" },
            { name: "Arte conceptual de ciencia ficción", desc: "tecnología avanzada, escala cinematográfica, diseño imaginativo" },
            { name: "Estilo ópera espacial", desc: "alcance épico, entornos cósmicos, iluminación dramática" },
            { name: "Minimalismo futurista", desc: "superficies limpias, blancos brillantes, calma de alta tecnología" },
            { name: "Estética de laboratorio de IA", desc: "interfaces brillantes, entorno científico moderno" },
            { name: "Futuro distópico", desc: "tonos desaturados, texturas industriales, ambiente sombrío" },
            { name: "Futuro utópico", desc: "ciudades limpias, luz tenue, tono optimista" },
            { name: "Estilo de diseño mecha", desc: "detalles mecánicos, aspecto de ciencia ficción industrial" },
            { name: "Concepto de mundo alienígena", desc: "paisajes exóticos, texturas desconocidas" },
            { name: "Estilo de holograma digital", desc: "transparencia brillante, aspecto de interfaz futurista" }
        ]
    },
    {
        name: "Bellas Artes e Historia",
        tema: "La evolución de una ciudad a través del arte: desde el Renacimiento hasta el Surrealismo.",
        styles: [
            { name: "Estilo pictórico renacentista", desc: "composición clásica, iluminación natural suave" },
            { name: "Estilo artístico barroco", desc: "contraste dramático, gran riqueza de detalles, intensidad emocional" },
            { name: "Pintura impresionista", desc: "pinceladas sueltas, paleta de colores centrada en la luz" },
            { name: "Arte expresionista", desc: "formas distorsionadas, uso emotivo del color" },
            { name: "Pintura surrealista", desc: "imágenes oníricas, elementos simbólicos" },
            { name: "Estilo Art Nouveau", desc: "líneas fluidas, motivos decorativos, formas orgánicas" },
            { name: "Ilustración de manuscrito medieval", desc: "bordes ornamentados, perspectiva plana" },
            { name: "Estética de escultura clásica", desc: "textura de mármol, forma atemporal" },
            { name: "Estilo artístico romántico", desc: "naturaleza dramática, atmósfera emotiva" },
            { name: "Estilo de pintura al fresco", desc: "pigmentos apagados, aspecto de arte mural histórico" }
        ]
    },
    {
        name: "Cultura pop y estética de internet",
        tema: "Influencers del multiverso: anime, K-pop, memes, Tumblr, stickers y collage digital.",
        styles: [
            { name: "Estética vaporwave", desc: "neón pastel, nostalgia retro de internet" },
            { name: "Imagen estilo meme", desc: "composición llamativa, expresión exagerada" },
            { name: "Estética de estilo de vida en redes sociales", desc: "tonos limpios, ambiente aspiracional" },
            { name: "Estilo fotográfico de influencer", desc: "luz suave, realismo cuidadosamente seleccionado" },
            { name: "Estética de la era Tumblr", desc: "tonos melancólicos, autoexpresión artística" },
            { name: "Estilo visual K-pop", desc: "iluminación cuidada, colores vibrantes, composición elegante" },
            { name: "Ilustración inspirada en el anime", desc: "rostros expresivos, dibujo de líneas limpias" },
            { name: "Estilo moderno de dibujos animados", desc: "colores llamativos, formas simplificadas" },
            { name: "Estilo de ilustración de pegatinas", desc: "formas delineadas, diseño lúdico" },
            { name: "Estética de collage digital", desc: "imágenes superpuestas, texturas mixtas" }
        ]
    },
    {
        name: "Técnicas experimentales y mixtas",
        tema: "Sueños de una inteligencia artificial: doble exposición, glitch, surrealismo, abstracción y arte conceptual.",
        styles: [
            { name: "Collage de técnica mixta", desc: "texturas de papel, materiales superpuestos, contraste artístico" },
            { name: "Efecto de doble exposición", desc: "imágenes superpuestas, composición surrealista" },
            { name: "Estilo artístico abstracto", desc: "formas no representacionales, colores expresivos" },
            { name: "Estética del arte glitch", desc: "distorsión digital, imágenes fragmentadas" },
            { name: "Surrealismo onírico", desc: "elementos flotantes, enfoque suave, ambiente etéreo" },
            { name: "Fotorrealismo con textura pictórica", desc: "detalles realistas y un toque artístico de pincelada" },
            { name: "Composición abstracta minimalista", desc: "colores sutiles, espacio negativo equilibrado" },
            { name: "Estudio experimental de iluminación", desc: "sombras inusuales, iluminación creativa" },
            { name: "Retrato surrealista generado por IA", desc: "realismo distorsionado, estética inquietante" },
            { name: "Estilo de arte conceptual", desc: "imágenes basadas en ideas, composición simbólica" }
        ]
    }
];



// --- TRADUCCIONES ---
const translations = {
    es: {
        title: "100 estilos de generación de imágenes",

        modelLabel: "Modelo",
        categoriaLabel: "Categoría",
        temaLabel: "Tema sugerido",
        generateImageBtn: "Generar",
        generatingImage: "¡Generando imagen!",
        downloadBtn: "Descargar imagen",
        openBtn: "Abrir imagen",
        scaleLabel: "Escala (Zoom)",
        defaultPrompt: "Coche eléctrico",
        copyJsonBtn: "Copiar JSON prompting",
        styleLabel: "Estilo",
        aspectLabel: "Relación de aspecto",
        personalizadoOption: "Personalizado",
        copiedStatus: "¡Copiado!"
    },
    en: {
        title: "100 Image Generation Styles",

        modelLabel: "Model",
        categoriaLabel: "Category",
        temaLabel: "Suggested Theme",
        generateImageBtn: "Generate",
        generatingImage: "Generating image!",
        downloadBtn: "Download image",
        openBtn: "Open image",
        scaleLabel: "Scale (Zoom)",
        defaultPrompt: "Electric car",
        copyJsonBtn: "Copy JSON prompting",
        styleLabel: "Style",
        aspectLabel: "Aspect Ratio",
        personalizadoOption: "Custom",
        copiedStatus: "Copied!"
    },
    fr: {
        title: "100 styles de génération d'images",

        modelLabel: "Modèle",
        categoriaLabel: "Catégorie",
        temaLabel: "Thème suggéré",
        generateImageBtn: "Générer",
        generatingImage: "Génération de l'image!",
        downloadBtn: "Télécharger l'image",
        openBtn: "Ouvrir l'image",
        scaleLabel: "Échelle (Zoom)",
        defaultPrompt: "Voiture électrique",
        copyJsonBtn: "Copier le JSON prompting",
        styleLabel: "Style",
        aspectLabel: "Ratio d'aspect",
        personalizadoOption: "Personnalisé",
        copiedStatus: "Copié!"
    }
};

let currentLang = 'es';

// ==========================================
// CAMBIO DE IDIOMA
// ==========================================

function changeLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];

    document.title = t.title;

    document.getElementById('categoria-label').textContent = t.categoriaLabel;
    document.getElementById('tema-label').textContent = t.temaLabel;
    document.getElementById('estilo-label').textContent = t.styleLabel;
    document.getElementById('aspect-label').textContent = t.aspectLabel;

    document.querySelectorAll('label').forEach(label => {
        const text = label.textContent.trim();
        if (text.includes('Escala') || text.includes('Scale') || text.includes('Échelle')) label.textContent = t.scaleLabel;
    });

    document.querySelector('button[onclick="generateImage()"]').textContent = t.generateImageBtn;
    document.getElementById('btn-copy-json').textContent = t.copyJsonBtn;

    document.getElementById('img_title').textContent = t.title;

    document.getElementById('img_loading').textContent = t.generatingImage;

    document.getElementById('btn-download').textContent = t.downloadBtn;
    document.getElementById('btn-open').textContent = t.openBtn;
    document.getElementById('btn-copy-json').textContent = t.copyJsonBtn;

    // Refresh dynamic labels in selects
    if (document.getElementById('img_obj_select').options.length > 0) {
        const lastIdx = document.getElementById('img_obj_select').options.length - 1;
        document.getElementById('img_obj_select').options[lastIdx].textContent = t.personalizadoOption;
    }

    localStorage.setItem('preferred_language', lang);
}

// ==========================================
// 1. IMPLEMENTACIÓN BYOP (Auth Flow)
// ==========================================

function populateCategorySelect() {
    const sel = document.getElementById('img_category');
    sel.innerHTML = '';
    CATEGORIES.forEach((cat, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = cat.name;
        sel.appendChild(opt);
    });
}

function populateTemaOptions() {
    const catIdx = parseInt(document.getElementById('img_category').value);
    const cat = CATEGORIES[catIdx];
    const sel = document.getElementById('img_obj_select');
    const t = translations[currentLang];
    sel.innerHTML = '';
    const opt1 = document.createElement('option');
    opt1.value = cat.tema;
    opt1.textContent = cat.tema;
    sel.appendChild(opt1);
    const opt2 = document.createElement('option');
    opt2.value = 'Personalizado';
    opt2.textContent = t.personalizadoOption;
    sel.appendChild(opt2);
    document.getElementById('img_obj_custom').style.display = 'none';
}

function populateStyleOptions() {
    const catIdx = parseInt(document.getElementById('img_category').value);
    const cat = CATEGORIES[catIdx];
    const sel = document.getElementById('img_style');
    sel.innerHTML = '';
    cat.styles.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.name;
        opt.textContent = s.name;
        sel.appendChild(opt);
    });
}

function onCategoryChange() {
    populateTemaOptions();
    populateStyleOptions();
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferred_language') || 'es';
    document.getElementById('languageSelect').value = savedLang;

    populateCategorySelect();
    populateTemaOptions();
    populateStyleOptions();

    populateModels();
    changeLanguage(savedLang);

    document.getElementById('img_model').addEventListener('change', () => {
        const t = translations[currentLang];
        document.title = t.title;
        document.getElementById('img_title').textContent = t.title;
    });

    document.getElementById('btn-copy-json').disabled = true;

    document.getElementById('btn-zip').addEventListener('click', downloadAllZip);
    document.getElementById('btn-presenter').addEventListener('click', downloadPresenterHtml);
    document.getElementById('btn-gallery').addEventListener('click', downloadGalleryHtml);
});



// ==========================================
// 2. LOGICA DE MODELOS
// ==========================================

function populateModels() {
    populateSelects(AUTHORIZED_MODELS);
}

function populateSelects(models) {
    const imgSelect = document.getElementById('img_model');
    const currentImg = imgSelect.value;

    imgSelect.innerHTML = "";

    models.forEach(model => {
        if (model.output_modalities.includes("image")) {
            const option = document.createElement('option');
            option.value = model.name;
            option.textContent = model.description || model.name;
            imgSelect.appendChild(option);
        }
    });

    if (currentImg && imgSelect.querySelector(`option[value="${currentImg}"]`)) imgSelect.value = currentImg;
    else if (imgSelect.options.length > 0) imgSelect.selectedIndex = 0;
}

// ==========================================
// 3. PAN & ZOOM LOGIC
// ==========================================

function updateScale(newScale) {
    scale = parseFloat(newScale);
    applyTransform();
}

function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX - pointX;
    startY = e.clientY - pointY;
    document.getElementById('img-container').style.cursor = "grabbing";
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    pointX = e.clientX - startX;
    pointY = e.clientY - startY;
    applyTransform();
}

function endDrag() {
    isDragging = false;
    document.getElementById('img-container').style.cursor = "grab";
}

function applyTransform() {
    const img = document.getElementById('img-preview');
    img.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
}

function resetView() {
    scale = 1; pointX = 0; pointY = 0;
    document.getElementById('scale-slider').value = 1;
    applyTransform();
}

// ==========================================
// 4. GENERACIÓN Y CARGA ROBUSTA
// ==========================================

function getProxiedUrl(url) {
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
}

function getObjeto() {
    const select = document.getElementById('img_obj_select');
    const t = translations[currentLang];
    if (select.value === 'Personalizado') {
        const custom = document.getElementById('img_obj_custom').value.trim();
        return custom || '';
    }
    return select.value;
}

function onObjetoChange() {
    const select = document.getElementById('img_obj_select');
    const textarea = document.getElementById('img_obj_custom');
    const t = translations[currentLang];
    textarea.style.display = select.value === 'Personalizado' ? 'block' : 'none';
}

function getCategoryAndStyle() {
    const catIdx = parseInt(document.getElementById('img_category').value);
    const cat = CATEGORIES[catIdx];
    const estilo = document.getElementById('img_style').value;
    const styleData = cat.styles.find(s => s.name === estilo);
    return { category: cat, styleData, estilo };
}

function getStylePromptLines(cat, estilo) {
    const styleData = cat.styles.find(s => s.name === estilo);
    if (!styleData) return { render: "", vibe: "" };
    return {
        render: `- ${styleData.name}: ${styleData.desc}`,
        vibe: `- Vibe: estética de ${cat.name.toLowerCase()}, con énfasis en ${styleData.desc.split(',')[0] || styleData.name.toLowerCase()}`
    };
}

function getAspectRatioDims() {
    const val = document.getElementById('aspect_ratio').value;
    switch (val) {
        case '16:9': return { w: 1920, h: 1080 };
        case '1:1': return { w: 1024, h: 1024 };
        case '9:16': return { w: 1080, h: 1920 };
        case '4:3': return { w: 1024, h: 768 };
        case '3:4': return { w: 768, h: 1024 };
        default: return { w: 1920, h: 1080 };
    }
}

function addToGallery(imageUrl) {
    galleryImages.push(imageUrl);
    document.getElementById('gallery-count').textContent = `${galleryImages.length} imagen${galleryImages.length !== 1 ? 'es' : ''}`;
    document.getElementById('gallery-section').style.display = 'block';

    const thumb = document.createElement('img');
    thumb.src = imageUrl;
    thumb.style.height = '70px';
    thumb.style.width = 'auto';
    thumb.style.maxWidth = '120px';
    thumb.style.borderRadius = '4px';
    thumb.style.cursor = 'pointer';
    thumb.style.border = '2px solid transparent';
    thumb.style.flexShrink = '0';
    thumb.onmouseenter = () => { thumb.style.borderColor = '#007ef6'; };
    thumb.onmouseleave = () => { thumb.style.borderColor = 'transparent'; };
    thumb.onclick = function() {
        const m = document.getElementById('slide-modal');
        const mi = document.getElementById('modal-img');
        if (m && mi) { mi.src = this.src; m.style.display = 'flex'; }
    };
    document.getElementById('gallery-thumbnails').appendChild(thumb);
    document.getElementById('gallery-thumbnails').scrollLeft = document.getElementById('gallery-thumbnails').scrollWidth;
}

function generateImage() {
    const objeto = getObjeto();
    if (!objeto) return alert(currentLang === 'es' ? "Ingresa un tema" : "Enter a theme");

    const model = document.getElementById('img_model').value;
    const dims = getAspectRatioDims();
    const size = `${dims.w}x${dims.h}`;
    const aspectName = document.getElementById('aspect_ratio').value;
    const { category, styleData, estilo } = getCategoryAndStyle();
    const styleLines = getStylePromptLines(category, estilo);

    const orientation = dims.w > dims.h ? 'horizontal / paisaje' : dims.w < dims.h ? 'vertical / retrato' : 'cuadrado';

    const catInfo = `Categoría: ${category.name}. Estilo: ${estilo} (${styleData.desc})`;

    const systemPrompt = `Genera una imagen basada en: "${objeto}" usando el estilo visual indicado.

CONTEXTO:
${catInfo}

CALIDAD DE RENDER — MUY IMPORTANTE:
${styleLines.render}
- Materiales con texturas visibles al detalle según corresponda al tema
- Iluminación adecuada al estilo: ${estilo.toLowerCase()}
- El tema debe representarse fielmente con el estilo visual seleccionado
- Fondo apropiado al contexto, sin distracciones innecesarias

COMPOSICIÓN (${dims.w}×${dims.h}):
- El tema ocupa el centro del frame
- Espacio equilibrado. Sin amontonamiento. Respiración visual entre elementos
- Composición profesional, bien encuadrada y balanceada

ESTILO:
${styleLines.vibe}
- Aplicación coherente del estilo en toda la imagen
- La imagen debe verse REAL y fiel al estilo seleccionado

FORMATO DE SALIDA:
- ${dims.w}×${dims.h} píxeles, orientación ${orientation}
- Ultra nítido, optimizado para presentaciones, YouTube y pantallas 4K
- Nivel de detalle: profesional, acorde al estilo seleccionado`;

    const fullPrompt = systemPrompt;

    document.getElementById('img_loading').style.display = 'block';
    document.getElementById('img_loading').textContent = translations[currentLang].generatingImage;
    document.getElementById('img-container').style.display = 'none';
    document.getElementById('zoom-area').style.display = 'none';
    document.getElementById('img-buttons').style.display = 'none';
    document.getElementById('download-section').style.display = 'none';
    toggleConfigControls(true);
    document.getElementById('btn-copy-json').disabled = true;
    resetView();

    fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: fullPrompt,
            model: model,
            size: size,
            width: dims.w,
            height: dims.h,
            response_format: "b64_json"
        })
    })
    .then(res => {
        if (!res.ok) return res.json().then(err => { throw new Error(err.error?.message || `HTTP ${res.status}`); });
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) return res.json();
        return res.blob().then(blob => blobToBase64(blob)).then(b64 => ({ data: [{ b64_json: b64 }] }));
    })
    .then(data => {
        const raw = data.data[0].b64_json || data.data[0].url;
        const dataUrl = raw && raw.startsWith('data:') ? raw : `data:image/png;base64,${raw}`;

        document.getElementById('img_loading').style.display = 'none';
        document.getElementById('img-container').style.display = 'flex';
        const img = document.getElementById('img-preview');
        img.style.display = 'block';
        img.src = dataUrl;

        document.getElementById('zoom-area').style.display = 'flex';
        document.getElementById('img-buttons').style.display = 'flex';
        document.getElementById('download-section').style.display = 'flex';
        document.getElementById('btn-copy-json').disabled = false;

        currentImageUrl = dataUrl;
        hasGenerated = true;
        addToGallery(dataUrl);
    })
    .catch(err => {
        document.getElementById('img_loading').style.display = 'none';
        alert(currentLang === 'es' ? `Error: ${err.message}` : `Error: ${err.message}`);
    });
}

async function downloadImage() {
    const urlToDownload = currentImageUrl;
    if (!urlToDownload) return;

    const btn = document.getElementById('btn-download');
    const originalText = btn.textContent;
    btn.textContent = translations[currentLang].downloadingStatus || "Descargando...";
    btn.disabled = true;

    try {
        let response;
        try {
            response = await fetch(urlToDownload);
        } catch (e) {
            response = await fetch(getProxiedUrl(urlToDownload));
        }

        if (!response.ok) throw new Error("Error en red");

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `infografia_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);

    } catch (error) {
        console.error("Error descargando:", error);
        fetch(urlToDownload).then(r => r.blob()).then(blob => {
            window.open(URL.createObjectURL(blob), '_blank');
        }).catch(() => window.open(urlToDownload, '_blank'));
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

function openImage() {
    if (!currentImageUrl) return;
    fetch(currentImageUrl).then(r => r.blob()).then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    }).catch(() => window.open(currentImageUrl, '_blank'));
}

// ==========================================
// 5. DESCARGAS Y GALERÍA
// ==========================================

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function downloadAllZip() {
    const btn = document.getElementById('btn-zip');
    const orig = btn.textContent;
    btn.textContent = 'Empaquetando ZIP...';
    btn.disabled = true;
    try {
        const zip = new JSZip();
        for (let i = 0; i < galleryImages.length; i++) {
            const url = galleryImages[i];
            if (!url) continue;
            const resp = await fetch(url);
            const blob = await resp.blob();
            zip.file(`imagen_${i + 1}.jpg`, blob);
        }
        const content = await zip.generateAsync({ type: 'blob' });
        const blobUrl = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'imagenes.zip';
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
}

function getPresenterTemplate() {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Galería Interactiva</title>
    <style>
        body,html{margin:0;padding:0;font-family:Arial,sans-serif;height:100%;overflow:hidden;background:#1a1a1a;color:white}
        .slide{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:20px;box-sizing:border-box;opacity:0}
        .slide.active{opacity:1;z-index:1}
        .slide img{max-width:100%;max-height:90%;object-fit:contain;border-radius:10px;box-shadow:0 4px 8px rgba(0,0,0,0.5)}
        .nav-button{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.2);color:white;border:none;padding:15px;cursor:pointer;font-size:1.5em;border-radius:50%;z-index:2}
        .nav-button:hover{background:rgba(255,255,255,0.3)}
        #prevBtn{left:20px} #nextBtn{right:20px}
        .indicators{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;z-index:2}
        .indicator{width:12px;height:12px;background:rgba(255,255,255,0.3);border-radius:50%;margin:0 5px;cursor:pointer}
        .indicator.active{background:white}
        footer{position:absolute;bottom:5px;left:0;width:100%;text-align:center;font-size:0.75rem;color:rgba(255,255,255,0.4);z-index:3;pointer-events:none}
        .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:999;display:none;align-items:center;justify-content:center;cursor:pointer}
        .modal-overlay.active{display:flex}
        .modal-overlay img{max-width:95%;max-height:95%;object-fit:contain;border-radius:8px}
        @keyframes fade{from{opacity:0}to{opacity:1}}
        @keyframes slideLeft{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes slideRight{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes slideDown{from{transform:translateY(-100%)}to{transform:translateY(0)}}
        @keyframes rotate{from{transform:rotate(-15deg) scale(0.8);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}
        @keyframes scale{from{transform:scale(0)}to{transform:scale(1)}}
        @keyframes flipX{from{transform:perspective(600px) rotateX(90deg);opacity:0}to{transform:perspective(600px) rotateX(0);opacity:1}}
        @keyframes flipY{from{transform:perspective(600px) rotateY(90deg);opacity:0}to{transform:perspective(600px) rotateY(0);opacity:1}}
        @keyframes zoomBlur{from{transform:scale(1.4);filter:blur(10px);opacity:0}to{transform:scale(1);filter:blur(0);opacity:1}}
        @keyframes swingIn{from{transform:perspective(400px) rotateX(-90deg);opacity:0}to{transform:perspective(400px) rotateX(0);opacity:1}}
        @keyframes bounceIn{0%{transform:scale(0);opacity:0}50%{transform:scale(1.15)}70%{transform:scale(0.95)}100%{transform:scale(1);opacity:1}}
        @keyframes glitch{0%{transform:translate(0)}20%{transform:translate(-5px,3px)}40%{transform:translate(5px,-3px)}60%{transform:translate(-3px,5px)}80%{transform:translate(3px,-5px)}100%{transform:translate(0)}}
        @keyframes spiralIn{from{transform:rotate(360deg) scale(0);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}
        @keyframes dropIn{from{transform:translateY(-100%) scale(0.3);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
        @keyframes unfold{from{transform:scaleY(0);opacity:0}to{transform:scaleY(1);opacity:1}}
        @keyframes skewIn{from{transform:skew(-30deg) scale(0.8);opacity:0}to{transform:skew(0) scale(1);opacity:1}}
        @keyframes slideTopLeft{from{transform:translate(-100%,-100%);opacity:0}to{transform:translate(0,0);opacity:1}}
        @keyframes slideBottomRight{from{transform:translate(100%,100%);opacity:0}to{transform:translate(0,0);opacity:1}}
        @keyframes flipDiagonal{from{transform:perspective(600px) rotateX(90deg) rotateY(90deg);opacity:0}to{transform:perspective(600px) rotateX(0) rotateY(0);opacity:1}}
        @keyframes rotateScale{from{transform:rotate(-180deg) scale(0.3);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}
        @keyframes blurIn{from{filter:blur(20px);opacity:0}to{filter:blur(0);opacity:1}}
        @keyframes lightSpeed{from{transform:translateX(100%) skewX(-30deg);opacity:0}to{transform:translateX(0) skewX(0);opacity:1}}
        @keyframes jackInTheBox{0%{transform:scale(0.1) rotate(30deg);transform-origin:center bottom}50%{transform:rotate(-10deg)}70%{transform:rotate(3deg)}100%{transform:scale(1) rotate(0)}}
        @keyframes perspectiveFlip{from{transform:perspective(800px) rotateY(-180deg);opacity:0}to{transform:perspective(800px) rotateY(0);opacity:1}}
    </style>
</head>
<body>
    <div class="presentation">
        <div id="slideContainer"></div>
        <button id="prevBtn" class="nav-button">&#10094;</button>
        <button id="nextBtn" class="nav-button">&#10095;</button>
        <div class="indicators"></div>
        <footer>100 estilos de generación de imágenes</footer>
    </div>
<script>
    const slideContainer = document.getElementById('slideContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelector('.indicators');
    let slides = [], currentSlide = 0;
    const transitions = [
        {name:'fade',d:'0.6s',e:'ease-in-out'},{name:'slideLeft',d:'0.5s',e:'cubic-bezier(0.25,0.46,0.45,0.94)'},{name:'slideRight',d:'0.5s',e:'cubic-bezier(0.25,0.46,0.45,0.94)'},{name:'slideUp',d:'0.5s',e:'cubic-bezier(0.25,0.46,0.45,0.94)'},{name:'slideDown',d:'0.5s',e:'cubic-bezier(0.25,0.46,0.45,0.94)'},{name:'rotate',d:'0.7s',e:'ease-in-out'},{name:'scale',d:'0.5s',e:'ease-out'},{name:'flipX',d:'0.7s',e:'ease-in-out'},{name:'flipY',d:'0.7s',e:'ease-in-out'},{name:'zoomBlur',d:'0.6s',e:'ease-out'},{name:'swingIn',d:'0.7s',e:'ease-out'},{name:'bounceIn',d:'0.8s',e:'cubic-bezier(0.34,1.56,0.64,1)'},{name:'glitch',d:'0.5s',e:'steps(4,end)'},{name:'spiralIn',d:'0.7s',e:'ease-out'},{name:'dropIn',d:'0.6s',e:'cubic-bezier(0.34,1.56,0.64,1)'},{name:'unfold',d:'0.6s',e:'ease-in-out'},{name:'skewIn',d:'0.55s',e:'ease-out'},{name:'slideTopLeft',d:'0.55s',e:'cubic-bezier(0.25,0.46,0.45,0.94)'},{name:'slideBottomRight',d:'0.55s',e:'cubic-bezier(0.25,0.46,0.45,0.94)'},{name:'flipDiagonal',d:'0.75s',e:'ease-in-out'},{name:'rotateScale',d:'0.7s',e:'ease-in-out'},{name:'blurIn',d:'0.6s',e:'ease-out'},{name:'lightSpeed',d:'0.6s',e:'cubic-bezier(0.25,0.46,0.45,0.94)'},{name:'jackInTheBox',d:'0.8s',e:'cubic-bezier(0.68,-0.55,0.27,1.55)'},{name:'perspectiveFlip',d:'0.8s',e:'ease-in-out'}
    ];
    function initSlides() {
        imageUrls.forEach((url, i) => {
            const s = document.createElement('div');
            s.className = 'slide' + (i===0?' active':'');
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Imagen ' + (i+1);
            img.onerror = function(){this.style.display='none'};
            img.onclick = function(){openModal(this.src)};
            s.appendChild(img);
            slideContainer.appendChild(s);
        });
        slides = document.querySelectorAll('.slide');
        slides.length ? showSlide(0) : (slideContainer.innerHTML='<p style="text-align:center;padding:40px;font-size:1.2em;">No se pudieron cargar las imágenes.</p>');
    }
    function randomTransition() {
        return transitions[Math.floor(Math.random() * transitions.length)];
    }
    function showSlide(n) {
        slides.forEach(s => s.classList.remove('active'));
        if (slides[n]) { const t = randomTransition(); slides[n].classList.add('active'); slides[n].style.animation = t.name + ' ' + t.d + ' ' + t.e; }
        currentSlide = n;
        document.querySelectorAll('.indicator').forEach((dot,i) => dot.classList.toggle('active',i===n));
    }
    function openModal(src) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        overlay.onclick = () => overlay.remove();
        const img = document.createElement('img');
        img.src = src;
        overlay.appendChild(img);
        document.body.appendChild(overlay);
    }
    prevBtn.onclick = () => { if(currentSlide>0) showSlide(currentSlide-1); };
    nextBtn.onclick = () => { if(currentSlide<slides.length-1) showSlide(currentSlide+1); };
    document.addEventListener('keydown', e => {
        if(e.key==='ArrowLeft' && currentSlide>0) showSlide(currentSlide-1);
        if(e.key==='ArrowRight' && currentSlide<slides.length-1) showSlide(currentSlide+1);
        if(e.key==='Escape') { const m=document.querySelector('.modal-overlay'); if(m) m.remove(); }
    });
    const imageUrls = [];
    initSlides();
<\/script>
</body>
</html>`;
}

function buildGalleryHtml(base64Images) {
    let imagesHtml = '';
    base64Images.forEach((img, i) => {
        imagesHtml += `        <div class="gallery-item"><img src="${img}" alt="Imagen ${i+1}" onclick="openModal(this.src)"></div>\n`;
    });
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Galería de imágenes</title>
    <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:Arial,sans-serif;background:#1a1a1a;color:white;padding:20px}
        h1{text-align:center;margin-bottom:30px;color:#ffd700}
        .gallery{display:flex;flex-wrap:wrap;gap:16px;justify-content:center}
        .gallery-item{width:300px;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.5);cursor:pointer;transition:transform 0.2s}
        .gallery-item:hover{transform:scale(1.03)}
        .gallery-item img{width:100%;height:auto;display:block}
        .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:999;display:none;align-items:center;justify-content:center;cursor:pointer}
        .modal-overlay.active{display:flex}
        .modal-overlay img{max-width:95%;max-height:95%;object-fit:contain;border-radius:8px}
        footer{text-align:center;margin-top:30px;color:#666;font-size:0.85rem}
    </style>
</head>
<body>
    <h1>Galería de imágenes</h1>
    <div class="gallery">
${imagesHtml}    </div>
    <footer>Generado con 100 estilos de generación de imágenes</footer>
    <script>
        function openModal(src) {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay active';
            overlay.onclick = () => overlay.remove();
            const img = document.createElement('img');
            img.src = src;
            overlay.appendChild(img);
            document.body.appendChild(overlay);
        }
    <\/script>
</body>
</html>`;
}

async function downloadPresenterHtml() {
    const btn = document.getElementById('btn-presenter');
    const orig = btn.textContent;
    btn.textContent = 'Generando...';
    btn.disabled = true;
    try {
        const base64Images = [];
        for (let i = 0; i < galleryImages.length; i++) {
            const url = galleryImages[i];
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
        a.download = 'galeria_interactiva.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (e) {
        alert('Error al crear el HTML.');
    } finally {
        btn.textContent = orig;
        btn.disabled = false;
    }
}

async function downloadGalleryHtml() {
    const btn = document.getElementById('btn-gallery');
    const orig = btn.textContent;
    btn.textContent = 'Generando galería...';
    btn.disabled = true;
    try {
        const base64Images = [];
        for (let i = 0; i < galleryImages.length; i++) {
            const url = galleryImages[i];
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
        a.download = 'galeria_imagenes.html';
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
}

// ==========================================
// 6. UTILIDADES UI
// ==========================================

function clearPrompt(id) {
    const select = document.getElementById('img_obj_select');
    select.selectedIndex = 0;
    document.getElementById('img_obj_custom').value = '';
    document.getElementById('img_obj_custom').style.display = 'none';
}

function copyJsonPrompting() {
    const objeto = getObjeto();
    if (!objeto || !hasGenerated) {
        navigator.clipboard.writeText("{}").catch(() => {});
        return;
    }
    const model = document.getElementById('img_model').value;
    const { category, styleData, estilo } = getCategoryAndStyle();
    const styleLines = getStylePromptLines(category, estilo);

    const catInfo = `Categoría: ${category.name}. Estilo: ${estilo} (${styleData.desc})`;

    const dims = getAspectRatioDims();
    const orientation = dims.w > dims.h ? 'horizontal / paisaje' : dims.w < dims.h ? 'vertical / retrato' : 'cuadrado';

    const systemPrompt = `Genera una imagen basada en: "${objeto}" usando el estilo visual indicado.

CONTEXTO:
${catInfo}

CALIDAD DE RENDER — MUY IMPORTANTE:
${styleLines.render}
- Materiales con texturas visibles al detalle según corresponda al tema
- Iluminación adecuada al estilo: ${estilo.toLowerCase()}
- El tema debe representarse fielmente con el estilo visual seleccionado
- Fondo apropiado al contexto, sin distracciones innecesarias

COMPOSICIÓN (${dims.w}×${dims.h}):
- El tema ocupa el centro del frame
- Espacio equilibrado. Sin amontonamiento. Respiración visual entre elementos
- Composición profesional, bien encuadrada y balanceada

ESTILO:
${styleLines.vibe}
- Aplicación coherente del estilo en toda la imagen
- La imagen debe verse REAL y fiel al estilo seleccionado

FORMATO DE SALIDA:
- ${dims.w}×${dims.h} píxeles, orientación ${orientation}
- Ultra nítido, optimizado para presentaciones, YouTube y pantallas 4K
- Nivel de detalle: profesional, acorde al estilo seleccionado`;

    const json = JSON.stringify({
        prompt: systemPrompt,
        model: model,
        size: `${dims.w}x${dims.h}`,
        width: dims.w,
        height: dims.h,
        response_format: "b64_json"
    }, null, 2);

    navigator.clipboard.writeText(json).then(() => {
        const btn = document.getElementById('btn-copy-json');
        const t = translations[currentLang];
        const orig = t.copyJsonBtn;
        btn.textContent = t.copiedStatus;
        setTimeout(() => btn.textContent = orig, 2000);
    }).catch(() => {
        alert(currentLang === 'es' ? "Error al copiar" : "Copy error");
    });
}

function toggleConfigControls(enabled) {
    const container = document.getElementById('gen-controls-group');
    if (!container) return;
    const inputs = container.querySelectorAll('select, textarea, button:not(#btn-copy-json)');
    inputs.forEach(input => {
        input.disabled = !enabled;
        input.style.opacity = enabled ? "1" : "0.6";
        input.style.pointerEvents = enabled ? "auto" : "none";
    });
}
