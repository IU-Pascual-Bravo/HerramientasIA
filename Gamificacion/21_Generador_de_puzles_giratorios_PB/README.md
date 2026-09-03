# Generador de Puzles Giratorios

Aplicación web educativa que genera una imagen a partir de un tema y la transforma en un puzzle giratorio interactivo. Cada pieza puede rotarse individualmente hasta completar la imagen.

## Características

- Generación de imágenes mediante el servicio de IA de Proyecto Descartes.
- Puzzles de `3x3`, `4x4`, `5x5`, `6x6` o `7x7` piezas.
- Rotación de las piezas haciendo clic sobre ellas.
- Detección automática de puzzle completado.
- Zoom del tablero con la rueda del ratón, entre `50 %` y `200 %`.
- Reinicio del puzzle conservando la imagen actual.
- Descarga de una versión HTML autónoma del puzzle.
- Diseño adaptable para pantallas pequeñas.
- Logotipos institucionales en las esquinas superiores.

## Uso

1. Escribe un tema en el campo de texto, por ejemplo: `un bosque mágico`.
2. Pulsa **Generar** y espera a que se cree la imagen.
3. Selecciona el tamaño del puzzle.
4. Haz clic en las piezas para girarlas en intervalos de 90 grados.
5. Cuando todas las piezas estén orientadas correctamente, aparecerá el mensaje de felicitación.
6. Usa **Reiniciar Puzzle** para volver a mezclar las orientaciones.
7. Usa **Descargar Puzzle** para guardar una copia HTML jugable.

También puedes desplazar la rueda del ratón sobre el tablero para acercar o alejar la vista.

## Ejecución

La aplicación no requiere instalación de dependencias ni proceso de compilación. Puede abrirse mediante un servidor web local.

### Opción recomendada: Visual Studio Code

Abre la carpeta en Visual Studio Code y ejecuta `index.html` con una extensión de servidor local, como **Live Server**.

### Con Python

Si Python está instalado, ejecuta desde esta carpeta:

```bash
python -m http.server 8000
```

Después abre en el navegador:

```text
http://localhost:8000
```

Es preferible utilizar un servidor local en lugar de abrir el archivo directamente, ya que la aplicación realiza peticiones HTTP al servicio de generación de imágenes.

## Servicio de imágenes

Las imágenes se solicitan mediante una petición `POST` a:

```text
https://node.proyectodescartes.org/api/ia/image
```

La aplicación envía el texto indicado por el usuario junto con estos parámetros:

- Modelo: `zimage`
- Resolución: `1024x1024`
- Semilla aleatoria para cada generación
- Mejora y refinado desactivados
- Logotipo del proveedor desactivado

El servicio debe estar disponible y permitir peticiones desde el navegador para que la generación funcione correctamente.

## Estructura del proyecto

```text
.
├── index.html
├── logoPB0.png
├── logo_escuela.png
└── README.md
```

- `index.html`: interfaz, estilos y lógica completa de la aplicación.
- `logoPB0.png`: logotipo institucional situado en la esquina superior izquierda.
- `logo_escuela.png`: logotipo de la Escuela de Pensamiento Educativo y Pedagógico situado en la esquina superior derecha.
- `README.md`: documentación del proyecto.

## Tecnologías

- HTML5
- CSS3
- JavaScript ejecutado en el navegador
- Fetch API
- Canvas y Blob URLs del navegador para preparar la descarga

## Consideraciones

- La primera carga genera automáticamente una imagen utilizando un prompt predeterminado.
- Cambiar el tamaño del puzzle vuelve a distribuir las piezas usando la imagen actual.
- La descarga incorpora la imagen como Base64, por lo que el archivo descargado no depende del servicio para volver a mostrar esa imagen.
- La generación de nuevas imágenes requiere conexión a Internet.
- Las imágenes generadas se mantienen en memoria mediante una Blob URL durante la sesión.
