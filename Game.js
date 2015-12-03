var gameHeight = gameWidth = 660;
var pieceLength = Math.floor(gameHeight / 7);
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', {preload: preload, create: create, update: update});

function preload() {
    
}

function create() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.add(setPieceDropped, this);

    left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    left.onDown.add(movePieceLeft, this);

    right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    right.onDown.add(movePieceRight, this);
    
    drawBoard();
}

function update() {
    updateBallFill();
    //Enemy move
    if (pieceDropped) {
        pieceDroppedY += (pieceLength / 2) / 4;
        dropPiece(pieceDroppedY, pieceDroppedX);
    }
        
    if (!playerTurn && !pieceDropped && !isGameOver) {
        buildTree(board, 0, 0, playerTurn);
    }
}

function playAgainstSelf() {
    buildTree(board, 0, 0, playerTurn);   
}

function setPieceDropped() {
    var x = Math.floor(ballGraphics.position.x / pieceLength);
    console.log(isColumnEmpty(board, x) + " " + playerTurn);
    if (isGameOver) {
        resetBoard();
        return;
    }
    if (isColumnEmpty(board, x) && playerTurn) 
        pieceDropped = true;   
}

function updateBallFill() {
    
}