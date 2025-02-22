from flask import Flask, jsonify, send_from_directory
import os

app = Flask(__name__)

@app.route('/data/<path:filename>')
def get_data(filename):
    base_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'Vallhalla')
    return send_from_directory(base_dir, filename)

if __name__ == '__main__':
    app.run(debug=True)