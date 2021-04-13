"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/// Functions that get information =============================================
/// When the user changes the game size selection
function gameSizeChange() {
  startGame();
} /// Difficulty level


var difficultyChange = function difficultyChange(event) {
  startGame();
}; /// Size of grid


var getSize = function getSize() {
  /// reads the title of the relevant radio button
  /// it expects it to be in a format "row x column" with spaces around the x
  return document.querySelector("input[name=gameSize]:checked").title.split(' x ');
}; /// Is number already in array
//  ******************* Not working yet
//  ******************* Intended to be used with mine seeder


var checkList = function checkList(listArr, numCheck) {
  listArr.find(function (numberItem) {
    return numberItem == numCheck;
  });
}; /// Functions that do something =========================================


var isTimerRunning;
isTimerRunning = false;

var timer = function timer() {
  var start;
  start = Date.now();
  setInterval(function () {
    if (isTimerRunning == false) {
      clearInterval();
    }

    var current = Date.now() - start;
    var seconds = Math.floor(current / 1000);
    document.getElementById('timer').innerHTML = seconds;
  }, 1000);
}; /// Function to create new grid


var createGrid = function createGrid(rowsX, columnsY) {
  /// It will generate the neccessary html code to insert into the game-area elements
  /// Populate grid with mines
  /// Game to offer 3 levels of difficulty. Easy, Medium, Hard
  /// These reflect a density of mines, so total number may change with size of grid for the same level of difficulty
  var gridInnerHtml = ""; /// Below creates the string for the inner HTML

  for (var rowIndex = 1; rowIndex <= rowsX; rowIndex++) {
    for (var columnIndex = 1; columnIndex <= columnsY; columnIndex++) {
      /// innerHTML constructed by looping through rows and columns.
      var rowsString = rowIndex.toString().padStart(2, "0");
      var columnString = columnIndex.toString().padStart(2, "0"); /// The above ensures that row and column references are 2 digits

      gridInnerHtml = " \n          ".concat(gridInnerHtml, " \n          <div class=\"game-area__mine\" id=\"mine").concat(rowsString).concat(columnString, "\" onclick=\"mineLeftClick(event)\"\n          oncontextmenu= \"mineRightClick(event)\">\n          <span class=\"mineNumber\">8</span>\n          <i class=\"fas fa-bomb\"></i>\n          <i class=\"fas fa-flag\"></i></div>\n          "); /// Construct each cell on a loop and add to the end of the previous loops
      /// div element:
      // is the container with a class for formatting the cell
      // actions for left and right mouse clicks
      // and a unique id for each cell to be able to access later
      /// Each cell has 3 parts
      // a span element to hold number of mines around 0-8 or 9 if the cell itself has a mine
      // an icon for a bomb
      // an icon for a flag
    }
  } /// Generate a string to set the correct column spacings in the grid-box for game-area


  var gridColumns = "";

  for (var index = 0; index < columnsY; index++) {
    gridColumns = gridColumns + " 1fr";
  } /// Set both the column styling for the grid and the HTML for the cells


  var gameArea = document.getElementById('game-area');
  gameArea.style.gridTemplateColumns = gridColumns;
  gameArea.innerHTML = gridInnerHtml; /// Time to seed with mines

  var minesArr = mineList(); //unshift to insert columnWidth at index=0 - way of passing 2 parameters

  minesArr.unshift(parseInt(maxColumns));
  minesArr.forEach(setMine); /// Calculate nearby mines for every cell without a mine
  /// Need to go around the surrounding 8 (max) cells looking for mines (value=9)

  var mineCount;

  for (var _rowIndex = 1; _rowIndex <= rowsX; _rowIndex++) {
    for (var _columnIndex = 1; _columnIndex <= columnsY; _columnIndex++) {
      var myCellStatus = myCell(_rowIndex, _columnIndex);
      mineCount = 0;

      if (myCellStatus.numberValue < 9) {
        // Count the mines surrounding
        border(_rowIndex, rowsX, _columnIndex, columnsY).forEach(function (rowCol) {
          myCellBorder = myCell(rowCol[0], rowCol[1]);
          if (myCellBorder.numberValue == 9) mineCount++;
        });
        myCellStatus.setNumberValue(mineCount);
      }
    }
  }
};

function mineList() {
  /// Easy = 10% of squares
  /// Medium = 15% of squares
  /// Hard = 20% of squares
  // ****************************Not currently generating random list********************************
  return [1, 2, 5, 13, 19];
}

var setMine = function setMine(value, index, array) {
  console.log("value: ".concat(value, " index: ").concat(index, " array: ").concat(array));

  if (index > 0) {
    var minePos = mineCoord(value, array[0]); //console.log(`minePos:: row ${minePos[0]} column ${minePos[1]}`);

    var rowsString = minePos[0].toString().padStart(2, "0");
    var columnString = minePos[1].toString().padStart(2, "0");
    var mineID = "mine".concat(rowsString).concat(columnString);
    var mineElement = document.getElementById(mineID);
    var spanInElement = mineElement.getElementsByClassName('mineNumber')[0];
    spanInElement.innerHTML = '9';
  }
}; // function to translate cell number to co-ordinates


var mineCoord = function mineCoord(cellNum, columnWide) {
  // Need to return a row and column
  var colNum = cellNum % columnWide;

  if (colNum == 0) {
    colNum = 5;
  }

  ;
  var rowNum = (cellNum - colNum) / columnWide + 1;
  return [rowNum, colNum];
}; // Get mineValue in span


var mineValueGet = function mineValueGet(mineRow, mineColumn) {
  var rowsString = mineRow.toString().padStart(2, "0");
  var columnString = mineColumn.toString().padStart(2, "0");
  var mineID = "mine".concat(rowsString).concat(columnString);
  return mineValueGetMineID(mineID);
};

var mineValueGetMineID = function mineValueGetMineID(idValue) {
  var mineElement = document.getElementById(idValue);
  var spanInElement = mineElement.getElementsByClassName('mineNumber')[0];
  return parseInt(spanInElement.innerHTML);
}; // Set mineValue in span


var mineValueSet = function mineValueSet(mineRow, mineColumn, value) {
  var rowsString = mineRow.toString().padStart(2, "0");
  var columnString = mineColumn.toString().padStart(2, "0");
  var mineID = "mine".concat(rowsString).concat(columnString);
  var mineElement = document.getElementById(mineID);
  mineElement.getElementsByClassName('mineNumber')[0].innerHTML = value;
}; // Function that cycles through all squares around a square


var goAround = function goAround(rowCurrent, rowMax, columnCurrent, columnMax, func) {
  if (func == "Count") {
    mineCount = 0;
  } else if (func == "CheckCells") {
    var _myCellGo = [];
  }

  for (var rowIndex1 = Math.max(1, parseInt(rowCurrent) - 1); rowIndex1 <= Math.min(parseInt(rowCurrent) + 1, rowMax); rowIndex1++) {
    //console.log(`Math.min: ${Math.min(columnCurrent+1)}`);
    for (var columnIndex1 = Math.max(1, parseInt(columnCurrent) - 1); columnIndex1 <= Math.min(parseInt(columnCurrent) + 1, columnMax); columnIndex1++) {
      if (!(rowIndex1 == rowCurrent && columnIndex1 == columnCurrent)) {
        myCellGo = myCell(rowIndex1, columnIndex1);

        if (func == "Count") {
          if (myCellGo.numberValue == 9) mineCount++;
        } else if (func == "CheckCells") {
          if (myCellGo.numberValue == 0 && (myCellGo.numberStatus == 'hidden' || myCellGo.numberStatus == '')) {
            myCellGo.setNumberVisibility('visible');
            myCellGo.setZeroNumberVisibility();
            myCellGo.setFlagVisibility('hidden');
            goAround(rowIndex1, rowMax, columnIndex1, columnMax, "CheckCells");
          } else {
            myCellGo.setNumberVisibility('visible');
            myCellGo.setFlagVisibility('hidden');
          }
        }
      }
    }
  }

  if (func == "Count") {
    //console.log(`mineCount: ${mineCount}`);
    return mineCount;
  } else if (func == "CheckCells") {
    // cellsArr.shift();
    // console.log(`goAound return cellsArr: ${cellsArr}`);
    return; //cellsArr
  }
}; // Function to provide array of cells around a given cell


var border = function border(rowCurrent, rowMax, columnCurrent, columnMax) {
  var cellsArr;

  for (var rowIndex = Math.max(1, parseInt(rowCurrent) - 1); rowIndex <= Math.min(parseInt(rowCurrent) + 1, rowMax); rowIndex++) {
    for (var columnIndex = Math.max(1, parseInt(columnCurrent) - 1); columnIndex <= Math.min(parseInt(columnCurrent) + 1, columnMax); columnIndex++) {
      if (!(rowIndex == rowCurrent && columnIndex == columnCurrent)) {
        if (typeof cellsArr == 'undefined') {
          cellsArr = [[rowIndex, columnIndex]];
        } else {
          cellsArr.push([rowIndex, columnIndex]);
        }
      }
    }
  }

  return cellsArr;
}; // Functions that respond to actions or events ===============================
// Let's play  ===  big Yellow button


function startGame(event) {
  isTimerRunning = false;
  document.getElementById('timer').innerHTML = '0'; // Check the size of grid required

  maxRows = getSize()[0];
  maxColumns = getSize()[1]; // Create the grid using size from above

  createGrid(maxRows, maxColumns); // Generate mines in grid
  // Calculate nearby mines for each cell not containing a mine
} // This function is called when a cell in the grid is (left) clicked on


function mineLeftClick(event) {
  !isTimerRunning && timer();

  if (mouseTwoButtonCheck !== 1) {
    /// Cell is either hidden or red flagged
    /// red flag = do nothing
    /// Hidden => check for mines
    var cellLeftClick = myCell(0, 0, event);

    if (cellLeftClick.flagStatus == 'hidden' || cellLeftClick.flagStatus == "") {
      var mineValue = cellLeftClick.numberValue;

      if (mineValue == 9) {
        // Blown away
        cellLeftClick.setBombVisibility('visible');
        cellLeftClick.setFlagVisibility('hidden');
        alert('BOOOOMMMM');
        startGame();
      } else if (mineValue > 0) {
        // Display number
        cellLeftClick.setFlagVisibility('hidden');
        cellLeftClick.setNumberVisibility('visible');
      } else {
        //It's clear. Check around
        cellLeftClick.setNumberVisibility('visible');
        cellLeftClick.setZeroNumberVisibility();
        var rowEvent = event.currentTarget.id.slice(4, 6);
        var columnEvent = event.currentTarget.id.slice(6, 8);
        var checkCells = [[rowEvent, columnEvent]];
        checkCells.concat(goAround(rowEvent, maxRows, columnEvent, maxColumns, "CheckCells"));
      }
    }
  } else {
    /// Do nothing as this was called following a left and right mouse click combo
    mouseTwoButtonCheck = 0;
  }
} /// This function is called when a cell in the grid is (right) clicked on


function mineRightClick(event) {
  event.preventDefault();
  !isTimerRunning && timer();
  var myCellRight = myCell(0, 0, event);
  var thisCell = document.getElementById(event.currentTarget.id);
  var thisCellBomb = thisCell.getElementsByClassName('fa-bomb')[0];
  var thisCellFlag = thisCell.getElementsByClassName('fa-flag')[0];
  var thisCellNumber = thisCell.getElementsByClassName('mineNumber')[0]; // if event.buttons = 1 then the left button is being held down while clicking the right

  mouseTwoButtonCheck = event.buttons; // Choose action depending on whether left mouse button was down while clicking right

  if (mouseTwoButtonCheck != 1) {
    // Just the right button
    if (myCellRight.numberStatus !== 'visible' && (myCellRight.flagStatus == 'hidden' || myCellRight.flagStatus == '')) {
      myCellRight.setFlagVisibility('visible');
      myCellRight.setBombVisibility('hidden');
      myCellRight.setNumberVisibility('hidden');
    } else {
      myCellRight.setFlagVisibility('hidden');
    }
  } else {
    // Left button down and right button click
    // Check number of flags in adjacent cells == mineNumber
    // If it is then reveal cells that are not flagged and not
    if (thisCellNumber.style.visibility == 'hidden' || thisCellNumber.style.visibility == '') {
      thisCellFlag.style.visibility = 'hidden';
      thisCellBomb.style.visibility = 'hidden';
      thisCellNumber.style.visibility = 'visible';
    } else {
      thisCellNumber.style.visibility = 'hidden';
    }
  }
}

var myCell = function myCell(row, column, event) {
  var thisCellID;
  var rowsString;
  var columnString;

  if (row == 0) {
    thisCellID = document.getElementById(event.currentTarget.id);
    rowsString = thisCellID.id.slice(4, 6);
    columnString = thisCellID.id.slice(6, 8);
  } else {
    rowsString = row.toString().padStart(2, "0");
    columnString = column.toString().padStart(2, "0");
    var mineID = "mine".concat(rowsString).concat(columnString);
    thisCellID = document.getElementById(mineID);
  }

  var thisCellBombID = thisCellID.getElementsByClassName('fa-bomb')[0];
  var thisCellBombStatus = thisCellBombID.style.visibility;
  var thisCellFlagID = thisCellID.getElementsByClassName('fa-flag')[0];
  var thisCellFlagStatus = thisCellFlagID.style.visibility;
  var thisCellNumberID = thisCellID.getElementsByClassName('mineNumber')[0];
  var thisCellNumberStatus = thisCellNumberID.style.visibility;
  var thisCellNumberValue = parseInt(thisCellNumberID.innerHTML);
  var cellObj = new MyCell(thisCellID, rowsString, columnString, thisCellBombID, thisCellBombStatus, thisCellFlagID, thisCellFlagStatus, thisCellNumberID, thisCellNumberStatus, thisCellNumberValue);
  return cellObj;
}; // Initiate some global variables =============================================


var mouseTwoButtonCheck = 0;
var maxRows = getSize()[0];
var maxColumns = getSize()[1];
var totalCells = maxRows * maxColumns;

var MyCell =
/*#__PURE__*/
function () {
  function MyCell(cellID, row, column, bombID, bombStatus, flagID, flagStatus, numberID, numberStatus, numberValue) {
    _classCallCheck(this, MyCell);

    // cell, bomb, flag, number are all element ID's in DOM
    // numberValue is the value in span with class = mineNumber
    this.cellID = cellID;
    this.row = row;
    this.column = column;
    this.bombID = bombID;
    this.bombStatus = bombStatus;
    this.flagID = flagID;
    this.flagStatus = flagStatus;
    this.numberID = numberID;
    this.numberStatus = numberStatus;
    this.numberValue = numberValue;
  }

  _createClass(MyCell, [{
    key: "setBombVisibility",
    value: function setBombVisibility(value) {
      this.bombID.style.visibility = value;
    }
  }, {
    key: "setFlagVisibility",
    value: function setFlagVisibility(value) {
      this.flagID.style.visibility = value;
    }
  }, {
    key: "setNumberVisibility",
    value: function setNumberVisibility(value) {
      this.numberID.style.visibility = value;
      this.cellID.style.background = 'green';
    }
  }, {
    key: "setZeroNumberVisibility",
    value: function setZeroNumberVisibility(value) {
      this.numberID.style.color = 'green';
    }
  }, {
    key: "setNumberValue",
    value: function setNumberValue(value) {
      this.numberID.innerHTML = value;
    }
  }]);

  return MyCell;
}(); // Code =========================================
// Start the game


startGame();