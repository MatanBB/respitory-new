function createMat() {
  const board = []
  for (var i = 0; i < SIZE; i++) {
    board.push([])
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: true,
        isFlagged: false
      }
    }
  }
  placeMines(board)
  return board
}

function renderBoard(gBoard) {
  var strHTML = ''
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += '<tr>\n'
    for (var j = 0; j < gBoard[0].length; j++) {
      var currCount = countNegsAround(gBoard, i, j)
      if (gBoard[i][j].isMine&& !gBoard[i][j].isShown) {
        strHTML += `<td class= "cell cell-${i}-${j} hidden" onclick="cellClicked(this,${i},${j})" oncontextmenu="onFlag(${i},${j})">${MINE}</td>\n`
      }
      if (gBoard[i][j].isMine && gBoard[i][j].isShown) {
        strHTML += `<td class= "cell cell-${i}-${j}" onclick="cellClicked(this,${i},${j})" oncontextmenu="onFlag(${i},${j})">${MINE}</td>\n`
      }
      if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
        strHTML += `<td class= "cell cell-${i}-${j} hidden" onclick="cellClicked(this,${i},${j});startClock()" oncontextmenu="onFlag(${i},${j})">${countNegsAround(gBoard, i, j)}</td>\n`
      } 
      if (!gBoard[i][j].isMine && gBoard[i][j].isShown) {
        strHTML += `<td class= "cell cell-${i}-${j}" onclick="cellClicked(this,${i},${j});startClock()" oncontextmenu="onFlag(${i},${j})">${countNegsAround(gBoard, i, j)}</td>\n`
      }
    }
    strHTML += '<tr/>'
  }
  const tableEl = document.querySelector('.tableEl')
  tableEl.innerHTML = strHTML
}