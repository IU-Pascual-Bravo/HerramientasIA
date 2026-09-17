# Matriz de Análisis Pedagógico

Aplicación web estática para analizar documentos pedagógicos en formato PDF o Word y generar una matriz estructurada con ayuda de Pollinations AI. El resultado puede consultarse en pantalla, exportarse a Excel o imprimirse como PDF.

## Características

- Carga de archivos `.pdf` y `.docx` mediante selector o arrastrar y soltar.
- Extracción de texto en el navegador con PDF.js y Mammoth.js.
- Selección del modelo de IA de Pollinations.
- Generación de tarjetas verdes, amarillas y naranjas, categoría y observaciones.
- Exportación de la matriz con estilos a `.xlsx` mediante ExcelJS.
- Interfaz responsive con los logos institucionales incluidos en el proyecto.

## Uso

1. Abre `index.html` en un navegador moderno.
2. Selecciona un modelo autorizado y carga un archivo PDF o Word.
3. Pulsa **Analizar y Generar Tabla**.
4. Exporta el resultado a Excel o usa la opción de impresión para guardarlo como PDF.

La aplicación carga PDF.js, Mammoth.js y ExcelJS desde CDN, por lo que se necesita conexión a Internet para procesar archivos y comunicarse con el backend.

## Estructura

```text
.
├── index.html
├── logoPB0.png
├── logo_escuela.png
└── README.md
```

## Notas de seguridad

El navegador envía únicamente el modelo y el texto al endpoint backend `https://node.proyectodescartes.org/api/ia/text`. La API key de Pollinations AI se mantiene exclusivamente en las variables de entorno del servidor y nunca se incluye en el código frontend ni en `localStorage`.

## Licencia

Este proyecto no declara una licencia específica. Añade la licencia institucional correspondiente antes de distribuirlo.
