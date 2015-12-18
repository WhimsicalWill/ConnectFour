//given an array of moves, this function returns a random move
function randomMove(posMoves) {
    var rand = Math.floor(Math.random() * posMoves.length);
    return posMoves[rand];
}


function buildTree(board, x, y, playerTurn) {
    var currPlayer = playerTurn == true ? "y" : "r";
    var value;
    //MAX_DEPTH is how many moves into the future the algorithm will search
    MAX_DEPTH = 7;
    bestMove = [];
    
    //On the first move, the ai will always return the middle spot, to reduce lag when loading website, we are hardcoding this
    if (moveCount == 0) {
        bestMove = [5, 3];
    }
    //If not the first move, call the buildTree_r function, so it can return the bestMove possible
    else
        var alpha = buildTree_r(board, x, y, currPlayer, -Infinity, Infinity, 0);
    
    //set pieceDroppedX to the bestMove, and set pieceDropped to true so the drop animation starts
    pieceDroppedX = bestMove[1];
    pieceDropped = true;
    //Set the x position of ballGraphics to be over the bestMove
    ballGraphics.position.x = bestMove[1] * pieceLength + pieceLength / 2;
    //Opponent has dropped a piece, so set the color to red
    setColor(red);
}

//This is a recursive function that builds the game tree
function buildTree_r(board, x, y, currPlayer, alpha, beta, depth) {
    //If we are about to search further then our MAX_DEPTH, return 0 for this node
    if (depth > MAX_DEPTH) {
        return 0;
    }

    var otherPlayer = currPlayer == "y" ? "r" : "y";
    
    //Add depth of wins and losses into consideration
    //If a win is closer in the future, it will get a higher rating in the tree
    if (checkForWin(board, x, y, currPlayer) && depth != 0) {
        return 1 - depth / (MAX_DEPTH + 1);
    }
    //If a loss is closer in the future, it will get a lower rating in the tree
    else if (checkForWin(board, x, y, otherPlayer) && depth != 0) {
        return -1 + depth / (MAX_DEPTH + 1);
    }
    //If the board is full, then return 0 to symbolize a tie
    else if (isFull(board)) {
        return 0;
    }

    //get an array of the different choices of moves the ai has
    var moveList = getMoves(board);
    
    //create an empty value list for this instance
    var valueList = [];

    //loop through all the different choices of moves
    for (var i = 0; i < moveList.length; i++) {
        //create a copy of the board parameter
        var boardCopy = copyBoard(board);
        
        //set a move from the array moveList
        setMove(boardCopy, moveList[i][1], moveList[i][0], currPlayer);
            
        //Create another possible future of the board, calling the buildTree_r function with this new instance of the board, and a new depth
        value = -buildTree_r(boardCopy, moveList[i][1], moveList[i][0], otherPlayer, alpha, beta, depth + 1);
        
        //If the value is higher than the current alpha, set the alpha to value
        alpha = Math.max(alpha, value);


        //push this value to the value list
        valueList.push(value);
        
    }

    //If the function has created the entire game tree, and is now at the starting node
    if (depth == 0) {
        console.log(valueList);
            //If minimax doesn't have a winning move, or won't definitely lose, we will try to set ourselves up for four in a row
            if (alpha == 0) {
                //get an array of the possible moves we have from the actual game's board (the original board parameter given to the function)
                var moveList = getMoves(board);
                var maxCount = 0; //the most amount of wins any of the moves have.
                var countList = [];
                for (var i = 0; i < valueList.length; i++) {
                    //Even if the value value isn't 0, we will still have a count in the list
                    var count = 0; //the number of wins
                    if (valueList[i] == 0) {
                        //set variables to be equal to the coordinates of a move in the moveList array
                        var posX = moveList[i][1];
                        var posY = moveList[i][0];

                        //Three in a row check # of 3 in a rows
                        //find the amount of possible wins for us and the enemy combined.
                        //If the enemy has a lot of chances to win by going in a certain spot, we want to block that.
                        count += (threeOutOfFour(posX, posY, board, "r", "y", 0) + threeOutOfFour(posX, posY, board, "y", "r", 0)) * 100;
                        
                        //get the number of four in a rows that could happen in the future for us and the enemy
                        count += possibleFutureWins(posX, posY, "y", 4) + possibleFutureWins(posX, posY, "r", 4);
                        
                        if (count > maxCount) {
                            maxCount = count;
                        }
                    }
                    //push after the check for alpha == 0, because negative values must return 0
                    countList.push(count);
                }
            
            //Find the move with the highest count and set bestMove to that move
            var posMoves = [];
            console.log(countList);
            console.log(maxCount);
            for (var n = 0; n < countList.length; n++) {
                //check valueList = alpha incase all counts are 0, so that a bad move doesnt get played
                if (countList[n] == maxCount && valueList[n] == alpha)
                    posMoves.push(moveList[n]);
            }
            console.log("posMoves " + posMoves);
            bestMove = randomMove(posMoves);
            console.log("new best move: (" + bestMove[1] + ", " + bestMove[0] + ")");   
        }
        else {
            //This compares all moves to see which one has the greatest value that was assigned by the mimimax algorithm
            var posMoves = [];
            console.log(valueList);
            for (var n = 0; n < valueList.length; n++) {
                if (valueList[n] == alpha)
                    posMoves.push(moveList[n]);
            }
            console.log("posMoves " + posMoves);
            bestMove = randomMove(posMoves);
            console.log("alpha " + alpha);
            console.log("bestMove: (" + bestMove[1] + ", " + bestMove[0] + ")");
        }
    }
    //return the highest number out of all valueList's members to the node that called buildTree_r
    return alpha;   
}

//This function returns the number of wins we could have in the future from any given coordinates on any given board
function possibleFutureWins(posX, posY, otherPlayer, checkLength) {
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
                            if (pointerOneX - 1 >= 0 && board[pointerOneY][pointerOneX - 1] != otherPlayer && posX - (pointerOneX - 1) < checkLength) {
                                pointerOneX--;
                                pointerCount++;
                            }
                            else {
                                pointerOneDone = true;   
                            }

                            if (pointerTwoX + 1 <=6 && board[pointerTwoY][pointerTwoX + 1] != otherPlayer && pointerTwoX + 1 - posX < checkLength) {
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
                            if (pointerOneY - 1 >= 0 && pointerOneX + 1 <= 6 && board[pointerOneY - 1][pointerOneX + 1] != otherPlayer && pointerOneX + 1 - posX < checkLength) {
                                pointerOneX++;
                                pointerOneY--;
                                pointerCount++;
                            }
                            else {
                                pointerOneDone = true;
                            }

                            //Pointers for going down and to the left
                            if (pointerTwoY + 1 <= 5 && pointerTwoX - 1 >= 0 && board[pointerTwoY + 1][pointerTwoX - 1] != otherPlayer && posX - (pointerTwoX - 1) < checkLength) {
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
                            if (pointerOneY - 1 >= 0 && pointerOneX - 1 >= 0 && board[pointerOneY - 1][pointerOneX - 1] != otherPlayer && posX - (pointerOneX - 1) < checkLength) {
                                pointerOneX--;
                                pointerOneY--;
                                pointerCount++;
                            }
                            else {
                                pointerOneDone = true;   
                            }

                            //Pointers for going down and to the right
                            if (pointerTwoY + 1 <= 5 && pointerTwoX + 1 <=6 && board[pointerTwoY + 1][pointerTwoX + 1] != otherPlayer && pointerTwoX + 1 - posX < checkLength) {
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
    //If the other player can make a really good move ontop of us, we do not want to go there.
    return count; //- (threeOutOfFour(posX, posY - 1, boardCopy, currPlayer, otherPlayer, depth + 1) * 0.1);
}