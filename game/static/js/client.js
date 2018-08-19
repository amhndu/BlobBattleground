const websocket = io('http://' + document.domain + ':' + location.port);
// verify our websocket connection is established
websocket.on('connect', function() {
	console.log('Websocket connected!');
});