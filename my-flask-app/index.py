import os
import logging
from flask import Flask, jsonify

# ——— Setup logging ———
logging.basicConfig(level=logging.INFO)
# (Flask will also pick this up via app.logger)

# ——— Create the app ———
app = Flask(__name__)

# ——— Debug “ping” endpoint ———
@app.route("/api/ping")
def ping():
    # Check whether MONGO_URI is visible in the env
    has_uri = bool(os.getenv("MONGO_URI"))
    return jsonify({
        "pong": True,
        "mongo_uri_set": has_uri
    })

if __name__ == "__main__":
    app.run(debug=True)