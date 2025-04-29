import os
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/ping")
def ping():
    # just confirms the function is live
    return jsonify({ "pong": True })

if __name__ == "__main__":
    app.run(debug=True)