import requests
import json

url = "https://node.proyectodescartes.org/api/ia/text"

payload_with_system = {
    "model": "openai-fast",
    "prompt": "Documento 1 (\"dummy.pdf\"): \"Este documento habla sobre el sol.\"\n\nPregunta: ¿Cómo hacer una pizza?\n\nRespuesta:",
    "system": "Eres un asistente que SOLO debe ayudar con preguntas relacionadas con el contenido del/los documento(s) PDF de esta sesión. Si la pregunta no guarda relación razonable con el documento, responde ÚNICAMENTE con UNA línea que empiece exactamente con [FUERA_DE_ALCANCE] seguida de una frase breve en español."
}

payload_without_system = {
    "model": "openai-fast",
    "prompt": "Eres un asistente que SOLO debe ayudar con preguntas relacionadas con el contenido del/los documento(s) PDF de esta sesión. Si la pregunta no guarda relación razonable con el documento, responde ÚNICAMENTE con UNA línea que empiece exactamente con [FUERA_DE_ALCANCE] seguida de una frase breve en español.\n\nDocumento 1 (\"dummy.pdf\"): \"Este documento habla sobre el sol.\"\n\nPregunta: ¿Cómo hacer una pizza?\n\nRespuesta:"
}

print("Testing with system parameter:")
try:
    r1 = requests.post(url, json=payload_with_system)
    print("Status Code:", r1.status_code)
    print("Response:", r1.text)
except Exception as e:
    print("Error:", e)

print("\nTesting with instructions in prompt:")
try:
    r2 = requests.post(url, json=payload_without_system)
    print("Status Code:", r2.status_code)
    print("Response:", r2.text)
except Exception as e:
    print("Error:", e)
