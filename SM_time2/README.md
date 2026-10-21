# Generador de Cuestionarios con IA

Una aplicación interactiva que genera cuestionarios dinámicos enriquecidos con imágenes utilizando inteligencia artificial. Soporta múltiples proveedores de IA con gestión flexible de modelos y API keys.

## 🎯 Características Principales

### 📚 Generación de Cuestionarios
- **Preguntas dinámicas** generadas por IA basadas en cualquier tema
- **Respuestas múltiples** (4 opciones por pregunta)
- **Imágenes descriptivas** generadas automáticamente para cada pregunta
- **Formato JSON** robusto con manejo automático de errores
- **Cuestionarios descargables** en HTML independiente

### 🤖 Soporte Multi-Proveedor
La app funciona con 3 proveedores de IA diferentes:

| Proveedor | Modelos Texto | Modelos Imagen | API Key |
|-----------|---------------|----------------|---------|
| **Red Descartes** | OpenAI, Gemini, Mistral | zimage, flux, gptimage, klein | No requerida |
| **Pollinations** | GPT-5.4, GPT-5.6, Kimi, Grok, Mistral, Gemini (6 opciones) | 10 opciones profesionales | Requerida |
| **OpenRouter** | DeepSeek, Gemini, GPT, Llama, Mistral, Minimax, Qwen, GLM, Enrutador libre (11 opciones) | Gemini, GPT, Klein, Grok, Recraft, Seedream, Flux (10 opciones) | Requerida |

### 🎨 Personalización
- **Selector de modelos de imagen** con vista previa de opciones
- **Selector de modelos de texto** adaptado por proveedor
- **Paletas de colores** múltiples (oscuro, claro, profesional, etc.)
- **Soporte multiidioma** (Español, Inglés, Francés)

### ⏱️ Características Avanzadas
- **Timer configurable** con barra de progreso visual
- **Sistema de puntuación** en tiempo real
- **Retroalimentación inmediata** (correcto/incorrecto)
- **Progreso del cuestionario** visible
- **Modo de práctica** sin límite de tiempo

### 🔒 Gestión de Seguridad
- **Validación de API keys** contra cada proveedor
- **Almacenamiento local** en localStorage (navegador)
- **Limpieza fácil** de credenciales guardadas
- **Preferencias persistentes** del usuario

## 🚀 Inicio Rápido

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a Internet
- API keys opcionales según el proveedor elegido

### Pasos
1. Abre `index.html` en tu navegador
2. Selecciona un proveedor (Red Descartes es libre)
3. Para proveedores pagos, ingresa tu API key y valida
4. Selecciona:
   - Tema del cuestionario
   - Número de preguntas
   - Modelo de imagen (opcional)
   - Modelo de texto (opcional)
5. Haz clic en **Generar Cuestionario**
6. Responde las preguntas usando el timer

### Archivos Incluidos
```
SM_time2/
├── index.html                    # Aplicación principal
├── README.md                     # Este archivo
├── README.html                   # Versión HTML del README
├── gifanimadoRedProyecto.gif    # Logo en la app
├── quiz-dioses-griegos.html     # Ejemplo de cuestionario
├── quiz-la-iliada.html          # Ejemplo de cuestionario
├── quiz-planetas-del-universo.html # Ejemplo de cuestionario
└── Modelo2/                      # Aplicación alternativa
    ├── app.js
    ├── index.html
    └── styles.css
```

## 🔧 Configuración de Proveedores

### Red Descartes (Recomendado para empezar)
✅ **Gratis** - No requiere API key

```
Endpoint: https://node.proyectodescartes.org/api/ia/text
Modelos de texto: openai, gemini-fast, mistral, deepseek
Modelos de imagen: zimage, flux, gptimage, klein
```

**Ventajas:**
- Completamente gratuito
- Respuestas rápidas
- Sin registro necesario

### Pollinations
🔑 **Requiere API key** - [Obtener en enter.pollinations.ai](https://enter.pollinations.ai/authorize)

```
Endpoint: https://gen.pollinations.ai/v1/chat/completions
Modelos de texto: 6 opciones incluida GPT-5.4 Nano
Modelos de imagen: 10+ opciones profesionales
```

### DeepSeek
❌ **Eliminado** - No tiene modelos de imagen integrados

### OpenRouter
🔑 **Requiere API key** - [Obtener en openrouter.ai/keys](https://openrouter.ai/keys)

```
Endpoint Texto: https://openrouter.ai/api/v1/chat/completions
Endpoint Imagen: https://openrouter.ai/api/v1/chat/completions (multimodal)

Modelos de Texto (11 opciones):
• deepseek/deepseek-chat-v3-0324 (DeepSeek V3)
• deepseek/deepseek-v4-flash (DeepSeek V4 Flash)
• google/gemini-2.5-flash (Gemini 2.5 Flash)
• openai/gpt-5-mini (GPT 5 Mini)
• moonshotai/kimi-k2.6 (Kimi k2.6)
• meta-llama/llama-3.3-70b-instruct (Llama 3.3 70B)
• minimax/minimax-m3 (Minimax M3)
• mistralai/mistral-small-2603 (Mistral 4 Small)
• qwen/qwen3.5-flash-02-23 (Qwen 3.5 Flash)
• z-ai/glm-4.7-flash (GLM 4.7 Flash)
• openrouter/free (Enrutador libre - para créditos limitados)

Modelos de Imagen (10 opciones):
• google/gemini-2.5-flash-image (Gemini 2.5 Flash - multimodal)
• openai/gpt-5-image-mini (GPT Image mini - multimodal)
• google/gemini-3.1-flash-image-preview (Gemini 3.1 - multimodal)
• openai/gpt-5.4-image-2 (GPT Image 2 - multimodal)
• black-forest-labs/flux.2-klein-4b (Klein - puro imagen)
• microsoft/mai-image-2.5 (MAI Image - puro imagen)
• x-ai/grok-imagine-image-quality (Grok xAI - puro imagen)
• recraft/recraft-v4.1-vector (Recraft V4.1 - puro imagen)
• bytedance-seed/seedream-4.5 (Seedream - puro imagen)
• black-forest-labs/flux.2-flex (Flux.2 Flex - puro imagen)
```

**Nota:** OpenRouter maneja automáticamente modelos multimodales vs. puros imagen mediante el parámetro `modalities`.

## 💾 Gestión de API Keys

### Guardar una API Key
1. Selecciona el proveedor
2. Ingresa tu API key en el campo
3. Haz clic en **Validar** para verificar
4. Se guardará automáticamente en tu navegador

### Validar una API Key
- Haz clic en el botón **Validar** junto a tu API key
- La app contactará el proveedor para confirmar validez
- Verás un mensaje de éxito o error

### Limpiar una API Key
- Haz clic en el botón **Limpiar**
- Se eliminará del navegador (no del proveedor)

### Seguridad
- Las API keys se almacenan **localmente** en tu navegador
- **No se envían** a servidores externos
- Usa siempre navegadores de confianza
- Revoca keys en el panel de cada proveedor si es necesario

## 📝 Uso de la Aplicación

### Pantalla de Configuración

```
[Logo] Generador de Cuestionarios con IA

🌍 Idioma: [Español ▼]

Proveedor: [Red Descartes ▼]
🔑 API Key de Red Descartes (opcional): [________] [Validar] [Limpiar]

🖌️ Modelo de imagen · Red Descartes: [zimage ▼]
🧠 Modelo de texto · Red Descartes: [openai ▼]

📌 Tema: [Ejemplo: Historia, Ciencia, Literatura]
📊 Número de preguntas: [5 ▼]
⏱️ Límite de tiempo: [30 seg ▼]

[Generar Cuestionario]
```

### Pantalla de Quiz

```
Pregunta 1 de 5

[Imagen generada]

¿Pregunta?
○ Opción A
○ Opción B (Respuesta correcta)
○ Opción C
○ Opción D

[⏱️ 28s] [Siguiente]
```

### Pantalla de Resultados

```
¡Quiz Completado!

Puntuación: 4/5 (80%)

[Descarga Quiz] [Regenerar Imágenes] [Cambiar Paleta] [Empezar de Nuevo]
```

## 🎨 Características de Diseño

### Paletas de Color
- **Moderno**: Gradiente púrpura-azul
- **Oscuro**: Tema nocturno
- **Claro**: Tema minimalista
- **Profesional**: Tema corporativo

### Selecciones Rápidas
- Cambiar paleta: Botón **Cambiar Paleta**
- Regenerar imágenes: Botón **Regenerar Imágenes**
- Descargar: Botón **Descargar Quiz** (HTML independiente)

## 🐛 Resolución de Problemas

### "Error 401" en la API
**Problema:** API key inválida o expirada

**Solución:**
1. Haz clic en **Limpiar** para eliminar la key
2. Obtén una nueva key del proveedor
3. Ingresa la nueva key y valida
4. Intenta de nuevo

### "No se encuentra array JSON"
**Problema:** La API retornó un formato inesperado

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca mensajes de error detallados
3. Verifica que:
   - El proveedor esté disponible
   - Tu API key sea válida
   - Tengas conexión a Internet
4. Intenta con otro tema o proveedor

### Las imágenes no se generan
**Problema:** Error en la generación de imágenes

**Solución:**
1. Verifica que el modelo de imagen sea válido
2. Intenta con otro modelo
3. Haz clic en **Regenerar Imágenes** manualmente
4. Comprueba tu conexión a Internet

### El timer no funciona
**Problema:** JavaScript deshabilitado

**Solución:**
1. Asegúrate que JavaScript está habilitado en tu navegador
2. Recarga la página (Ctrl+F5 o Cmd+Shift+R)
3. Intenta en otro navegador

## 🔨 Desarrollo Técnico

### 🔌 Integración con Proveedores

### Endpoints Utilizados

**Red Descartes (Free):**
- Texto: `https://node.proyectodescartes.org/api/ia/text`
- Imagen: `https://node.proyectodescartes.org/api/ia/image`

**Pollinations:**
- Texto: `https://gen.pollinations.ai/v1/chat/completions`
- Imagen: `https://enter.pollinations.ai/api/generate/image/`

**OpenRouter:**
- Texto e Imagen: `https://openrouter.ai/api/v1/chat/completions`

## Stack de Tecnología
- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **APIs:** REST (Red Descartes, Pollinations, OpenRouter)
- **Almacenamiento:** localStorage para API keys y preferencias
- **Formato:** JSON para preguntas, Base64 para imágenes

### Estructura del Código

**DOM Principal:**
```javascript
const dom = {
  topicInput,        // Input para el tema
  numQuestionsSelect, // Selector de cantidad
  generateBtn,       // Botón generar
  setupContainer,    // Pantalla de setup
  quizContainer,     // Pantalla de quiz
  // ... más referencias
};
```

**Estado Global:**
```javascript
let state = {
  generatedQuestions: [],  // Array de preguntas
  currentQuestion: 0,      // Índice actual
  score: 0,                // Puntuación
  totalQuestions: 0,       // Total
  lang: 'es',              // Idioma
  provider: 'free',        // Proveedor actual
  // ... más propiedades
};
```

**Catálogos de Modelos:**
```javascript
const MODEL_CATALOGS = {
  free: { imageLabel, textLabel, images: [], text: [] },
  pollinations: { ... },
  deepseek: { ... },
  openrouter: { ... }
};
```

### Funciones Principales

| Función | Propósito |
|---------|-----------|
| `fetchQuiz()` | Genera preguntas vía API |
| `generateImage()` | Crea imágenes para cada pregunta |
| `startQuiz()` | Inicia el cuestionario |
| `checkAnswer()` | Valida la respuesta |
| `showQuestion()` | Muestra pregunta + imagen |
| `downloadQuiz()` | Exporta como HTML |

### Manejo de Errores

La app incluye:
- ✅ Try-catch en todas las llamadas API
- ✅ Validación de respuestas
- ✅ Fallback automático de formatos JSON
- ✅ Reparación de JSON truncado
- ✅ Logging detallado en consola

## 📱 Compatibilidad

| Navegador | Versión | Estado |
|-----------|---------|--------|
| Chrome | 90+ | ✅ Completo |
| Firefox | 88+ | ✅ Completo |
| Safari | 14+ | ✅ Completo |
| Edge | 90+ | ✅ Completo |
| IE 11 | - | ❌ No soportado |

## 🌐 Idiomas Soportados

- 🇪🇸 **Español** (por defecto)
- 🇬🇧 **English**
- 🇫🇷 **Français**

## 📊 Ejemplos de Uso

### Generar un quiz sobre Historia
1. Selecciona **Red Descartes** (gratis)
2. Ingresa tema: "Revolución Francesa"
3. Preguntas: 5
4. Modelo imagen: "zimage"
5. Modelo texto: "openai"
6. ¡Generar!

### Generar un quiz con Pollinations
1. Selecciona **Pollinations**
2. Ingresa tu API key (obtén en enter.pollinations.ai)
3. Valida la key
4. Ingresa tema: "Inteligencia Artificial"
5. Preguntas: 10
6. Modelo imagen: "flux.2-pro"
7. Modelo texto: "GPT-5.4 Nano"
8. ¡Generar!

## 🎁 Funciones Bonus

### Descargar Quiz
- Genera un archivo HTML independiente
- Incluye todas las preguntas e imágenes
- Funciona sin conexión a Internet
- Mantiene la puntuación local

### Regenerar Imágenes
- Vuelve a generar todas las imágenes
- Útil si una imagen es de baja calidad
- Mismo tema, nuevas imágenes

### Cambiar Paleta
- Alterna entre 4 temas de color
- Cambio instantáneo sin recargar
- Preferencia guardada

### Restaurar Proveedor
- La app recuerda tu último proveedor
- Se restaura automáticamente al abrir

## 📞 Soporte

### Recursos
- 📖 Documentación API: Ver sitios de cada proveedor
- 🐛 Consola del navegador (F12) para mensajes de error
- 💬 Comunidades: Busca en Stack Overflow, Reddit

### Proveedores
- **Red Descartes:** https://proyectodescartes.org
- **Pollinations:** https://enter.pollinations.ai
- **DeepSeek:** https://deepseek.com
- **OpenRouter:** https://openrouter.ai

## 📄 Licencia

Este proyecto es de código abierto. Siéntete libre de:
- ✅ Modificar y mejorar
- ✅ Redistribuir
- ✅ Usar comercialmente
- ✅ Integrar en otros proyectos

## 🙏 Agradecimientos

Agradecemos a:
- **Proyecto Descartes** por proporcionar una API gratuita
- **Pollinations** por su plataforma de generación
- **DeepSeek** y **OpenRouter** por sus modelos
- **La comunidad de IA** por sus contribuciones

---

**Versión:** 1.0  
**Última actualización:** Octubre 2026  
**Mantenidor:** Red Descartes Team

¡Diviértete creando cuestionarios! 🎉
