const url = "https://node.proyectodescartes.org/api/ia/text";

const payload = (model) => ({
    model: model,
    prompt: 'Documento 1 ("dummy.pdf"): "Este documento habla sobre el sol."\n\nPregunta: ¿Cómo hacer una pizza?\n\nRespuesta:',
    system: "Eres un asistente que SOLO debe ayudar con preguntas relacionadas con el contenido del/los documento(s) PDF de esta sesión. Si la pregunta no guarda relación razonable con el documento, responde ÚNICAMENTE con UNA línea que empiece exactamente con [FUERA_DE_ALCANCE] seguida de una frase breve en español."
});

async function testModel(model) {
    console.log(`Testing model: ${model}`);
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload(model))
        });
        console.log("Status Code:", res.status);
        console.log("Response:", await res.text());
    } catch (e) {
        console.error("Error:", e);
    }
}

async function run() {
    await testModel("openai-fast");
    await testModel("openai");
    await testModel("gemini-search");
}

run();
