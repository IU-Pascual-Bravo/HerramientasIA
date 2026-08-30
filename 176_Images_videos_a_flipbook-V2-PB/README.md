# Flipbook Editor

Editor visual de flipbooks (libros interactivos) que se ejecuta 100% en el navegador, sin servidor ni dependencias externas. Permite incluir imágenes, videos, texto con formato, páginas HTML y PDF.

## Cómo usar

1. Abre `index.html` en cualquier navegador moderno
2. Añade contenido por los botos de la barra o arrastrando archivos al área de drop
3. Navega el libro con las flechas, teclado (← → ↑ ↓) o los puntos indicadores
4. Descarga el libro como HTML autónomo o como PDF

## Formatos soportados

| Tipo       | Formatos                                               |
|------------|--------------------------------------------------------|
| Imagen     | JPG, PNG, WebP, GIF, SVG                               |
| Video      | MP4, WebM, MOV, AVI, MKV, OGV, 3GP                    |
| Texto      | TXT, MD (Markdown) — con editor de formato en línea    |
| HTML       | .html, .htm — se incrusta en un iframe                 |
| PDF        | .pdf — se incrusta con un object tag                   |

## Funciones

- **Añadir URL**: pega una URL de imagen o video
- **Abrir archivos**: selector múltiple de archivos locales
- **Arrastrar y soltar**: soporta archivos y URLs sueltas
- **Limpiar todo**: elimina todas las páginas
- **Proporción de página**: 3:4, 4:3, 1:1, 3:2, A4, Carta, 9:16
- **Numerar páginas**: checkbox para mostrar/ocultar números
- **Navegación**: flechas laterales, teclado (← → ↑ ↓), puntos indicadores
- **Editor de texto**: cambia fuente, tamaño, negrilla, cursiva, viñetas, color, alineación (izquierda, centro, derecha, justificado)
- **Lightbox**: haz clic en una imagen/video para ver en pantalla completa con zoom (rueda), arrastre y pinza táctil; cierra con Escape o ✕
- **Animación 3D**: transición con perspectiva y profundidad al pasar páginas
- **Descargar libro**: genera un archivo `.html` autónomo con todas las páginas incrustadas, animación 3D y lightbox
- **Descargar PDF**: genera un PDF con todas las imágenes del libro usando jsPDF (cargado dinámicamente)

## Archivos del proyecto

| Archivo                          | Descripción                                      |
|----------------------------------|--------------------------------------------------|
| `index.html`                     | Versión completa con texto, video, PDF, HTML     |
| `index_print.html`               | Versión alternativa para generar PDF             |
| `165_Images_a_flipbook/`         | Versión simplificada solo imágenes               |
| `Ejemplos/`                      | Archivos de ejemplo                              |

## Cómo se descarga el libro

El libro descargado (`flipbook.html`) es un archivo HTML autónomo que contiene:
- Todas las imágenes/páginas incrustadas como base64
- El mismo sistema de navegación responsive
- Animación de hojas en 3D con perspectiva
- Lightbox con zoom, arrastre y soporte táctil
- Soporte para video, texto, PDF y HTML embebido

No requiere internet ni servidor para funcionar.

## Tecnología

- HTML, CSS y JavaScript vanilla (sin frameworks)
- jsPDF (cargado desde CDN solo al exportar PDF)
- Canvas API para conversión a base64
- `contentEditable` + `document.execCommand` para formato de texto
