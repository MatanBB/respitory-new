'use strict'
var FLAG = '🚩'
var MINE = '💣'
var SIZE = 4
var isFlagged = false
var mineCount = 2
var Lives
var gBoard = createMat()
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
}
var gLevel = {
  SIZE: 4,
  MINES: 2,
}

function InitGame() {
  gGame.isOn = true
  gBoard = createMat()
  renderBoard(gBoard)
  Lives = 3
}

function countNegsAround(gBoard, row, col) {
  var negsCount = 0
  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue
    for (var j = col - 1; j <= col + 1; j++) {
      if (j < 0 || j > gBoard.length - 1) continue
      if (i === row && j === col) continue
      if (gBoard[i][j].isMine) negsCount++
    }
  }
  return negsCount
}


function renderBoard(gBoard) {
  var strHTML = ''
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += '<tr>\n'
    for (var j = 0; j < gBoard[0].length; j++) {
      var currCount = countNegsAround(gBoard, i, j)
      if (gBoard[i][j].isMine === true) {
        strHTML += `<td class= "cell cell-${i}-${j} hidden" onclick="cellClicked(this,${i},${j})" oncontextmenu="onFlag(${i},${j})">${MINE}</td>\n`
      } else strHTML += `<td class= "cell cell-${i}-${j} hidden" onclick="cellClicked(this,${i},${j})" oncontextmenu="onFlag(${i},${j})">${countNegsAround(gBoard, i, j)}</td>\n`
    }
    strHTML += '<tr/>'
  }
  const tableEl = document.querySelector('.tableEl')
  tableEl.innerHTML = strHTML
}

function placeMines(board) {
  var numsArr = []
  for (var i = 0; i < mineCount; i++) {
    var randomNum1 = Math.floor(Math.random() * board.length)
    var randomNum2 = Math.floor(Math.random() * board.length)
    numsArr.push([randomNum1, randomNum2])
    if (numsArr[0] === numsArr[1]) {
      var randomNum1 = Math.floor(Math.random() * board.length)
      var randomNum2 = Math.floor(Math.random() * board.length)
    }
    board[randomNum1][randomNum2].isMine = true
  }
  return board
}

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
var timer = 1
function countUp() {
  if (gGame.isOn) {
    var timerEl = document.querySelector('.timerEl')
    timerEl.textContent = timer
    timer++
  }
  else return
}



function cellClicked(El, i, j) {
  var timerEl = document.querySelector('.timerEl')
  var cellEl = document.querySelector(`.cell-${i}-${j}`)
  if(gBoard[i][j].isFlagged) return
  if (cellEl.classList.contains('hidden')) {
    cellEl.classList.remove('hidden')
    gBoard[i][j].isShown = true
  }
  if (gBoard[i][j].isMine === true) gGame.isOn = false
  if (!gGame.isOn && timerEl.textContent !== '0') {
    timerEl.textContent = '☠️' + timer + '☠️'
    clearInterval(interval)
  }
  if (gGame.isOn && timerEl.textContent === '-') {
    timerEl.textContent = '0'
    var interval = setInterval(countUp, 1000)
  }
}
function onFlag(i,j){
  var cellEl = document.querySelector(`.cell-${i}-${j}`)
  var currCell = gBoard[i][j]
   if (currCell.isShown||!gGame.isOn) return
  gBoard[i][j].isFlagged = !gBoard[i][j].isFlagged
  if (currCell.isFlagged) cellEl.classList.add('flagged')
  if (!currCell.isFlagged) cellEl.classList.remove('flagged')
}


var tableEl=document.querySelector('.tableEl')
tableEl.addEventListener("contextmenu", e => e.preventDefault())
