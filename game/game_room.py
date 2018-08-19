import random
import string

class GameRoom:
    def __init__(self):
        self.room_id = ''.join(random.SystemRandom().choice(
            string.ascii_uppercase) for _ in range(5))
        self.players = []
        self.owner = None

    def add_player(self, player):
        self.players.append(player)

    def set_owner(self, owner):
        self.owner = owner

    def update_player_name(self, player_id, name):
    	self.players[player_id].username = name

