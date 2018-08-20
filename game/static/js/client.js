const socket = io('http://' + document.domain + ':' + location.port);
// verify our websocket connection is established
socket.on('connect', function() {
	console.log('Websocket connected!');
});

socket.on('game-created', function(room_id, player_id) {
	//implement fetch
	console.log(room_id);
	console.log(player_id);
})

socket.on('game-joined', function(player_id, players) {
	console.log(player_id);
	console.log(players);
})

var username = prompt("Username");
socket.emit('set-username', username);

function joinGame(){
	let room = document.getElementById('room_id').value;
	socket.emit('join-game', username);
}

function createGame(){
	socket.emit('create-game', username);
}