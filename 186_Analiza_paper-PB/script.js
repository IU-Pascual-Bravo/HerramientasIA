document.addEventListener('DOMContentLoaded', () => {
    // PDF Upload Elements
    const pdfUploadInput = document.getElementById('pdf-upload-1');
    const pdfStatusDisplay = document.getElementById('pdf-status-1');
    const togglePdfButton = document.getElementById('toggle-pdf-viewer-button-1');

    const selectPdfBtn = document.getElementById('select-pdf-btn');
    const loadedPdfNamesContainer = document.getElementById('loaded-pdf-names');

    selectPdfBtn.addEventListener('click', () => {
        pdfUploadInput.click();
    });

    const questionInput = document.getElementById('question-input');
    const sendButton = document.getElementById('send-button');
    const sendButtonText = document.getElementById('send-button-text');
    const chatDisplay = document.getElementById('chat-display');
    const loadingSpinner = document.getElementById('loading-spinner');

    const newChatButton = document.getElementById('new-chat-button');
    const toggleThemeButton = document.getElementById('toggle-theme-button');
    const pdfViewerContainer = document.getElementById('pdf-viewer-container');
    const pdfIframe = document.getElementById('pdf-iframe');
    const downloadWordBtn = document.getElementById('download-word-btn');
    const downloadHtmlBtn = document.getElementById('download-html-btn');
    const modelSelector = document.getElementById('model-selector');
    const questionsSelector = document.getElementById('questions-selector');

    // Preguntas propuestas
    const proposedQuestions = {
        "malinterpretado": "Explícame este artículo como lo haría alguien que lo ha malinterpretado. ¿Cuál es la idea errónea más común?",
        "revisor_externo": "Si fueras un revisor externo que intentara encontrar fallos en este artículo, ¿qué señalarías?",
        "importancia_practica": "Para cada punto principal, explícame por qué es importante en la práctica. Si no lo es, dilo.",
        "suposicion_invalidante": "¿Cuál es la única suposición que, de ser errónea, invalidaría todo este argumento?",
        "objeciones": "Estoy a punto de hablar de este artículo con alguien que no está de acuerdo. Indícame sus posibles objeciones y cómo respondería yo.",
        "desactualizado": "¿Qué afirmaciones de este artículo tienen más probabilidades de estar desactualizadas y por qué?",
        "opinion_generalizada": "¿En qué se diferencia la opinión de este artículo de la opinión generalizada sobre este tema?",
        "preguntas_ocultas": "¿Qué preguntas debería hacerme sobre este artículo que probablemente no se me hayan ocurrido?",
        "pruebas_demoledoras": "¿Qué pruebas, de existir, harían que este argumento se desmoronara?",
        "terminos_tecnicos": "Extraiga todos los términos técnicos y defínalos en lenguaje sencillo, ordenándolos según la frecuencia con la que aparecen.",
        "contradicciones": "¿Hay algún punto en este artículo que parezca contradecirse con otro? ¿Dónde?",
        "dialogo": "Escribe esto como un diálogo entre dos personas con puntos de vista diferentes, basándote en el artículo.",
        "diapositiva": "Si solo pudieras mostrar una diapositiva para resumir esto, ¿qué contendría?",
        "analogia": "¿Se utiliza alguna analogía o metáfora en esta fuente? Si no, sugiera una que sea apropiada.",
        "cobertura_faltante": "¿Qué esperarías que cubriera una fuente como esta que no cubre?",
        "investigacion_futura": "Basándonos en esta fuente, ¿qué temas o preguntas valdría la pena investigar a continuación?",
        "avances_recientes": "Si este artículo se publicara hoy, ¿cómo cambiarían las conclusiones debido a los avances tecnológicos o sociales recientes?",
        "contexto_opuesto": "¿Cómo se aplicarían las conclusiones de este artículo en un entorno con recursos limitados o en un contexto cultural totalmente opuesto?",
        "reproducibilidad": "Si intentara reproducir este estudio exactamente, ¿qué información me faltaría?",
        "sesgos_ocultos": "¿Qué sesgos podrían haber influido en los resultados, incluso si los autores no los mencionan?",
    };

    let pdfTextContent = "";
    let currentPdfName = "";
    let currentPdfFileUrl = null;

    let isProcessing = false;
    let isPdfViewerVisible = false;
    let conversationHistory = [];
    
    // Avatar URLs - generated without exposing API key
    function getAvatarUrl(type) {
        const currentModel = modelSelector.value || 'gemini-flash-lite';
        let seed = 888;

        const modelSeeds = {
            'openai': 888,
            'openai-fast': 818,
            'gemini-flash-lite': 808,
            'gemini-search': 928,
            'nova-fast': 948,
            'perplexity-fast': 908,
            'deepseek': 938,
        };

        seed = modelSeeds[currentModel] || 888;

        if (type === 'bot') {
            return `https://enter.pollinations.ai/api/generate/image/AI%20bot%20asistente?width=150&height=150&model=flux&seed=${seed}`;
        } else if (type === 'user') {
            return `https://enter.pollinations.ai/api/generate/image/perfil%20de%20un%20investigador?width=150&height=150&model=flux&seed=${seed}`;
        }
        return '';
    }

    // ----- Theme Management -----
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            toggleThemeButton.textContent = '☀️ Tema';
        } else {
            document.body.classList.remove('dark-mode');
            toggleThemeButton.textContent = '🌙 Tema';
        }
    }

    function toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }
    
    toggleThemeButton.addEventListener('click', toggleTheme);
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // ----- Modelos autorizados -----
    const authorizedModels = {
        text: ["openai", "mistral", "gemini-fast", "openai-fast", "gemini-search", "nova-fast", "perplexity-fast", "deepseek"],
    };

    function populateModels() {
        modelSelector.innerHTML = '';
        authorizedModels.text.forEach(m => {
            const option = document.createElement('option');
            option.value = m;
            option.textContent = m;
            modelSelector.appendChild(option);
        });
    }
    populateModels();

    // ----- PDF and Chat Handling -----
    if (pdfUploadInput) {
        pdfUploadInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                handlePdfUpload(e);
                e.target.value = null;
            }
        });
    }

    sendButton.addEventListener('click', handleSendQuestion);
    questionInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (!sendButton.disabled) handleSendQuestion();
        }
    });

    newChatButton.addEventListener('click', resetChat);
    if (togglePdfButton) {
        togglePdfButton.addEventListener('click', togglePdfViewer);
    }

    downloadHtmlBtn.addEventListener('click', downloadSessionHtml);
    downloadWordBtn.addEventListener('click', downloadSessionWord);

    // Event listener para preguntas propuestas
    questionsSelector.addEventListener('change', (e) => {
        const selectedQuestion = e.target.value;
        if (selectedQuestion && proposedQuestions[selectedQuestion]) {
            questionInput.value = proposedQuestions[selectedQuestion];
            questionInput.focus();
        }
    });

    function resetChat() {
        pdfTextContent = "";
        currentPdfName = "";
        if (currentPdfFileUrl) {
            URL.revokeObjectURL(currentPdfFileUrl);
            currentPdfFileUrl = null;
        }
        
        if (pdfStatusDisplay) pdfStatusDisplay.textContent = "";
        if (pdfUploadInput) pdfUploadInput.value = null;
        if (togglePdfButton) {
            togglePdfButton.disabled = true;
            togglePdfButton.textContent = 'Ver PDF';
        }

        loadedPdfNamesContainer.innerHTML = '';
        selectPdfBtn.disabled = false;
        selectPdfBtn.textContent = 'Seleccionar PDF';

        conversationHistory = [];
        systemPromptBase = '';

        chatDisplay.innerHTML = '<div class="system-message">Por favor, carga un PDF para comenzar.</div>';
        questionInput.value = "";
        questionsSelector.value = "";
        questionInput.disabled = true;
        sendButton.disabled = true;
        downloadWordBtn.disabled = true;
        downloadHtmlBtn.disabled = true;

        if (pdfViewerContainer.classList.contains('visible')) {
             pdfViewerContainer.classList.remove('visible');
        }
        pdfIframe.src = 'about:blank'; 
        isPdfViewerVisible = false;
    }
    
    function togglePdfViewer() {
        if (!currentPdfFileUrl) return;
        
        if (isPdfViewerVisible) {
            pdfViewerContainer.classList.remove('visible');
            isPdfViewerVisible = false;
            togglePdfButton.textContent = 'Ver PDF';
        } else {
            pdfViewerContainer.classList.add('visible');
            pdfIframe.src = currentPdfFileUrl;
            isPdfViewerVisible = true;
            togglePdfButton.textContent = 'Ocultar PDF';
        }
    }

    function extractAuthorFromPdfText(pdfText) {
        // Tomar solo las primeras 3000 caracteres donde suelen estar los metadatos
        const header = pdfText.substring(0, 3000);

        const patterns = [
            // "Author(s)/Autor(es): Apellido, Nombre; Apellido2, Nombre2"
            /(?:authors?|autores?)[:\s]+([^\n\r]{5,120})/i,
            // Línea con varios apellidos en mayúsculas seguidos de iniciales: SMITH J, DOE A
            /^([A-ZÁÉÍÓÚÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*)*(?:\s*[,;]\s*[A-ZÁÉÍÓÚÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*)*)+)/m,
            // Apellido, Nombre y Apellido, Nombre (con coma invertida estilo APA)
            /([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+,\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ.]+(?:\s*[,;&]\s*[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+,\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ.]+)*)/,
            // Nombre Apellido clásico (al menos dos palabras con mayúscula)
            /^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){1,3})/m,
        ];

        for (const pattern of patterns) {
            const match = header.match(pattern);
            if (match && match[1]) {
                const raw = match[1].trim().replace(/[:\d\.\(\)\[\]]/g, '').trim();
                if (raw.length > 3) return raw;
            }
        }
        return null;
    }

    function formatDocumentName(fileName, rawAuthor) {
        if (!rawAuthor) {
            return fileName.replace(/\.pdf$/i, '').replace(/_/g, ' ');
        }

        // Separar múltiples autores por coma, punto y coma o &
        const parts = rawAuthor
            .split(/[,;](?=\s*[A-ZÁÉÍÓÚÑ])|(?:\s+[y&]\s+)/)
            .map(p => p.trim())
            .filter(p => p.length > 2);

        // Extraer solo el apellido (primera palabra significativa de cada parte)
        const surnames = parts.map(p => {
            // Si viene "Apellido, Nombre" tomar la primera parte
            const commaIdx = p.indexOf(',');
            const base = commaIdx > 0 ? p.substring(0, commaIdx).trim() : p.split(/\s+/)[0];
            return base;
        }).filter(Boolean);

        if (surnames.length === 0) return rawAuthor;
        if (surnames.length === 1) return surnames[0];
        if (surnames.length === 2) return `${surnames[0]} y ${surnames[1]}`;
        return `${surnames[0]}, ${surnames[1]} y otros`;
    }

    function handlePdfUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const isValidPdf = file.name && (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));

        if (!isValidPdf) {
            pdfStatusDisplay.textContent = `"${file.name}" no es válido.`;
            pdfStatusDisplay.style.color = "var(--danger-color)";
            return;
        }

        currentPdfName = file.name;
        if (currentPdfFileUrl) URL.revokeObjectURL(currentPdfFileUrl);
        currentPdfFileUrl = URL.createObjectURL(file);

        const tag = document.createElement('span');
        tag.className = 'pdf-loaded-tag';
        tag.title = file.name;
        tag.textContent = file.name;
        loadedPdfNamesContainer.innerHTML = '';
        loadedPdfNamesContainer.appendChild(tag);

        pdfStatusDisplay.textContent = "Procesando...";
        pdfStatusDisplay.style.color = "var(--warning-color)";
        addMessageToChat("Cargando " + file.name + "...", "system");
        togglePdfButton.disabled = false;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const typedarray = new Uint8Array(e.target.result);
            try {
                const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                let text = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    textContent.items.forEach(item => text += item.str + " ");
                    text += "\n"; 
                }
                
                pdfTextContent = text;
                
                pdfStatusDisplay.textContent = "Lista!";
                pdfStatusDisplay.style.color = "var(--success-color)";
                questionInput.disabled = false;
                sendButton.disabled = false;
                addMessageToChat(`"${file.name}" está listo.`, "system");
                questionInput.focus();
            } catch (error) {
                console.error("Error al procesar PDF:", error);
                pdfStatusDisplay.textContent = "Error al procesar.";
                pdfStatusDisplay.style.color = "var(--danger-color)";
                pdfTextContent = ""; 
                if (currentPdfFileUrl) { 
                    URL.revokeObjectURL(currentPdfFileUrl); 
                    currentPdfFileUrl = null; 
                }
                addMessageToChat("Error procesando PDF: " + error.message, "system error");
                togglePdfButton.disabled = true;
                loadedPdfNamesContainer.innerHTML = '';
            }
        };
        reader.readAsArrayBuffer(file);
    }

    let systemPromptBase = '';

    function buildSystemPrompt() {
        const maxSinglePdfLength = 400000;
        const author = extractAuthorFromPdfText(pdfTextContent);
        const docName = formatDocumentName(currentPdfName, author);
        let combinedText = `=== DOCUMENTO: ${docName} ===\n`;
        combinedText += pdfTextContent.length > maxSinglePdfLength
            ? pdfTextContent.substring(0, maxSinglePdfLength) + "... (truncado)\n\n"
            : pdfTextContent + "\n\n";

        systemPromptBase = `Eres un asistente de investigación académica. Al responder, SIEMPRE cita las fuentes usando el apellido del autor tal como aparece en la etiqueta "=== DOCUMENTO: <nombre> ===" de cada texto. Nunca uses expresiones genéricas como "en el documento", "el texto dice" o "según el documento". En su lugar usa el nombre del autor directamente, por ejemplo: "Según García y López...", "Para Martínez y otros...", "Como señala Smith...". Si el documento no tiene autor identificable, usa el título abreviado del archivo. Responde siempre en español con rigor académico.\n\n${combinedText}`;
    }

    async function handleSendQuestion() {
        const question = questionInput.value.trim();

        if (!question || !pdfTextContent || isProcessing) {
            if (!pdfTextContent) addMessageToChat("Por favor, carga un PDF primero.", "system error");
            return;
        }

        addMessageToChat(question, 'user');
        questionInput.value = '';
        isProcessing = true;
        sendButton.disabled = true;
        questionInput.disabled = true;
        loadingSpinner.style.display = 'inline-block';
        sendButtonText.textContent = 'Enviando';

        addMessageToChat("Pensando...", "bot", true);

        // Build system prompt with PDF on first question only
        if (!systemPromptBase) {
            buildSystemPrompt();
        }

        conversationHistory.push({ role: 'user', content: question });

        // Build prompt: include PDF context only on first exchange, then just conversation
        let fullPrompt;
        if (conversationHistory.length <= 2) {
            // First turn: system prompt + user question
            fullPrompt = systemPromptBase + '\n\n';
            fullPrompt += `Usuario: ${question}\n\n`;
        } else {
            // Subsequent turns: last few exchanges to keep size manageable
            fullPrompt = systemPromptBase + '\n\n';
            fullPrompt += `Instrucción: Usa el documento mencionado arriba para responder. Mantén el contexto de la conversación previa.\n\n`;
            // Take only last 4 messages to avoid prompt bloat
            const recentHistory = conversationHistory.slice(-4);
            recentHistory.forEach(msg => {
                if (msg.role === 'user') {
                    fullPrompt += `Usuario: ${msg.content}\n\n`;
                } else if (msg.role === 'assistant') {
                    fullPrompt += `Asistente: ${msg.content}\n\n`;
                }
            });
        }
        fullPrompt += 'Asistente:';

        const apiUrl = `https://node.proyectodescartes.org/api/ia/text`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: modelSelector.value || 'openai',
                    prompt: fullPrompt
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorBody = "No se pudo obtener detalles del error.";
                try { errorBody = await response.text(); } catch (e) { }
                throw new Error(`Error del servidor: ${response.status}. ${errorBody.substring(0, 200)}`);
            }

            let botResponse = await response.text();
            botResponse = botResponse.trim();

            if (!botResponse) {
                botResponse = "La IA no proporcionó una respuesta o la respuesta fue vacía.";
            }

            updateLastBotMessage(botResponse);
            conversationHistory.push({ role: 'assistant', content: botResponse });

        } catch (error) {
            clearTimeout(timeoutId);
            console.error("Error al contactar el backend:", error);
            if (error.name === 'AbortError') {
                updateLastBotMessage("Lo siento, el servidor tardó demasiado en responder. Intenta con una pregunta más corta o recarga el PDF.");
            } else {
                updateLastBotMessage(`Lo siento, ocurrió un error: ${error.message}. Intenta de nuevo.`);
            }
            conversationHistory.pop();
        } finally {
            isProcessing = false;
            sendButton.disabled = false;
            questionInput.disabled = false;
            loadingSpinner.style.display = 'none';
            sendButtonText.textContent = 'Enviar';
            questionInput.focus();

            downloadWordBtn.disabled = false;
            downloadHtmlBtn.disabled = false;
        }
    }

    function addMessageToChat(message, sender, isThinking = false) {
        const messageElement = document.createElement('div');
        let innerMessage = message;
        
        const userAvatarUrl = getAvatarUrl('user');
        const botAvatarUrl = getAvatarUrl('bot');

        messageElement.classList.add(sender === 'user' ? 'user-message' : (sender.includes('system') ? 'system-message' : 'bot-message'));
        if(sender.includes('error')) messageElement.classList.add('error');
        
        if (sender === 'bot' && !isThinking) {
            innerMessage = marked.parse ? marked.parse(message) : message;
            const currentModel = modelSelector.value || 'Modelo no seleccionado';
            messageElement.innerHTML = `
                <div class="message">
                    <img src="${botAvatarUrl}" class="avatar-img" alt="Bot Avatar">
                    <div class="message-bubble bot-bubble">
                        <strong>Chatbot:</strong> 
                        <div style="margin-top:5px;">${innerMessage}</div>
                        <div style="margin-top:10px; font-size:0.8em; color:var(--secondary-color); font-style:italic;">
                            Modelo: ${currentModel}
                        </div>
                    </div>
                </div>
            `;
        } else if (sender === 'bot' && isThinking) {
            messageElement.innerHTML = `
                <div class="message">
                    <img src="${botAvatarUrl}" class="avatar-img" alt="Bot Avatar">
                    <div class="message-bubble bot-bubble">
                        <strong>Chatbot:</strong> 
                        <span class="thinking-animation">${message}</span>
                    </div>
                </div>
            `;
            messageElement.id = "thinking-message"; 
        } else if (sender === 'user') {
            messageElement.innerHTML = `
                <div class="message user-message">
                    <div class="message-bubble user-bubble">${innerMessage}</div>
                    <img src="${userAvatarUrl}" class="avatar-img" alt="User Avatar">
                </div>
            `;
        } else {
            messageElement.textContent = message;
        }
        
        chatDisplay.appendChild(messageElement);
        chatDisplay.scrollTop = chatDisplay.scrollHeight; 
    }

    function updateLastBotMessage(message) {
        const thinkingMessageElement = document.getElementById('thinking-message');
        if (thinkingMessageElement) {
            const innerMessage = marked.parse ? marked.parse(message) : message;
            
            const botAvatarUrl = getAvatarUrl('bot');

            const currentModel = modelSelector.value || 'Modelo no seleccionado';
            thinkingMessageElement.innerHTML = `
                <div class="message">
                    <img src="${botAvatarUrl}" class="avatar-img" alt="Bot Avatar">
                    <div class="message-bubble bot-bubble">
                        <strong>Chatbot:</strong> 
                        <div style="margin-top:5px;">${innerMessage}</div>
                        <div style="margin-top:10px; font-size:0.8em; color:var(--secondary-color); font-style:italic;">
                            Modelo: ${currentModel}
                        </div>
                    </div>
                </div>
            `;
            thinkingMessageElement.removeAttribute('id'); 
        } else {
            addMessageToChat(message, 'bot');
        }
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }
    
    resetChat(); 

    // --- Download feature ---
    function getSessionHTML() {
        const clone = chatDisplay.cloneNode(true);
        // Clean up unneeded classes or fix styles for export if needed
        return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Analiza artículo PDF - Sesión</title>
                <style>
                    body { font-family: sans-serif; line-height: 1.6; padding: 20px; color: #333; }
                    .user-message { background-color: #007bff; color: white; padding: 10px; border-radius: 8px; margin-bottom: 10px; max-width: 80%; margin-left: auto; text-align: right; }
                    .bot-message { background-color: #e9ecef; color: #343a40; padding: 10px; border-radius: 8px; margin-bottom: 10px; max-width: 80%; }
                    .system-message { text-align: center; color: #666; font-style: italic; margin-bottom: 10px; }
                    pre { background: #333; color: #fff; padding: 10px; border-radius: 5px; overflow-x: auto; }
                    code { background: #eee; padding: 2px 4px; border-radius: 3px; }
                    .bot-message code { background: #d0d0d0; }
                </style>
            </head>
            <body>
                <h2>Sesión de Chat - Analiza artículo PDF</h2>
                <p>Archivo cargado: ${currentPdfName || 'Ninguno'}</p>
                <hr>
                <div class="chat-container">
                    ${clone.innerHTML}
                </div>
            </body>
            </html>
        `;
    }

    function downloadSessionHtml() {
        const htmlContent = getSessionHTML();
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sesion_Chat_${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function processHtmlToDocx(htmlContent) {
    const paragraphs = [];
    
    // Crear un elemento temporal para parsear el HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Procesar cada elemento
    const elements = tempDiv.children;
    
    for (let element of elements) {
        const tagName = element.tagName.toLowerCase();
        const text = element.textContent || element.innerText || '';
        
        if (tagName === 'h1' || tagName === 'h2') {
            paragraphs.push(new docx.Paragraph({
                text: text,
                heading: tagName === 'h1' ? docx.HeadingLevel.HEADING_1 : docx.HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 }
            }));
        } else if (tagName === 'h3') {
            paragraphs.push(new docx.Paragraph({
                text: text,
                heading: docx.HeadingLevel.HEADING_3,
                spacing: { before: 300, after: 200 }
            }));
        } else if (tagName === 'ul' || tagName === 'ol') {
            const listItems = element.querySelectorAll('li');
            listItems.forEach(li => {
                paragraphs.push(new docx.Paragraph({
                    text: li.textContent,
                    bullet: { level: 0 },
                    spacing: { after: 100 }
                }));
            });
        } else if (tagName === 'p') {
            // Procesar texto con negrillas y otros formatos
            const textRuns = [];
            
            if (element.children.length === 0) {
                // Texto simple
                textRuns.push(new docx.TextRun({ text: text }));
            } else {
                // Texto con formato
                processInlineElements(element, textRuns);
            }
            
            paragraphs.push(new docx.Paragraph({
                children: textRuns.length > 0 ? textRuns : [new docx.TextRun({ text: text })],
                spacing: { after: 200 }
            }));
        } else if (tagName === 'blockquote') {
            paragraphs.push(new docx.Paragraph({
                text: text,
                italics: true,
                indent: { left: 720 }, // 1 inch indent
                spacing: { after: 200 },
                border: {
                    left: { color: "CCCCCC", size: 6, style: docx.BorderStyle.SINGLE }
                }
            }));
        } else if (tagName === 'code') {
            paragraphs.push(new docx.Paragraph({
                text: text,
                font: "Courier New",
                shading: { type: docx.ShadingType.SOLID, color: "F5F5F5" },
                spacing: { after: 100 }
            }));
        } else if (tagName === 'pre') {
            paragraphs.push(new docx.Paragraph({
                text: text,
                font: "Courier New",
                shading: { type: docx.ShadingType.SOLID, color: "2D2D2D" },
                color: "FFFFFF",
                spacing: { after: 200 }
            }));
        } else {
            // Elemento no reconocido, tratar como párrafo normal
            paragraphs.push(new docx.Paragraph({
                text: text,
                spacing: { after: 200 }
            }));
        }
    }
    
    return paragraphs;
}

function processInlineElements(element, textRuns) {
    for (let node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            textRuns.push(new docx.TextRun({ text: node.textContent }));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            const text = node.textContent || '';
            
            if (tagName === 'strong' || tagName === 'b') {
                textRuns.push(new docx.TextRun({ text: text, bold: true }));
            } else if (tagName === 'em' || tagName === 'i') {
                textRuns.push(new docx.TextRun({ text: text, italics: true }));
            } else if (tagName === 'u') {
                textRuns.push(new docx.TextRun({ text: text, underline: {} }));
            } else if (tagName === 'code') {
                textRuns.push(new docx.TextRun({ 
                    text: text, 
                    font: "Courier New",
                    shading: { type: docx.ShadingType.SOLID, color: "F0F0F0" }
                }));
            } else if (tagName === 'a') {
                textRuns.push(new docx.TextRun({ 
                    text: text,
                    color: "0066CC",
                    underline: {}
                }));
            } else {
                // Procesar elementos anidados
                processInlineElements(node, textRuns);
            }
        }
    }
}

function downloadSessionWord() {
        // Check if libraries are available
        if (typeof docx === 'undefined' || typeof saveAs === 'undefined') {
            console.log('docx available:', typeof docx);
            console.log('saveAs available:', typeof saveAs);
            console.log('window.docx:', typeof window.docx);
            alert('Librerías de Word no cargadas. Reintente en un momento.');
            return;
        }
        
        // Extract chat content
        const chatMessages = chatDisplay.querySelectorAll('.user-message, .bot-message, .system-message');
        const children = [];
        
        console.log('Messages found:', chatMessages.length);
        chatMessages.forEach((msg, index) => {
            console.log(`Message ${index}:`, msg.className, msg.textContent.substring(0, 50));
        });
        
        // Title
        children.push(new docx.Paragraph({
            text: "Sesión de Chat - Analiza artículo PDF",
            heading: docx.HeadingLevel.HEADING_1,
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 400 }
        }));
        
        // Files info
        children.push(new docx.Paragraph({
            children: [
                new docx.TextRun({
                    text: "Archivos cargados: ",
                    bold: true
                }),
                new docx.TextRun({
                    text: currentPdfName || 'Ninguno'
                })
            ],
            spacing: { after: 200 }
        }));
        
        // Separator
        children.push(new docx.Paragraph({
            text: "________________________________________________________________________________________________",
            spacing: { after: 400 }
        }));
        
        // Process messages
        chatMessages.forEach(msg => {
            if (msg.classList.contains('system-message')) {
                children.push(new docx.Paragraph({
                    text: msg.textContent,
                    italics: true,
                    alignment: docx.AlignmentType.CENTER,
                    spacing: { after: 200 },
                    color: "666666"
                }));
            } else if (msg.classList.contains('user-message')) {
                // Extraer el texto del usuario de forma más directa
                const userText = msg.textContent.replace('Usuario:', '').trim();
                children.push(new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: "Usuario: ",
                            bold: true,
                            color: "0066CC"
                        }),
                        new docx.TextRun({
                            text: userText
                        })
                    ],
                    spacing: { after: 200 },
                    alignment: docx.AlignmentType.RIGHT,
                    shading: {
                        type: docx.ShadingType.SOLID,
                        color: "E3F2FD"
                    }
                }));
            } else if (msg.classList.contains('bot-message')) {
                // Extraer el HTML del bot para preservar formato
                const botBubble = msg.querySelector('.message-bubble');
                if (botBubble) {
                    const contentDiv = botBubble.querySelector('div[style*="margin-top:5px;"]');
                    const modelInfo = botBubble.querySelector('div[style*="font-size:0.8em;"]')?.textContent || '';
                    
                    if (contentDiv) {
                        // Procesar HTML para convertir a formato Word
                        const htmlContent = contentDiv.innerHTML;
                        const formattedText = processHtmlToDocx(htmlContent);
                        
                        // Añadir cada párrafo formateado
                        formattedText.forEach(paragraph => {
                            children.push(paragraph);
                        });
                        
                        // Añadir información del modelo
                        if (modelInfo) {
                            children.push(new docx.Paragraph({
                                children: [
                                    new docx.TextRun({
                                        text: modelInfo,
                                        italics: true,
                                        size: 20,
                                        color: "666666"
                                    })
                                ],
                                spacing: { after: 200 }
                            }));
                        }
                    }
                }
            }
        });
        
        // Create document
        const doc = new docx.Document({
            sections: [{
                properties: {},
                children: children
            }]
        });
        
        // Save document
        docx.Packer.toBlob(doc).then(blob => {
            saveAs(blob, `Sesion_Chat_Investigacion_${Date.now()}.docx`);
        });
    }
});
