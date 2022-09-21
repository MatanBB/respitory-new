'use strict'
var FLAG = '🚩'
var MINE = '💣'
var SIZE = 5
var mineCount = 2
var gBoard = createMat();placeMines()
var gGame = {
  isOn: false
  , shownCount: 0
  , markedCount: 0
  , secsPassed: 0
}
var gLevel = {
  SIZE: 4
  , MINES: 2
}



function InitGame() {
  gBoard

}

function countNegsAround(board, row, col) {
  var negsCount = 0
  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i > board.length) continue
    for (var j = col - 1; j <= col + 1; j++) {
      if (j < 0 || j > board.length) continue
      if (i === row && j === col) continue
      if (board[i][j].isMine) negsCount++
    }
  }
  return negsCount
}

function renderBoard(board){
  
}

function placeMines(board=gBoard){
  var numsArr = []
  for (var i = 0; i < mineCount; i++) {
    var randomNum1 = Math.floor(Math.random() * board.length)
    var randomNum2 = Math.floor(Math.random() * board.length)
    numsArr.push([randomNum1,randomNum2])
    if (numsArr[0]===numsArr[1]) {
      var randomNum1 = Math.floor(Math.random() * board.length)
      var randomNum2 = Math.floor(Math.random() * board.length)
    }
    board[randomNum1][randomNum2].isMine = true
  }
  console.log(numsArr)
  return board
}

function createMat() {
  const board = []
  for (var i = 0; i < SIZE; i++) {
    board.push([])
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0
        , isShown: true
        , isMine: false
        , isMarked: true
      }
    }
  }
  return board
}