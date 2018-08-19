from flask_socketio import SocketIO, emit, join_room, close_room
from game import socketio
from game.game_room import GameRoom, rooms



# @socketio.on('create')
# def on_create():
#     """Create a game lobby"""
#     gm = GameRoom()
#     room = gm.room_id
#     rooms[room] = gm
#     join_room(room)
#     emit('join_room', {'room': room})
    
#     # Print all room ids and names till now
#     for rm in rooms.values():
#         print(rm.room_id)
