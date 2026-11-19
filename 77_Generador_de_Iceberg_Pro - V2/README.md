# Generador de Iceberg Pro

Aplicación web autónoma para crear **icebergs educativos** con niveles de profundidad creciente, imágenes generadas por IA, actividades de pensamiento crítico, citas bibliográficas y cuestionarios.

El objetivo no es solo generar una página vistosa: es producir un **material formativo** que un estudiante pueda leer, cuestionar y citar, y que un docente pueda imprimir, adaptar y evaluar.

## Roles de uso

| Rol | Dónde trabaja | Qué hace |
|---|---|---|
| **Docente** | `index.html` (la app) | Genera, edita, revisa la vista académica y exporta PDF, HTML académico, Word y HTML interactivo. |
| **Alumnado** | **HTML interactivo** descargado | Responde los cuestionarios, ve su puntuación y descarga su **Resumen CSV**, **Detalle CSV** o **JSON**. |
| **Docente** | Su hoja de cálculo o app de rúbrica | Importa el CSV/JSON del alumno, registra la nota y evalúa con su rúbrica. |

La app también permite responder los cuestionarios, pero eso es una **vista previa de prueba para el docente**. El recorrido del alumno es el HTML interactivo, que no necesita API Key ni la app.

> Los cuestionarios son formativos y se ejecutan en el navegador. Un HTML interactivo contiene las respuestas correctas en su código; para evaluaciones de alto impacto conviene usar un LMS o un servidor.

## Características

- Genera entre 3 y 5 niveles, con tres entradas por nivel.
- Incluye objetivos de aprendizaje, activación de conocimientos previos y cierre metacognitivo.
- Desarrolla cada entrada con explicación, conceptos relacionados, preguntas socráticas, actividad, transferencia y evaluación formativa.
- Crea dos preguntas de selección múltiple por entrada y un cuestionario final con al menos una pregunta por nivel; si el modelo devuelve menos, se completa con preguntas de las entradas y se avisa.
- Equilibra la longitud de las opciones para reducir pistas involuntarias.
- Genera imágenes en distintos estilos y permite regenerarlas individualmente.
- Permite cambiar la paleta de colores con énfasis en contraste y legibilidad.
- Incluye modo claro y modo oscuro.
- Permite editar manualmente las introducciones de los niveles y de las entradas.
- **Documento académico HTML** con portada, ficha pedagógica, índice, referencias, clave de respuestas, rúbrica y guía docente.
- **Imágenes del documento académico** centradas y con tamaño máximo proporcionado, tanto en HTML/PDF como en Word visual y Word.
- **PDF académico** mediante la vista de impresión del documento.
- **Word real (.docx)** con estilos, índice, paginación, imágenes, tablas y propiedades del documento.
- **Word visual (.doc)** con el documento académico ya renderizado por MathJax; útil para ver las fórmulas en Word.
- **HTML interactivo** independiente para el aula.
- Renderiza expresiones matemáticas con MathJax.

## Progresión cognitiva

La metáfora del iceberg organiza la profundidad, pero la exigencia intelectual sigue una secuencia de pensamiento crítico:

| Nivel | Metáfora | Enfoque cognitivo |
|---|---|---|
| 1 | La Superficie | Identificar y contextualizar: hechos visibles, definiciones y contexto. |
| 2 | Aguas Poco Profundas | Explicar y relacionar: causas, consecuencias y mecanismos. |
| 3 | La Zona de Penumbra | Analizar e interpretar: debates, intereses y diferencia entre hecho e interpretación. |
| 4 | El Abismo | Evaluar evidencias: calidad de fuentes, sesgos y argumentos rivales. |
| 5 | El Vacío Insondable | Crear y revisar: síntesis, propuestas, incertidumbre y metacognición. |

Los títulos y las entradas se generan con ese enfoque, no con criterios de oscuridad, conspiración o terror. Así el iceberg no premia lo sensacionalista, sino la profundidad del razonamiento.

## Fuentes y referencias

El modo **Fuentes verificables** solo aparece para modelos con consulta web. Cuando se activa:

- La IA debe consultar fuentes reales y no inventar URLs, autores, títulos, fechas o DOI.
- Las introducciones y las explicaciones incluyen **marcadores de cita** `[[n]]` que la app convierte en citas APA.
- La app distingue entre **referencias citadas** (las que sostienen afirmaciones del texto) y **fuentes consultadas** (todas las que el modelo declaró haber consultado).
- Si una entrada no tiene citas verificables, se advierte en el documento en lugar de inventar una referencia.
- Las referencias finales se ordenan alfabéticamente y se muestran con sangría francesa.
- Si no se puede verificar una fuente, se omite.

> Importante: una bibliografía final no sustituye a las citas en el texto. La app intenta que cada afirmación factual tenga su cita; si el modelo no la aporta, el documento lo advierte para que el docente lo revise.

## Documento académico

El documento académico se construye a partir de un modelo de datos, no clonando el HTML interactivo. Incluye:

1. Portada con título, autoría, institución, área, fecha, versión y licencia.
2. Ficha pedagógica con propósito, uso sugerido, objetivos, conocimientos previos, metodología y evaluación.
3. Índice.
4. Niveles con introducción y entradas.
5. Cuestionario final.
6. Cierre metacognitivo.
7. Referencias citadas.
8. Anexos: clave de respuestas, rúbrica, guía docente, fuentes consultadas y créditos de imágenes.

El HTML académico se puede imprimir o guardar como PDF desde el navegador. El DOCX se genera con la librería `docx` y se descarga como `.docx` real.

## Formatos Word

| Formato | Qué es | Cuándo usarlo |
|---|---|---|
| **Word (.docx)** | Documento Word real, editable, con estilos, índice, tablas y paginación. | Para editar la estructura, la rúbrica o la portada. Las fórmulas LaTeX se conservan como texto TeX. |
| **Word visual (.doc)** | HTML del documento académico ya renderizado por MathJax, guardado con extensión `.doc`. | Para ver las fórmulas en Word o hacer una edición puntual. Word puede avisar de que el formato no coincide con la extensión. |

El **PDF** es la opción recomendada para entregar o imprimir documentos con fórmulas. El **`.doc` visual** no es un Word nativo: es una solución de compatibilidad. Para edición estructural, usa el **`.docx`**.

## Requisitos

- Navegador moderno: Chrome, Edge, Firefox o Safari.
- Conexión a internet para la generación con IA.
- API Key según el proveedor elegido:
  - Red Descartes: no requiere clave.
  - Pollinations: requiere API Key.
  - OpenRouter: requiere API Key.
- Los archivos `academic-export.js` y `vendor/docx.iife.js` deben estar junto a `index.html` para la exportación académica y Word. Si el archivo local de `docx` no está, la app intenta cargarlo desde CDN.

## Uso

1. Abre `index.html` en un navegador.
2. Escribe el tema central.
3. Completa, si quieres, los datos del documento académico (autoría, institución, área y licencia).
4. Selecciona proveedor, profundidad, estilo visual y modelos.
5. Introduce y valida la API Key cuando sea necesario.
6. Activa **Fuentes verificables** si el modelo seleccionado tiene consulta web.
7. Pulsa **Generar Iceberg**.
8. Revisa las introducciones y edítalas si hace falta.
9. Usa **Vista académica** para revisar el documento completo.
10. Usa **PDF académico** para imprimir o guardar como PDF.
11. Usa **Word (.docx)** para descargar el documento editable.
12. Usa **HTML académico** para descargar el documento en HTML.
13. Usa **HTML interactivo** para el iceberg con paneles y cuestionarios.

## Exportación

| Formato | Para qué sirve | Qué conserva |
|---|---|---|
| **Vista académica** | Revisar el documento completo antes de exportar | Portada, ficha, índice, niveles, referencias, anexos |
| **PDF académico** | Entregar o imprimir | Diseño lineal, paginación del navegador, sin paneles |
| **Word (.docx)** | Editar o adaptar | Estilos, índice, imágenes, tablas, clave de respuestas |
| **HTML académico** | Leer o archivar | Documento lineal, sin interacción |
| **HTML interactivo** | Trabajar en pantalla | Paneles desplegables, cuestionarios y retroalimentación |

### HTML interactivo

Conserva niveles, textos, imágenes incrustadas, ediciones manuales, paneles desplegables, cuestionarios y bibliografía. No incluye la configuración ni las API Keys. Es el material para el aula, no el documento formal. Incluye un bloque **Para el profesor** con exportación de resultados en CSV (resumen y detalle) y JSON.

### HTML académico

Es un documento lineal, con portada, índice, citas, clave de respuestas y anexos. No depende de `fondo.jpg` ni de los logos locales. Las imágenes se incrustan como `data:` cuando están disponibles. Es el archivo que se lee, se imprime o se convierte a PDF.

### DOCX

Genera un `.docx` real con:

- Portada y ficha pedagógica.
- Índice actualizable en Word.
- Encabezado, pie y numeración de páginas.
- Imágenes con pie y crédito.
- Cuestionarios y clave de respuestas.
- Tablas de rúbrica.
- Metadatos del documento.

Si Word muestra el índice vacío, actualízalo con `Ctrl+A` y luego `F9`, o con **Referencias > Actualizar tabla**.

### PDF

El PDF se obtiene desde la **vista académica**. El documento usa un diseño claro, con saltos de página por nivel, portada, índice y anexos. Al pulsar **PDF académico** se abre la vista y se intenta abrir el diálogo de impresión. Si el navegador lo bloquea, pulsa el botón **“Imprimir o guardar como PDF”** de la barra superior y elige “Guardar como PDF”. El nombre propuesto es `Iceberg_academico_<tema>.pdf`; si imprimes desde **Vista académica**, el nombre es `Iceberg_vista_academica_<tema>.pdf`.

### Nombres de archivo

Los nombres se limitan a unos 80 caracteres para evitar el aviso de Windows de “acorte el nombre del archivo”. Se conserva la extensión y se eliminan acentos y caracteres inválidos.

| Exportación | Nombre propuesto |
|---|---|
| HTML académico | `Iceberg_academico_<tema>.html` |
| PDF académico | `Iceberg_academico_<tema>.pdf` |
| PDF desde Vista académica | `Iceberg_vista_academica_<tema>.pdf` |
| Word (.docx) | `Iceberg_word_<tema>.docx` |
| Word visual (.doc) | `Iceberg_word_visual_<tema>.doc` |
| HTML interactivo | `Iceberg_interactivo_<tema>.html` |

El apelativo va **al principio** del nombre y el título se limita a unos 24 caracteres, para que el apelativo no se pierda cuando Windows acorta el final en rutas largas.

El **título interno** del HTML/PDF académico se mantiene completo en la portada y en el cuerpo. El nombre de archivo se acorta solo en la pestaña y en el diálogo de guardado.

## Resultados de los cuestionarios

Los resultados se calculan en el navegador mientras se responde. En la app aparecen en el panel **Resultados** y en la barra flotante **Resultados: X / Y**. No se guardan en el servidor ni en `localStorage`: al recargar o regenerar el iceberg se reinician.

Cada **HTML interactivo** exportado es un documento independiente: empieza con los cuestionarios a cero y guarda sus propias respuestas en esa pestaña. Responder en la app no modifica el HTML exportado, y responder en el HTML exportado no modifica la app.

## Exportar resultados para el profesor

El HTML interactivo está pensado para que cada estudiante lo use de forma independiente. Al final, en **Resultados**, hay un bloque **“Para el profesor”** con:

- **Resumen CSV**: una fila por estudiante, con aciertos y total por nivel, cuestionario final, total, preguntas respondidas y porcentaje.
- **Detalle CSV**: una fila por pregunta, con nivel, número, pregunta, opción elegida, opción correcta, acierto y explicación.
- **JSON**: la misma información estructurada, para una app de rúbrica o un procesamiento propio.

Flujo recomendado:

1. El estudiante abre su HTML interactivo y responde.
2. Escribe su nombre (opcional) en **“Nombre del estudiante”**.
3. Pulsa **Resumen CSV**, **Detalle CSV** o **JSON**.
4. Envía el archivo al profesor.
5. El profesor importa el CSV en su hoja de cálculo o el JSON en su app de rúbrica.

El resumen está pensado para **acumular filas de varios estudiantes** en una sola hoja. El detalle permite revisar pregunta por pregunta. Los CSV incluyen BOM UTF-8 para Excel y protegen las celdas que podrían interpretarse como fórmulas.

## Expresiones matemáticas

La app y el HTML académico cargan MathJax con estos delimitadores:

- `\( ... \)` y `$ ... $` para matemáticas en línea.
- `\[ ... \]` y `$$ ... $$` para bloques.

La app espera a que MathJax esté disponible antes de componer el iceberg. La vista académica espera a MathJax, a las fuentes y a las imágenes antes de imprimir el PDF.

**Limitación importante:** el DOCX no convierte LaTeX a ecuaciones nativas de Word. Las expresiones se conservan como texto TeX (`\(F=ma\)`, `$x^2$`). Para verlas renderizadas, usa el **PDF**, el **HTML académico** o el **Word visual (.doc)**, que conserva el HTML ya compuesto por MathJax. La app avisa de esta limitación al generar el Word `.docx`.

La app conserva las llaves y los corchetes de LaTeX al limpiar respuestas recuperadas; no convierte `\vec{E}` en `\vec` ni `\frac{a}{b}` en `\frac`. También elimina los espacios de ancho cero y los literales `\u200b` que algunos modelos insertan entre fórmulas. Si aun así aparece un error de sintaxis, la app sustituye el error rojo/amarillo de MathJax por una insignia **“⚠ fórmula no válida”** y muestra el número de fórmulas afectadas. En ese caso, revisa la fórmula o regenera el contenido.

## Proveedores y endpoints

- Red Descartes: `node.proyectodescartes.org`.
- Pollinations: `gen.pollinations.ai`, `enter.pollinations.ai`.
- OpenRouter: `openrouter.ai`.

Las API Keys se guardan en el `localStorage` del navegador por proveedor. No se incorporan a las exportaciones académicas ni al DOCX. En el HTML interactivo, si una imagen remota no se puede incrustar, se elimina en lugar de dejar una URL con clave.

## Solución de problemas

Solo se incluyen incidencias que pueden ocurrir con la versión actual. Las correcciones ya cerradas no se repiten aquí.

| Problema | Acción recomendada |
|---|---|
| Error de IA | Valida la API Key, cambia de modelo y vuelve a intentar. El mensaje ahora incluye el código HTTP. |
| Word no se descarga | Comprueba que `vendor/docx.iife.js` exista o que haya conexión para el CDN. El archivo se descarga como `.docx`, no como `.doc`. |
| El PDF no se descarga | El botón abre la vista académica; pulsa “Imprimir o guardar como PDF” en la barra superior y elige “Guardar como PDF”. |
| No sé qué HTML usar | **HTML académico** es el documento formal para leer/imprimir; **HTML interactivo** es el iceberg con paneles y cuestionarios para el aula. |
| Las fórmulas se ven como TeX en Word | El DOCX no convierte LaTeX a ecuaciones de Word. Usa el PDF, el HTML académico o **Word visual (.doc)**, que conserva las fórmulas renderizadas. |
| Word visual (.doc) avisa del formato | Es un HTML con extensión `.doc`, como el Word de la versión original. Ábrelo igualmente; si necesitas un `.docx` nativo, usa **Word (.docx)**. |
| Word abre sin índice | Actualiza el índice con `Ctrl+A` y `F9`. |
| Imagen que no carga | Usa el botón de regeneración de la entrada o cambia el modelo de imagen. |
| El cuestionario final no cubre todos los niveles | Revisa el aviso que aparece sobre el cuestionario; regenera el iceberg o añade preguntas en las entradas que falten. |
| Bajo contraste | Usa el botón de cambio de paleta y comprueba la legibilidad antes de exportar. |
| La vista académica no abre | Permite ventanas emergentes para el archivo local. También puedes usar **HTML académico** y abrirlo en otra pestaña. |

## Estructura de archivos

- `index.html`: aplicación interactiva.
- `academic-export.js`: modelo y exportadores HTML/DOCX.
- `vendor/docx.iife.js`: librería `docx` para generar Word sin depender del CDN.
- `backups/`: versión anterior conservada para comparar.
- `fondo.jpg`, `logoPB1.png`, `logo_escuela.png`: recursos visuales de la app.
- `Ejemplos/`: ejemplos generados.

`docx` se distribuye con licencia MIT; su código está en `vendor/docx.iife.js`.

## Créditos

Desarrollado para contextos educativos en español en el ecosistema de la Red Descartes.

La revisión de citas, la verificación de fuentes y la adaptación pedagógica son responsabilidad de la autoría del material.
