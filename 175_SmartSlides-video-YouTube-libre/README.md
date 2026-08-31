# SlideVision AI

Aplicación web que genera presentaciones de diapositivas automáticamente a partir de videos de YouTube o temas personalizados, utilizando **Pollinations.ai** como backend de IA.

## Utilidad

SlideVision AI convierte cualquier video de YouTube en una presentación visual profesional en minutos. La IA analiza el contenido del video y genera diapositivas con texto e imágenes coherentes, ahorrando horas de trabajo manual en la creación de presentaciones.

### Casos de uso

- Transformar videos educativos o conferencias en presentaciones de estudio
- Crear material visual a partir de videos de YouTube para clases o reuniones
- Generar presentaciones rápidas sobre un tema sin tener que escribir diapositivas manualmente
- Obtener múltiples formatos de salida (ZIP, HTML interactivo, galería)

## Características

- **Entrada por video de YouTube**: pega un enlace y la IA lo analiza automáticamente
- **Entrada por tema personalizado**: escribe un tema y descripción para generar la presentación
- **Vista previa del video**: el video se muestra embebido en el lienzo mientras trabajas
- **Grilla de diapositivas**: todas las diapositivas se generan y muestran en una cuadrícula
- **Regeneración individual**: cada diapositiva tiene su propio botón "Regenerar"
- **Paleta de colores**: 8 paletas predefinidas que se aplican en tiempo real
- **Estilos visuales**: 14 estilos de diseño (Profesional, Corporativo, Futurista, Académico, etc.)
- **Relación de aspecto**: 16:9, 4:3, A4, 9:16
- **Editor JSON**: el JSON generado es editable antes de generar las diapositivas
- **Modal de imagen ampliada**: haz clic en cualquier diapositiva para verla a pantalla completa
- **Descargas**:
  - ZIP con todas las imágenes
  - Presentación interactiva HTML con 25 transiciones
  - Galería de imágenes HTML

## Instrucciones de uso

### 1. Obtener API Key

1. Haz clic en **"Obtener"** junto al campo de API Key
2. Serás redirigido a Pollinations.ai para autorizar la aplicación
3. Copia la API Key generada y pégala en el campo

### 2. Elegir fuente de contenido

**Opción A — Video de YouTube:**
1. Pega el enlace del video en el campo **"Enlace de video (YouTube)"**
2. El video se cargará automáticamente en el lienzo de vista previa
3. Se mostrará el título y autor del video

**Opción B — Tema personalizado:**
1. Escribe un tema en el campo **"Tema Central de la Presentación"**
2. Opcionalmente añade una **descripción/enfoque** para guiar a la IA

> Nota: ambas opciones son mutuamente excluyentes. Si usas YouTube, el campo Tema se desactiva.

### 3. Configurar la presentación

- **Número de diapositivas**: ajusta la cantidad (por defecto 10)
- **Relación de aspecto**: elige entre 16:9, 4:3, A4 o 9:16
- **Estilo visual**: selecciona el diseño que prefieras
- **Paleta de colores**: haz clic en el botón superior para cambiar la paleta

### 4. Generar JSON

1. Haz clic en **"1. Crear JSON prompting"**
2. Espera a que la IA genere la estructura JSON
3. El JSON aparecerá en el editor de texto — puedes editarlo manualmente si lo deseas

### 5. Generar diapositivas

1. Haz clic en **"2. Generar diapositivas"**
2. Las diapositivas se generarán una por una con una barra de progreso
3. Una vez listas, aparecerán en una cuadrícula
4. Haz clic en **"Regenerar"** en cualquier diapositiva para mejorarla individualmente
5. Haz clic en cualquier imagen para verla ampliada

### 6. Descargar

- **ZIP**: descarga todas las imágenes como archivos JPG
- **Presentación Interactiva**: descarga un HTML con navegación entre diapositivas y transiciones aleatorias
- **Galería de Imágenes**: descarga un HTML con todas las diapositivas en una galería responsive

## Tecnología

- **Frontend**: HTML, CSS, JavaScript vanilla (sin frameworks)
- **Backend de IA**: Pollinations.ai (API de generación de texto e imágenes)
- **Descargas**: JSZip para empaquetado ZIP
- **Sin servidor**: todo se ejecuta en el navegador del cliente

## Requisitos

- Navegador web moderno (Chrome, Edge, Firefox, Safari)
- Conexión a internet
- API Key gratuita de Pollinations.ai

---

Diseñado por Juan Guillermo Rivera Berrío
