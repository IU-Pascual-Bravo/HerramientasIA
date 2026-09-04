# Puzzle Hexagonal de Video

Aplicación web interactiva para convertir un video en un puzzle de piezas hexagonales. El usuario puede cargar el video de ejemplo, indicar una URL o seleccionar un archivo local, y después girar las piezas hasta reconstruirlo.

## Características

- Puzzle de 7, 19, 37 o 61 piezas hexagonales.
- Rotación de cada pieza en pasos de 60 grados.
- Video de ejemplo incluido en `modelo.mp4`.
- Carga de videos desde una URL o desde un archivo local.
- Detección de puzzle completado, animación de confeti y reproducción del video completo.
- Reinicio, guardado, descarga del puzzle y generación de una galería.
- Logos institucionales visibles en las esquinas superiores de la interfaz.

## Uso

1. Abre `index.html` en un navegador moderno.
2. Usa el video incluido o carga otro mediante una URL o un archivo local.
3. Selecciona el número de piezas.
4. Haz clic en las piezas para girarlas hasta completar el video.
5. Usa los botones inferiores para reiniciar, guardar o exportar el puzzle.

## Estructura

```text
.
├── index.html          # Interfaz principal
├── style.css           # Estilos y diseño responsive
├── script.js           # Lógica del puzzle y exportaciones
├── modelo.mp4          # Video de ejemplo
├── logoPB0.png         # Logo de la Institución Universitaria Pascual Bravo
├── logo_escuela.png    # Logo de la Escuela de Pensamiento Educativo y Pedagógico
├── puzle_inicial.html  # Versión inicial autocontenida
└── Ejemplos/           # Ejemplos adicionales
```

## Tecnologías

- HTML5
- CSS3
- JavaScript nativo
- Elemento HTML `<video>`

## Requisitos

No requiere instalación ni dependencias. Para una carga fiable de videos locales y las funciones de exportación, se recomienda abrir el proyecto mediante un servidor local, aunque la interfaz principal también puede abrirse directamente desde `index.html`.

## Créditos

Diseñado por **Juan Guillermo Rivera Berrío** con tecnología Gemini 3.1 Pro.
