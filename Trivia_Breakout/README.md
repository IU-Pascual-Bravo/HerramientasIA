# ¡Trivia Breakout!

Juego educativo que combina preguntas de opción múltiple con una mecánica tipo *Breakout*. El jugador elige un tema, rompe bloques con la pelota y responde preguntas para descubrir un código secreto de cuatro cifras.

## Características

- Genera 12 preguntas en español para el tema elegido.
- Permite usar Red Descartes sin configurar una clave o conectar proveedores de IA mediante una API Key.
- Incluye preguntas y opciones con fórmulas matemáticas en LaTeX.
- Permite mover la paleta con el puntero y adapta el tablero al tamaño de la pantalla.
- Asigna puntos según los intentos y revela una cifra por cada grupo de tres bloques completado.
- Descarga el juego generado como un archivo HTML con las preguntas y el código de esa partida.
- Incluye los logos de Pascual Bravo y de la escuela.

## Requisitos

- Un navegador moderno con JavaScript habilitado.
- Conexión a Internet para generar preguntas mediante el proveedor seleccionado y cargar KaTeX desde un CDN.
- Una API Key válida si se elige un proveedor que la requiere.

No se requiere instalar dependencias ni ejecutar un servidor para abrir la aplicación principal.

## Cómo iniciar

1. Descarga o copia la carpeta del proyecto, conservando `index.html` y los archivos de imagen en la misma ubicación.
2. Abre `index.html` en un navegador.
3. Escribe un tema, por ejemplo, «Historia del arte», «Insectos» o «Matemáticas».
4. Deja seleccionado **Red Descartes** o configura otro proveedor de IA.
5. Pulsa **¡Generar y Empezar!**. Cuando se generen las preguntas, comenzará el juego.

## Proveedores de IA

La aplicación ofrece estas opciones:

| Tipo | Proveedores | Configuración |
| --- | --- | --- |
| Gratuito | Red Descartes | No requiere API Key. |
| Con API Key | Google AI Studio, Mistral AI, Cohere y Groq | Selecciona el proveedor, el modelo y proporciona una clave válida. |
| Pago por uso | Pollinations AI, OpenRouter y DeepSeek | Selecciona el proveedor, el modelo y proporciona una clave válida. Pueden aplicarse cargos según las condiciones del proveedor. |

La interfaz permite validar y borrar la clave del proveedor seleccionado. Las claves y la preferencia de proveedor se guardan en el almacenamiento local del navegador; no se guardan en archivos del proyecto. Usa únicamente claves propias y revisa las condiciones y los costos del proveedor antes de usar servicios de pago.

## Cómo jugar

1. Mueve el puntero sobre el tablero para desplazar la paleta.
2. Cuando la pelota alcance un bloque, responde la pregunta de opción múltiple.
3. Una respuesta correcta elimina el bloque. Se obtienen **10 puntos** al acertar en el primer intento, **6** en el segundo y **3** en el tercero.
4. Cada grupo de tres bloques completado revela una cifra del código secreto.
5. Al eliminar los 12 bloques, introduce el código de cuatro cifras para ver el resultado. La puntuación máxima es **120 puntos**.
6. Pulsa **Jugar de nuevo** para reiniciar y generar otra partida.

## Descargar una partida

Una vez generadas las preguntas, aparece el botón **Descargar Juego**. El archivo HTML descargado contiene las preguntas y el código de esa partida, y se puede abrir para jugar sin volver a generar preguntas ni configurar una API Key. La representación de fórmulas con KaTeX se carga desde un CDN, por lo que requiere conexión a Internet.

## Archivos principales

| Archivo | Descripción |
| --- | --- |
| `index.html` | Aplicación, estilos y lógica del juego. |
| `logoPB1.png` | Logo de Pascual Bravo. |
| `logo_escuela.png` | Logo de la escuela. |
| `gifanimadoRedProyecto.gif` | Recurso gráfico adicional incluido en la carpeta. |
| `Modelo_logos/` | Aplicación de referencia para la presentación de los logos. |

## Tecnologías

HTML, CSS y JavaScript, con [KaTeX](https://katex.org/) para representar fórmulas matemáticas. La generación de preguntas se realiza mediante el servicio del proveedor de IA seleccionado.
