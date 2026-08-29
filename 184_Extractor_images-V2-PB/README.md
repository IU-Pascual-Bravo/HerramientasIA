# 🎓 Extractor Universal de Imágenes & Optimizador Web

Un potente extractor de imágenes "todo en uno" basado íntegramente en el navegador. Permite recuperar imágenes de archivos complejos (**PDF, PPTX, HTML**), extraer contenido visual de **sitios web** mediante URL, **obtener fotogramas de videos** (MP4/WebM) cada N segundos, o procesar **carpetas locales** enteras, incluyendo herramientas avanzadas de compresión y conversión a formatos modernos como **WebP**.

> 🌟 **Pensado para la educación:** recopila, extrae y reutiliza recursos visuales de cualquier material digital para crear presentaciones y recursos didácticos sin depender de servicios en la nube.

![Versión](https://img.shields.io/badge/version-2.0-blue)
![Tecnología](https://img.shields.io/badge/Tecnología-JS_Pure-yellow)
![Privacidad](https://img.shields.io/badge/Privacidad-100%25_Local-green)
![Uso](https://img.shields.io/badge/Uso-Educativo-orange)

## 📚 Utilidad en Educación

Esta herramienta está diseñada para transformar cualquier material digital en recursos visuales reutilizables dentro del aula:

*   **Creación de materiales didácticos:** extrae diagramas, gráficos e ilustraciones de PDFs, libros digitales y diapositivas para reutilizarlos en guías, talleres y cuadernillos.
*   **Análisis de videos:** captura fotogramas de videos **cada 20 segundos** (configurable) para estudiar secuencias, representar momentos clave de una clase grabada o generar líneas de tiempo visuales sin reproducir todo el video.
*   **Bancos de imágenes docentes:** convierte colecciones de imágenes a formatos ligeros (WebP) para web, plataformas virtuales (Moodle, Google Classroom) y presentaciones, ahorrando espacio y mejorando la velocidad de carga.
*   **Investigación escolar y universitaria:** compila evidencias visuales de sitios web y documentos de referencia con fines de análisis, citación y portafolios.
*   **Presentaciones académicas:** genera presentaciones de diapositivas en múltiples proporciones (16:9, 4:3, 9:16 para TikTok/Stories, póster A4, etc.) a partir del material extraído.
*   **Privacidad estudiantil:** todo se procesa localmente; los trabajos y materiales de los estudiantes nunca abandonan el dispositivo, cumpliendo con las buenas prácticas de protección de datos en el entorno educativo.

## ✨ Características Principales

*   **📄 Extracción de PDF (Objetos Reales):** A diferencia de otros extractores, accede a los objetos de imagen internos (`XObjects`) del PDF en lugar de tomar capturas de la página, preservando la resolución original.
*   **📊 Soporte PowerPoint (.pptx):** Analiza la estructura interna del archivo para extraer todos los recursos multimedia guardados en las diapositivas.
*   **🎬 Extracción de fotogramas de video:** sube un video **MP4 o WebM** (máximo 150 minutos) y la herramienta captura un fotograma **cada 20 segundos** (intervalo configurable de 1 a 60 s) usando Canvas y el reproductor nativo del navegador. El intervalo se puede ajustar para regenerar los fotogramas al instante.
*   **🌐 Extractor de URL Web:** ingresa una dirección web y la herramienta detectará y descargará las imágenes automáticamente (utiliza un proxy CORS para evitar bloqueos de seguridad).
*   **📁 Procesamiento de Carpetas y Archivos:** permite seleccionar una carpeta completa para realizar conversiones masivas (ej. de PNG a WebP) de forma instantánea.
*   **⚡ Panel de Optimización Real-Time:**
    *   **Formatos:** salida en WebP, JPEG o PNG.
    *   **Escala:** redimensiona imágenes proporcionalmente (de 0.2x a 1.5x).
    *   **Calidad:** ajuste fino de la relación calidad/peso.
    *   **Comparativa:** visualización del peso original vs. optimizado y porcentaje de ahorro.
*   **📽 Generador de Presentaciones:** convierte los resultados en una presentación de diapositivas descargable con transiciones, zoom y múltiples proporciones (horizontales, verticales, redes sociales, póster y A4).
*   **📦 Descarga en ZIP:** empaqueta todos los resultados en un único archivo comprimido con un solo clic.

## 🚀 Instalación y Uso

Al ser una aplicación web estática (client-side), no requiere servidor, base de datos ni instalación de dependencias.

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/extractor-imagenes-universal.git
    ```
2.  **Ejecuta:** abre el archivo `index.html` en cualquier navegador moderno (Chrome, Firefox, Edge, Safari).
3.  **Flujo de trabajo recomendado en clase:**
    *   Arrastra un **PDF, PPTX, HTML, carpeta de imágenes o un video** a la zona de archivos (o usa el botón **🎬 Subir Video**).
    *   Ajusta el **intervalo de fotogramas** (por defecto 20 s) y presiona **🎬 Extraer fotogramas** si el video cambia.
    *   Configura formato, escala y calidad en el panel de optimización.
    *   Descarga los resultados en **ZIP** o genera una **presentación** con los recursos extraídos.

## 🛠️ Tecnologías Utilizadas

*   **[PDF.js](https://mozilla.github.io/pdf.js/):** para el análisis y renderizado de objetos dentro de documentos PDF.
*   **[JSZip](https://stuk.github.io/jszip/):** para la descompresión de archivos Office (PPTX) y la generación de paquetes de descarga.
*   **HTML5 Canvas API:** motor central para el procesamiento, redimensionado, compresión de imágenes y captura de fotogramas de video.
*   **HTML5 Video API:** reproducción local del video y extracción de fotogramas mediante `seek` + `canvas`.
*   **CORS Proxy:** integración con servicios de proxy para la extracción de contenido web remoto.

## 🔒 Privacidad y Seguridad

**Tus archivos nunca salen de tu ordenador.** Todo el procesamiento de imágenes, lectura de PDFs, extracción de fotogramas y compresión se realiza localmente en la memoria de tu navegador. Esto garantiza:

*   Máxima velocidad de procesamiento.
*   Privacidad absoluta de documentos, investigaciones y material didáctico.
*   Funcionamiento sin necesidad de subir datos a la nube.

## 👤 Créditos y Desarrollo

*   **Autor:** Juan Guillermo Rivera Berrío.
*   **Tecnología:** desarrollado con el apoyo de **Hy3 (Hunyuan 3 )** para la optimización de algoritmos de extracción y manejo de objetos de imagen.

## 📝 Licencia

Este proyecto se distribuye bajo la Licencia MIT. Siéntete libre de usarlo, modificarlo y adaptarlo a tus necesidades educativas.

---

### 💡 ¿Quieres contribuir?
Si encuentras un error o tienes una sugerencia para mejorar la extracción de objetos:

1.  Haz un **Fork** del proyecto.
2.  Crea una rama (`git checkout -b feature/NuevaMejora`).
3.  Haz un **Commit** con tus cambios.
4.  Envía un **Pull Request**.

---

Diseñado por Juan Guillermo Rivera Berrío con tecnología Hy3 (Hunyuan 3 ) y asistencia de OpenCode