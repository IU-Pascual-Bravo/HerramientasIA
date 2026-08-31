# Chatbot PDF Interactivo Avanzado

Esta es una aplicación web interactiva que permite a los usuarios cargar documentos PDF y "chatear" con ellos utilizando inteligencia artificial (IA). Diseñado por Juan Guillermo Rivera Berrío.

## Características Principales

*   **Carga de Múltiples PDFs**: Puedes cargar hasta 3 documentos PDF simultáneamente para que la IA los analice.
*   **Chat Inteligente**: Haz preguntas sobre el contenido de los documentos cargados. Soporta múltiples modelos de IA (OpenAI, Gemini).
*   **Visor Integrado**: Un panel lateral te permite visualizar el PDF original mientras chateas.
*   **Personalización**:
    *   Soporte para modo claro y oscuro (Tema).
    *   Paleta de colores personalizable.
    *   Avatares personalizados para el usuario y el bot.
*   **Exportación**:
    *   Descarga el historial del chat en formato HTML o PDF.
    *   Descarga tu propio "Chatbot autónomo" con los avatares incrustados.

## Cómo Usar la Aplicación

1.  **Abre la aplicación**: Ejecuta el archivo `index.html` en tu navegador web moderno preferido (Chrome, Firefox, Edge, etc.).
2.  **Carga un PDF**: En la sección izquierda "1. Cargar Documento PDF", haz clic en "Seleccionar PDF" y elige un documento de tu computadora. Puedes añadir un segundo y tercer PDF si lo deseas.
3.  **Personaliza Avatares (Opcional)**: Sube una imagen para tu usuario y otra para el Bot. Estas imágenes se mostrarán en el chat.
4.  **Selecciona el Modelo**: En la barra superior, puedes elegir el modelo de IA que deseas usar (ej. `openai-fast`, `gemini-search`).
5.  **Chatea**: Una vez que el documento se haya procesado, escribe tus preguntas en el área de texto inferior y presiona "Enviar". La IA responderá basándose en el contenido de tus PDFs.
6.  **Ver el PDF original**: Utiliza los botones "Ver PDF 1", "Ver PDF 2", etc., en la barra superior para abrir el visor y leer el documento directamente en la aplicación.

## Tecnologías Utilizadas

*   **HTML/CSS/JavaScript**: Estructura, estilos y lógica del cliente.
*   **PDF.js**: Para el procesamiento y renderizado de los archivos PDF.
*   **MathJax**: Para renderizar fórmulas matemáticas incluidas en las respuestas del chat.
*   **Marked.js**: Para interpretar y dar formato Markdown a las respuestas.
*   **html2pdf.js**: Para la exportación de las conversaciones a PDF.
*   **API de Proyecto Descartes**: El procesamiento de la IA se realiza a través de `https://node.proyectodescartes.org`.
