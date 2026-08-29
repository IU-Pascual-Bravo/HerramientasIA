# Evaluación Diagnóstica (Generador con Semáforo de Retroalimentación)

Aplicación web de un solo archivo (`index.html`) que crea **evaluaciones diagnósticas interactivas** con inteligencia artificial. El objetivo no es calificar contenido nuevo, sino detectar **saberes previos** y **concepciones erróneas** antes de enseñar, usando un *semáforo de retroalimentación* (verde / amarillo / rojo) que explica al estudiante por qué cada respuesta es correcta, incompleta o un error conceptual.

No requiere instalación ni servidor propio: se abre directamente en el navegador. La generación de texto e imágenes se realiza a través del servicio de IA de Proyecto Descartes (`node.proyectodescartes.org`), por lo que **necesita conexión a internet**.

---

## Cómo usarla

1. Abre `index.html` en cualquier navegador moderno (doble clic).
2. Rellena los **datos de la evaluación** (los dos primeros son obligatorios):
   - **Materia / Experto** (ej. *Matemáticas*, *Biología*).
   - **Tema o Unidad a evaluar** (ej. *Fracciones*, *Fotosíntesis*).
   - **Número de preguntas** (de 3 a 15; estándar 6).
   - **Tipo de prueba**:
     - *Formativa* → el alumno recibe retroalimentación inmediata al responder.
     - *Sumativa* → el alumno envía la prueba por correo y la retroalimentación queda oculta hasta el envío.
3. (Opcional) Despliega **Personalizar / Afinar Parámetros** para indicar nivel del alumnado, aprendizaje posterior, restricciones, finalidad o pegar/cargar un estándar o criterio curricular (PDF/TXT).
4. (Opcional) En **Configuración del Modelo e Interfaz** elige paleta de colores, estilo visual, modelo de imagen, modelo de texto y si incluir MathJax (fórmulas matemáticas).
5. Elige uno de los **dos modos de generación** (ver abajo) y espera a que la IA genere la evaluación.
6. Cuando termine, descarga los materiales desde los botones que aparecen:
   - **HTML Alumno (Ejecutable)** – cuestionario interactivo para el estudiante.
   - **HTML Profesor (Ficha Técnica)** – con respuestas, distractores y criterios.
   - **Word Profesor** – documento `.docx` de la ficha.

---

## Los dos modos de generación

La aplicación ofrece dos formas de producir la evaluación. Ambos usan los mismos datos de entrada y generan el mismo tipo de producto final (cuestionario + semáforo + ficha de profesor).

### 1. Modo Guiado (Paso a Paso) — botón verde oscuro

Genera la evaluación **por fases, una a una**, mostrando un *stepper* de 4 bloques. Es ideal para revisar y corregir el contenido antes de avanzar:

| Fase | Bloque | Qué genera |
|------|--------|------------|
| 0 | **Contexto Inicial** | Captura materia, tema, nivel, restricciones y estándar. |
| 1 | **Saberes Previos** | Preguntas diagnósticas sobre conocimientos previos y conceptos fundamento. |
| 2 | **Criterios del Semáforo** | Rúbrica verde/amarillo/rojo que define qué demuestra cada nivel de respuesta. |
| 3 | **Cuestionario Diagnóstico** | Cuestionario completo (3 apartados: saberes previos, comprensión aplicada e identificación de concepciones erróneas). |

En cada fase puedes **Confirmar** (guarda la fase y habilita la siguiente) o **Replantear** (regenera esa fase). El stepper marca las fases completadas y conserva lo ya validado, así puedes iterar sin perder el trabajo. Recomendado cuando quieres control fino sobre la prueba o usarla con alumnado real.

### 2. Modo Rápido (1 Clic Directo) — botón naranja

Genera **toda la evaluación completa en una sola llamada** a la IA, sin paradas intermedias. Es la opción más rápida para obtener un borrador terminado de inmediato. Recomendado para prototipar, explorar ideas o cuando no necesitas revisar fase a fase.

> Consejo: usa **Modo Rápido** para iterar rápido y **Modo Guiado** para afinar la versión definitiva que entregarás a tus estudiantes.

---

## Semáforo de Retroalimentación

Cada pregunta clasifica la respuesta del estudiante en uno de tres niveles, con explicación pedagógica automática:

- 🟢 **Verde** – domina el saber previo; se muestran los puntos clave correctos.
- 🟡 **Amarillo** – base intermedia con imprecisiones; se sugiere repaso.
- 🔴 **Rojo** – concepción errónea o ausencia de saber previo; se explica el error conceptual.

En pruebas *formativas* esta retroalimentación aparece al instante; en *sumativas* queda oculta hasta que el alumno envía la prueba por correo.

---

## Archivos del proyecto

- `index.html` — aplicación principal (todo en un archivo: HTML, CSS y JS).
- `index_Elena.html` / `index_v.html` — variantes de la interfaz.
- `ejemplos/` — evaluaciones ya generadas de muestra (conectivismo, constructivismo, IoT, etc.).
- `logo_pascual_bravo.png` / `.svg` — logotipo institucional (puedes reemplazarlo con el botón **Logo**).

---

## Notas

- La evaluación debe medir **exclusivamente saberes previos**, no el contenido nuevo del tema.
- Necesita conexión a internet para la generación (servicio de IA de Proyecto Descartes).
- Modelos de texto disponibles: GPT 5.4 Nano, GPT 5 Nano, Gemini 2.5 Flash y Gemini 2.5 Search.
- Diseñado por Juan Guillermo Rivera Berrío y Elena Álvarez Saiz con tecnología de IA y asistencia de Open Code.
