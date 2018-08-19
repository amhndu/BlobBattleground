from flask_socketio import SocketIO, emit, join_room, close_room
from game import socketio
from game.game_room import GameRoom
from game.player import Player
from flask import request

rooms = {} # dict to track active rooms
player = [] # dict to track players

@socketio.on('create')
def on_create():
    """Create a game lobby"""
    gm = GameRoom()
    room = gm.room_id
    rooms[room] = gm
    join_room(room)
    emit('join_room', {'room': room})
    
    # Print all room ids and names till now
    for rm in rooms.values():
        print(rm.room_id)

@socketio.on('set-username')
def on_set_username(name):
	"""User wants to set his name"""
	rooms[sid_map[request.sid][0]].update_player_name(sid_map[request.sid][1], name)




