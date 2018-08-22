var config = {
    renderer: Phaser.AUTO,
    width: 1020,
    height: 728,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    state: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

class Player {

}

function preload(){
}

let player;
let cursors;
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = this.add.graphics(game.world.centerX, game.world.centerY);
    player.beginFill(0xFF4370, 1);
    player.drawCircle(0, 0, 60);

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.drag.set(200);
    player.body.maxVelocity.set(200);

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    const delta_map = { left: { x: -1, y: 0 }, right: { x: 1, y: 0}, up: { x: 0, y: -1 }, down: { x: 0, y: 1}};
    const delta = { x: 0, y: 0 };
    for (dir in cursors) {
        if (cursors[dir].isDown) {
            delta.x += delta_map[dir].x;
            delta.y += delta_map[dir].y;
        }
    }
    
    player.body.velocity.x += delta.x * 100;
    player.body.velocity.y += delta.y * 100;
}
