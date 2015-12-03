//We will be moving the ball's graphics position, and we don't want other things to be affected.
var boardGraphics, ballGraphics;
var boardHeight = pieceLength * 6;
var boardWidth = pieceLength * 7;
var moveCount = 0;
var playerTurn = false;
var isGameOver = false;
var pieceDropped = false;
var pieceDroppedX = 0;
var pieceDroppedY = pieceLength / 2;
var red = 0xFF0000;
var yellow = 0xFFFF00;

var board = [[" ", " ", " ", " ", " ", " ", " "],
             [" ", " ", " ", " ", " ", " ", " "],
             [" ", " ", " ", " ", " ", " ", " "],
             [" ", " ", " ", " ", " ", " ", " "],
             [" ", " ", " ", " ", " ", " ", " "],
             [" ", " ", " ", " ", " ", " ", " "]];

//Draw the grid lines of the board, and set properties of some graphics objects.
function drawBoard() {
    game.stage.backgroundColor = 0xffffff;
    boardGraphics = game.add.graphics(0, 0);
    
    //If the game did not just end
    if (!isGameOver)
        ballGraphics = game.add.graphics(boardWidth / 2, pieceLength / 2);
    isGameOver = false;
    boardGraphics.lineStyle(1.5, 0x000000);
    
    //Drawing the Vertical Lines
    //There are 7 spaces, but 8 lines.
    for (var i = 0; i < 8; i++) {
        var x = i / 7 * boardWidth;
        //To fix the line from being cut off
        if (x == 0)
            x = 1;
        else if (x == boardWidth)
            x = boardWidth - 1;
        boardGraphics.moveTo(x, pieceLength);
        boardGraphics.lineTo(x, boardWidth);
    }
    
    //Drawing the Horizontal Lines
    //There are 6 spaces, but 7 lines.
    for (var i = 0; i < 7; i++) {
        var y = i / 6 * boardHeight;
        boardGraphics.moveTo(0, y + pieceLength);
        boardGraphics.lineTo(boardWidth, y + pieceLength);
    }
    
    setColor(yellow);
}
//Changes the circle that the player / ai is dropping into the board's color
function setColor(color) {
    //Draws a white circle in order to make the space blank
    ballGraphics.clear();
    
    ballGraphics.lineStyle(1.5, 0x000000);
    ballGraphics.beginFill(color, 0.5);
    ballGraphics.drawCircle(0, 0, pieceLength);
    ballGraphics.endFill();
}

function movePieceRight() {
    console.log("movePieceRight");
    
    //If the piece is not already in the rightmost position
    if (ballGraphics.position.x < 6 * pieceLength && !pieceDropped && !isGameOver)
        ballGraphics.position.x += pieceLength;
}

function movePieceLeft() {
    console.log("movePieceLeft");
    
    //If the piece is not already in the leftmost position
    if (ballGraphics.position.x >= pieceLength && !pieceDropped && !isGameOver)
        ballGraphics.position.x -= pieceLength;
}

//pieceX is can be 0 for human turn, it will be set in this code
function dropPiece(pieceY, pieceX) {
    if (playerTurn) 
        var pieceX = Math.floor(ballGraphics.position.x / pieceLength); 
    else 
        ballGraphics.position.x = pieceX * pieceLength + pieceLength / 2;
    
    if (Math.ceil((pieceY - pieceLength * 1.5) / pieceLength) < 6 && board[Math.ceil((pieceY - pieceLength * 1.5) / pieceLength)][pieceX] == " ")
        ballGraphics.position.y = pieceY;
    else {
        pieceDropped = false;
        pieceDroppedY = 0;
        makeMove((ballGraphics.position.x - pieceLength / 2) / pieceLength, Math.floor((pieceY - pieceLength) / pieceLength));
        
        //If the game is over, we want the ball to be offscreen (don't reset pos)
        if (!isGameOver) {
            ballGraphics.position.y = pieceDroppedY = pieceLength / 2;
            ballGraphics.position.x = pieceLength * 3 + pieceLength / 2; 
        }
        //We are up to move, so change color to yellow
        setColor(yellow);
    }
}

//Returns true if column can be moved in
function isColumnEmpty(board, x) {
    if (board[0][x] == " ")
        return true;
    return false;
}

function resetBoard() {
    clearBoard();
    boardGraphics.clear();
    drawBoard();
    text.destroy();
    ballGraphics.position.y = pieceLength / 2;
    moveCount = 0;
    playerTurn = false;
}

function clearBoard() {
    for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 6; y++) {
            board[y][x] = " "; 
        }
    }
}

//Sets move and handles things like checking for wins and drawing
function makeMove(x, y) {
    console.log(x + " " + y);
    moveCount++;
    if (playerTurn) {
        type = "y"
        boardGraphics.beginFill(yellow, 0.5);
    }
    else {
        type = "r"
        boardGraphics.beginFill(red, 0.5); 
    }
    
    setMove(board, x, y, type);
    //We are drawing on the board graphics, where 0,0 is at the top left of the whole webpage
    //We want to start this one pieceLength beneath that while also adding half a pieceLength in order to center
    boardGraphics.drawCircle(x * pieceLength + pieceLength / 2, (y + 1) * pieceLength + pieceLength / 2, pieceLength);
    boardGraphics.endFill();
    
    //Check for wins based off of the move we just made 
    console.log("pos: " + ballGraphics.position.y);
    if (checkForWin(board, x, y, type)) 
        gameOver(type);
    if (isFull(board)) {
        gameOver("tie");  
    }
    playerTurn = !playerTurn;
}

function setMove(board, x, y, type) {
    board[y][x] = type;
}

function checkForWin(board, x, y, type) {
    //Gets the x coordinate of the last move and checks that column for a win
    for (var i = 0, j = 1; i < 6; i++, j++) {
        if (board[i][x] != type) 
            j = 0;
        else if (j == 4) 
            return true;
    }
    
    //Gets the y coordinate of the last move and checks that row for a win
    for (var i = 0, j = 1; i < 7; i++, j++) {
        if (board[y][i] != type) 
            j = 0;
        else if (j == 4) 
            return true;
    }
    
    //Check forward diagonal for 4 in a row
    //The pointers for going up and to the right.
    pointerOneX = x;
    pointerOneY = y;
    
    //The pointers for going down and to the left.
    pointerTwoX = x;
    pointerTwoY = y;
    
    count = 1;
    var pointerOneDone = false;
    var pointerTwoDone = false;
    while ((board[pointerOneY][pointerOneX] == type || board[pointerTwoY][pointerTwoX] == type) && (!pointerOneDone || !pointerTwoDone)) {
        
        //Pointers for going up and to the right
        if (pointerOneY - 1 >= 0 && pointerOneX <= 6 && board[pointerOneY - 1][pointerOneX + 1] == type) {
            pointerOneX++;
            pointerOneY--;
            count++;
        }
        else 
            pointerOneDone = true;
        
        //Pointers for going down and to the left
         if (pointerTwoY + 1 <= 5 && pointerTwoX - 1 >= 0 && board[pointerTwoY + 1][pointerTwoX - 1] == type) {
            pointerTwoX--;
            pointerTwoY++;
            count++;
        }
        else 
            pointerTwoDone = true;
        
        if (count >= 4) 
            return true;   
    }
    
    //Reset pointers for checking backward diagonal for win
    //The pointers for going up and to the left.
    pointerOneX = x;
    pointerOneY = y;

    //The pointers for going down and to the right.
    pointerTwoX = x;
    pointerTwoY = y;
    
    count = 1;
    var pointerOneDone = false;
    var pointerTwoDone = false;
    while ((board[pointerOneY][pointerOneX] == type || board[pointerTwoY][pointerTwoX] == type) && (!pointerOneDone || !pointerTwoDone)) {
        
        //Pointers for checking up and to the left
        if (pointerOneY - 1 >= 0 && pointerOneX - 1 >= 0 && board[pointerOneY - 1][pointerOneX - 1] == type) {
            pointerOneX--;
            pointerOneY--;
            count++;
        }
        else 
            pointerOneDone = true;
        
        //Pointers for checking down and to the right
        if (pointerTwoY + 1 <= 5 && pointerTwoX + 1 <=6 && board[pointerTwoY + 1][pointerTwoX + 1] == type) {
            pointerTwoX++;
            pointerTwoY++;
            count++;
        }
        else 
            pointerTwoDone = true;   
        
        if (count >= 4) 
            return true;   
    }
    return false;
}

function gameOver(type) {
    ballGraphics.position.y = -500;
    switch (type) {
        case "r":
            text = game.add.text(280, 40, "red wins");
            break;
        case "y":
            text = game.add.text(260, 40, "yellow wins");
            break;
        default:
            text = game.add.text(300, 40, "tie");
    }
    isGameOver = true;
}

function sleep(milliseconds) {
    console.log("sleep");
    var start = new Date().getTime();
    while ((new Date().getTime() - start) < milliseconds);
}

function copyBoard(board) {
    var boardCopy = [[" ", " ", " ", " ", " ", " ", " "],
             [" ", " ", " ", " ", " ", " ", " "],
             [" ", " ", " ", " ", " ", " ", " "],
             [" ", " ", " ", " ", " ", " ", " "],
             [" ", " ", " ", " ", " ", " ", " "],
             [" ", " ", " ", " ", " ", " ", " "]];
    
    for (x = 0; x < 7; x++) {
        for (y = 0; y < 6; y++) {
            if (board[y][x] != " ")
                boardCopy[y][x] = board[y][x];
        }
    }
    return boardCopy;
}

//gets the coordinates of every single move that can be dropped into a given board
function getMoves(board) {
    var moves = [];
    for(var x = 0; x < 7; x++){
        var y = 0;
        while(y <= 5 && board[y][x] == " ") {
            y++;
        }
        
        //Don't push a move if the column is filled up
        if (y != 0) 
            moves.push([y - 1, x]);
    }
    return moves;
}

function isFull (board) {
    //if one square on the board is empty, return false
    for (var x = 0; x < 7; x++) {
        for(var y = 0; y < 6; y++) {
            if (board[y][x] == " ")
                return false;
        }
    }
    return true
}
