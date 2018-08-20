const websocket = io('http://' + document.domain + ':' + location.port);
// verify our websocket connection is established
websocket.on('connect', function() {
	console.log('Websocket connected!');
    websocket.emit('join-room', location.hash.substring(1));
});

websocket.on('joined-room', function(id, players) {
    if (id == 0)
    console.log(id);
    console.log(players);
});
