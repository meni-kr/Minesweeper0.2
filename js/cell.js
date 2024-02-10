'use strict'

function onCellClicked(eve, elCell, currI, currJ) {
    const leftClick = eve.buttons === 1
    const rightClick = eve.buttons === 2
    if (gIsGameOver) return
    if (!gGame.isOn) {
        if (rightClick) return
        gGame.isOn = true
        onInit(currI, currJ)
        revelCell(currI, currJ)
        startTimer()
        if (!gBoard[currI][currJ].minesAround) {
            expandShown(currI, currJ)
        }
        return
    }

    if(gIsHint){
        onCellAfterHint(currI,currJ)
        setTimeout(()=>{onCellAfterHint(currI,currJ)},1000)
        gIsHint=false
        return
    }

    if (leftClick && !gBoard[currI][currJ].isShown && !gBoard[currI][currJ].isMarked) {
        onMouseLeft(currI, currJ)
        return
    }
    if (rightClick) {
        if (gBoard[currI][currJ].isShown) return
        onMouseRight(elCell, currI, currJ)
    }
}

function onMouseLeft(i, j) {
    if (gBoard[i][j].isMine) {
        checkLoseGame()
        
    } else if (!gBoard[i][j].minesAround) {
        revelCell(i, j)
        expandShown(i, j)
    } else {
        revelCell(i, j)
        checkWinGame()
    }
}

function onMouseRight(elCell, i, j) {
    onCellMarked(elCell, i, j)
    showAndHide(elCell)
}

function onCellMarked(elCell, i, j) {

    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        elCell.innerText = FLAG
        gGame.markedCount++
        checkWinGame()
        return
    } else if (gBoard[i][j].isMine) {
        gBoard[i][j].isMarked = false
        elCell.innerText = MINE
        gGame.markedCount--
        return
    } else {
        gBoard[i][j].isMarked = false
        elCell.innerText = gBoard[i][j].minesAround
        gGame.markedCount--
        return
    }
}

function onCellAfterHint(cellI,cellJ){
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (!gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
                toggleCellHint(i, j)
            }
        }
    }
}

function toggleCellHint(cellI, cellJ) {
    const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    elCell.classList.toggle('hidden')
}

function safeClicks(){
    
}