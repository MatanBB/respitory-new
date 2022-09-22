'use strict'
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
  document.querySelector('.restartBtn').textContent = '🙂'
  gGame.isOn = true
  gBoard = createMat()
  DisableRightClick()
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

function showNegsAround(gBoard, row, col) {
  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue
    for (var j = col - 1; j <= col + 1; j++) {
      const cellEl = document.querySelector(`.cell-${i}-${j}`)
      if (j < 0 || j > gBoard.length - 1) continue
      if (!gBoard[i][j].isShown) {
        cellEl.classList.remove('hidden')
        gBoard[i][j].isShown = true
      }
    }
  }
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
  var MinesLocation = []
  for (var i = 0; i < mineCount; i++) {
    var randomNum1 = Math.floor(Math.random() * board.length)
    var randomNum2 = Math.floor(Math.random() * board.length)
    MinesLocation.push({ i: randomNum1, j: randomNum2 })
    if (i > 1 && MinesLocation[i] === MinesLocation[i - 1]) {
      randomNum1 = Math.floor(Math.random() * board.length)
      randomNum2 = Math.floor(Math.random() * board.length)
      console.log('Identical mine positions detected')
      i = 0; continue
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
  else {
    timer = 1
    return
  }
}



function cellClicked(El, i, j) {
  var cellEl = document.querySelector(`.cell-${i}-${j}`)
  var restartBtn = document.querySelector('.restartBtn')
  if (cellEl.textContent === '0') {
    showNegsAround(gBoard, i, j)
  }
  if (gBoard[i][j].isFlagged || !gGame.isOn) {
    return
  }
  if (cellEl.classList.contains('hidden') && !gBoard[i][j].isMine) {
    var audio = new Audio('sounds/tapNum.wav');
    audio.play();
    cellEl.classList.remove('hidden')
    gBoard[i][j].isShown = true
  }
  if (gBoard[i][j].isMine === true) {
    onLose()
    var mineLocations = MinesLocator(i, j)
    for (var k = 0; k < mineLocations.length; k++) {
      var mineLocation = document.querySelector(`.cell-${mineLocations[k].i}-${mineLocations[k].j}`)
      mineLocation.classList.remove('hidden')
      mineLocation.classList.add('revealMine')
    }
  }
  gGame.shownCount = countisShown()
  if (gGame.shownCount === (gBoard.length * gBoard.length) - mineCount) checkFlags()
  stopClock()
}


function stopClock() {
  var timerEl = document.querySelector('.timerEl')
  if (!gGame.isOn && timerEl.textContent !== '0') {
    timerEl.textContent = '☠️' + timer + '☠️'
    clearInterval(interval)
  }
  if (gGame.isOn && timerEl.textContent === '-') {
    timerEl.textContent = '0'
    var interval = setInterval(countUp, 1000)
  }
}

function onFlag(i, j) {
  var cellEl = document.querySelector(`.cell-${i}-${j}`)
  var currCell = gBoard[i][j]
  if (currCell.isShown || !gGame.isOn) return
  gBoard[i][j].isFlagged = !gBoard[i][j].isFlagged
  if (currCell.isFlagged) cellEl.classList.add('flagged')
  if (!currCell.isFlagged) cellEl.classList.remove('flagged')
  checkFlags()
}

function checkFlags() {
  var flagMineCounter = 0
  var flagNumCounter = 0
  for (var f = 0; f < gBoard.length; f++) {
    for (var g = 0; g < gBoard[0].length; g++) {
      if (gBoard[f][g].isFlagged && !gBoard[f][g].isMine) {
        flagNumCounter++
      }
      if (gBoard[f][g].isFlagged && gBoard[f][g].isMine) {
        flagMineCounter++
        flagNumCounter++
      }
    }
  } console.log('mines', flagMineCounter, 'nums', flagNumCounter)
  if (gGame.shownCount >= (gBoard.length * gBoard.length) - mineCount&&flagMineCounter === flagNumCounter && flagMineCounter !== 0 && flagNumCounter === mineCount) onWin()
}

function DisableRightClick() {
  var tableEl = document.querySelector('.tableEl')
  tableEl.addEventListener("contextmenu", e => e.preventDefault())
}

function onRestart() {
  location.reload()
}

function MinesLocator(i, j) {
  var minesLocations = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine === true) minesLocations.push({ i, j })
    }
  }
  return minesLocations
}

function onWin() {
  var audio = new Audio('sounds/winAudio.wav');
  audio.play();
  gGame.isOn = false
  document.querySelector('.timerEl').classList.add('fullyHidden')
  document.querySelector('.restartBtn').textContent = '🥳'
  document.querySelector('.gameResult').textContent = 'CONGRATS!'
  document.querySelector('.gameResult').classList.remove('fullyHidden')
}

function onLose() {
  gGame.isOn = false
  var audio = new Audio('sounds/loseAudio.wav');
  audio.volume = 0.45
  audio.play();
  document.querySelector('.restartBtn').textContent = '😔'
  document.querySelector('.gameResult').textContent = 'YOU LOST..'
  document.querySelector('.gameResult').classList.remove('fullyHidden')
}

function easyBtn() {
  SIZE = 4
  mineCount = 2
  const GameEl = document.querySelector('.GameEl').style.height = '600px'
  InitGame()
}

function mediumBtn() {
  SIZE = 6
  mineCount = 14
  const GameEl = document.querySelector('.GameEl').style.height = '600px'
  InitGame()
}

function expertBtn() {
  SIZE = 12
  mineCount = 32
  const GameEl = document.querySelector('.GameEl').style.height = '840px'
  InitGame()
}

function countisShown(){
  var showCounter=0
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isShown) showCounter++
    }
  }
  return showCounter
}