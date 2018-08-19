from flask_socketio import emit, join_room
from flask import request
from game import socketio
from game.game_room import rooms
from game.player import Player
import json

sid_map = {}

@socketio.on('join-room')
def connect(room_id):
    room = rooms[room_id]
    join_room(room.room_id)

    client_id = len(room.players)
    player = Player(client_id)
    if client_id == 0:
        room.owner = player
    room.players.append(player)

    sid_map[request.sid] = (room_id, client_id)
    print(request.sid, room_id, client_id)

    emit('joined-room', (client_id, json.dumps(room.players, default=lambda o: o.__dict__)))

