from flask_socketio import emit, join_room, leave_room
from game import app
from game.game_room import GameRoom
from game import socketio
import json
from game import utilities as ut

def game_loop(game_room):
    app.logger.debug("%s's game loop started", game_room.id)
    while game_room.state == GameRoom.State.Playing:
        socketio.emit('game-update', ut.serialize_player(game_room.players, ['id','posx','posy', 'velx', 'vely']), room=game_room.id)
        #app.logger.debug('update sent to %s', game_room.id)
        socketio.sleep(0.05) # 0
    app.logger.debug("%s's game loop ended", game_room.id)

