# Crea tu juego: Memoriza PB

Aplicación web para crear juegos de memoria de parejas con palabras e imágenes relacionadas con un tema. Permite seleccionar la cantidad de parejas, revisar las imágenes antes de jugar, ajustar el tamaño de la grilla y descargar una versión del juego.

## Archivos principales

- `index.html`: aplicación principal.
- `ejemplo1.html`, `ejemplo2.html` y `ejemplo3.html`: ejemplos o variantes del juego.
- `isotipo.png`: imagen que aparece en el reverso de las tarjetas.
- `logoPB0.png`: logo fijo en la esquina superior izquierda.
- `logo_escuela.png`: logo fijo en la esquina superior derecha.
- `bien.mp3` y `error.mp3`: sonidos del juego.

## Cómo se usa

1. Abre `index.html` en un navegador.
2. Escribe el tema del juego. Si lo dejas vacío, se utiliza el tema `animales`.
3. Selecciona el número de parejas: `8`, `10`, `12` o `16`. La opción predeterminada es `8`.
4. Selecciona el estilo artístico de las imágenes.
5. Pulsa **Iniciar Juego** y espera a que se generen las palabras y las imágenes.
6. Revisa las imágenes generadas. Puedes editar el texto asociado, regenerar una imagen o subir una imagen propia.
7. Pulsa **Aprobar imágenes y Jugar** para iniciar la partida.

## Durante la partida

- Haz clic en dos tarjetas para descubrirlas.
- Si forman una pareja, quedan descubiertas; si no, se vuelven a ocultar.
- El contador muestra los movimientos y las parejas encontradas.
- Utiliza el botón de tema claro/oscuro para cambiar la apariencia.
- Utiliza el deslizador **Tamaño de la grilla** para reducir o ampliar las tarjetas entre el `70%` y el `140%`.
- El número de columnas se adapta automáticamente al número de parejas para evitar huecos. En pantallas pequeñas se usan cuatro columnas para mejorar la lectura.
- Pulsa **Jugar de Nuevo** para volver a mezclar las tarjetas.

## Descargar el juego

Cuando la partida esté preparada:

1. Ajusta el zoom de la grilla si lo deseas.
2. Pulsa **Descargar Juego**.
3. Abre el archivo HTML descargado.

La descarga convierte a Base64 las imágenes del juego y los logos, incluido `isotipo.png`. También incrusta el isotipo dentro del código que crea las tarjetas, por lo que los recursos locales no son necesarios junto al HTML descargado.

El archivo descargado conserva el tema, la cantidad de parejas, la distribución de la grilla y el nivel de zoom seleccionado.

## Requisitos y notas

- Para generar palabras e imágenes, la aplicación necesita conexión a Internet y acceso a los servicios de Proyecto Descartes.
- Los archivos `isotipo.png`, `logoPB0.png` y `logo_escuela.png` deben permanecer en el mismo directorio que `index.html` al utilizar la aplicación original.
- El juego ya descargado puede abrirse como un archivo independiente porque sus imágenes y logos se incrustan en Base64.
