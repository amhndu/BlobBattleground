class Lobby {
    constructor() {
        this.socket = io('http://' + document.domain + ':' + location.port);
        this.room_id = null
    }

    join(){
        this.room_id = document.getElementById('room_id').value;
        this.player = new PlayerModel(null, document.getElementById('username').value || 'Anonymous')
        this.socket.emit('join-lobby', room, this.player.name);
        console.log('sent join lobby');
    }

    create(){
        this.player = new PlayerModel(null, document.getElementById('username').value || 'Anonymous')
        this.socket.emit('create-lobby', this.player.name);
        console.log('sent create lobby');
    }

    startGame(){
        this.socket.emit('start-game');
    }

    receiveUpdate(data){
        console.log('game update');
        console.log(data);
    }

}

class PlayerModel {
    constructor(id, name) {
        this.id = id
        this.name = name
    }
}

function fetchlobby(owner){
    return fetch('/lobby')
        .then(response => response.text())
        .then((html) => {
            document.getElementById("app").innerHTML = html;
            if(!owner){
                document.getElementById("owner-privileges").classList.add('hidden');
            }
        });
}


const lobby = new Lobby();
const gamesrc = document.currentScript.getAttribute('gamesrc');
const libsrc  = document.currentScript.getAttribute('libsrc');

function loadScript(src) {
    console.log('Loading ' + src);
    return new Promise((resolve, reject) => {
        let newScript = document.createElement("script");
        newScript.src = src;
        newScript.onload = () => resolve();
        document.head.appendChild(newScript);
    });
}

function main() {
    const socket = lobby.socket;
    // verify our websocket connection is established
    socket.on('connect', () => {
        console.log('Websocket connected!');
    });

    socket.on('lobby-created', (room_id, player_id) => {
        console.log(room_id);
        console.log(player_id);
        fetchlobby(true)
            .then(function(){
                document.getElementById("room-id-display").innerHTML = room_id;
                let node = document.createElement("LI");                 
                let textnode = document.createTextNode(player_id+" "+lobby.player.name);       
                node.appendChild(textnode);                              
                document.getElementById("player-list").appendChild(node);
            });
    });

    socket.on('lobby-joined', (player_id) => {
        window.player_id = player_id;
        fetchlobby(false)
            .then(function(){
                document.getElementById("room-id-display").innerHTML = lobby.room_id;
            });
    });

    socket.on('room-update', (players) => {
        console.log(players);
        var players = JSON.parse(players);
        document.getElementById("player-list").innerHTML = "";                
        for(let i = 0; i<players.length; i++){
            let node = document.createElement("LI");
            if(players[i] == null || players[i] == undefined)
                continue;                 
            let textnode = document.createTextNode(players[i]['id']+" "+players[i]['name']);       
            node.appendChild(textnode);                              
            document.getElementById("player-list").appendChild(node);	
        }
    });



    socket.on('game-started', () => {
        console.log('Initiate game start. Loading scripts...');
        document.getElementById('app').classList.add('hidden');
        loadScript(libsrc)
            .then(() => loadScript(gamesrc));
    });

    socket.on('lobby-update', lobby.receiveUpdate);


}

main();
