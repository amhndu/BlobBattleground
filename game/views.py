from game import app
from flask import render_template, redirect
from game.game_room import GameRoom, rooms

@app.route('/')
def index():
    """Serve the index HTML"""
    return render_template('index.html')

@app.route('/create')
def create_room():
    gm = GameRoom()
    room = gm.room_id
    rooms[room] = gm
    url = "/game/" + room
    return redirect(url, code=302)

@app.route('/game/<room_id>')
def join_game(room_id):
    return render_template('waitingroom.html')
