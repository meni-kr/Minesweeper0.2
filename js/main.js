'use strict'

const MINE = '💣'
const FLAG = '🚩'
const LIFE = '💓'

var gTimerInterval
var gIsGameOver
var gBoard
var gIsHint
const gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    safeClick: 3
}

function onInit(currI, currJ) {
    resets()
    gBoard = buildBoard(gLevel, currI, currJ)
    renderBoard(gBoard)
    
}

function resets() {
    gBoard = []
    gIsGameOver = false
    gGame.lives = 3
    gGame.markedCount = 0
    gGame.shownCount = 0
    showLives()
    document.querySelector('.smili').innerText = '😂'
    clearInterval(gTimerInterval)
    document.querySelector('.hints').innerHTML ='<button class="safe-click">click mee!!</button>'
    var strHTML = ''
    for(var i =0;i<3;i++){
        strHTML += '<span onclick="onHintClick(this)">💡</span>'
    }
    document.querySelector('.hints').innerHTML += strHTML

}

function setGameLevel(btn) {
    if (btn.innerText === 'easy') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
        gGame.isOn = false
        
        onInit()
    } else if (btn.innerText === 'medium') {
        gLevel.SIZE = 8
        gLevel.MINES = 14
        gGame.isOn = false
        onInit()
    } else {
        gLevel.SIZE = 12
        gLevel.MINES = 32
        gGame.isOn = false
        onInit()
    }
}

function buildBoard(sizeAndMines, currI, currJ) {
    const board = []
    for (var i = 0; i < sizeAndMines.SIZE; i++) {
        board.push([])
        for (var j = 0; j < sizeAndMines.SIZE; j++) {
            board[i][j] = {
                minesAround: 4,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    if (gGame.isOn) {
        setRandMains(board, sizeAndMines, currI, currJ)
    }
    return board
}

function renderBoard(board) {
    setMinesNegsCount(gBoard)
    const elTable = document.querySelector('tbody')
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            const className = `cell hidden`
            var cell = board[i][j].isMine ? MINE : board[i][j].minesAround
            //    style="background-image: url(/img/${board[i][j].minesAround}.png);"
            if(board[i][j].isMine){
                strHTML += `<td class="${className}" data-i=${i} data-j=${j} onmousedown="onCellClicked(event,this,${i},${j})"><button></button></td>`
            }else{
                strHTML += `<td class="${className}" data-i=${i} data-j=${j} onmousedown="onCellClicked(event,this,${i},${j})"><button></button></td>`
            }
        }
        strHTML += '</tr>'
    }
    elTable.innerHTML = strHTML
}

function minesAroundCount(cell, loc) {
    if (cell.isMine) return
    var countMine = 0
    for (var i = loc.i - 1; i <= loc.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = loc.j - 1; j <= loc.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === loc.i && j === loc.j) continue
            if (gBoard[i][j].isMine) countMine++
        }
    }
    return countMine
}

function startTimer() {

    if (gTimerInterval) clearInterval(gTimerInterval)

    var startTime = Date.now()
    gTimerInterval = setInterval(() => {
        const timeDiff = Date.now() - startTime

        const seconds = getFormatSeconds(timeDiff)
        const minutes = getFormatMinutes(timeDiff)

        document.querySelector('span.sec').innerText =  seconds
        document.querySelector('span.min').innerText = minutes

    }, 100)
}

function getFormatSeconds(timeDiff) {
    const seconds = new Date(timeDiff).getSeconds()
    return (seconds + '').padStart(2, '0')
}

function getFormatMinutes(timeDiff) {
    const milliSeconds = new Date(timeDiff).getMinutes()
    return (milliSeconds + '').padStart(2, '0')
}

function checkWinGame() {
    const countCell = (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES
    if (gGame.shownCount === countCell && gGame.markedCount === gLevel.MINES) {
        gGame.isOn = false
        gIsGameOver = true
        clearInterval(gTimerInterval)
        document.querySelector('.smili').innerText = '😎'
    }
}

function checkLoseGame() {
    if (gGame.lives !== 1) {
        gGame.lives--
        showLives()
    } else {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                if (gBoard[i][j].isMine) {
                    revelCell(i, j)
                }
            }
        }
        document.querySelector('.smili').innerText = '🤯'
        document.querySelector('.lives span').innerHTML= ''
        clearInterval(gTimerInterval)
        gGame.isOn = false
        gIsGameOver = true
    }

}

function expandShown(cellI, cellJ) {
    if (gBoard[cellI][cellJ].minesAround) return
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length || gBoard[i].isShown || gBoard[i].isMarked) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length || gBoard[i][j].isShown || gBoard[i][j].isMarked) continue
            if (!gBoard[i][j].isMine) {
                revelCell(i, j)
                expandShown(i, j)
            }
        }
    }
    checkWinGame()
}

// function revelCell(cellI, cellJ) {
//     const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
//     elCell.classList.remove('hidden')
//     gBoard[cellI][cellJ].isShown = true
//     gGame.shownCount++
// }
function revelCell(cellI, cellJ){
    const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    elCell.innerHTML=`<span>${gBoard[cellI][cellJ].minesAround}</span>`
    gBoard[cellI][cellJ].isShown = true
    gGame.shownCount++
}

function showAndHide(elCell) {
    elCell.classList.toggle('flag')
    elCell.classList.toggle('hidden')
}