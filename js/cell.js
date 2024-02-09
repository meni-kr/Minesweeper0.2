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
        if (!gBoard[currI][currJ].minesAround) {
            expandShown(currI, currJ)
        }
        console.log(gGame.shownCount);
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
    console.log('left');
    console.log(gGame.shownCount);
    console.log(gGame.markedCount);
    console.log(gLevel.MINES);
    
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
    console.log('right');
    console.log(gGame.shownCount);
    console.log(gGame.markedCount);
    console.log(gLevel.MINES);
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