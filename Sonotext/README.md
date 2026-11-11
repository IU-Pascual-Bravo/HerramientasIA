# Sonotext

Aplicación web sencilla para convertir archivos de audio o grabaciones de voz en texto mediante Pollinations AI y modelos compatibles con Whisper.

## Uso pensado para adultos mayores

La interfaz está diseñada para facilitar el acceso a personas adultas mayores:

- Presenta botones y controles grandes, con textos claros y alto contraste.
- Permite elegir entre subir un archivo de audio o grabar directamente con el micrófono.
- Muestra instrucciones visibles sobre cada paso y los formatos admitidos.
- La transcripción aparece en un área amplia para poder leerla y copiarla con comodidad.
- Los logotipos institucionales se muestran junto al título para identificar fácilmente la aplicación.

## Cómo usarla

1. Abre `index.html` en un navegador moderno.
2. Introduce la clave de Pollinations AI en el campo de credenciales. La clave se obtiene en [enter.pollinations.ai](https://enter.pollinations.ai).
3. Selecciona el modelo y, si se desea, el idioma del audio.
4. En **Audio de Entrada**, elige **Subir Archivo** para seleccionar un audio o **Grabar Micrófono** para realizar una grabación.
5. Pulsa el botón de transcripción y espera a que aparezca el texto.
6. Revisa el resultado y utiliza las opciones disponibles para copiarlo o descargarlo.
7. Pulsa **Generar y descargar audio ilustrado** para crear un archivo HTML autocontenido con el audio, las pistas sincronizadas y el resaltado automático durante la reproducción.

## Archivos principales

- `index.html`: aplicación principal.
- `logoPB1.png`: logotipo situado en la esquina superior izquierda de la cabecera.
- `logo_escuela.png`: logotipo situado en la esquina superior derecha de la cabecera.
- `index_transcriptor_modelos_actualizados.html`: versión alternativa con modelos adicionales.
- `index_con_footer.html`: versión alternativa con pie de página.

## Requisitos

- Navegador actualizado con JavaScript habilitado.
- Conexión a Internet para comunicarse con Pollinations AI.
- Permiso del navegador para usar el micrófono cuando se elija la grabación.
- Una clave válida de Pollinations AI.

La clave se utiliza desde el navegador para realizar la solicitud y no se guarda en este proyecto.
