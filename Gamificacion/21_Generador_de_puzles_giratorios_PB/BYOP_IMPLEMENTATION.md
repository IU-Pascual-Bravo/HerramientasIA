# Guía de Implementación: Flujo "Bring Your Own Pollen" (BYOP)

Esta guía detalla cómo implementar el flujo de autorización de Pollinations en aplicaciones web. Este flujo permite que los usuarios obtengan y vinculen su clave API de manera fluida, mejorando la experiencia de usuario (UX) y reduciendo errores manuales.

---

## 🚀 Conceptos Base

El flujo BYOP (Bring Your Own Pollen) de Pollinations permite a las aplicaciones solicitar una clave API directamente a través de una interfaz de autorización oficial. Existen dos métodos principales de implementación:

1.  **Flujo de Redirección (Redirect Flow)**: El usuario es redirigido a Pollinations y luego de vuelta a tu aplicación con la clave en el fragmento de la URL (#).
2.  **Flujo de Ventana Emergente (Popup Flow)**: Se abre una pequeña ventana para la autorización y se comunica con la ventana principal mediante mensajes.

---

## 🛠️ Implementación Técnica (Flujo de Redirección)

Este es el método más robusto para dispositivos móviles y el implementado actualmente en este proyecto.

### 1. Interfaz de Usuario (HTML)
Se recomienda un diseño que integre el campo de entrada manual con un botón de obtención automática.

```html
<div class="api-key-container">
    <input type="password" id="apiKeyInput" placeholder="plln_sk_...">
    <button id="getApiKeyBtn">
        <i class="fas fa-key"></i> Obtener API Key
    </button>
</div>
```

### 2. Disparar el Flujo (JavaScript)
Al hacer clic en el botón, redirigimos al usuario a la URL de autorización.

```javascript
function startAuthFlow() {
    // La URL de redirección debe ser la misma donde se encuentra tu app
    const redirectUrl = window.location.href.split('#')[0];
    
    // Redirigir a Pollinations
    window.location.href = `https://enter.pollinations.ai/authorize?redirect_url=${encodeURIComponent(redirectUrl)}`;
}
```

### 3. Capturar y Persistir la Clave
Al regresar, la clave vendrá en el hash de la URL: `tu-app.com/#api_key=plln_sk_...`

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const apiKey = hashParams.get('api_key');

    if (apiKey) {
        // 1. Guardar en el input
        document.getElementById('apiKeyInput').value = apiKey;
        
        // 2. Persistir para futuras sesiones
        localStorage.setItem('pollinations_api_key', apiKey);

        // 3. Limpiar la URL (Estética y Seguridad)
        window.history.replaceState(null, null, window.location.pathname + window.location.search);
        
        // 4. Notificar al usuario (Opcional)
        console.log('API Key obtenida con éxito');
    }
});
```

---

## ⚡ Flujo Alternativo: Ventana Emergente (Popup)

Ideal para SPAs (Single Page Applications) donde no se desea recargar el estado de la aplicación.

```javascript
function openAuthPopup() {
    const width = 500, height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    const popup = window.open(
        'https://pollinations.ai/c/Bring%20Your%20Own%20Pollen',
        'PollinationsAuth',
        `width=${width},height=${height},top=${top},left=${left}`
    );

    // Escuchar el mensaje desde el popup
    window.addEventListener('message', (event) => {
        // IMPORTANTE: Verificar el origen por seguridad
        if (event.origin !== 'https://pollinations.ai') return;

        if (event.data && event.data.type === 'api_key' && event.data.key) {
            const receivedKey = event.data.key;
            document.getElementById('apiKeyInput').value = receivedKey;
            localStorage.setItem('pollinations_api_key', receivedKey);
            popup.close();
        }
    }, { once: true });
}
```

---

## 💎 Mejores Prácticas y Seguridad

> [!IMPORTANT]
> **Seguridad de la Clave**: Nunca envíes la clave API a un servidor propio a menos que sea estrictamente necesario para un proxy. Prefiere el uso directo desde el cliente (Frontend-only).

- **Validación**: Asegúrate de que el campo de la clave no esté vacío antes de enviarlo.
- **Persistencia Seleccionada**: Usa `localStorage` para persistencia prolongada o `sessionStorage` si prefieres que la clave se borre al cerrar la pestaña.
- **Feedback Visual**: Muestra una notificación clara (success/error) cuando el flujo se complete.
- **Carga Inicial**: En `DOMContentLoaded`, verifica siempre el `localStorage` para autocompletar el campo.

---

## 🔍 Solución de Problemas (Troubleshooting)

| Problema | Causa Probable | Solución |
| :--- | :--- | :--- |
| El hash no aparece | `redirect_url` incorrecto | Asegúrate de que `redirectUrl` coincida exactamente con la URL cargada. |
| El input no se actualiza | El DOM no está listo | Coloca la lógica de captura dentro de un listener de `DOMContentLoaded`. |
| La clave se pierde al refrescar | Falta persistencia | Asegúrate de llamar a `localStorage.setItem`. |
| Bloqueo de Popup | Configuración del navegador | En el flujo de redirección no hay este problema, por eso es el preferido. |

---

## 🗂️ Checkpoint de Integración

- [ ] Botón "Obtener API Key" agregado a la UI.
- [ ] Función de redirección apuntando a `https://enter.pollinations.ai/authorize`.
- [ ] Lógica de captura de URL Fragment implementada.
- [ ] Limpieza de URL via `history.replaceState`.
- [ ] Persistencia en `localStorage`.
- [ ] Soporte multi-idioma para etiquetas y notificaciones.