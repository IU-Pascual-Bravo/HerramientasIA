# 📚 Generador de Cuestionarios con PDF

Aplicación web interactiva que permite **crear cuestionarios de opción múltiple a partir del contenido de un documento PDF utilizando Inteligencia Artificial**.

La aplicación analiza el texto del PDF, genera preguntas relacionadas con su contenido y crea una experiencia de evaluación interactiva que incluye imágenes generadas por IA, temporizador, retroalimentación inmediata y resultados finales.

Además, permite descargar el cuestionario generado como un archivo **HTML independiente**, que puede compartirse y ejecutarse en cualquier navegador web.

---

## ✨ Características principales

* 📄 Carga de documentos en formato PDF.
* 🔍 Extracción automática del texto del documento.
* 🤖 Generación automática de preguntas mediante IA.
* ❓ Preguntas de opción múltiple con cuatro respuestas.
* 🔀 Organización aleatoria de las opciones de respuesta.
* 🖼️ Generación de imágenes ilustrativas para cada pregunta.
* 🎨 Selección de diferentes estilos artísticos.
* 🧠 Selección de diferentes modelos de IA para texto.
* 🖌️ Selección de diferentes modelos para generación de imágenes.
* 🌍 Soporte para español, inglés y francés.
* ⏱️ Temporizador configurable por pregunta.
* 📊 Barra de progreso durante el cuestionario.
* ✅ Retroalimentación inmediata sobre respuestas correctas e incorrectas.
* 🏆 Resultado final y porcentaje de desempeño.
* 🎨 Cambio dinámico de paletas de colores.
* 🖼️ Regeneración de imágenes mediante nuevos prompts.
* 📤 Posibilidad de subir imágenes personalizadas.
* 💾 Descarga del cuestionario como un archivo HTML autónomo.
* 📱 Diseño adaptable para computadores, tabletas y dispositivos móviles.

---

# 🚀 Cómo usar la aplicación

## 1. Abrir la aplicación

Abra el archivo:

```text
index.html
```

en un navegador web moderno.

> Para garantizar el funcionamiento de las funciones de Inteligencia Artificial y de las bibliotecas externas, se recomienda disponer de conexión a Internet.

---

## 2. Cargar un documento PDF

En la pantalla principal:

1. Pulse el botón **Seleccionar PDF**.
2. Busque el documento que desea utilizar.
3. Seleccione un archivo con extensión `.pdf`.
4. Espere mientras la aplicación procesa y extrae el contenido textual.

Cuando el proceso finalice, aparecerá un mensaje indicando que el PDF ha sido cargado correctamente.

---

## 3. Configurar el cuestionario

Antes de generar el cuestionario puede configurar diferentes opciones.

### 🔢 Número de preguntas

Puede seleccionar:

* 4 preguntas
* 8 preguntas
* 12 preguntas
* 16 preguntas
* 20 preguntas

La IA generará las preguntas tomando como referencia el contenido extraído del documento PDF.

---

### 🌍 Idioma

Actualmente están disponibles:

* 🇪🇸 Español
* 🇺🇸 English
* 🇫🇷 Français

El idioma seleccionado determina la interfaz y el idioma en el que se solicitará la generación del cuestionario.

---

### ⏱️ Tiempo por pregunta

Puede establecer un límite de:

* 15 segundos
* 30 segundos
* 45 segundos
* 60 segundos
* 90 segundos
* Sin límite

Cuando el temporizador está activo, la aplicación muestra el tiempo restante mediante una barra visual.

Si el tiempo llega a cero:

* La pregunta se marca como no respondida.
* Se muestra la respuesta correcta.
* El usuario puede continuar con la siguiente pregunta.

---

### 🎨 Estilo artístico

Las imágenes generadas para las preguntas pueden utilizar diferentes estilos, entre ellos:

* Fotográfico
* Pintura al óleo
* Acuarela
* Arte digital
* Caricatura
* Cartoon 3D
* Anime
* Boceto
* Pop art
* Impresionista
* Abstracto
* Minimalista
* Vintage
* Cyberpunk
* Steampunk
* Surrealista
* Gótico
* Art nouveau
* Art déco
* Cubista
* Expresionista
* Renacentista
* Barroco
* Noir
* Neón
* Pastel
* Monocromático
* Graffiti
* Pixel art
* Render 3D
* Cómic

---

### 🖼️ Modelo de imagen

Puede seleccionar diferentes modelos para generar las imágenes:

* `zimage`
* `flux`
* `gptimage`
* `klein`

---

### 🤖 Modelo de texto

También puede elegir el modelo que utilizará la IA para generar las preguntas:

* `openai`
* `mistral`
* `gemini-fast`
* `openai-fast`
* `gemini-search`
* `nova-fast`
* `perplexity-fast`
* `deepseek`

---

## 4. Generar el cuestionario

Después de configurar las opciones:

1. Pulse **Generar Cuestionario**.
2. La aplicación procesará el contenido del PDF.
3. La IA generará las preguntas y respuestas.
4. Las opciones de cada pregunta se reorganizarán.
5. Se prepararán los prompts visuales para las imágenes.
6. Comenzará automáticamente el cuestionario.

Durante este proceso puede aparecer información sobre el estado de generación.

---

# 📝 Cómo responder el cuestionario

Cada pregunta incluye:

* El número de la pregunta.
* El enunciado.
* Una imagen ilustrativa.
* Cuatro opciones de respuesta.

Seleccione una respuesta haciendo clic sobre ella.

### Si la respuesta es correcta

La opción seleccionada se mostrará en color verde.

### Si la respuesta es incorrecta

* La respuesta seleccionada se mostrará en color rojo.
* La respuesta correcta se mostrará en color verde.

Después podrá pulsar **Siguiente** para continuar.

---

# 📊 Barra de progreso

En la parte superior del cuestionario encontrará una barra que indica:

```text
Pregunta X de Y
```

Esto permite conocer el avance durante la actividad.

---

# 🖼️ Personalización de imágenes

Cada pregunta permite modificar su imagen.

## Regenerar una imagen

Puede editar el texto del prompt visual y pulsar:

```text
Regenerar Imagen
```

La aplicación generará una nueva imagen utilizando el prompt actualizado.

---

## Subir una imagen propia

También puede reemplazar la imagen generada por una imagen personalizada:

1. Pulse **Subir imagen**.
2. Seleccione una imagen desde su dispositivo.
3. La imagen seleccionada reemplazará la ilustración original de esa pregunta.

---

# 🎨 Cambiar la paleta de colores

Desde la pantalla inicial puede pulsar:

```text
Cambiar Paleta
```

La aplicación cambiará dinámicamente los colores principales de la interfaz.

Existen diferentes combinaciones visuales, incluyendo tonos:

* Púrpura.
* Verde.
* Rojo.
* Azul.
* Naranja.
* Magenta.
* Turquesa.
* Marrón.
* Rosa.
* Cian.
* Ámbar.
* Azul nocturno.

---

# 🏆 Resultados finales

Al finalizar todas las preguntas, la aplicación muestra:

* Número de respuestas correctas.
* Número total de preguntas.
* Porcentaje obtenido.
* Mensaje de retroalimentación.

Por ejemplo:

```text
Tu puntuación es: 7 de 8 (88%)
```

---

# 💾 Descargar el cuestionario

Una de las características principales de la aplicación es la posibilidad de descargar el cuestionario generado.

Para hacerlo:

1. Configure el tiempo del cuestionario descargado.
2. Pulse **Descargar Cuestionario**.
3. La aplicación procesará las imágenes.
4. Se generará un archivo HTML independiente.

El archivo descargado contiene:

* Las preguntas.
* Las opciones.
* Las respuestas correctas.
* Las imágenes.
* La barra de progreso.
* El temporizador.
* El diseño visual seleccionado.
* La pantalla de resultados.

Esto permite compartir el cuestionario sin necesidad de volver a generar las preguntas.

---

# 📁 Estructura básica del proyecto

```text
/
├── index.html
└── logo_pascual_bravo.png
```

El archivo principal de la aplicación es:

```text
index.html
```

Este contiene:

* HTML.
* CSS.
* JavaScript.
* Configuración de la interfaz.
* Procesamiento de PDF.
* Comunicación con los servicios de IA.
* Generación del cuestionario.
* Generación de imágenes.
* Descarga del cuestionario.

---

# 🔧 Tecnologías utilizadas

## HTML5

Se utiliza para construir la estructura de la interfaz.

## CSS3

Se utiliza para:

* Diseño responsive.
* Gradientes.
* Animaciones.
* Barras de progreso.
* Temporizador visual.
* Botones e ինտeracciones visuales.

## JavaScript

Gestiona la lógica de:

* Carga de archivos.
* Procesamiento del PDF.
* Comunicación con APIs.
* Generación de preguntas.
* Control del temporizador.
* Evaluación de respuestas.
* Generación de resultados.
* Descarga del cuestionario.

## PDF.js

La aplicación utiliza **PDF.js** para leer el documento PDF y extraer su contenido textual.

## Servicios de Inteligencia Artificial

La aplicación se comunica con servicios de IA para:

* Generar preguntas.
* Crear respuestas de opción múltiple.
* Generar prompts visuales.
* Crear imágenes ilustrativas.

---

# ⚠️ Consideraciones importantes

## Calidad del PDF

Los resultados dependerán de la calidad del contenido textual del PDF.

Los documentos con texto seleccionable generalmente producirán mejores resultados.

Los PDF que contienen únicamente imágenes o documentos escaneados pueden requerir un proceso adicional de reconocimiento óptico de caracteres (OCR).

---

## Conexión a Internet

La aplicación requiere conexión a Internet para utilizar:

* La biblioteca PDF.js.
* Los servicios de Inteligencia Artificial.
* La generación de imágenes.

---

## Generación mediante IA

Las preguntas y las imágenes son generadas automáticamente por modelos de Inteligencia Artificial.

Por este motivo, se recomienda revisar el contenido generado antes de utilizar el cuestionario en actividades académicas o evaluaciones formales.

---

# 🎓 Posibles usos educativos

Esta herramienta puede utilizarse para crear:

* Cuestionarios de estudio.
* Actividades de repaso.
* Evaluaciones formativas.
* Autoevaluaciones.
* Pruebas de conocimientos.
* Actividades de recuperación.
* Material interactivo para clases.
* Recursos para educación virtual.
* Cuestionarios para capacitación empresarial.

---

# 🔄 Crear otro cuestionario

Para comenzar nuevamente, pulse:

```text
Otro cuestionario
```

La aplicación reiniciará su estado y permitirá cargar un nuevo documento PDF.

---

# 📱 Compatibilidad

Se recomienda utilizar navegadores modernos como:

* Google Chrome.
* Microsoft Edge.
* Mozilla Firefox.
* Safari.

La interfaz cuenta con diseño adaptable para pantallas de diferentes tamaños.

---

# 💡 Flujo general de trabajo

```text
PDF
 │
 ▼
Extracción de texto
 │
 ▼
Configuración del cuestionario
 │
 ▼
Generación de preguntas con IA
 │
 ▼
Generación de prompts visuales
 │
 ▼
Generación de imágenes
 │
 ▼
Resolución del cuestionario
 │
 ▼
Resultados finales
 │
 ▼
Descarga como HTML independiente
```

---

## 👨‍💻 Autor y desarrollo

Aplicación diseñada por Juan Guillermo Rivera Berrío con tecnología Claude 5 Sonnet.

---

## 📄 Licencia

Puedes adaptar este apartado según la licencia que quieras utilizar para el proyecto.

Por ejemplo:

```text
MIT License
```

o una licencia de uso académico o institucional.
