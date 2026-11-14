# 📚 Análisis Gramatical Interactivo

Una aplicación web educativa que utiliza inteligencia artificial para generar párrafos etiquetados gramaticalmente y crear juegos interactivos para el aprendizaje del análisis sintáctico.

## 🌟 Características Principales

- **Generación automática** de párrafos sobre cualquier tema
- **Etiquetado gramatical** preciso (verbos, sustantivos, adjetivos, preposiciones)
- **Juegos interactivos** en 4 etapas para practicar identificación de palabras
- **Sistema de puntuación** con feedback inmediato
- **Videos relacionados** de Pexels integrados
- **Multiidioma**: Español, Inglés, Francés, Alemán
- **Descarga de ejercicios** en formato HTML standalone
- **Temas de color** personalizables con modo claro/oscuro

## 🚀 Ventajas del Sistema Multi-Proveedor

### 1. **Flexibilidad Total**
- Cambia entre proveedores según tus necesidades sin cambiar de aplicación
- Adapta el proveedor al tipo de tarea (velocidad vs. calidad)
- No dependes de un único servicio

### 2. **Optimización de Costos**
- **Modo Libre**: Sin costos, ideal para pruebas y demos
- **Pollinations**: Gratis con registro, perfecto para uso personal
- **OpenRouter**: Paga solo por lo que usas, acceso a múltiples modelos
- **Groq**: Extremadamente económico para prompts cortos

### 3. **Redundancia y Confiabilidad**
- Si un proveedor tiene problemas, cambia a otro inmediatamente
- Sin interrupciones en tu flujo de trabajo
- Backup automático de API Keys por proveedor

### 4. **Acceso a Diferentes Modelos**
- **Groq**: Ultra-rápido (1000 tokens/seg) para respuestas inmediatas
- **OpenRouter**: Modelos de última generación (GPT-5, Gemini 2.5, DeepSeek)
- **Pollinations**: Variedad equilibrada precio-calidad
- **Libre**: Modelos gratuitos sin límites de prueba

### 5. **Experimentación Sencilla**
- Compara resultados entre diferentes modelos fácilmente
- Encuentra el mejor proveedor para tu caso de uso
- Ajusta según la complejidad del contenido

### 6. **Escalabilidad**
- Comienza gratis en desarrollo
- Escala a proveedores pagos en producción
- Distribuye la carga entre múltiples APIs

### 7. **Control de Privacidad**
- Usa proveedores locales o sin API para contenido sensible
- Elige proveedores con políticas de privacidad específicas
- Mantén el control sobre dónde se procesan tus datos

### 8. **Adaptación Automática**
- Sistema de detección de errores inteligente
- Sugerencias automáticas si un proveedor falla
- Logs detallados para debugging

## 🎯 Proveedores Disponibles

### 🆓 Libre (Sin API Key)
- **Ventaja**: Gratuito, sin registro
- **Ideal para**: Prototipos, demos, aprendizaje
- **Modelos**: GPT 5 Mini, Mistral 3.2, Deepseek V3.2, Perplexity Sonar
- **Backend**: node.proyectodescartes.org

### 🌸 Pollinations AI
- **Ventaja**: Generación de texto e imágenes en una sola plataforma
- **Ideal para**: Proyectos personales, educación
- **API Key**: Gratis con registro en [enter.pollinations.ai](https://enter.pollinations.ai)
- **Modelos**: GPT 5 Mini, Mistral 3.2, Deepseek V3.2, Perplexity Sonar
- **Extra**: Generación de avatares integrada

### 🌐 OpenRouter
- **Ventaja**: Acceso a +100 modelos de múltiples proveedores
- **Ideal para**: Producción, alta calidad
- **API Key**: [openrouter.ai/keys](https://openrouter.ai/keys)
- **Modelos destacados**: 
  - DeepSeek V3/V4 (económico)
  - Gemini 2.5 Flash (Google)
  - GPT-5 Mini (OpenAI)
  - Llama 3.3 70B (Meta)
  - Qwen 3.5 (Alibaba)
- **Precio**: Desde $0.15 por 1M tokens

### �?Groq
- **Ventaja**: Velocidad extrema (hasta 1000 tokens/seg)
- **Ideal para**: Respuestas en tiempo real
- **API Key**: [console.groq.com/keys](https://console.groq.com/keys)
- **Modelos recomendados**:
  - GPT OSS 20B (más rápido)
  - GPT OSS 120B (mejor calidad)
  - Qwen 3.6/3.8 27B
- **Limitación**: Prompts más cortos que otros proveedores
- **Precio**: Desde $0.075 por 1M tokens

## 📋 Casos de Uso por Proveedor

| Caso de Uso | Proveedor Recomendado | Razón |
|-------------|----------------------|-------|
| **Desarrollo/Testing** | Libre | Sin costos, sin configuración |
| **Demos y Presentaciones** | Pollinations | Incluye imágenes, gratis |
| **Producción de Alta Calidad** | OpenRouter | Mejores modelos, confiable |
| **Chatbots en Tiempo Real** | Groq | Ultra-rápido, baja latencia |
| **Proyectos Educativos** | Libre o Pollinations | Gratis, suficiente calidad |
| **Análisis de Documentos** | OpenRouter | Soporte para contexto largo |
| **Respuestas Cortas Rápidas** | Groq | Velocidad incomparable |

## 🛠�?Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet
- (Opcional) API Key del proveedor elegido

### Inicio Rápido

1. **Abrir la aplicación**
   ```
   Abre index.html en tu navegador
   ```

2. **Seleccionar proveedor**
   - Elige "Libre" para empezar sin configuración
   - O selecciona otro proveedor e ingresa tu API Key

3. **Configurar preferencias**
   - Idioma de la interfaz
   - Modelo de lenguaje
   - Dificultad del ejercicio (corto/largo)
   - Activar/desactivar videos

4. **Generar ejercicio**
   - Escribe un tema en el campo de entrada
   - Haz clic en "Enviar"
   - Completa los 4 niveles del juego

### Obtener API Keys

#### Pollinations AI
1. Visita [enter.pollinations.ai](https://enter.pollinations.ai)
2. Haz clic en "Authorize" o usa el botón "Obtener API Key"
3. La key se guardará automáticamente

#### OpenRouter
1. Crea una cuenta en [openrouter.ai](https://openrouter.ai)
2. Ve a [Settings �?Keys](https://openrouter.ai/keys)
3. Crea una nueva API Key (empieza con `sk-or-`)
4. Copia y pega en la aplicación

#### Groq
1. Crea una cuenta en [console.groq.com](https://console.groq.com)
2. Ve a [API Keys](https://console.groq.com/keys)
3. Crea una nueva key (empieza con `gsk_`)
4. Copia y pega en la aplicación

### Verificar API Key

Usa el botón **�?* junto al campo de API Key para verificar que funciona correctamente antes de enviar un mensaje.

## 🎮 Cómo Jugar

1. **Generación**: La IA crea un párrafo sobre tu tema
2. **Nivel 1 - Verbos**: Identifica todos los verbos
3. **Nivel 2 - Sustantivos**: Identifica todos los sustantivos
4. **Nivel 3 - Adjetivos**: Identifica todos los adjetivos
5. **Nivel 4 - Preposiciones**: Identifica todas las preposiciones
6. **Puntuación Final**: Obtén tu promedio de precisión

## 🎨 Personalización

### Temas de Color
- Haz clic en el botón **"Paleta"**
- Cicla entre 9 temas diferentes:
  - Indigo (por defecto)
  - Emerald, Rose, Amber, Sky, Violet, Teal, Crimson
  - Modo Claro

### Configuración Local
Las preferencias se guardan automáticamente:
- Proveedor seleccionado
- API Keys (por proveedor)
- No es necesario reconfigurar cada vez

## 💾 Descargar Ejercicios

Cada ejercicio generado puede descargarse como un archivo HTML independiente:
- Incluye el párrafo completo
- Incluye el video relacionado (si está activado)
- Juego interactivo funcional
- Mantiene el tema de color actual
- No requiere conexión a internet para usar

## 🔧 Arquitectura Técnica

### Patrón de Configuración
```javascript
const PROVIDER_CONFIG = {
    nombre_proveedor: {
        requiresKey: boolean,
        models: [{value, label}],
        keyPlaceholder: string,
        getKeyUrl: string
    }
}
```

### Flujo de Datos
1. Usuario selecciona proveedor �?Actualiza modelos y visibilidad de API Key
2. Usuario ingresa tema �?Se construye prompt específico para el proveedor
3. Llamada a API �?Manejo específico por proveedor
4. Respuesta JSON �?Parsing y extracción de etiquetas
5. Renderizado �?Juego interactivo en 4 etapas

### Almacenamiento
- **localStorage**: API Keys, preferencias de proveedor
- **Caché en memoria**: Avatares generados, estado del juego
- **Sin backend propio**: Todo el procesamiento es client-side

## 🔒 Seguridad y Privacidad

- Las API Keys se almacenan localmente en tu navegador
- No se envían a ningún servidor excepto al proveedor elegido
- Modo "Libre" no requiere API Keys
- Cada proveedor tiene sus propias políticas de privacidad
- Los ejercicios descargados no contienen API Keys

## 🌍 Soporte Multiidioma

### Interfaz Completa
- Español (por defecto)
- English
- Français
- Deutsch

### Generación de Contenido
Los prompts se adaptan automáticamente al idioma seleccionado, asegurando que el análisis gramatical sea correcto para cada lengua.

## 📊 Métricas y Retroalimentación

- **Puntuación por nivel**: 0-100% de precisión
- **Feedback visual**: Colores verde/rojo para correcto/incorrecto
- **Promedio final**: Puntuación global del ejercicio
- **Palabras correctas mostradas**: Aprendizaje progresivo

## 🐛 Solución de Problemas

### "API Key inválida"
- Verifica que copiaste la key completa
- Usa el botón �?para probar la conexión
- Revisa que la key esté activa en el portal del proveedor

### "Respuesta vacía"
- Con Groq: Usa temas más simples o cambia a otro modelo
- Verifica tu conexión a internet
- Prueba con otro proveedor

### Errores de JSON
- Los modelos a veces responden con texto extra
- La app intenta extraer el JSON automáticamente
- Si persiste, prueba otro modelo del mismo proveedor

## 🚀 Extender la Aplicación

### Agregar un Nuevo Proveedor

1. Actualiza `PROVIDER_CONFIG`:
```javascript
nuevo_proveedor: {
    requiresKey: true,
    models: [/* lista de modelos */],
    keyPlaceholder: 'formato...',
    getKeyUrl: 'url...'
}
```

2. Agrega lógica en `generateAIResponse()`:
```javascript
} else if (currentProvider === 'nuevo_proveedor') {
    // Tu implementación aquí
}
```

### Agregar Nuevos Idiomas

1. Extiende el objeto `TRANSLATIONS`
2. Agrega la opción en `languageSelector`
3. Los prompts se adaptarán automáticamente

## 📄 Licencia

Este proyecto fue diseñado por Juan Guillermo Rivera Berrío utilizando tecnología Gemini 2.5 Pro y múltiples APIs de IA.

## 🤝 Contribuciones

Este es un proyecto educativo. Siéntete libre de:
- Usarlo en tus propios proyectos
- Adaptarlo a otras materias (matemáticas, ciencias, etc.)
- Agregar nuevos proveedores de IA
- Mejorar la interfaz o funcionalidad
- Compartir con otros educadores

## 📞 Soporte

Para problemas específicos de cada proveedor:
- **Libre**: Contacta al proyecto Descartes
- **Pollinations**: [pollinations.ai/contact](https://pollinations.ai)
- **OpenRouter**: [openrouter.ai/docs](https://openrouter.ai/docs)
- **Groq**: [console.groq.com/docs](https://console.groq.com/docs)

## 🎓 Créditos

- **APIs de IA**: Pollinations, OpenRouter, Groq, Proyecto Descartes
- **Videos**: Pexels API
- **Diseño**: Inter Font Family (Google Fonts)
- **Concepto y Desarrollo**: Juan Guillermo Rivera Berrío

---

**Versión**: 2.0 - Multi-Proveedor  
**Fecha**: Septiembre 2026  
**Tecnología**: HTML5, CSS3, JavaScript (Vanilla)
