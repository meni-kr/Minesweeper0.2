'use strict'

var gCells = []

function setRandMains(board, sizeAndMines, currI, currJ) {
    var maineCount = 0
    while (maineCount !== sizeAndMines.MINES) {
        var i = getRandomInt(0, sizeAndMines.SIZE)
        var j = getRandomInt(0, sizeAndMines.SIZE)
        if (board[currI][currJ] === board[i][j]) continue
        if (!board[i][j].isMine) {
            board[i][j].isMine = true
            maineCount++
        }
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAround = minesAroundCount(board[i][j], { i, j })
        }
    }
}



function onEmojiClicked() {
    gGame.isOn = false
    onInit()
}

function onHintClick(elSpan){
    if(!gGame.isOn)return
    gIsHint=true
    elSpan.innerText=''

}

function showLives() {
    const elSpan = document.querySelector('.lives span')
    var innerText = ''
    for (var i = 1; i <= gGame.lives ; i++) {
        innerText += '💓'
        // innerText += '<img src="/img/heart.png" alt="💓">'
    }
    elSpan.innerHTML = innerText
}

////////////////get random int\\\\\\\\\\\\\\\\\\\\\\\\

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}