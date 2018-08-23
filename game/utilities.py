import json

def serialize_player(players, keylist):
	return json.dumps(players, default=lambda o: {key: o.__dict__[key] for key in keylist})
