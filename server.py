from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, emit
import random
import string

# initialize Flask
app = Flask(__name__)
socketio = SocketIO(app)
ROOMS = {} # dict to track active rooms

@app.route('/')
def index():
    """Serve the index HTML"""
    return render_template('index.html')

class Game:
    def __init__(self, name):
        self.name = name
        self.room_id = ''.join(random.SystemRandom().choice(
        string.ascii_uppercase) for _ in range(5))

@socketio.on('create')
def on_create(data):
    """Create a game lobby"""
    gm = Game(
        name=data['name'])
    room = gm.room_id
    ROOMS[room] = gm
    join_room(room)
    emit('join_room', {'room': room})
    
    # Print all room ids and names till now
    for rm in ROOMS.values():
        print(rm.room_id, rm.name)

if __name__ == '__main__':
    socketio.run(app, debug=True)