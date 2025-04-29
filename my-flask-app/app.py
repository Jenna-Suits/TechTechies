import os
from flask import Flask, request, jsonify, send_from_directory
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv

# 1) Load .env
load_dotenv()

# 2) Flask setup, serve from public/
app = Flask(__name__, static_folder='public')
CORS(app)

# 3) Connect to Atlas via MONGO_URI in your .env
app.config['MONGO_URI'] = os.getenv('MONGO_URI')
mongo = PyMongo(app)

# 4) Collections
users = mongo.db.users
posts = mongo.db.posts

# 5) Serve static UI
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    fp = os.path.join(app.static_folder, path)
    if path and os.path.exists(fp):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')  # your login page

# 6) Login endpoint
@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    acct = data.get('username')
    pwd  = data.get('password')
    user = users.find_one({'accountID': acct, 'password': pwd})
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    return jsonify({'message': 'OK'}), 200

# 7) Registration endpoint
@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    users.insert_one({
        'accountID':   data['accountID'],
        'password':    data['password'],
        'email':       data.get('email',''),
        'phoneNumber': data.get('phoneNumber','')
    })
    return jsonify({'message': 'User created'}), 201

# 8) Posts API (example)
@app.route('/api/posts', methods=['GET','POST'])
def api_posts():
    if request.method == 'GET':
        all_posts = list(posts.find({}, {'_id': False}))
        return jsonify(all_posts), 200

    # POST new post
    p = request.get_json()
    posts.insert_one({
        'title':   p.get('title'),
        'content': p.get('content'),
        'author':  p.get('author')
    })
    return jsonify({'message': 'Post added'}), 201

if __name__ == '__main__':
    app.run(debug=True)