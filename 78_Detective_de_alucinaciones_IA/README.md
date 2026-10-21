# Detective de Alucinaciones IA

Aplicación web educativa para crear cuestionarios con ayuda de modelos de inteligencia artificial. Cada pregunta presenta cuatro afirmaciones: tres verdaderas y una falsa o «alucinación». El jugador debe identificar la afirmación falsa y luego puede consultar la explicación generada.

## Funciones

- Genera categorías de trivia escolar o permite escribir un tema propio.
- Ofrece varios modelos y proveedores de IA.
- Permite configurar la dificultad (fácil, medio o difícil) y el número de preguntas (de 4 a 15; el valor inicial es 5).
- Baraja las afirmaciones de cada pregunta para variar su orden.
- Muestra respuestas, explicaciones, puntuación, racha y precisión.
- Descarga el cuestionario generado como un archivo HTML independiente, que se puede jugar sin conexión.
- Guarda en el almacenamiento local del navegador el proveedor preferido y las claves API introducidas.

## Archivos

- `index.html`: aplicación completa, incluidos sus estilos, lógica e interfaz.
- `logoPB1.png` y `logo_escuela.png`: imágenes del encabezado.
- `Modelo_logos/`: aplicación de referencia para la presentación de los logos; no es necesaria para ejecutar la app principal.

No se requiere instalación de paquetes, compilación ni servidor backend propio.

## Requisitos

- Un navegador moderno con JavaScript habilitado.
- Conexión a Internet para consultar proveedores de IA y generar temas o preguntas.
- Una API key de un proveedor que la requiera. **Red Descartes** aparece como alternativa que no requiere API key.

La interfaz usa Google Fonts mediante una conexión externa; si no está disponible, el navegador utilizará una fuente alternativa.

## Ejecución

Se recomienda servir la carpeta mediante un servidor HTTP local, especialmente si el navegador limita solicitudes de red desde archivos `file://`.

En Windows, abre una terminal en la carpeta del proyecto y ejecuta:

```powershell
py -m http.server 8000
```

En macOS o Linux:

```sh
python3 -m http.server 8000
```

Luego abre <http://localhost:8000> en el navegador. También puedes abrir `index.html` directamente, aunque las solicitudes a servicios externos pueden depender de las políticas del navegador.

## Configurar el proveedor de IA

1. En la sección **Proveedor y API Key**, selecciona un proveedor.
2. Si el proveedor lo requiere, crea una clave en su sitio oficial y pégala en el campo de configuración. El botón **Obtener API Key** abre la página correspondiente cuando está disponible.
3. Pulsa **Validar** para comprobar la clave. También puedes probar la app sin validarla previamente; el proveedor rechazará la solicitud si la clave o el modelo no son válidos.
4. Elige un modelo en **Modelo IA**.
5. Si cambias de proveedor, revisa que el modelo seleccionado pertenezca a ese proveedor.

Proveedores incluidos en la interfaz:

- Red Descartes (sin API key)
- Google AI Studio
- Mistral AI
- Cohere
- Groq
- Pollinations AI
- OpenRouter (selección inicial)
- DeepSeek

La disponibilidad y los nombres de modelos pueden cambiar en los servicios externos. La aplicación utiliza las opciones definidas en `index.html`.

## Crear y jugar un cuestionario

1. Espera a que aparezcan las categorías sugeridas, o pulsa **Nuevos Temas** para volver a generarlas.
2. Selecciona una categoría o escribe un tema en el campo **Tema** y pulsa **Iniciar**.
3. Ajusta la dificultad y la cantidad de preguntas antes de empezar. El número se limita automáticamente al rango de 4 a 15.
4. En cada pregunta, identifica cuál de las cuatro afirmaciones es falsa.
5. Revisa el resultado y la explicación antes de avanzar. Al terminar, la pantalla final muestra los aciertos y la precisión.
6. Usa **Crear Nuevo** para volver al menú o **Descargar este Cuestionario (Clon)** para guardar las preguntas de esa partida como HTML.

El clon descargado contiene las preguntas ya generadas y no necesita API key ni conexión a Internet para jugar. No genera preguntas nuevas.

## Privacidad y uso responsable

- Las claves API se guardan en `localStorage` del navegador para el proveedor seleccionado. No se cifran; evita guardar claves en perfiles de navegador compartidos o dispositivos públicos. **Limpiar** elimina la clave guardada del proveedor actual.
- Los temas y prompts de generación se envían directamente al proveedor de IA seleccionado. Consulta sus condiciones de privacidad, límites y costos antes de usarlo.
- El contenido generado puede contener errores. Verifica las afirmaciones y explicaciones antes de usarlas con fines académicos.
- No compartas una clave API dentro de los temas que escribas ni en información sensible.

## Solución de problemas

- **No aparecen categorías:** comprueba la conexión, el proveedor, la clave y el modelo; después pulsa **Nuevos Temas**.
- **La clave no se valida:** verifica que corresponda al proveedor seleccionado, que siga activa y que el proveedor permita solicitudes desde el navegador. Algunas restricciones de red o CORS dependen del servicio.
- **No se genera una pregunta:** revisa el mensaje de estado del proveedor y vuelve a intentar. La app vuelve a intentar generar una pregunta hasta tres veces si la respuesta no tiene el formato esperado.
- **El modelo no está disponible:** selecciona otro modelo de la lista del proveedor. Los catálogos pueden cambiar sin actualizar la aplicación.
- **La clave o el proveedor dejan de recordarse:** comprueba que el navegador permita almacenamiento local y que no se haya borrado el almacenamiento del sitio.

## Créditos

Diseñado por Juan Guillermo Rivera con tecnología GPT-6 Luna y asistencia de OpenCode.
