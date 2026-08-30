# 🛠️ DevSuite: Visor de Markdown, Validador de JSON & Visor LaTeX

**DevSuite** es una aplicación web *standalone* ligera, portátil e interactiva diseñada para facilitar la edición, previsualización y validación de archivos **Markdown**, **JSON** y **LaTeX** en tiempo real. 

Funciona directamente desde el navegador en un solo archivo HTML, sin necesidad de instalaciones, Node.js ni servidores backend.

---

## ✨ Características Principales

### 📝 1. Visor y Editor de Markdown
* **Edición con sintaxis coloreada:** Colores inspirados en Notepad++ (encabezados en naranja, texto en negrita en azul, fragmentos de código en verde).
* **Previsualización HTML en tiempo real:** Renderizado instantáneo utilizando la hoja de estilos oficial de GitHub (*GitHub Markdown CSS*).
* **Carga de archivos:** Abre archivos `.md`, `.markdown` o `.txt` directamente desde tu equipo.

### 🔍 2. Validador y Formateador de JSON
* **Validación instantánea:** Detecta errores de sintaxis mientras escribes y muestra un estado claro (**JSON VÁLIDO** / **JSON INVÁLIDO**).
* **Resaltado de líneas con error:** Marca en rojo la línea exacta donde el analizador detecta el fallo sintáctico.
* **Detección inteligente de comas sobrantes (*Trailing Commas*):** Identifica automáticamente cuando el error es causado por una coma sobrante antes de un cierre `}` o `]` y señala la línea exacta del origen.
* **Herramientas rápidas:** 
  * **Dar formato (*Pretty Print*):** Identación automática a 2 espacios.
  * **Minificar:** Comprime el JSON eliminando espacios y saltos de línea.

### ∑ 3. Visor LaTeX (KaTeX)
* **Renderizado KaTeX en tiempo real:** Convierte expresiones matemáticas escritas en LaTeX a HTML+MathML conforme escribes.
* **Modo *displayMode*:** Alterna entre fórmulas en línea (`displayMode` desactivado) y en bloque centrado (`displayMode` activado).
* **Editor con resaltado sintáctico:** Edición de código LaTeX con CodeMirror (modo `stex`).
* **Carga de archivos:** Abre archivos `.tex` o `.txt` directamente desde tu equipo.
* **Librerías locales:** KaTeX (con soporte de química *mhchem*) se incluye desde la subcarpeta `latex/`, sin depender de CDN.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5 / CSS3 / JavaScript (ES6+)**: Estructura, diseño responsivo por paneles y lógica pura de cliente.
* **[CodeMirror 5](https://codemirror.net/5/)**: Editor de código embebido con soporte para numeración de líneas y resaltado sintáctico.
* **[Marked.js](https://marked.js.org/)**: Convertidor ultrarrápido de Markdown a HTML.
* **[GitHub Markdown CSS](https://github.com/sindresorhus/github-markdown-css)**: Estilos para la previsualización fiel a la interfaz de GitHub.
* **[KaTeX](https://katex.org/)**: Renderizador de fórmulas matemáticas en el navegador (local, en `latex/`).

---

## 🚀 Cómo Ejecutar la Aplicación

No requiere ningún proceso de compilación ni dependencias locales.

1. Descarga o clona este repositorio.
2. Abre el archivo **`index.html`** haciendo doble clic en él o arrastrándolo a cualquier navegador web moderno (*Google Chrome, Mozilla Firefox, Microsoft Edge, Safari*).
3. ¡Listo! Utiliza las pestañas superiores para alternar entre el visor de Markdown, el validador de JSON y el visor LaTeX.

> **Nota:** La subcarpeta `latex/` es necesaria, ya que contiene las librerías KaTeX que usa el visor LaTeX.

---

## 📂 Estructura del Proyecto

```text
├── index.html        # Aplicación completa (HTML, CSS y JS integrado)
├── README.md         # Documentación del proyecto
└── latex/            # Librerías KaTeX locales (css, js, katex, fonts)