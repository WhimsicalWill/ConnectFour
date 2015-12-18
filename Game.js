var gameHeight = gameWidth = 660;
//The diameter of an indivual connect four piece
var pieceLength = Math.floor(gameHeight / 7);
//Make a new phaser game, with which we can draw graphics onto
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', {create: create, update: update});

function create() {
    //Center the phaser game
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    //If the spacebar is pressed, go to the setPieceDropped function
    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.add(setPieceDropped, this);

    //If the left arrow key is pressed, go to the movePieceLeft function
    left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    left.onDown.add(movePieceLeft, this);

    //If the right arrow key is pressed, go to the movePieceRight function
    right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    right.onDown.add(movePieceRight, this);
    
    //draw the outline of the board
    drawBoard();
}

//the update method is called every frame
function update() {
    //If pieceDropped is true, then call the dropPiece method so we can animate the dropping of a piece
    if (pieceDropped) {
        //Add an eighth of pieceLength to the y position of the piece, for a smooth animation
        //pieceDroppedY will be checked in dropPiece, to ensure it is not colliding with another piece, or outside of the board
        pieceDroppedY += pieceLength / 8;
        dropPiece(pieceDroppedY, pieceDroppedX);
    }
        
    //If it is the opponent's turn, and the game is not over, and we are not in the middle of an animation, find the best move
    if (!playerTurn && !pieceDropped && !isGameOver) {
        buildTree(board, 0, 0, playerTurn);
    }
}

//A function which can easily be plugged into the code in order to get the algorithm to play itself and move whenever space is pressed
function playAgainstSelf() {
    buildTree(board, 0, 0, playerTurn);   
}

//This method is called to ensure that we can drop a piece
function setPieceDropped() {
    //set x to the current column ballGraphics is hovering over
    var x = Math.floor(ballGraphics.position.x / pieceLength);
    
    //If the game is over, reset the board and return
    if (isGameOver) {
        resetBoard();
        return;
    }
    
    //If the column we want to move in is empty and it is the human player's turn, set pieceDropped to true to begin an animation
    if (isColumnEmpty(board, x) && playerTurn) 
        pieceDropped = true;   
}