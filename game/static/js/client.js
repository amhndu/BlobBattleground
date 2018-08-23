class Lobby {
    constructor() {
        this.socket = io('http://' + document.domain + ':' + location.port);
        this.room_id = null
    }

    join(){
        this.room_id = document.getElementById('room_id').value;
        this.player = new PlayerModel(null, document.getElementById('username').value || 'Anonymous')
        this.socket.emit('join-lobby', this.room_id, this.player.name);
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
    constructor(id, name, posx=null, posy=null) {
        this.id = id
        this.name = name
        this.posx = posx
        this.posy = posy
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
        newScript.type = "application/javascript";
        newScript.src = src;
        newScript.onload = () => resolve();
        document.body.appendChild(newScript);
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
            })
            .then(function(){
                socket.on('lobby-update', (players) => {
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
                })   
            });
    });

    socket.on('lobby-joined', (player_id, players) => {
        window.player_id = player_id;
        console.log(players);
        console.log(player_id);
        fetchlobby(false)
            .then(function(){
                document.getElementById("room-id-display").innerHTML = lobby.room_id;
                document.getElementById("player-list").innerHTML = "";                
                for(let i = 0; i<players.length; i++){
                    let node = document.createElement("LI");
                    if(players[i] == null || players[i] == undefined)
                        continue;                 
                    let textnode = document.createTextNode(players[i]['id']+" "+players[i]['name']);       
                    node.appendChild(textnode);                              
                    document.getElementById("player-list").appendChild(node);   
                }
            })
            .then(function(){
                socket.on('lobby-update', (players) => {
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
                })
            });
    });


    socket.on('game-started', (players) => {
        console.log('Initiate game start. Loading scripts...');
        console.log('Initial Player positions:');
        console.log(players);
        Players = []
        for(let i = 0; i < players.length; i++){
            Players.push(new PlayerModel(players[i].id, players[i].name, players[i].posx, players[i].posy));
        }
        document.getElementById('app').classList.add('hidden');
        loadScript(libsrc)
            .then(() => loadScript(gamesrc));
    });

}

main();
