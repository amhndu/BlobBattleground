from game.player import Player
import random
import string

rooms = {} # dict to track active rooms

class GameRoom:
    def __init__(self):
        self.id = self.generate_room_id()
        self.players = []
        self.owner = None

    def new_player(self, *args):
        p = None
        if len(self.players) == 0:
            p = self.owner = Player(0, *args)
        else:
            p = Player(len(self.players), *args)
        self.players.append(p)
        return p


    def generate_room_id(self):
        room_id = ''.join(random.SystemRandom().choice(
            string.ascii_uppercase) for _ in range(5))
        if room_id in rooms:
            self.generate_room_id()
        else:
            return room_id
