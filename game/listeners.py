from flask_socketio import emit, join_room
from flask import request
from game import socketio
from game.game_room import rooms, GameRoom
import json

sid_map = {}

@socketio.on('create-game')
def create(name):
    room = GameRoom()
    rooms[room.id] = room
    join_room(room.id)

    player = room.new_player(name)

    sid_map[request.sid] = (room.id, player.id)

    print('DBG game-created', room.id, player.name)
    emit('game-created', (room.id, player.id))


@socketio.on('join-game')
def join(room_id, name):
    room = rooms[room_id]
    join_room(room.room_id)

    player = room.new_player(name)

    sid_map[request.sid] = (room.id, player.id)

    print('DBG game-joined', room.id, player.id, player.name)
    emit('game-joined', (player.id, json.dumps(room.players, default=lambda o: o.__dict__)))

@socketio.on('start-game')
def start():
    room_id, player_id = sid_map[request.sid]
    room = rooms[room_id]
    player = room.players[player_id]
    if player == room.owner:
        print('starting game')
        emit('game-started', room=room_id)
    else:
        print('attempt to create game by non-owner')


