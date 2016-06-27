var websocket = io.connect();
var game = new Phaser.Game(screen.width, screen.height-120, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('background','img/debug-grid-1920x1920.png');
    game.load.image('player','img/peque.png');
    game.load.image('dot', 'img/dot.png');
    game.load.spritesheet('pacman', 'img/pacman.png', 32, 32);

}

var player;
var cursors;
var players = new Object();
var myId = guid();
var dots;
var score;
var puntos = 0;



websocket.on('createPlayer', function(data){
        
                myId = data.id;
                
        
});


function create() {
    //websocket.emit('newplayer',{corx: game.world.centerX,cory: game.world.centerY});
        console.log(myId); 

        game.add.tileSprite(0, 0, 1920, 1920, 'background');

        game.world.setBounds(0, 0, 1920, 1920);

        game.physics.startSystem(Phaser.Physics.P2JS);

        
        players[myId] = game.add.sprite(game.world.centerX, game.world.centerY, 'pacman',0);
        players[myId].anchor.setTo(0.5, 0.5);
        players[myId].animations.add('munch', [0, 1, 2, 1], 20, true);


        //game.physics.p2.enable(players[myId]);
        game.physics.enable(players[myId],Phaser.Physics.ARCADE);
        players[myId].body.allowRotation = false;
        //players[0] = game.add.sprite(20, 20, 'player');

        players[myId].body.fixedRotation = true;
        players[myId].body.collideWorldBounds = true; //Limita el player al mapa
        //players[myId].body.setSize(16, 16, 0, 0);

        cursors = game.input.keyboard.createCursorKeys();

        players[myId].play('munch');
        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        game.camera.follow(players[myId], Phaser.Camera.FOLLOW_LOCKON);
        //game.camera.follow(players[myId]);

        dots = game.add.physicsGroup();
        for (var i = 0; i < 2000; i++) {
            dots.create(getRandomArbitrary(30, 1900),getRandomArbitrary(30, 1900),'dot');
        };
        var style = {font: "65px Arial"};
        score = game.add.text(screen.width,20,puntos,style);
        score.fixedToCamera = true;
        score.cameraOffset.setTo(screen.width-200, 20);
        console.log(players);

}

function update() {
        //players[myId].body.setZeroVelocity();

        players[myId].scale.x = 1;
        players[myId].angle = 0;

        if (cursors.up.isDown)
        {
            //players[myId].body.moveUp(300);
            players[myId].y += -5;
            players[myId].angle = 270;
            //websocket.emit('newplayer',{corx: players[myId].x,cory:players[myId].y});
        }
        else if (cursors.down.isDown)
        {
            //players[myId].body.moveDown(300);
            players[myId].y += 5;
            players[myId].angle = 90;
            //websocket.emit('newplayer',{corx: players[myId].x,cory:players[myId].y});
        }

        if (cursors.left.isDown)
        {
            //players[myId].body.velocity.x = -300;
            players[myId].x += -5;
            players[myId].scale.x = -1;
            //websocket.emit('newplayer',{corx: players[myId].x,cory:players[myId].y});
        }
        else if (cursors.right.isDown)
        {
            players[myId].x += 5;
            //players[myId].body.moveRight(300);
            //websocket.emit('newplayer',{corx: players[myId].x,cory:players[myId].y});
        }

        players[myId].rotation = game.physics.arcade.moveToPointer(players[myId], 20, game.input.activePointer, 1900);
        
        game.physics.arcade.overlap(players[myId],dots,eatDot,null,this);

}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(players[myId], 32, 500);
    
}

function eatDot(pacman, dot){
    dot.kill();
    puntos++;
    score.text = puntos;
}


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}