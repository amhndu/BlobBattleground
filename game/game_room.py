import random
import string

rooms = {} # dict to track active rooms

class GameRoom:
    def __init__(self):
        self.room_id = self.generate_room_id()
        self.players = []
        self.owner = None

    def add_player(self, player):
        self.players.append(player)

    def set_owner(self, owner):
        self.owner = owner

    def generate_room_id(self):
        room_id = ''.join(random.SystemRandom().choice(
            string.ascii_uppercase) for _ in range(5))
        if room_id in rooms:
            self.generate_room_id();
        else:
            return room_id
