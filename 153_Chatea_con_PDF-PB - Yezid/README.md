# Chatbot PDF Interactivo

Este es un proyecto diseñado por Juan Guillermo Rivera Berrío, construido con la asistencia de la IA agéntica Antigravity y la tecnología de Gemini 3.1 Pro. Su objetivo es brindar una interfaz de chat que permite dialogar y extraer información valiosa directamente desde documentos PDF, de forma interactiva y amigable desde el navegador web.

## 🌟 Características Principales

- **Visor Integrado de PDF**: Permite cargar un archivo local PDF y visualizarlo al instante junto con la interfaz de chat, todo en una sola pantalla.
- **Lectura de URLs**: Permite introducir una página web o un PDF público como fuente de conocimiento. Intenta leerla directamente y usa `r.jina.ai` como alternativa cuando el sitio bloquea CORS.
- **Visor de páginas web**: Las URLs cargadas pueden abrirse en el visor integrado, junto con el chat y el texto extraído.
- **Selector Dinámico de Modelos**: Consulta en tiempo real los modelos de lenguaje disponibles para procesar la información, filtrando inteligentemente aquellos con mayor capacidad de retención.
- **Exportación de Sesiones**: Expórtalo fácilmente a PDF y HTML para el registro persistente o impresión del chat llevado a cabo.
- **Diseño Dual**: Cambia entre un tema modo claro y oscuro a voluntad para una lectura cómoda.
- **Búsqueda Sensible al Contexto**: Respuestas orientadas completamente al texto plano extraído del PDF.

## 🚀 Potenciado por la infraestructura de Pollinations AI

El núcleo inteligente y de comunicación de este proyecto ocurre gracias a la robusta integración con diferentes herramientas y endpoints proveídos por el ecosistema de **Pollinations AI**, las cuales son el motor que le da vida a la aplicación:

1. **Gestor de API Keys (BYOK/BYOP)**: Haciendo uso de su plataforma de enlace y autorización en `enter.pollinations.ai`, la aplicación permite que el usuario obtenga y utilice sus credenciales con muchísima facilidad de manera segura desde la web, vinculando un flujo de inicio de sesión fácil.
   
2. **Directorio Dinámico de Modelos**: La aplicación no se ata a modelos preprogramados de manera limitante. Se empodera de la información dada por `https://enter.pollinations.ai/api/generate/text/models` para construir un autocompletado en el selector de modelos de chat del proyecto. Adicionalmente, evalúa el atributo `context_length` de los modelos de Pollinations para listar a los modelos más avanzados (ventana mayor o igual a 400.000 tokens), ideal cuando leemos PDFs de muchas páginas. Identificando también los que son de acceso pago u abierto dinámicamente.

3. **Inferencia de Texto e Inteligencia Artificial**: Todas las consultas, procesamientos y dudas enviadas desde el input del chat se derivan a la poderosa API `gen.pollinations.ai/v1/chat/completions`. A través del cual, interactuamos con el modelo seleccionado devolviendo una interpretación certera de alta calidad basada en nuestro documento PDF.

## 🛠 Instalación y Uso

Dado que es una aplicación estática y limpia (Javascript vanilla, HTML5 puro y CSS3):

1. Clona el repositorio o descarga en una carpeta la estructura base de los archivos `index.html`, `script.js` y `style.css`.
2. Ábre el index directamente desde tu navegador (No requiere frameworks o entornos como Node.js preestablecidos).
3. Ingresa tu API token u obtenlo utilizando el botón "Obtener API Key" el cual te dirigirá al portal de autorización de Pollinations AI.
4. Carga tu Documento PDF utilizando la casilla de la izquierda o escribe una URL pública y pulsa **Leer URL**.
5. Si cargaste una URL, usa **Ver página** para abrirla en el visor integrado.
6. Selecciona el Modelo de IA que prefieras o se acomode en el selector superior de la barra de herramientas.
7. ¡Empieza a chatear y preguntar sobre el contenido de tu documento o página!

---
> *Diseñado por Juan Guillermo Rivera Berrío con tecnología Gemini 3.1 Pro y la IA agéntica Antigravity.*
