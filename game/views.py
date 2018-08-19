from game import app
from flask import render_template

@app.route('/')
def index():
    """Serve the index HTML"""
    return render_template('index.html')



