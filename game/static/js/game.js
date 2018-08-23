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
        state = {
            id: this.player.id,
            pos_x: this.player.view.body.x,
            pos_y: this.player.view.body.y
        };
        return state;
    }
}

class NetworkController {
    constructor() {
        this.players = {};
    }

    addPlayer(player) {
        this.players[player.id] = player
    }

    networkUpdate(players) {
        console.log('Network Update');
        console.log(players);
        //players.forEach((item, index, arr) => {
            
        //});
    }
}

let keyboardController = null;
let networkController = null;

class PlayState {
    preload() {
        // load images and stuff here
    }

    createPlayerView(physics) {
        let playerView = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY);
        playerView.beginFill(0xFF4370, 1);
        playerView.drawCircle(0, 0, 60);

        if (physics) {
            this.game.physics.enable(playerView, Phaser.Physics.ARCADE);
            playerView.body.drag.set(200);
            playerView.body.maxVelocity.set(200);
        }

        return playerView;
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        let player = new Player(lobby.self_id, this.createPlayerView(true));
        let cursors = this.game.input.keyboard.createCursorKeys();
        keyboardController = new KeyboardController(player, cursors);

        networkController = new NetworkController();
        lobby.socket.on('game-update', (players) => {
            var data = JSON.parse(players);
            networkController.networkUpdate(players);
            //lobby.socket.emit('client-update', keyboardController.stateSnapshot());
        });
    }

    update() {
        keyboardController.update();
    }
}

function gameSetup(players) {
    console.log(players);
    //var player = JSON.parse(players);

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
        state: new PlayState()
    };

    let game = new Phaser.Game(config);
    console.log('Created Phaser game');
}
