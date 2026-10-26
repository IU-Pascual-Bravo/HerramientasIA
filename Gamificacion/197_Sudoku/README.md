# Sudoku Red Descartes

Sudoku web autocontenido con niveles de dificultad, generación mediante IA y generación local de respaldo. Las soluciones locales se construyen con backtracking aleatorio y las soluciones recibidas de IA se rechazan si presentan patrones visuales repetidos entre los bloques.

## Uso

Abre `index.html` en un navegador. Selecciona el nivel y el modelo de lenguaje, y pulsa **Generar Sudoku**.

Los niveles disponibles son:

- Facil
- Intermedio
- Dificil
- Experto
- Maestro
- Diabolico

El botón **Posibles** aparece cuando no hay jugadas deterministas evidentes. Muestra los candidatos en una matriz 3x3 fija, con los valores `1 2 3`, `4 5 6` y `7 8 9` en sus posiciones correspondientes. Al seleccionar un valor asignado se resaltan sus coincidencias y candidatos.

## Página de prueba

Abre `prueba.html` para comprobar manualmente el funcionamiento de **Posibles** sin depender del backend de IA. Esta página usa un tablero fijo y mantiene el botón habilitado incluso cuando existen jugadas evidentes.

Permite verificar:

- Candidatos en posiciones constantes dentro de cada celda.
- Resaltado de valores asignados y candidatos coincidentes.
- Colocación de valores mediante los botones del teclado o las teclas `1` a `9`.
- Mensajes fugaces `👼` para aciertos y `😈` para errores.
- Borrado y reinicio del tablero de prueba.

## Archivos

- `index.html`: aplicación principal.
- `prueba.html`: tablero de prueba local.
- `Ejemplos/`: ejemplos HTML descargados de partidas anteriores.
