from game.player import Player
import random
import string
from enum import Enum, auto

rooms = {} # dict to track active rooms

class GameRoom:
    class State(Enum):
        Lobby       = auto()
        Playing     = auto()
        Finished    = auto()

    def __init__(self):
        self.id = self.generate_room_id()
        self.players = []
        self.owner = None
        self.state = GameRoom.State.Lobby
        self.dimension_x = 300
        self.dimension_y = 300

    def new_player(self, *args):
        p = None
        if len(self.players) == 0:
            p = self.owner = Player(0, *args)
        else:
            p = Player(len(self.players), *args)
        self.players.append(p)
        return p

    def remove_player(self, p_id):
        if p_id >= 0 and p_id < len(self.players):
            self.players[p_id] = None
        return p_id

    def update_player(self, p_id, data):
        if p_id not in range(len(self.players)):
            return

        for attr in ('posx', 'posy', 'velx', 'vely'):
            setattr(self.players[p_id], attr, data[attr])

    def generate_room_id(self):
        room_id = ''.join(random.SystemRandom().choice(
            string.ascii_uppercase) for _ in range(5))
        if room_id in rooms:
            self.generate_room_id()
        else:
            return room_id

    def spawn_players(self):
        for player in self.players:
            if player is not None:
                player.posx = random.randrange(0, self.dimension_x)
                player.posy = random.randrange(0, self.dimension_y)
