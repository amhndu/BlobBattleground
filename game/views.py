from game import app
from flask import render_template, redirect
from game.game_room import GameRoom, rooms

@app.route('/')
def index():
    """Serve the index HTML"""
    return render_template('index.html')

@app.route('/lobby')
def join_game():
    return render_template('lobby.html')
