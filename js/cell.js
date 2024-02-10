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
    if (gIsHint) {
        onCellAfterHint(currI, currJ)
        setTimeout(() => {
            gIsHint = false
            onCellAfterHint(currI, currJ)
        }, 1000)
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
        elCell.innerHTML = `<button></button>`
        gGame.markedCount--
        return
    } else {
        gBoard[i][j].isMarked = false
        elCell.innerHTML = `<button></button>`
        gGame.markedCount--
        return
    }
}

function onCellAfterHint(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (!gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
                if (gIsHint) showCellHint(i, j)
                else closeCellHint(i, j)
            }
        }
    }
}

function showCellHint(cellI, cellJ) {
    const elBtn = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    elBtn.innerHTML = (gBoard[cellI][cellJ].isMine) ? `<span>💣</span>` : `<span>${gBoard[cellI][cellJ].minesAround}</span>`
}

function closeCellHint(cellI, cellJ) {
    const elBtn = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    elBtn.innerHTML = `<button></button>`
}

function safeClicks(btn) {
    if (!gGame.isOn) return
    if (!gGame.safeClicks) return
    var count = 0
    gGame.safeClicks--
    btn.innerText = `you have: ${gGame.safeClicks} safe clicks`
    var foundSafeCell = false
    while (!foundSafeCell) {
        var i = getRandomInt(0, gLevel.SIZE)
        var j = getRandomInt(0, gLevel.SIZE)
        count++
        if (count === gLevel.SIZE * gLevel.SIZE * gLevel.SIZE) {
            document.querySelector(`.safe-clicks`).innerText = 'there no safe place'
            return
        }
        if (gBoard[i][j].isShown || gBoard[i][j].isMine) continue
        const elBtn = document.querySelector(`[data-i="${i}"][data-j="${j}"] button`)
        elBtn.classList.add('is-safe')
        foundSafeCell = true
        setTimeout(() => {
            elBtn.classList.remove('is-safe')
        }, 700)
    }
}