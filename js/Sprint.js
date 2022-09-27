'use strict'
var MINE = '💣'
var HINT = '🔌'
var SCORE
var id=0
var HINTCON = false
var SIZE = 4
var SAFECLICKS = 3
var SAFECLICK = false
var CLOCKSTART = false
var HINTS = 1
var Lives = 1
var HEART = '❤️'
var isFlagged = false
var mineCount = 2
var timer
var ele = document.querySelector('.timerEl')
var sec = 0
var bestScore = {
  bestScore: 0,
}
var gBoard
var gGame = {
  level: 'Easy',
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
}
var gLevel = {
  SIZE: 4,
  MINES: 2,
}
function hideSafeCell(gBoard, i, j) {
  const cellEl = document.querySelector(`.cell-${i}-${j}`)
  cellEl.classList.add('hidden')
  cellEl.classList.remove('safeClickReveal')
}


function onSafeClick() {
  SAFECLICKS--
  if (SAFECLICKS < 0) return
  var audio = new Audio('sounds/safeClick.wav');
  audio.play()
  audio.volume = 0.3
  var safeCellsArr = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
        safeCellsArr.push({ i, j })
      }
    }
  }
  var randomNum = Math.floor(Math.random() * safeCellsArr.length)
  const cellEl = document.querySelector(`.cell-${safeCellsArr[randomNum].i}-${safeCellsArr[randomNum].j}`)
  console.log(cellEl)
  console.log(safeCellsArr[randomNum])
  cellEl.classList.remove('hidden')
  cellEl.classList.add('safeClickReveal')
  setTimeout(function () {
    hideSafeCell(gBoard, safeCellsArr[randomNum].i, safeCellsArr[randomNum].j);
  }, 1000);
  document.querySelector('.safeClicksLeft').textContent = SAFECLICKS
}

function InitGame() {
  document.querySelector('.restartBtn').textContent = '🙂'
  gGame.isOn = true
  gBoard = createMat()
  DisableRightClick()
  renderBoard(gBoard)
  document.querySelector('.scoreEl').textContent = displayHearts()
  document.querySelector('.hintsEl').textContent = displayHints()
  document.querySelector('.gameHints').style.backgroundColor = '#5b476d'
  if (isNaN(parseInt(localStorage.getItem(gGame.level)))) {
    document.querySelector('.bestScoreEl').textContent = 'No Best Score Yet..'
  } else document.querySelector('.bestScoreEl').textContent = 'Best Level Score: ' + localStorage.getItem(gGame.level) + '\t'
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
  if (negsCount === 0) negsCount = ''
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

function placeMines(board) {
  var MinesLocation = []
  for (var i=0;i<board.length;i++){
    for (var j=0;j<board.length;j++){
      var object = {i:i,j:j}
      MinesLocation.push(object)
    }
  }
  for (var k=0;k<mineCount;k++){
    var randomNum = Math.floor(Math.random()*MinesLocation.length)
    var Mine = MinesLocation.splice(randomNum,1)
    board[Mine[0].i][Mine[0].j].isMine = true
  }
}


function startClock() {
  if (CLOCKSTART === false && gGame.isOn === true) {
    CLOCKSTART = true
    timer = setInterval(() => {
      ele.innerHTML = sec;
      sec++;
    }, 1000)
  } else return
}

function cellClicked(El, i, j) {
  if (gGame.isOn === false) return
  var cellEl = document.querySelector(`.cell-${i}-${j}`)
  gGame.shownCount = countisShown()
  if (gGame.shownCount === 0 && gBoard[i][j].isMine && !HINTCON) {
    InitGame()
    cellClicked(this, i, j)
  }
  if (HINTCON === true && HINTS > 0) {
    var audio = new Audio('sounds/hintSound.wav');
    audio.play()
    audio.volume = 0.1
    showNeighbors(gBoard, i, j)
    setTimeout(function () {
      hideNeighbors(gBoard, i, j);
    }, 1000);
    HINTS--
    document.querySelector('.hintsEl').textContent = displayHints()
    HINTCON = false
    return
  }
  if (cellEl.textContent === '') {
    showNegsAround(gBoard, i, j)
    var audio = new Audio('sounds/tapNum.wav');
    audio.play();
  }
  if (gBoard[i][j].isFlagged || !gGame.isOn) {
    return
  }
  if (cellEl.classList.contains('hidden') && !gBoard[i][j].isMine) {
    var audio = new Audio('sounds/tapNum.wav');
    audio.play();
    audio.volume = 0.3
    cellEl.classList.remove('hidden')
    gBoard[i][j].isShown = true
  }
  if (gBoard[i][j].isMine === true && Lives > 0) {
    Lives--
    cellEl.classList.remove('hidden')
    cellEl.classList.add('revealMine')
    cellEl.onclick = null
    document.querySelector('.scoreEl').textContent = displayHearts()
    gBoard[i][j].isShown = true
  }
  if (gBoard[i][j].isMine === true && Lives === 0) {
    onLose()
    var mineLocations = MinesLocator(i, j)
    for (var k = 0; k < mineLocations.length; k++) {
      var mineLocation = document.querySelector(`.cell-${mineLocations[k].i}-${mineLocations[k].j}`)
      mineLocation.classList.remove('hidden')
      mineLocation.classList.add('revealMine')
    }
    stopClock()
  }
  gGame.shownCount = countisShown()
  if (gGame.shownCount === (gBoard.length * gBoard.length) - mineCount) {
    checkFlags()
  }
}

function stopClock() {
  clearInterval(timer)
  CLOCKSTART = false
}

function onFlag(i, j) {
  startClock()
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
  if (gGame.shownCount >= (gBoard.length * gBoard.length) - mineCount && flagMineCounter === flagNumCounter && flagMineCounter !== 0 && flagNumCounter === mineCount) onWin()
}

function DisableRightClick() {
  var tableEl = document.querySelector('.tableEl')
  tableEl.addEventListener("contextmenu", e => e.preventDefault())
}

function onRestart() {
  document.querySelector('.scoreEl').textContent = displayHearts()
  SAFECLICKS = 3
  document.querySelector('.safeClicksLeft').textContent = SAFECLICKS
  document.querySelector('.timerEl').textContent = 0
  SCORE = 0
  stopClock()
  sec = 0
  document.querySelector('.gameResult').classList.add('fullyHidden')
  if (isNaN(parseInt(localStorage.getItem(gGame.level)))) {
    document.querySelector('.bestScoreEl').textContent = 'No Best Score Yet..'
  } else document.querySelector('.bestScoreEl').textContent = 'Best Level Score: ' + localStorage.getItem(gGame.level) + '\t'
  InitGame()
  gGame.shownCount = countisShown()
  if (gBoard.length=== 4) Lives = 1
  if (gBoard.length=== 6) Lives = 2
  if (gBoard.length===12) Lives = 3
}

function MinesLocator(i, j) {
  var minesLocations = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine === true) {
        minesLocations.push({ i, j })
        gBoard[i][j].isShown = true
      }
    }
  }
  return minesLocations
}

function onWin() {
  var audio = new Audio('sounds/winAudio.wav');
  audio.play();
  gGame.isOn = false
  document.querySelector('.restartBtn').textContent = '🥳'
  document.querySelector('.gameResult').textContent = 'CONGRATS!'
  document.querySelector('.gameResult').classList.remove('fullyHidden')
  SCORE = parseInt(document.querySelector('.timerEl').textContent)
  stopClock()
  var levelScore = parseInt(localStorage.getItem(gGame.level))
  console.log(levelScore)
  if (isNaN(levelScore) || SCORE < levelScore) {
    localStorage.setItem(gGame.level, SCORE)
    alert('New Level Record!')
    document.querySelector('.bestScoreEl') = 'Best Level Score: ' + SCORE
  }
}

function onLose() {
  stopClock()
  gGame.isOn = false
  var audio = new Audio('sounds/loseAudio.wav');
  audio.volume = 0.45
  audio.play();
  document.querySelector('.restartBtn').textContent = '😔'
  document.querySelector('.gameResult').textContent = 'YOU LOST..'
  document.querySelector('.gameResult').classList.remove('fullyHidden')
}

function displayHearts() {
  var str = ''
  for (var i = 0; i < Lives; i++) {
    str += HEART
  }
  return str
}

function displayHints() {
  var str = ''
  for (var i = 0; i < HINTS; i++) {
    str += HINT
  }
  if (!str.length) {
    document.querySelector('.gameHints').style.backgroundColor = 'red'
    return 'Wasted'
  }
  return str
}

function easyBtn() {
  gGame.level = 'Easy'
  SIZE = 4
  mineCount = 2
  HINTS = 1
  const GameEl = document.querySelector('.GameEl').style.height = '650px'
  Lives = 1
  document.querySelector('.hintsEl').textContent = displayHints()
  document.querySelector('.scoreEl').textContent = displayHearts()
  onRestart()
  
}

function mediumBtn() {
  gGame.level = 'Medium'
  SIZE = 6
  mineCount = 14
  HINTS = 2
  const GameEl = document.querySelector('.GameEl').style.height = '700px'
  Lives = 2
  document.querySelector('.hintsEl').textContent = displayHints()
  document.querySelector('.scoreEl').textContent = displayHearts()
  onRestart()
}

function expertBtn() {
  gGame.level = 'Expert'
  SIZE = 12
  mineCount = 32
  HINTS = 3
  const GameEl = document.querySelector('.GameEl').style.height = '970px'
  Lives = 3
  document.querySelector('.hintsEl').textContent = displayHints()
  document.querySelector('.scoreEl').textContent = displayHearts()
  onRestart()
}

function countisShown() {
  var showCounter = 0
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isShown && !gBoard[i][j].isMine) showCounter++
    }
  }
  return showCounter
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

function onHint() {
  HINTCON = true
  var audio = new Audio('sounds/hintsBtn.wav')
  audio.play()
  audio.volume = 0.25
}

function hideNeighbors(gBoard, row, col) {
  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue
    for (var j = col - 1; j <= col + 1; j++) {
      const cellEl = document.querySelector(`.cell-${i}-${j}`)
      if (j < 0 || j > gBoard.length - 1) continue
      if (cellEl.style.opacity = '0.5' && !gBoard[i][j].isShown) {
        cellEl.classList.add('hidden')
        cellEl.style.opacity = '1'
        gBoard[i][j].isShown = false
      }
    }
  }
  HINTCON = false
}


function showNeighbors(gBoard, row, col) {
  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue
    for (var j = col - 1; j <= col + 1; j++) {
      const cellEl = document.querySelector(`.cell-${i}-${j}`)
      if (j < 0 || j > gBoard.length - 1) continue
      if (!gBoard[i][j].isShown) {
        cellEl.classList.remove('hidden')
        cellEl.style.opacity = '0.5'
      }
    }
  }
}