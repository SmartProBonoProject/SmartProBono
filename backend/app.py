from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import os

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "https://*.onrender.com"]
    }
})

model_name = "tiiuae/falcon-rw-1b"

# Add this near the top
HF_TOKEN = os.environ.get("HF_TOKEN")

# Load model with optimizations
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    trust_remote_code=True,
    torch_dtype=torch.float16,  # Using float16 for memory efficiency
    load_in_8bit=True,          # Enable 8-bit quantization
    token=HF_TOKEN  # Add this line
)

tokenizer = AutoTokenizer.from_pretrained(
    model_name,
    trust_remote_code=True,
    token=HF_TOKEN  # Add this line
)

device = "mps" if torch.backends.mps.is_available() else "cpu"
model = model.to(device)

@app.route("/api/legal", methods=["POST"])
def legal_assistant():
    data = request.json
    prompt = data.get("prompt", "")

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    outputs = model.generate(
        inputs["input_ids"],
        max_length=256,        # Shorter responses to save memory
        temperature=0.7,
        pad_token_id=tokenizer.eos_token_id,
        num_beams=2,          # Simple beam search
        early_stopping=True    # Stop when possible
    )
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return jsonify({"response": response})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
