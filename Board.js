//We will be moving the ball's graphics position, and we don't want other things to be affected.
var boardGraphics, ballGraphics;
var moveCount = 0;
var playerTurn = true;

var board = [[" ", " ", " ", " ", " ", " ", " "],
             [" ", " ", " ", " ", " ", " ", " "],
             [" ", " ", " ", " ", " ", " ", " "],
             [" ", " ", " ", " ", " ", " ", " "],
             [" ", " ", " ", " ", " ", " ", " "],
             [" ", " ", " ", " ", " ", " ", " "]];


function drawBoard() {
    game.stage.backgroundColor = 0xffffff;
    boardGraphics = game.add.graphics(0, 0);
    ballGraphics = game.add.graphics(gameWidth / 2, pieceLength / 2);
    boardGraphics.lineStyle(2, 0x000000);
    
    
    //Drawing the Vertical Lines
    //There are 7 spaces, but 8 lines.
    for (var i = 0; i < 8; i++) {
        var x = i / 7 * gameWidth;
        //To fix the line from being cut off
        if (x == 0)
            x = 1;
        else if (x == gameWidth)
            x = gameWidth - 1;
        boardGraphics.moveTo(x, 0);
        boardGraphics.lineTo(x, gameHeight);
    }
    //Drawing the Horizontal Lines
    //There are 6 spaces, but 7 lines.
    for (var i = 0; i < 7; i++) {
        var y = i / 6 * gameHeight;
        boardGraphics.moveTo(0, y);
        boardGraphics.lineTo(gameWidth, y);
    }
    
    //Draw the piece that we can choose where to drop down
    ballGraphics.lineStyle(2, 0x000000);
    ballGraphics.beginFill(0xFFFF00, 0.5);
    ballGraphics.drawCircle(0, 0, pieceLength);
    ballGraphics.endFill();
}

function movePieceRight() {
    console.log("movePieceRight");
    
    //If the piece is not already in the rightmost position
    if (ballGraphics.position.x < 660)
        ballGraphics.position.x += pieceLength;
    
    //drawPieceChoice(pieceX);
}

function movePieceLeft() {
    console.log("movePieceLeft");
    
    //If the piece is not already in the leftmost position
    if (ballGraphics.position.x >= pieceLength)
        ballGraphics.position.x -= pieceLength;
    
}

function dropPiece() {
    console.log("dropPiece");
    
    var x = Math.floor(ballGraphics.position.x / pieceLength);
    var y = 0;
    console.log("x: " + x + " y: " + y);
    console.log(board);
    console.log(board[y][x] === " ");
    //While the board[y][x] is blank and y is not less than the bottom row
    while (y <= 5 && board[y][x] === " ") {
        //^^^THIS IS THROWING THE ERROR
        console.log(y);
        //We add to y because of the way the board array is written. Ex: bottom row is 5
        y++
    }
    setMove(x, y - 1, "r");
}

function clearBoard() {
    for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 6; y++) {
            board[y][x] = " "; 
        }
    }
}

function setMove(x, y, type) {
    console.log(y);
    board[y][x] = type;
    boardGraphics.beginFill(0xFFFF00, 0.5);
    boardGraphics.drawCircle(x * pieceLength + pieceLength / 2, y * pieceLength + pieceLength / 2, pieceLength);
    boardGraphics.endFill();
}