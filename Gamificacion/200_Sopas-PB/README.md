# Generador de sopas de letras

Aplicación web para crear sopas de letras a partir de un tema. La aplicación consulta un modelo de inteligencia artificial para generar las palabras, construye la cuadrícula y permite jugarla o descargarla como un archivo HTML independiente.

## Uso

1. Abre `index.html` en un navegador moderno.
2. Selecciona el idioma y el modelo de texto.
3. Escribe un tema, ajusta el tamaño de la cuadrícula y el número de palabras.
4. Pulsa **Generar sopa**.
5. Selecciona las palabras en la cuadrícula y, cuando quieras, pulsa **Descargar sopa**.

Para evitar restricciones del navegador con peticiones `fetch`, es recomendable servir la carpeta mediante un servidor web local en lugar de abrir el archivo directamente. Por ejemplo, con Python:

```bash
python -m http.server 8000
```

Después, visita `http://localhost:8000/`.

## Archivos principales

- `index.html`: aplicación principal.
- `logoPB0.png`: logo situado en la esquina superior izquierda.
- `logo_escuela.png`: logo situado en la esquina superior derecha.
- `generador_sopa_letras_Gemini.html`: versión anterior del generador.

## Requisitos

- Navegador con soporte para HTML5, CSS3 y JavaScript moderno.
- Conexión a internet para consultar `https://node.proyectodescartes.org/api/ia/text`.
- Un modelo de texto compatible con la API configurada.

La aplicación no necesita un proceso de compilación ni dependencias locales.
