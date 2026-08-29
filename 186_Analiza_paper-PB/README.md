# Analiza artículo PDF

Aplicación web para analizar artículos académicos en PDF mediante inteligencia artificial. Carga un PDF, selecciona un modelo de IA y haz preguntas sobre el contenido. El sistema mantiene contexto de conversación, permitiendo diálogos profundos sobre el documento.

## Apps incluidas

| App | Descripción |
|---|---|
| `index.html` | Chat interactivo con PDF: carga un artículo, haz preguntas y obtén respuestas contextualizadas con memoria de conversación |
| `Modelo_texto.html` | Escritor de artículos académicos: ingresa un tema y genera un artículo estructurado con referencias |

## Arquitectura

```
Frontend (index.html / Modelo_texto.html)
        |
        | POST /api/ia/text  { model, prompt }
        v
Backend (node.proyectodescartes.org)
        |
        | API Key desde .env (nunca expuesta al frontend)
        v
Pollinations AI (gen.pollinations.ai)
```

La API key se gestiona exclusivamente desde el backend a través de variables de entorno. El frontend nunca tiene acceso a ella.

## Modelos disponibles

### Chat con PDF (`index.html`)
openai, mistral, gemini-fast, openai-fast, gemini-search, nova-fast, perplexity-fast, deepseek

### Escritor de artículos (`Modelo_texto.html`)
gemini-search, perplexity-fast, gemini-large

## Funcionalidades

- Carga de archivos PDF con extracción de texto mediante PDF.js
- Chat con memoria de conversación (mantiene contexto entre mensajes)
- 20 preguntas predefinidas para analizar el artículo desde distintas perspectivas
- Visor de PDF integrado (toggle mostrar/ocultar)
- Exportación de la sesión a HTML o Word (.docx)
- Avatares generados por IA para cada mensaje
- Tema claro/oscuro con persistencia en localStorage
- Extracción automática de autores del PDF y formato de citas
- Backend proxy seguro: la API key nunca se expone al frontend

## Requisitos del backend

El backend debe estar desplegado en `https://node.proyectodescartes.org/` con:

- `app.js` como archivo principal
- Puerto `3000`
- Archivo `.env` con la variable `API_KEY` (valor: `plln_sk_...`)
- Endpoint `POST /api/ia/text` que acepte `{ model, prompt }` y retorne texto plano

## Configuración

No requiere configuración del lado del cliente. El frontend se conecta automáticamente al backend en `https://node.proyectodescartes.org/api/ia/text`.

### Despliegue del backend (Plesk)

1. Subir `app.js` al servidor
2. Configurar `.env` con la API key
3. Asegurar que el endpoint `POST /api/ia/text` esté activo en puerto 3000
4. El frontend apunta al backend por defecto; si cambia la URL, editar la constante `apiUrl` en `script.js`

## Uso

1. Abrir `index.html` en un navegador
2. Click en **Seleccionar PDF** y elegir un archivo
3. Esperar a que se procese el documento
4. Seleccionar un modelo de IA
5. Elegir una pregunta predefinida o escribir una personalizada
6. Hacer clic en **Enviar**
7. Descargar la conversación como HTML o Word con los botones de la barra

## Créditos

Diseñado por Juan Guillermo Rivera Berrío con tecnología Gemini 3.1 Pro, IA agéntica Antigravity, y las API de Pollinations.
