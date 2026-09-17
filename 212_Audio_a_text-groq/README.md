# Transcriptor de Audio con Groq

Aplicación web para convertir grabaciones de voz o archivos de audio en texto usando la API de Speech-to-Text de Groq.

Con una interfaz sencilla, botones grandes, instrucciones visibles y dos formas de introducir el audio: subir un archivo o grabarlo directamente con el micrófono.

## Uso

1. Abra `index.html` haciendo doble clic sobre el archivo o desde un navegador web.
2. En el campo **Groq API Key**, escriba su clave de Groq. Si no tiene una, puede crearla en [console.groq.com/keys](https://console.groq.com/keys).
3. Elija el modelo recomendado `whisper-large-v3-turbo` o el modelo `whisper-large-v3` si necesita mayor precisión.
4. Seleccione el idioma del audio. Para español, elija **Español (es)**.
5. Para usar un archivo, haga clic en **Subir Archivo** y después en el recuadro grande. También puede arrastrar el archivo al recuadro.
6. Para hablar directamente, seleccione **Grabar Micrófono**, pulse **Iniciar Grabación** y pulse **Detener Grabación** cuando termine.
7. Pulse **Transcribir Audio con Groq** y espere a que aparezca el texto.
8. Use **Copiar**, **Descargar .txt** o **Descargar Word** para guardar el resultado.

## Descargar en Word

La opción **Descargar Word** crea un archivo `.doc` que se puede abrir con Microsoft Word y otros procesadores de texto compatibles. El contenido se organiza en párrafos separados por oraciones y conserva los saltos de línea disponibles.

## Archivos incluidos

- `index.html`: versión con la lista ampliada de modelos sustituida por los modelos disponibles en Groq.
- `logoPB1.png`: logo de la Institución Universitaria Pascual Bravo.
- `logo_escuela.png`: logo de la Escuela de Pensamiento Educativo y Pedagógico.

## Requisitos y recomendaciones

- Navegador actualizado, como Google Chrome, Microsoft Edge o Mozilla Firefox.
- Conexión a internet para comunicarse con Groq.
- Permiso para usar el micrófono si se elige la grabación directa.
- Los archivos de audio deben respetar los límites de tamaño y formatos admitidos por Groq.

La clave de Groq se escribe solo durante el uso de la página y no se guarda en el navegador. Para una aplicación pública o institucional, se recomienda utilizar un servidor intermedio y no exponer la clave desde el navegador.
