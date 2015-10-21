var gameWidth = 770;
var gameHeight = 660;
var pieceLength = gameHeight / 6;
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', {preload: preload, create: create, update: update});

function preload() {
    
}

function create() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.add(dropPiece, this);

    left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    left.onDown.add(movePieceLeft, this);

    right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    right.onDown.add(movePieceRight, this);
    
    drawBoard();
    
}

function update() {
    if (playerTurn) {
    }
    
    else {
        
    }
}