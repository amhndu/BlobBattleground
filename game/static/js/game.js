class Player {
    constructor(id, view) {
        this.id = id;
        this.view = view;
    }
}

class KeyboardController {
    constructor(player, cursors) {
        this.player = player;
        this.cursors = cursors;
    }

    update() {
        const dir_map = { left: { x: -1, y: 0 }, right: { x: 1, y: 0 }, up: { x: 0, y: -1 }, down: { x: 0, y: 1 }};
        const delta = { x: 0, y: 0 };

        for (let dir in this.cursors) {
            if (this.cursors[dir].isDown) {
                delta.x += dir_map[dir].x;
                delta.y += dir_map[dir].y;
            }
        }

        let view = this.player.view;
        view.body.velocity.x += delta.x * 100;
        view.body.velocity.y += delta.y * 100;
    }

    stateSnapshot() {
        let state = {
            id: this.player.id,
            posx: this.player.view.body.x,
            posy: this.player.view.body.y,
            velx: this.player.view.body.velocity.x,
            vely: this.player.view.body.velocity.y,
        };
        return state;
    }
}

class NetworkController {
    constructor() {
        this.players = {};
    }

    addPlayer(player) {
        this.players[player.id] = player;
    }

    networkUpdate(playerUpdate) {
        //console.log('Network Update');
        //console.log(playerUpdate);

        for(let i = 0; i<playerUpdate.length; i++){
            if(playerUpdate[i] == null) {
                continue;
                // player.hide()
            }

            if(playerUpdate[i].id == lobby.self_id)
                continue;

            let player = this.players[playerUpdate[i].id];
            player.view.position.x = playerUpdate[i].posx;
            player.view.position.y = playerUpdate[i].posy;
            if(stateBuffer.buffer.length > 0){
                player.view.body.velocity.x = ((stateBuffer.buffer[0][i].posx - playerUpdate[i].posx)/50);  
                player.view.body.velocity.y = ((stateBuffer.buffer[0][i].posy - playerUpdate[i].posy)/50);   
            }
            else{
                player.view.body.velocity.x = playerUpdate[i].velx;
                player.view.body.velocity.y = playerUpdate[i].vely;
            }
        }
    }
}

class StateBuffer {
    constructor() {
        this.min_buff_len = 10;
        this.buffer = [];
        this.status = "wait";
    }

    enqueue(gamestate) {
        this.buffer.push(gamestate);
        if(this.status == "wait" && this.buffer.length == this.min_buff_len){
            this.status = "ready";
        }
    }

    dequeue(gamestate) {
        let state = this.buffer[0];
        this.buffer.shift();    
        if(this.buffer.length == 0){
            this.status = "wait";
        }
        return state;
    }

    length() {
        return this.buffer.length;
    }

    isFull() {
        return (this.buffer.length >= min_buff_len ? true: false); 
    }
}

let keyboardController = null;
let networkController = null;
let stateBuffer = new StateBuffer();

class PlayState {
    constructor(initialPStates){
        this.initialPStates = initialPStates;
    }
    preload() {
        // load images and stuff here
    }

    createPlayerView(physics, initial_pos={x:0,y:0}) {
        let playerView = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY);
        playerView.beginFill(0xFF4370, 1);
        playerView.drawCircle(initial_pos.x, initial_pos.y, 60);

        if (physics) {
            this.game.physics.enable(playerView, Phaser.Physics.ARCADE);
            playerView.body.drag.set(200);
            playerView.body.maxVelocity.set(200);
        }

        return playerView;
    }

    create() {
        this.game.stage.disableVisibilityChange = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        networkController = new NetworkController();
        for (let i = 0; i<this.initialPStates.length; i++) {
            let pos = {x: this.initialPStates[i].posx, y: this.initialPStates[i].posy};
            let player = new Player(this.initialPStates[i].id, this.createPlayerView(true, pos));

            if (this.initialPStates[i].id == lobby.self_id) {
                let cursors = this.game.input.keyboard.createCursorKeys();
                keyboardController = new KeyboardController(player, cursors);
            } else {
                networkController.addPlayer(player);
            }
        }
        lobby.socket.on('game-update', (players) => {
            players = JSON.parse(players);
            stateBuffer.enqueue(players);
            //networkController.networkUpdate(players);
            lobby.socket.emit('client-update', JSON.stringify(keyboardController.stateSnapshot()));
        });
    }

    update() {
        keyboardController.update();
    }
}

function startNetworkUpdateLoop() {
    setInterval(function(){
        if(stateBuffer.status == "ready"){
            networkController.networkUpdate(stateBuffer.dequeue());
        }
        console.log("Buffer health: "+String(stateBuffer.buffer.length));  
    }, 50);
}

function gameSetup(players) {
    console.log(players);
    players = JSON.parse(players);

    const config = {
        renderer: Phaser.AUTO,
        width: 1020,
        height: 728,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        },
        state: new PlayState(players)
    };

    let game = new Phaser.Game(config);
    console.log('Created Phaser game');

    startNetworkUpdateLoop();
    console.log('Network update loop started');
}
