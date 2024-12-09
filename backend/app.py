from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import time

app = Flask(__name__)
CORS(app)

# Dictionary to store different models and tokenizers
models = {}
tokenizers = {}

def load_model(model_name, category):
    """Load a model and tokenizer for a specific category"""
    print(f"Loading {category} model: {model_name}...")
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        trust_remote_code=True,
        device_map="auto"
    )
    tokenizer = AutoTokenizer.from_pretrained(
        model_name,
        trust_remote_code=True
    )
    return model, tokenizer

# Initialize different models for different categories
print("Loading specialized models...")

# Contracts model (smaller, faster for specific tasks)
models['contracts'], tokenizers['contracts'] = load_model("facebook/opt-125m", "contracts")

# Rights model (medium size for broader knowledge)
models['rights'], tokenizers['rights'] = load_model("gpt2", "rights")

# Rights specific model (specific rights and their implications)
models['rights_specific'], tokenizers['rights_specific'] = load_model("gpt2", "rights_specific")

# Procedures model (larger for complex explanations)
models['procedures'], tokenizers['procedures'] = load_model("facebook/opt-350m", "procedures")

print("All models loaded!")

def generate_response(prompt, category, max_length=150, temperature=0.5):
    """Generate response using the appropriate model"""
    model = models[category]
    tokenizer = tokenizers[category]
    
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(
        **inputs,
        max_length=max_length,
        min_length=20,
        temperature=temperature,
        do_sample=True,
        top_p=0.85,
        top_k=40,
        no_repeat_ngram_size=3,
        num_beams=2,
        early_stopping=True
    )
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return clean_response(response, prompt)

def clean_response(response, prompt):
    """Common function for cleaning responses"""
    # Remove prompt and common prefixes
    cleanup_phrases = [
        prompt,
        "Here's a clear answer:",
        "The answer is:",
        "Let me explain:"
    ]
    for phrase in cleanup_phrases:
        response = response.replace(phrase, "").strip()
    
    # Ensure complete sentences
    sentences = response.split('.')
    complete_sentences = [s.strip() for s in sentences if s.strip()]
    response = '. '.join(complete_sentences)
    if not response.endswith('.'):
        response += '.'
    
    return response.strip()

@app.route("/api/legal/contracts", methods=["POST"])
def contract_assistant():
    start_time = time.time()
    user_prompt = request.json.get('prompt')
    
    prompt = (
        "Explain this contract law concept clearly: "
        f"{user_prompt}"
    )
    
    try:
        model_start_time = time.time()
        response = generate_response(prompt, "contracts", max_length=200, temperature=0.4)
        model_time = time.time() - model_start_time
        total_time = time.time() - start_time
        
        print(f"\nContract Question Timing:")
        print(f"Model Time: {model_time:.2f}s")
        print(f"Total Time: {total_time:.2f}s")
        print(f"Q: {user_prompt}")
        print(f"A: {response}\n")
        
        return jsonify({
            "response": response,
            "timing": {
                "model_time": f"{model_time:.2f}s",
                "total_time": f"{total_time:.2f}s"
            }
        })
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/legal/rights", methods=["POST"])
def rights_assistant():
    start_time = time.time()
    user_prompt = request.json.get('prompt')
    
    prompt = (
        "Explain these legal rights clearly and specifically. "
        f"Question: {user_prompt}"
    )
    
    try:
        model_start_time = time.time()
        response = generate_response(prompt, "rights", max_length=250, temperature=0.5)
        model_time = time.time() - model_start_time
        total_time = time.time() - start_time
        
        print(f"\nRights Question Timing:")
        print(f"Model Time: {model_time:.2f}s")
        print(f"Total Time: {total_time:.2f}s")
        print(f"Q: {user_prompt}")
        print(f"A: {response}\n")
        
        return jsonify({
            "response": response,
            "timing": {
                "model_time": f"{model_time:.2f}s",
                "total_time": f"{total_time:.2f}s"
            }
        })
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/legal/rights/specific", methods=["POST"])
def rights_specific_assistant():
    start_time = time.time()
    user_prompt = request.json.get('prompt')
    
    prompt = (
        "Explain these specific rights and their implications: "
        f"{user_prompt}"
    )
    
    try:
        model_start_time = time.time()
        response = generate_response(prompt, "rights_specific", max_length=250, temperature=0.5)
        model_time = time.time() - model_start_time
        total_time = time.time() - start_time
        
        print(f"\nRights Specific Question Timing:")
        print(f"Model Time: {model_time:.2f}s")
        print(f"Total Time: {total_time:.2f}s")
        print(f"Q: {user_prompt}")
        print(f"A: {response}\n")
        
        return jsonify({
            "response": response,
            "timing": {
                "model_time": f"{model_time:.2f}s",
                "total_time": f"{total_time:.2f}s"
            }
        })
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/legal/procedures", methods=["POST"])
def procedure_assistant():
    start_time = time.time()
    user_prompt = request.json.get('prompt')
    
    prompt = (
        "Explain this legal procedure step by step clearly. "
        f"Question: {user_prompt}"
    )
    
    try:
        model_start_time = time.time()
        response = generate_response(prompt, "procedures", max_length=300, temperature=0.6)
        model_time = time.time() - model_start_time
        total_time = time.time() - start_time
        
        print(f"\nProcedure Question Timing:")
        print(f"Model Time: {model_time:.2f}s")
        print(f"Total Time: {total_time:.2f}s")
        print(f"Q: {user_prompt}")
        print(f"A: {response}\n")
        
        return jsonify({
            "response": response,
            "timing": {
                "model_time": f"{model_time:.2f}s",
                "total_time": f"{total_time:.2f}s"
            }
        })
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/legal/contracts/generate", methods=["POST"])
def generate_contract_document():
    data = request.json
    content = data.get('content', [])
    
    # Generate formatted document from chat content
    document_html = f"""
    <div class="legal-document">
        <h2>Legal Document Summary</h2>
        <div class="content">
            {''.join(f'<p>{msg["text"]}</p>' for msg in content if msg["type"] == "assistant")}
        </div>
        <div class="signature-section">
            <p>Signature: _____________________</p>
            <p>Date: _____________________</p>
        </div>
    </div>
    """
    
    return jsonify({
        "document": document_html
    })

if __name__ == "__main__":
    print("Starting Flask app on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)


