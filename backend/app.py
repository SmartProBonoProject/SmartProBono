from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import os

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"]  # Or your specific frontend origin
    }
})

model_name = "tiiuae/falcon-rw-1b"  # Using smaller 1B model

# Load model without quantization for Mac compatibility
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    trust_remote_code=False,
    torch_dtype=torch.float16,  # Changed to float16 to reduce memory usage
)

tokenizer = AutoTokenizer.from_pretrained(
    model_name,
    trust_remote_code=False
)

device = "mps" if torch.backends.mps.is_available() else "cpu"
model = model.to(device)

@app.route("/api/legal", methods=["POST"])
def legal_assistant():
    data = request.json
    prompt = data.get("prompt", "")

    # Move inputs to the same device as the model
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    # Generate response
    outputs = model.generate(
        inputs["input_ids"],
        max_length=500,
        temperature=0.7,
        pad_token_id=tokenizer.eos_token_id
    )
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
