import app
from flask import render_template, redirect
from game.game_room import GameRoom, rooms

@app.route('/')
def index():
    """Serve the index HTML"""
    return render_template('index.html')

@app.route('/create')
def create_room():
    room = GameRoom()
    rooms[room.id] = room
    url = "/game#" + room.id
    return redirect(url, code=302)

@app.route('/game')
def join_game():
    return render_template('waitingroom.html')
