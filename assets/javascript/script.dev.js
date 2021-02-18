"use strict";

// Functions that get information =============================================
// Size of grid
var getSize = function getSize() {
  // reads the title of the relevant radio button
  // it expects it to be in a format "row x column" with spaces around the x
  return document.querySelector("input[name=gameSize]:checked").title.split(' x ');
}; // Difficulty level


var difficulty = function difficulty(event) {
  return document.querySelector("input[name=difficulty]:checked").value;
}; // Is number already in array


var checkList = function checkList(listArr, numCheck) {
  listArr.find(function (numberItem) {
    return numberItem == numCheck;
  });
}; // Functions that do something =========================================
// Function to create new grid


var createGrid = function createGrid(rowsX, columnsY) {
  // It will generate the neccessary html code to insert into the game-area elements
  // Populate grid with mines
  // Game to offer 3 levels of difficulty. Easy, Medium, Hard
  // These reflect a density of mines, so total number may change with size of grid for the same level of difficulty
  var gridInnerHtml = "";
  var gridColumns = "";
  var minesArr = mineList();
  console.log(minesArr); // Create the string for the inner HTML

  for (var rowIndex = 1; rowIndex <= rowsX; rowIndex++) {
    for (var columnIndex = 1; columnIndex <= columnsY; columnIndex++) {
      // innerHTML constructed by looping through rows and columns.
      var rowsString = rowIndex.toString().padStart(2, "0");
      var columnString = columnIndex.toString().padStart(2, "0"); // The above ensures that row and column references are 2 digits

      gridInnerHtml = " \n            ".concat(gridInnerHtml, " \n            <div class=\"game-area__mine\" id=\"mine").concat(rowsString).concat(columnString, "\" onclick=\"mineField(event)\"\n            oncontextmenu= \"mineRightClick(event)\">\n            <span class=\"mineNumber\">8</span>\n            <i class=\"fas fa-bomb\"></i>\n            <i class=\"fas fa-flag\"></i></div>\n            "); // Construct each cell on a loop and add to the end of the previous loops
      // div element:
      // is the container with a class for formatting the cell
      // actions for left and right mouse clicks
      // and a unique id for each cell to be able to access later
      // Each cell has 3 parts
      // a span element to hold number of mines around 0-8 or 9 if the cell itself has a mine
      // an icon for a bomb
      // an icon for a flag
    }
  } // Generate a string to set the correct column spacings in the grid-box for game-area


  for (var index = 0; index < columnsY; index++) {
    gridColumns = gridColumns + " 1fr";
  } // Set both the column styling for the grid and the HTML for the cells


  var gameArea = document.getElementById('game-area');
  gameArea.style.gridTemplateColumns = gridColumns;
  gameArea.innerHTML = gridInnerHtml;
}; // Calculate nearby mines for every cell without a mine
// Need to go around the surrounding 8 (max) cells looking for mines (value=9)
// How to systematically work outwards from selected cell??
// This routine may need to be called from different sections
// Perhaps use an array of cells to be checked
// Mine seeding


function mineList() {} // Easy = 10% of squares
// Medium = 15% of squares
// Hard = 20% of squares
// let mineListArr = [];
// let randomNum = 0;
// let index = 0;
// const numberMines = Math.ceil(totalCells * 0.10);
// do {
//   randomNum = Math.ceil(Math.random() * totalCells);
//   if (checkList(mineListArr,randomNum)) {
//     mineListArr.push(randomNum);
//     index++;
//   }
// }
// while (index < numberMines);
// Functions that respond to actions or events ===============================
// Let's play  ===  big Yellow button


function resetPlay(event) {
  // Check the size of grid required
  maxRows = getSize()[0];
  maxColumns = getSize()[1]; // Create the grid using size from above

  createGrid(maxRows, maxColumns); // Generate mines in grid
  // Calculate nearby mines for each cell not containing a mine
} // This function is called when a cell in the grid is (left) clicked on


function mineField(event) {
  if (mouseTwoButtonCheck !== 1) {
    var thisCell = document.getElementById(event.currentTarget.id);
    var thisCellBomb = thisCell.getElementsByClassName('fa-bomb')[0];
    var thisCellFlag = thisCell.getElementsByClassName('fa-flag')[0];
    var thisCellNumber = thisCell.getElementsByClassName('mineNumber')[0];

    if (thisCellBomb.style.visibility == 'hidden' || thisCellBomb.style.visibility == '') {
      thisCellBomb.style.visibility = 'visible';
      thisCellFlag.style.visibility = 'hidden';
      thisCellNumber.style.visibility = 'hidden';
    } else {
      thisCellBomb.style.visibility = 'hidden';
    }
  } else {
    // Do nothing as this was called following a left and right mouse click combo
    mouseTwoButtonCheck = 0;
  }
} // This function is called when a cell in the grid is (right) clicked on


function mineRightClick(event) {
  event.preventDefault();
  var thisCell = document.getElementById(event.currentTarget.id);
  var thisCellBomb = thisCell.getElementsByClassName('fa-bomb')[0];
  var thisCellFlag = thisCell.getElementsByClassName('fa-flag')[0];
  var thisCellNumber = thisCell.getElementsByClassName('mineNumber')[0]; // if event.buttons = 1 then the left button is being held down while clicking the right

  mouseTwoButtonCheck = event.buttons; // Choose action depending on whether left mouse button was down while clicking right

  if (mouseTwoButtonCheck != 1) {
    // Just the right button
    if (thisCellFlag.style.visibility == 'hidden' || thisCellFlag.style.visibility == '') {
      thisCellFlag.style.visibility = 'visible';
      thisCellBomb.style.visibility = 'hidden';
      thisCellNumber.style.visibility = 'hidden';
    } else {
      thisCellFlag.style.visibility = 'hidden';
    }
  } else {
    // Left button down and right button click
    if (thisCellNumber.style.visibility == 'hidden' || thisCellNumber.style.visibility == '') {
      thisCellFlag.style.visibility = 'hidden';
      thisCellBomb.style.visibility = 'hidden';
      thisCellNumber.style.visibility = 'visible';
    } else {
      thisCellNumber.style.visibility = 'hidden';
    }
  }
} // When the user changes the game size selection


function gameSize() {} // Does nothing yet, work done elsewhere
// Initiate some global variables =============================================


var mouseTwoButtonCheck = 0;
var maxRows = getSize()[0];
var maxColumns = getSize()[1];
var totalCells = maxRows * maxColumns; // Code =========================================
// Start the game

resetPlay();