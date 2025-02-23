from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/Paper/<path:filename>')
def serve_paper_files(filename):
    paper_dir = os.path.join(app.root_path, 'Paper')
    return send_from_directory(paper_dir, filename)


@app.route('/Live/<path:filename>')
def serve_live_files(filename):
    live_dir = os.path.join(app.root_path, 'PaLiveper')
    return send_from_directory(live_dir, filename)

@app.route('/account/<account_id>')
def account_page(account_id):
    # Fetch account data based on account_id
    account_data = get_account_data(account_id)  # Replace with your data retrieval logic
    return render_template('account.html', account=account_data)

if __name__ == '__main__':
    app.run(debug=True, port=8000)