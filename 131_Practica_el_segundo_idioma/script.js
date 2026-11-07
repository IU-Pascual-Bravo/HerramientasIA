let currentExerciseIndex = 0;
let totalExercises = 0;
let exercises = [];
let score = 0;
let draggedElement = null;

const elements = {
    setupDiv: document.getElementById('setup'),
    loaderDiv: document.getElementById('loader'),
    gameContainer: document.getElementById('game-container'),
    resultsContainer: document.getElementById('results-container'),
    startBtn: document.getElementById('start-btn'),
    resetBtn: document.getElementById('reset-btn'),
    verifyBtn: document.getElementById('verify-btn'),
    nextBtn: document.getElementById('next-btn'),
    modeSelect: document.getElementById('mode-select'),
    numEjerciciosSelect: document.getElementById('num-ejercicios-select'),
    levelSelect: document.getElementById('level-select'),
    textModelSelect: document.getElementById('text-model-select'),
    providerSelect: document.getElementById('provider-select'),
    apiKeyInput: document.getElementById('api-key-input'),
    apiKeyLabel: document.getElementById('api-key-label'),
    apiKeyStatus: document.getElementById('api-key-status'),
    getApiKeyBtn: document.getElementById('get-api-key-btn'),
    validateKeyBtn: document.getElementById('validate-key-btn'),
    clearKeyBtn: document.getElementById('clear-key-btn'),
    sourcePhrase: document.getElementById('source-phrase'),
    slotsContainer: document.getElementById('slots-container'),
    optionsContainer: document.getElementById('options-container'),
    currentStepText: document.getElementById('current-step'),
    progressBarFill: document.getElementById('progress-bar-fill'),
    changeThemeBtn: document.getElementById('change-theme-btn'),
    downloadHeaderBtn: document.getElementById('download-header-btn')
};

const backgroundGradients = [
    'radial-gradient(circle at top right, #1e1b4b, #0f172a)',
    'radial-gradient(circle at top right, #1e3a8a, #172554)',
    'radial-gradient(circle at top right, #312e81, #1e1b4b)',
    'radial-gradient(circle at top right, #3730a3, #1e1b4b)',
    'radial-gradient(circle at top right, #4c1d95, #0f172a)',
    'radial-gradient(circle at top right, #5b21b6, #1e1b4b)'
];
let currentGradientIndex = 0;

const PROVIDERS = {
    pollinations: { name: 'Pollinations AI', url: 'https://gen.pollinations.ai/v1/chat/completions', validateUrl: 'https://gen.pollinations.ai/v1/models', model: 'openai', placeholder: 'plln_sk_...', keyUrl: 'https://enter.pollinations.ai/authorize' },
    free: { name: 'Red Descartes', url: 'https://node.proyectodescartes.org/api/ia/text', model: 'gemini-search', free: true, placeholder: '', keyUrl: '' },
    openrouter: { name: 'OpenRouter', url: 'https://openrouter.ai/api/v1/chat/completions', validateUrl: 'https://openrouter.ai/api/v1/models', model: 'google/gemini-2.5-flash', placeholder: 'sk-or-...', keyUrl: 'https://openrouter.ai/keys' },
    google: { name: 'Google AI Studio', url: 'https://generativelanguage.googleapis.com/v1beta/models/', validateUrl: 'https://generativelanguage.googleapis.com/v1beta/models', model: 'gemini-3.8-flash', placeholder: 'AIzaSy...', keyUrl: 'https://aistudio.google.com/app/apikey' },
    mistral: { name: 'Mistral AI', url: 'https://api.mistral.ai/v1/chat/completions', validateUrl: 'https://api.mistral.ai/v1/models', model: 'open-mistral-7b', placeholder: 'Clave Mistral API...', keyUrl: 'https://console.mistral.ai/api-keys/' },
    cohere: { name: 'Cohere', url: 'https://api.cohere.com/v2/chat', validateUrl: 'https://api.cohere.com/v1/models', model: 'command-a-plus-05-2026', placeholder: 'Clave Cohere API...', keyUrl: 'https://dashboard.cohere.com/api-keys' },
    groq: { name: 'Groq', url: 'https://api.groq.com/openai/v1/chat/completions', validateUrl: 'https://api.groq.com/openai/v1/models', model: 'llama-3.1-8b-instant', placeholder: 'gsk_...', keyUrl: 'https://console.groq.com/keys' },
    deepseek: { name: 'DeepSeek', url: 'https://api.deepseek.com/chat/completions', validateUrl: 'https://api.deepseek.com/models', model: 'deepseek-flash', placeholder: 'sk-...', keyUrl: 'https://platform.deepseek.com/api_keys' }
};

const MODEL_OPTIONS = {
    pollinations: ['openai', 'openai/gpt-5.6-luna', 'moonshotai/kimi-k2.6', 'x-ai/grok-4.3', 'mistral-small-3.2', 'qwen-coder', 'gemini-fast', 'z-ai/glm-5.3-flash', 'openai/gpt-6-luna', 'minimax/minimax-m3', 'meta/llama-3.3-70b-instruct', 'google/gemini-3.8-flash', 'anthropic/claude-haiku-5.5', 'mistralai/mistral-large-4'],
    free: ['openai', 'openai-fast', 'gemini-fast', 'gemini-search', 'mistral', 'nova-fast', 'perplexity-fast', 'deepseek'],
    openrouter: ['google/gemini-2.5-flash', 'deepseek/deepseek-chat-v3-0324', 'openai/gpt-5-mini', 'moonshotai/kimi-k2.6', 'meta-llama/llama-3.3-70b-instruct', 'openrouter/free'],
    google: ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.1-pro-preview'],
    mistral: ['open-mistral-7b', 'open-mixtral-8x7b'],
    cohere: ['command-a-plus-05-2026', 'command-a-03-2025', 'command-a-reasoning-08-2025', 'command-r7b-12-2024'],
    groq: ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b'],
    deepseek: ['deepseek-flash', 'deepseek-v4-pro']
};

function providerKeyName(provider) {
    return `${provider}_api_key`;
}

function setApiKeyStatus(message, type = '') {
    elements.apiKeyStatus.textContent = message;
    elements.apiKeyStatus.className = type;
}

function updateProvider() {
    const provider = elements.providerSelect.value;
    const config = PROVIDERS[provider];
    const models = MODEL_OPTIONS[provider] || [config.model];
    elements.textModelSelect.replaceChildren(...models.map(model => new Option(model, model)));
    elements.textModelSelect.value = config.model;
    elements.apiKeyLabel.textContent = config.free ? 'No se requiere API Key' : `API Key de ${config.name}`;
    elements.apiKeyInput.placeholder = config.placeholder;
    elements.apiKeyInput.disabled = Boolean(config.free);
    elements.apiKeyInput.required = !config.free;
    elements.apiKeyInput.value = config.free ? '' : (localStorage.getItem(providerKeyName(provider)) || '');
    elements.getApiKeyBtn.hidden = config.free;
    elements.getApiKeyBtn.title = `Obtener API Key de ${config.name}`;
    localStorage.setItem('preferred_language_provider', provider);
    setApiKeyStatus('');
}

async function validateProviderKey() {
    const provider = elements.providerSelect.value;
    const config = PROVIDERS[provider];
    const key = elements.apiKeyInput.value.trim();

    if (config.free) {
        setApiKeyStatus(`${config.name} no requiere API Key.`, 'success');
        return;
    }
    if (!key) {
        setApiKeyStatus('Introduce una API Key antes de validarla.', 'error');
        return;
    }

    elements.validateKeyBtn.disabled = true;
    elements.validateKeyBtn.textContent = 'Validando...';
    try {
        const headers = provider === 'google' ? { 'x-goog-api-key': key } : { Authorization: `Bearer ${key}` };
        const response = await fetch(config.validateUrl, { method: 'GET', headers });
        if (!response.ok) {
            const details = (await response.text()).slice(0, 240);
            throw new Error(`${response.status}${details ? `: ${details}` : ''}`);
        }
        localStorage.setItem(providerKeyName(provider), key);
        setApiKeyStatus(`API Key válida para ${config.name}.`, 'success');
    } catch (error) {
        setApiKeyStatus(`No se pudo validar la API Key de ${config.name}. ${error.message}`, 'error');
    } finally {
        elements.validateKeyBtn.disabled = false;
        elements.validateKeyBtn.textContent = 'Validar';
    }
}

function startApiKeyFlow() {
    const config = PROVIDERS[elements.providerSelect.value];
    if (!config.keyUrl) return;
    if (elements.providerSelect.value === 'pollinations') {
        const redirectUrl = window.location.href.split('#')[0];
        window.location.href = `${config.keyUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`;
        return;
    }
    window.open(config.keyUrl, '_blank', 'noopener,noreferrer');
}

function changeTheme() {
    currentGradientIndex = (currentGradientIndex + 1) % backgroundGradients.length;
    document.body.style.background = backgroundGradients[currentGradientIndex];
}

async function fetchFromProvider(prompt, provider, model, apiKey) {
    const config = PROVIDERS[provider];
    const headers = { 'Content-Type': 'application/json' };
    let url = config.url;
    let body;

    if (provider === 'free') {
        body = { prompt, model };
    } else if (provider === 'google') {
        url += `${model}:generateContent`;
        headers['x-goog-api-key'] = apiKey;
        body = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
    } else {
        headers.Authorization = `Bearer ${apiKey}`;
        if (provider === 'openrouter') {
            headers['HTTP-Referer'] = window.location.origin;
            headers['X-Title'] = 'Practica con un segundo idioma';
        }
        body = { model, messages: [{ role: 'user', content: prompt }] };
    }

    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    const responseText = await response.text();
    if (!response.ok) throw new Error(`Error ${response.status}: ${responseText}`);

    let data;
    try {
        data = JSON.parse(responseText);
    } catch {
        return responseText;
    }
    if (typeof data === 'string') return data;
    if (provider === 'google') return data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('') || '';
    if (provider === 'cohere') return data.message?.content?.map(part => part.text || '').join('') || '';
    if (provider === 'free') return data.text || data.response || data.choices?.[0]?.message?.content || '';
    return data.choices?.[0]?.message?.content || '';
}

async function startApp() {
    const mode = elements.modeSelect.value;
    totalExercises = parseInt(elements.numEjerciciosSelect.value);
    const level = elements.levelSelect.value;
    const model = elements.textModelSelect.value;
    const provider = elements.providerSelect.value;
    const apiKey = elements.apiKeyInput.value.trim();

    if (!PROVIDERS[provider].free && !apiKey) {
        setApiKeyStatus(`Introduce una API Key de ${PROVIDERS[provider].name} para continuar.`, 'error');
        return;
    }
    
    elements.setupDiv.style.display = 'none';
    elements.loaderDiv.style.display = 'block';
    elements.resultsContainer.style.display = 'none';
    elements.loaderDiv.innerHTML = `<div class="spinner"></div><p>Generando ${totalExercises} ejercicios (Nivel: ${level})...</p>`;

    try {
        const prompt = mode === 'es-en' 
            ? `Genera ${totalExercises} frases variadas y cortas en español de nivel ${level} y sus traducciones exactas al inglés. Formato: Frase ES | Frase EN (una por línea). Sin numeración.`
            : `Genera ${totalExercises} frases variadas y cortas en inglés de nivel ${level} y sus traducciones exactas al español. Formato: Frase EN | Frase ES (una por línea). Sin numeración.`;

        const responseText = await fetchFromProvider(prompt, provider, model, apiKey);
        const lines = responseText.split('\n').filter(line => line.includes('|'));
        
        exercises = lines.map(line => {
            const parts = line.split('|').map(s => s.trim().replace(/[.,!?;]$/, ''));
            const source = parts[0].replace(/^\d+[\.\)]\s*/, '');
            const target = parts[1];
            return { source, target, targetWords: target.split(/\s+/).filter(w => w.length > 0) };
        }).slice(0, totalExercises);

        if (exercises.length === 0) throw new Error("No se pudieron generar ejercicios válidos.");

        currentExerciseIndex = 0;
        score = 0;
        renderExercise();
        elements.gameContainer.style.display = 'block';
    } catch (err) {
        alert("Error al iniciar: " + err.message);
        resetToSetup();
    } finally {
        elements.loaderDiv.style.display = 'none';
    }
}

function renderExercise() {
    const exercise = exercises[currentExerciseIndex];
    elements.sourcePhrase.textContent = exercise.source;
    elements.currentStepText.textContent = `Ejercicio ${currentExerciseIndex + 1} de ${totalExercises}`;
    elements.progressBarFill.style.width = `${((currentExerciseIndex) / totalExercises) * 100}%`;

    elements.slotsContainer.innerHTML = '';
    elements.optionsContainer.innerHTML = '';
    elements.verifyBtn.style.display = 'inline-block';
    elements.nextBtn.style.display = 'none';
    elements.verifyBtn.disabled = true;

    exercise.targetWords.forEach((_, i) => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.index = i;
        slot.addEventListener('dragover', e => {
            e.preventDefault();
            if (!e.target.hasChildNodes()) e.target.classList.add('drag-over');
        });
        slot.addEventListener('dragleave', e => e.target.classList.remove('drag-over'));
        slot.addEventListener('drop', e => {
            e.preventDefault();
            e.target.classList.remove('drag-over');
            if (e.target.classList.contains('slot') && !e.target.hasChildNodes()) {
                e.target.appendChild(draggedElement);
                checkAllFilled();
            }
        });
        slot.addEventListener('click', e => {
            if (e.target.classList.contains('word-chip')) {
                elements.optionsContainer.appendChild(e.target);
                elements.verifyBtn.disabled = true;
            }
        });
        elements.slotsContainer.appendChild(slot);
    });

    const shuffledWords = [...exercise.targetWords].sort(() => Math.random() - 0.5);
    shuffledWords.forEach(word => {
        const chip = document.createElement('div');
        chip.className = 'word-chip';
        chip.textContent = word;
        chip.draggable = true;
        chip.addEventListener('dragstart', e => {
            draggedElement = e.target;
            e.target.classList.add('dragging');
        });
        chip.addEventListener('dragend', e => e.target.classList.remove('dragging'));
        chip.addEventListener('click', () => {
            const emptySlot = Array.from(elements.slotsContainer.children).find(s => !s.hasChildNodes());
            if (emptySlot) {
                emptySlot.appendChild(chip);
                checkAllFilled();
            }
        });
        elements.optionsContainer.appendChild(chip);
    });
}

function checkAllFilled() {
    const allFilled = Array.from(elements.slotsContainer.children).every(s => s.hasChildNodes());
    elements.verifyBtn.disabled = !allFilled;
}

function verifyExercise() {
    const exercise = exercises[currentExerciseIndex];
    const slots = Array.from(elements.slotsContainer.children);
    let correctInThisExercise = 0;

    slots.forEach((slot, i) => {
        const wordPlaced = slot.firstChild.textContent;
        const correctWord = exercise.targetWords[i];
        if (wordPlaced.toLowerCase() === correctWord.toLowerCase()) {
            slot.classList.add('correct');
            correctInThisExercise++;
        } else {
            slot.classList.add('incorrect');
        }
        slot.style.pointerEvents = 'none';
    });

    score += (correctInThisExercise / exercise.targetWords.length);
    elements.verifyBtn.style.display = 'none';
    elements.nextBtn.style.display = 'inline-block';
}

function nextExercise() {
    currentExerciseIndex++;
    if (currentExerciseIndex < totalExercises) {
        renderExercise();
    } else {
        showFinalResults();
    }
}

function showFinalResults() {
    elements.gameContainer.style.display = 'none';
    const percentage = Math.round((score / totalExercises) * 100);
    elements.resultsContainer.innerHTML = `
        <h2>Evaluación Finalizada</h2>
        <div class="percentage-score">${percentage}%</div>
        <p>Puntaje promedio: ${percentage}/100</p>
        <button onclick="resetToSetup()">Reiniciar</button>
    `;
    elements.resultsContainer.style.display = 'block';
    if (percentage >= 80) confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

function resetToSetup() {
    elements.resultsContainer.style.display = 'none';
    elements.gameContainer.style.display = 'none';
    elements.setupDiv.style.display = 'block';
}

async function descargarHTML() {
    if (exercises.length === 0) {
        alert("Primero debes generar los ejercicios para poder descargarlos.");
        return;
    }

    // Estilos inlined para asegurar que funcione en modo local (file://)
    const styles = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
:root {
    --primary: #6366f1; --primary-hover: #4f46e5; --success: #10b981; --error: #ef4444; 
    --bg: #0f172a; --glass: rgba(255, 255, 255, 0.05); --glass-border: rgba(255, 255, 255, 0.1); --text: #f8fafc;
}
body {
    font-family: 'Outfit', sans-serif; color: var(--text); background: radial-gradient(circle at top right, #1e1b4b, #0f172a);
    min-height: 100vh; margin: 0; display: flex; flex-direction: column; align-items: center; padding: 40px 20px; box-sizing: border-box; transition: background 0.5s ease;
}
#app-container {
    width: 100%; max-width: 800px; background: var(--glass); backdrop-filter: blur(12px); border: 1px solid var(--glass-border);
    border-radius: 24px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); margin: auto;
}
.evaluation-header { margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
.progress-info { display: flex; flex-direction: column; gap: 10px; flex-grow: 1; margin-right: 20px; }
#current-step { font-weight: 600; font-size: 1.1rem; color: #94a3b8; }
.progress-bar-container { width: 100%; height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden; }
#progress-bar-fill { height: 100%; width: 0%; background: linear-gradient(to right, var(--primary), #a855f7); transition: width 0.5s ease; }
#source-phrase { font-size: 1.8rem; font-weight: 600; text-align: center; margin: 30px 0; color: #fff; padding: 20px; background: rgba(255, 255, 255, 0.03); border-radius: 16px; }
.section-label { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 25px 0 12px; }
#slots-container, #options-container { display: flex; flex-wrap: wrap; gap: 12px; min-height: 60px; padding: 15px; border-radius: 16px; background: rgba(0, 0, 0, 0.2); align-items: center; }
#slots-container { border: 2px dashed var(--glass-border); margin-bottom: 20px; }
.slot { min-width: 80px; height: 45px; border-radius: 8px; background: rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: center; padding: 0 15px; font-weight: 500; transition: all 0.2s; border: 1px solid transparent; }
.slot.drag-over { background: rgba(99, 102, 241, 0.2); border-color: var(--primary); }
.word-chip { padding: 10px 18px; background: #fff; color: #1e293b; border-radius: 10px; cursor: grab; user-select: none; font-weight: 600; transition: all 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.word-chip:hover { transform: scale(1.05); }
.word-chip.dragging { opacity: 0.5; cursor: grabbing; }
.slot.correct { background: rgba(16, 185, 129, 0.15) !important; border: 2px solid var(--success) !important; color: #10b981; }
.slot.incorrect { background: rgba(239, 68, 68, 0.15) !important; border: 2px solid var(--error) !important; color: #ef4444; }
.action-buttons { display: flex; gap: 15px; margin-top: 40px; justify-content: center; }
button { padding: 14px 20px; border-radius: 12px; font-size: 1rem; border: none; font-weight: 600; cursor: pointer; transition: all 0.3s; }
#verify-btn { background: var(--primary); color: white; width: 200px; }
#next-btn { background: var(--success); color: white; width: 200px; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
#results-container { text-align: center; padding: 20px; display: none; }
#results-container h2 { font-size: 2.5rem; margin-bottom: 20px; color: var(--success); }
.percentage-score { font-size: 5rem; font-weight: 800; margin: 20px 0; color: #fff; }
footer { margin-top: 40px; text-align: center; font-size: 0.85rem; color: #64748b; width: 100%; }
@media (max-width: 640px) { #app-container { padding: 25px; } #source-phrase { font-size: 1.3rem; } .action-buttons { flex-direction: column; } #verify-btn, #next-btn { width: 100%; } }
    `;

    // Capturar el fondo actual del body
    const currentBodyBg = getComputedStyle(document.body).background;

    const jsLogic = `
        const exercises = ${JSON.stringify(exercises)};
        let currentExerciseIndex = 0;
        let score = 0;
        const totalExercises = exercises.length;

        const elements = {
            gameContainer: document.getElementById('game-container'),
            resultsContainer: document.getElementById('results-container'),
            verifyBtn: document.getElementById('verify-btn'),
            nextBtn: document.getElementById('next-btn'),
            sourcePhrase: document.getElementById('source-phrase'),
            slotsContainer: document.getElementById('slots-container'),
            optionsContainer: document.getElementById('options-container'),
            currentStepText: document.getElementById('current-step'),
            progressBarFill: document.getElementById('progress-bar-fill')
        };

        let draggedElement = null;

        function renderExercise() {
            const exercise = exercises[currentExerciseIndex];
            elements.sourcePhrase.textContent = exercise.source;
            elements.currentStepText.textContent = "Ejercicio " + (currentExerciseIndex + 1) + " de " + totalExercises;
            elements.progressBarFill.style.width = ((currentExerciseIndex) / totalExercises) * 100 + "%";

            elements.slotsContainer.innerHTML = '';
            elements.optionsContainer.innerHTML = '';
            elements.verifyBtn.style.display = 'inline-block';
            elements.nextBtn.style.display = 'none';
            elements.verifyBtn.disabled = true;

            exercise.targetWords.forEach((_, i) => {
                const slot = document.createElement('div');
                slot.className = 'slot';
                slot.dataset.index = i;
                slot.addEventListener('dragover', e => {
                    e.preventDefault();
                    if (!e.target.hasChildNodes()) e.target.classList.add('drag-over');
                });
                slot.addEventListener('dragleave', e => e.target.classList.remove('drag-over'));
                slot.addEventListener('drop', e => {
                    e.preventDefault();
                    e.target.classList.remove('drag-over');
                    if (e.target.classList.contains('slot') && !e.target.hasChildNodes()) {
                        e.target.appendChild(draggedElement);
                        checkAllFilled();
                    }
                });
                slot.addEventListener('click', e => {
                    if (e.target.classList.contains('word-chip')) {
                        elements.optionsContainer.appendChild(e.target);
                        elements.verifyBtn.disabled = true;
                    }
                });
                elements.slotsContainer.appendChild(slot);
            });

            const shuffledWords = [...exercise.targetWords].sort(() => Math.random() - 0.5);
            shuffledWords.forEach(word => {
                const chip = document.createElement('div');
                chip.className = 'word-chip';
                chip.textContent = word;
                chip.draggable = true;
                chip.addEventListener('dragstart', e => {
                    draggedElement = e.target;
                    e.target.classList.add('dragging');
                });
                chip.addEventListener('dragend', e => e.target.classList.remove('dragging'));
                chip.addEventListener('click', () => {
                    const emptySlot = Array.from(elements.slotsContainer.children).find(s => !s.hasChildNodes());
                    if (emptySlot) {
                        emptySlot.appendChild(chip);
                        checkAllFilled();
                    }
                });
                elements.optionsContainer.appendChild(chip);
            });
        }

        function checkAllFilled() {
            const allFilled = Array.from(elements.slotsContainer.children).every(s => s.hasChildNodes());
            elements.verifyBtn.disabled = !allFilled;
        }

        function verifyExercise() {
            const exercise = exercises[currentExerciseIndex];
            const slots = Array.from(elements.slotsContainer.children);
            let correctInThisExercise = 0;

            slots.forEach((slot, i) => {
                const wordPlaced = slot.firstChild.textContent;
                const correctWord = exercise.targetWords[i];
                if (wordPlaced.toLowerCase() === correctWord.toLowerCase()) {
                    slot.classList.add('correct');
                    correctInThisExercise++;
                } else {
                    slot.classList.add('incorrect');
                }
                slot.style.pointerEvents = 'none';
            });

            score += (correctInThisExercise / exercise.targetWords.length);
            elements.verifyBtn.style.display = 'none';
            elements.nextBtn.style.display = 'inline-block';
        }

        function nextExercise() {
            currentExerciseIndex++;
            if (currentExerciseIndex < totalExercises) {
                renderExercise();
            } else {
                showFinalResults();
            }
        }

        function showFinalResults() {
            elements.gameContainer.style.display = 'none';
            const percentage = Math.round((score / totalExercises) * 100);
            elements.resultsContainer.innerHTML = "<h2>Evaluación Finalizada</h2><div class='percentage-score'>" + percentage + "%</div><p>Puntaje promedio: " + percentage + "/100</p><button onclick='location.reload()'>Reiniciar</button>";
            elements.resultsContainer.style.display = 'block';
            if (percentage >= 80) confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }

        elements.verifyBtn.addEventListener('click', verifyExercise);
        elements.nextBtn.addEventListener('click', nextExercise);
        renderExercise();
    `;

    const footerContent = document.querySelector('footer').innerHTML;

    const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Práctica de Idioma</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></scr` + `ipt>
    <style>
        ${styles}
        body { background: ${currentBodyBg} !important; justify-content: flex-start; }
        #setup, #change-theme-btn, .header-buttons { display: none !important; }
        #game-container { display: block !important; }
    </style>
</head>
<body>
    <div id="app-container">
        <div id="game-container">
            <div class="evaluation-header">
                <div class="progress-info">
                    <span id="current-step"></span>
                    <div class="progress-bar-container"><div id="progress-bar-fill"></div></div>
                </div>
            </div>
            <div id="exercise-board">
                <div id="source-phrase"></div>
                <div class="section-label">Organiza la traducción:</div>
                <div id="slots-container"></div>
                <div class="section-label">Palabras disponibles:</div>
                <div id="options-container"></div>
                <div class="action-buttons">
                    <button id="verify-btn">Verificar</button>
                    <button id="next-btn" style="display: none;">Siguiente</button>
                </div>
            </div>
        </div>
        <div id="results-container"></div>
    </div>
    <footer>${footerContent}</footer>
    <script>${jsLogic}</scr` + `ipt>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "practica_idioma.html";
    a.click();
    URL.revokeObjectURL(url);
}


const savedProvider = localStorage.getItem('preferred_language_provider');
if (PROVIDERS[savedProvider]) elements.providerSelect.value = savedProvider;
elements.providerSelect.addEventListener('change', updateProvider);
elements.apiKeyInput.addEventListener('input', () => {
    const provider = elements.providerSelect.value;
    if (PROVIDERS[provider].free) return;
    const key = elements.apiKeyInput.value.trim();
    if (key) localStorage.setItem(providerKeyName(provider), key);
    else localStorage.removeItem(providerKeyName(provider));
});
elements.getApiKeyBtn.addEventListener('click', startApiKeyFlow);
elements.validateKeyBtn.addEventListener('click', validateProviderKey);
elements.clearKeyBtn.addEventListener('click', () => {
    const provider = elements.providerSelect.value;
    localStorage.removeItem(providerKeyName(provider));
    elements.apiKeyInput.value = '';
    setApiKeyStatus(`API Key eliminada del navegador para ${PROVIDERS[provider].name}.`, 'success');
});
updateProvider();

const apiKeyFromHash = new URLSearchParams(window.location.hash.slice(1)).get('api_key');
if (apiKeyFromHash) {
    elements.providerSelect.value = 'pollinations';
    updateProvider();
    elements.apiKeyInput.value = apiKeyFromHash;
    localStorage.setItem('pollinations_api_key', apiKeyFromHash);
    window.history.replaceState(null, null, window.location.pathname + window.location.search);
    setApiKeyStatus('API Key de Pollinations guardada en este navegador.', 'success');
}

elements.startBtn.addEventListener('click', startApp);
elements.verifyBtn.addEventListener('click', verifyExercise);
elements.nextBtn.addEventListener('click', nextExercise);
elements.resetBtn.addEventListener('click', resetToSetup);
elements.downloadHeaderBtn.addEventListener('click', descargarHTML);
elements.changeThemeBtn.addEventListener('click', changeTheme);
