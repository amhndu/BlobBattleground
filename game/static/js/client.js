const socket = io('http://' + document.domain + ':' + location.port);
// verify our websocket connection is established
socket.on('connect', function() {
	console.log('Websocket connected!');
});

var username = prompt("Username");
socket.on('game-created', function(room_id, player_id) {
	console.log(room_id);
	console.log(player_id);
	fetchlobby(true);
	setTimeout(function(){
		document.getElementById("room-id-display").innerHTML = room_id;
		let node = document.createElement("LI");                 
		let textnode = document.createTextNode(player_id+" "+username);       
		node.appendChild(textnode);                              
		document.getElementById("player-list").appendChild(node);
	}, 1000);
});

socket.on('game-joined', function(player_id, players) {
	console.log(player_id);
	console.log(players);
	fetchlobby(false);
	//document.getElementById("room-id-display").innerHTML = window.room_id;
	var players = JSON.parse(players);
	setTimeout(function(){
		document.getElementById("room-id-display").innerHTML = window.room_id;
		let node = document.createElement("LI");
		console.log(players);                 
		for(let i = 0; i<players.length; i++){
			let node = document.createElement("LI");                 
			let textnode = document.createTextNode(players[i]['id']+" "+players[i]['name']);       
			node.appendChild(textnode);                              
			document.getElementById("player-list").appendChild(node);	
		}
	}, 1000);
});

function joinGame(){
	var room = document.getElementById('room_id').value;
	window.room_id = room;
	socket.emit('join-game', room, username);
}

function createGame(){
	socket.emit('create-game', username);
}

function fetchlobby(owner){
	fetch('/lobby')
		.then(function(response){
			return response.text();
		})
		.then(function(html){
			document.getElementById("app").innerHTML = html;
			if(!owner){
				document.getElementById("owner-privileges").style.visibility = "hidden";
			}
		});
}