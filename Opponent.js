    function randomMove(posMoves) {
        var rand = Math.floor(Math.random() * posMoves.length);
        return posMoves[rand];
    }

function buildTree(board, x, y, playerTurn) {
    var currPlayer = playerTurn == true ? "y" : "r";
    var value;
    MAX_DEPTH = 7;
    bestMove = [];
    
    //On the first move, the ai will always return the middle spot, to reduce lag when loading website, we are hardcoding this
    if (moveCount == 0) {
        bestMove = [5, 3];
    }
    else
        var alpha = buildTree_r(board, x, y, currPlayer, -Infinity, Infinity, 0);
    
    pieceDroppedX = bestMove[1];
    pieceDropped = true;
    ballGraphics.position.x = bestMove[1] * pieceLength + pieceLength / 2;
    //Opponent has dropped a piece, so set the color to red
    setColor(red);
}

function buildTree_r(board, x, y, currPlayer, alpha, beta, depth) {
    //console.log(currPlayer + ": " + x + " " + y);
    if (depth > MAX_DEPTH) {
        return 0;
    }

    var otherPlayer = currPlayer == "y" ? "r" : "y";
    //console.log(board);
    //console.log("checkForWin " + otherPlayer + ": " + x + " " + y + " = " + checkForWin(board, x, y, otherPlayer));
    //console.log("checkForWin " + currPlayer + ": " + x + " " + y + " = " + checkForWin(board, x, y, currPlayer));
    //Add depth of wins and losses into consideration
    if (checkForWin(board, x, y, currPlayer) && depth != 0) {
        return 1 - depth / (MAX_DEPTH + 1);
    }
    else if (checkForWin(board, x, y, otherPlayer) && depth != 0) {
        return -1 + depth / (MAX_DEPTH + 1);
    }
    else if (isFull(board)) {
        //console.log("tie found at depth = " + depth);
        return 0;
    }

    var moveList = getMoves(board);
    //console.log(moveList);
    var saList = [];

    for (var i = 0; i < moveList.length; i++) {
        var boardCopy = copyBoard(board);
        
        setMove(boardCopy, moveList[i][1], moveList[i][0], currPlayer);
        
        //The current player is red or maxamizing player
        //if (otherPlayer == "y") {
            
            value = -buildTree_r(boardCopy, moveList[i][1], moveList[i][0], otherPlayer, alpha, beta, depth + 1);
            alpha = Math.max(alpha, value);
//            //if (value <= alpha) 
//                //continue;
//            
//            alpha = Math.max(alpha, value);
//            if (beta <= alpha) {
//                //Cut off beta branch
//                //console.log("Cut off beta branch");
//                break;   
//            }
//        }
//        else {
//            
//            value = -buildTree_r(boardCopy, moveList[i][1], moveList[i][0], otherPlayer, alpha, beta, depth + 1);
//            
////            if (value >= beta)
////                break; 
//            
//            beta = Math.min(beta, value);
//            if (beta <= alpha) {
//                //Cut off alpha branch
//                //console.log("Cut off alpha branch");
//                break;
//            }
//        }

        //push this value to the value list
        
        saList.push(value);
        
    }

    
    if (depth == 0) {
        console.log(saList);
            //If minimax doesn't have a conclusion, we will try to set ourselves up for four in a row
            if (alpha == 0) {
                var moveList = getMoves(board);
                var maxCount = 0; //the most amount of wins any of the moves have.
                var countList = [];
                for (var i = 0; i < saList.length; i++) {
                    //Even if the value value isn't 0, we will still have a count in the list
                    var count = 0; //the number of wins
                    if (saList[i] == 0) {
                        var posX = moveList[i][1];
                        var posY = moveList[i][0];

                        //Three in a row check # of 3 in a rows
                        //The piece that we will be checking for will be yellow.
                        count += (threeOutOfFour(posX, posY, board, "r", "y", 0) + threeOutOfFour(posX, posY, board, "y", "r", 0)) * 100;
                        
                        //find the amount of possible wins for us and the enemy combined.
                        //If the enemy has a lot of chances to win by going in a certain spot, we want to block that.
                        count += possibleFutureWins(posX, posY, "y", "y", 4) + possibleFutureWins(posX, posY, "r", "r", 4);
                        
                        if (count > maxCount) {
                            maxCount = count;
                        }
                    }
                    //push after the check for alpha == 0, because negative values must return 0
                    countList.push(count);
                }

            var posMoves = [];
            console.log(countList);
            console.log(maxCount);
            for (var n = 0; n < countList.length; n++) {
                //check saList = alpha incase all counts are 0, so that a bad move doesnt get played
                if (countList[n] == maxCount && saList[n] == alpha)
                    posMoves.push(moveList[n]);
            }
            console.log("posMoves " + posMoves);
            bestMove = randomMove(posMoves);
            console.log("new best move: (" + bestMove[1] + ", " + bestMove[0] + ")"); 
            return alpha;
        }
        else {
            //This compares all moves to see which one has the greatest value
            var posMoves = [];
            console.log(saList);
            for (var n = 0; n < saList.length; n++) {
                if (saList[n] == alpha)
                    posMoves.push(moveList[n]);
            }
            console.log("posMoves " + posMoves);
            bestMove = randomMove(posMoves);
            console.log("alpha " + alpha);
            console.log("bestMove: (" + bestMove[1] + ", " + bestMove[0] + ")");
        }
    }
    return alpha;   
}

//If we want to see possible wins in the future, emptyPiece will be equal to otherPlayer, so nothing will change.
//If we want to see how many actual pieces are in a row, we give emptyPiece an empty string
//checkLength is the maximum length to either side the pointers can check. If we are checking for 3 in a rows, its 3
function possibleFutureWins(posX, posY, otherPlayer, emptyPiece, checkLength) {
                        //count is the number of possible ways that we could get four in a row, by going in a certain spot.
                        var count = 0;
    
                        //Check horizontal future wins
                        pointerOneX = posX;
                        pointerOneY = posY;
                        pointerTwoX = posX;
                        pointerTwoY = posY;

                        //The count for pointers in a row
                        var pointerCount = 1;
                        var pointerOneDone = false;
                        var pointerTwoDone = false;
                        while (!pointerOneDone || !pointerTwoDone) {
                            
                            //The pointer that is moving backwards or to the left. Don't check the y pointer, because we are checking rows.
                            if (pointerOneX - 1 >= 0 && board[pointerOneY][pointerOneX - 1] != otherPlayer  && board[pointerOneY][pointerOneX - 1] != emptyPiece && posX - (pointerOneX - 1) < checkLength) {
                                pointerOneX--;
                                pointerCount++;
                            }
                            else {
                                pointerOneDone = true;   
                            }

                            if (pointerTwoX + 1 <=6 && board[pointerTwoY][pointerTwoX + 1] != otherPlayer && board[pointerTwoY][pointerTwoX + 1] != emptyPiece && pointerTwoX + 1 - posX < checkLength) {
                                pointerTwoX++;
                                pointerCount++;
                            }
                            else {
                                pointerTwoDone = true;   
                            }
                        }
                        
                        //If there is 4 in a row, 4 - 3 = 1, which means the count will be increased by 1.
                        //Make sure not negative.
                        if (pointerCount >= checkLength) 
                            count += pointerCount - (checkLength - 1);
                        
                        //Check Forward Diagonal
                        pointerOneX = posX;
                        pointerOneY = posY;
                        pointerTwoX = posX;
                        pointerTwoY = posY;

                        pointerCount = 1;
                        var pointerOneDone = false;
                        var pointerTwoDone = false;
                        while (!pointerOneDone || !pointerTwoDone) {

                            //Pointers for going up and to the right
                            if (pointerOneY - 1 >= 0 && pointerOneX + 1 <= 6 && board[pointerOneY - 1][pointerOneX + 1] != otherPlayer && board[pointerOneY - 1][pointerOneX + 1] != emptyPiece && pointerOneX + 1 - posX < checkLength) {
                                pointerOneX++;
                                pointerOneY--;
                                pointerCount++;
                            }
                            else {
                                pointerOneDone = true;
                            }

                            //Pointers for going down and to the left
                            if (pointerTwoY + 1 <= 5 && pointerTwoX - 1 >= 0 && board[pointerTwoY + 1][pointerTwoX - 1] != otherPlayer && board[pointerTwoY + 1][pointerTwoX - 1] != emptyPiece && posX - (pointerTwoX - 1) < checkLength) {
                                pointerTwoX--;
                                pointerTwoY++;
                                pointerCount++;
                            }
                            else {
                                pointerTwoDone = true;
                            }
                        }
                        if (pointerCount >= checkLength) 
                            count += pointerCount - (checkLength - 1);
                        
                        //Check backwards diagonal   
                        pointerOneX = posX;
                        pointerOneY = posY;
                        pointerTwoX = posX;
                        pointerTwoY = posY;
        
                        pointerCount = 1;
                        var pointerOneDone = false;
                        var pointerTwoDone = false;
                        while (!pointerOneDone || !pointerTwoDone) {

                            //Pointers for going up and to the left
                            if (pointerOneY - 1 >= 0 && pointerOneX - 1 >= 0 && board[pointerOneY - 1][pointerOneX - 1] != otherPlayer && board[pointerOneY - 1][pointerOneX - 1] != emptyPiece && posX - (pointerOneX - 1) < checkLength) {
                                pointerOneX--;
                                pointerOneY--;
                                pointerCount++;
                            }
                            else {
                                pointerOneDone = true;   
                            }

                            //Pointers for going down and to the right
                            if (pointerTwoY + 1 <= 5 && pointerTwoX + 1 <=6 && board[pointerTwoY + 1][pointerTwoX + 1] != otherPlayer && board[pointerTwoY + 1][pointerTwoX + 1] != emptyPiece && pointerTwoX + 1 - posX < checkLength) {
                                pointerTwoX++;
                                pointerTwoY++;
                                pointerCount++;
                            }
                            else {
                                pointerTwoDone = true;   
                            }
                        }
                        if (pointerCount >= checkLength) 
                            count += pointerCount - (checkLength - 1);
    
                        return count;
}

//This method checks chunks of four for 3 of our pieces and one space. This is the definition of three in a row in connect four.
//It is a recursive method that will also check if the opponent can get a 3 in a row ontop of your move.
function threeOutOfFour(posX, posY, board, currPlayer, otherPlayer, depth) {
    if (depth == 2 || posY < 0) {
        return 0;   
    }
    var count = 0;
    var spaceCount = 0;
    var boardCopy = copyBoard(board);
    setMove(boardCopy, posX, posY, currPlayer);
    
    //Horizontal Check
    var startX = posX - 3 < 0 ? 0 : posX - 3;
    while (startX < 4 && startX <= posX) {
        spaceCount = 0;
        for (var j = 0; j < 4; j++) {
            if (boardCopy[posY][startX + j] == " ")
                spaceCount++;
            if (boardCopy[posY][startX + j] == otherPlayer || spaceCount > 1)
                break;
            if (j == 3)
                count++;
        }
        startX++;
    }
    
    //Backwards Diagonal Check
    var startX = posX - 3;
    var startY = posY - 3;
    if (startX < 0) {
        startY -= startX;
        startX = 0;
    }
    if (startY < 0) {
        startX -= startY;
        startY = 0;
    }
    
    while (startX < 4 && startY < 3 && startX <= posX && startY <= posY) {
        spaceCount = 0; 
        for (var j = 0; j < 4; j++) {
            if (boardCopy[startY + j][startX + j] == " ")
                spaceCount++;
            if (boardCopy[startY + j][startX + j] == otherPlayer || spaceCount > 1)
                break;
            if (j == 3)
                count++;
        }
        startX++;
        startY++;
    }
    
    //Forward Diagonal Check
    //Find the point where the diagonal of posX and posY touch the border or extend out 3
    var startX = posX - 3;
    var startY = posY + 3;
    if (startX < 0) {
        startY += startX;
        startX = 0;
    }
    if (startY > 5) {
        startX += startY - 5;
        startY = 5;
    }
    
    while (startX < 4 && startY >= 3 && startX <= posX && startY >= posY) {
        spaceCount = 0;
        for (var j = 0; j < 4; j++) {
            if (boardCopy[startY - j][startX + j] == " ")
                spaceCount++;
            if (boardCopy[startY - j][startX + j] == otherPlayer || spaceCount > 1)
                break;
            if (j == 3)
                count++;
        }
        startX++;
        startY--;
    }
    //console.log("3/4: " + posX + " " + posY + " count: " + count + " currPlayer: " + currPlayer);
    //console.log("count: " + (count - threeOutOfFour(posX, posY - 1, boardCopy, currPlayer, otherPlayer, depth + 1)));
    //If the other player can make a really good move ontop of us, we do not want to go there.
    return count; //- (threeOutOfFour(posX, posY - 1, boardCopy, currPlayer, otherPlayer, depth + 1) * 0.1);
}