from game import app
from game.game_room import GameRoom
from game import socketio
import json

def game_loop(game_room):
    app.logger.debug("%s's game loop started", game_room.id)
    while game_room.state != GameRoom.State.Finished:
        #socketio.emit('game-update', {'players': json.dumps(game_room.players, default=lambda o: o.__dict__)}, room=game_room.id)
        socketio.sleep(1) # 0
    app.logger.debug("%s's game loop ended", game_room.id)

