# Puzzle Hexagonal Simétrico

Aplicación web interactiva para crear, jugar y descargar rompecabezas formados por piezas hexagonales giratorias.

## Características

- Cuatro niveles de dificultad: 7, 19, 37 o 61 piezas.
- Generación de imágenes mediante un prompt de IA.
- Carga de imágenes desde una URL pública o desde el dispositivo.
- Recorte centrado de imágenes para mantener la proporción.
- Rotación de cada pieza en pasos de 60 grados.
- Descarga del puzzle como un archivo HTML independiente.
- Diseño adaptable a ordenadores, tabletas y teléfonos.

## Uso

1. Abre `index.html` en un navegador moderno.
2. Genera una imagen con un prompt, pega una URL o sube un archivo local.
3. Selecciona el número de piezas del puzzle.
4. Haz clic sobre las piezas para girarlas hasta reconstruir la imagen.
5. Usa **Descargar Puzzle** para guardar una versión HTML del puzzle.

La generación mediante IA y la subida de archivos requieren conexión a Internet, ya que utilizan servicios externos configurados en `script.js`.

## Estructura

- `index.html`: estructura de la interfaz y los logotipos del proyecto.
- `style.css`: estilos, distribución responsive y apariencia del puzzle.
- `script.js`: generación, carga, mezcla, rotación y exportación del puzzle.
- `logoPB0.png`: logotipo PB mostrado arriba a la izquierda.
- `logo_escuela.png`: logotipo de la escuela mostrado arriba a la derecha.
- `Ejemplos/`: ejemplos y material complementario.

## Tecnologías

- HTML5
- CSS3 con Flexbox, variables y `clip-path`
- JavaScript Vanilla

## Créditos

Diseñado por **Juan Guillermo Rivera Berrío** con tecnología **Gemini 3.1 Pro**.
