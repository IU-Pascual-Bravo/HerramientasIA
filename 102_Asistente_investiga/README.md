# Asistente de Proyectos de Investigación

Aplicación web para generar títulos y perfiles de proyectos de investigación con ayuda de distintos proveedores de inteligencia artificial.

## Características

- Selección de un tema y una población o ámbito de estudio.
- Generación de títulos académicos.
- Creación de un perfil de investigación con:
  - Título.
  - Objetivo general.
  - Objetivos específicos.
  - Justificación.
  - Variables independiente y dependiente.
  - Enfoque metodológico sugerido.
- Generación de preguntas de investigación.
- Exportación del informe en HTML y PDF.
- Selección entre varios proveedores de IA.
- Guardado local de las claves API en el navegador.
- Cambio entre modo claro y modo oscuro, con persistencia de la preferencia.
- Logos institucionales de Pascual Bravo y de la escuela en la cabecera.

## Archivos principales

| Archivo | Descripción |
| --- | --- |
| `index.html` | Aplicación completa: estructura, estilos y lógica JavaScript. |
| `logoPB1.png` | Logo de Pascual Bravo. |
| `logo_escuela.png` | Logo de la escuela. |
| `Modelo_logos/` | Aplicación de referencia para el uso de los logos. |
| `gifanimadoRedProyecto.gif` | Recurso gráfico anterior, conservado en el directorio. |

## Uso

1. Abra `index.html` en un navegador moderno.
2. Use el botón **🌙 Modo oscuro** ubicado en la esquina superior derecha para activar el tema oscuro. El botón cambia a **☀️ Modo claro** para volver al tema claro.
3. Seleccione el proveedor de IA.
4. Si el proveedor lo requiere, introduzca su clave API y pulse **Validar**.
5. Seleccione el tema, la población o ámbito, el número de títulos y el modelo de IA.
6. Pulse **Generar Títulos**.
7. Seleccione un título de la lista o introduzca uno manualmente usando el número `0`.
8. Pulse **Generar Perfil**.
9. Cuando el perfil esté listo, pulse **Generar Preguntas de Investigación**.
10. Descargue el resultado en formato HTML o PDF.

## Proveedores disponibles

La aplicación contempla los siguientes proveedores:

- Red Descartes, sin clave API.
- Google AI Studio.
- Mistral AI.
- Cohere.
- Groq.
- Pollinations AI.
- OpenRouter.
- DeepSeek.

Las claves introducidas se almacenan únicamente en el `localStorage` del navegador actual. No se incluyen en los archivos del proyecto.

## Dependencias externas

La aplicación carga desde CDN:

- Tailwind CSS.
- `html2canvas`.
- `jsPDF`.

Por tanto, se necesita conexión a Internet para cargar esas librerías y para consultar los proveedores de IA.

## Nota de seguridad

No comparta sus claves API. Si utiliza un equipo compartido, elimine la clave con el botón **Limpiar** y cierre la sesión del navegador al terminar.

## Autoría

Diseñado por Juan Guillermo Rivera Berrío.
