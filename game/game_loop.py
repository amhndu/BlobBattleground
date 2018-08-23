from flask_socketio import emit, join_room, leave_room
from game import app
from game.game_room import GameRoom
from game import socketio
import json
from game import utilities as ut

def game_loop(game_room, current_app):
    app.logger.debug("%s's game loop started", game_room.id)
    with current_app.app_context():
	    while game_room.state != GameRoom.State.Finished:
	        socketio.emit('game-update', ut.serialize_player(game_room.players, ['id','posx','posy']), room=game_room.id)
	        app.logger.debug('update sent to %s', game_room.id)
	        socketio.sleep(1) # 0
    app.logger.debug("%s's game loop ended", game_room.id)

