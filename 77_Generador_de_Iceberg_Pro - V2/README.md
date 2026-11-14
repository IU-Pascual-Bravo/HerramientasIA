# Generador de Iceberg Pro

Aplicación web de un solo archivo (`index.html`) que genera, con IA, un **iceberg de aprendizaje** sobre cualquier tema: niveles de profundidad creciente, imágenes ilustrativas, actividades de pensamiento crítico y **cuestionarios de selección múltiple** con retroalimentación inmediata.

## Características

- **Iceberg por niveles:** de 3 entradas por nivel, desde lo más conocido hasta lo más profundo del tema.
- **Experiencia de aprendizaje completa** en cada entrada:
  - Explicación y conceptos clave con sus relaciones.
  - Pensamiento crítico y evidencias.
  - Preguntas socráticas.
  - Actividad de aprendizaje y transferencia.
  - Evaluación formativa: pregunta de comprobación y **2 preguntas de selección múltiple**.
- **Plan de aprendizaje:** objetivos, activación de conocimientos previos y cierre metacognitivo.
- **Cuestionario final** que evalúa todos los niveles del iceberg.
- **Panel de resultados** al final: puntaje por nivel, del cuestionario final y total en porcentaje.
- **Imágenes con IA** en distintos estilos, regenerables por entrada, con paleta de colores intercambiable.
- **Descarga del iceberg** como HTML independiente.

## Requisitos

- Un navegador moderno (Chrome, Edge, Firefox, Safari).
- Conexión a internet.
- Un proveedor de IA, a elegir en la app:
  - **Red Descartes (gratuito):** no requiere llave.
  - **Pollinations:** requiere API Key (botón **🔑 Obtener** o pegarla manualmente).
  - **OpenRouter:** requiere API Key.

## Uso

1. Abre `index.html` en el navegador (o publícalo en tu servidor).
2. Escribe el **tema** (por ejemplo, *Biología marina*).
3. Elige proveedor, número de niveles, estilo visual y modelos de texto e imagen.
4. Si el proveedor lo requiere, ingresa o valida tu API Key.
5. Pulsa **🔮 Generar Iceberg** y espera a que se generen los niveles y el cuestionario final.
6. Explora cada entrada y responde los cuestionarios:
   - La opción **correcta** se marca en **verde**.
   - Si eliges una incorrecta, se marca en **rojo** y la correcta se muestra en verde, con una explicación.
   - Cada pregunta se responde una sola vez.
7. Revisa el panel **📊 Resultados** al final.

## Descarga del iceberg

El botón **📥 Descargar Iceberg HTML** genera un archivo independiente:

- El **título** de la página y el encabezado son el **tema** del iceberg.
- Las imágenes se incrustan en el archivo (funciona sin conexión).
- Los **cuestionarios se reinician**: no conserva las respuestas dadas en la app.
- Mantiene la interacción: paneles desplegables, ampliación de imágenes, cuestionarios y resultados.
- No incluye el panel de configuración ni las llaves de API.

## Notas técnicas

- Todo el código (HTML, CSS y JavaScript) está en un único archivo, sin dependencias.
- La API Key se guarda en el `localStorage` del navegador, por proveedor, y nunca se incluye en el archivo descargado.
- Las preguntas se piden a la IA en formato JSON; el orden de las opciones se mezcla en cada generación.
- **Opciones equilibradas:** el prompt exige opciones de longitud similar y la app detecta cuando la respuesta correcta es claramente la más larga; en ese caso pide a la IA reescribir los distractores para igualar su extensión y nivel de detalle, evitando que se pueda acertar solo por la longitud.
- Si la IA no devuelve un cuestionario válido para una entrada, esa entrada se muestra sin preguntas de selección múltiple y el resto continúa. Si falla el cuestionario final, se arma con preguntas de las entradas.
- Endpoints usados: `node.proyectodescartes.org` (Red Descartes), `gen.pollinations.ai` y `enter.pollinations.ai` (Pollinations) y `openrouter.ai` (OpenRouter).

## Solución de problemas

| Problema | Posible causa y solución |
|---|---|
| «Error de IA» al generar | Llave inválida o modelo no disponible: valida la llave o cambia de modelo. |
| Imágenes que no cargan | Límite o caída del proveedor: usa **🔄 Regenerar** o cambia el modelo de imagen. |
| Una entrada sin cuestionario | La IA no devolvió el formato esperado: vuelve a generar el iceberg. |
| Los colores del cuestionario no cambian | Recarga la página con `Ctrl + F5` para limpiar la caché. |

## Créditos

Desarrollado para contextos educativos en español, en el ecosistema de la Red Descartes.
