import { myCell, MinesCount } from './class.js';


/// Functions that get information =============================================


  /// When the user changes the game size selection

  
  function gameSizeChange() {
    startGame();
  }


  /// Difficulty level -- Hidden for now

  const difficultyChange = (event) => {
    startGame();
  }


  /// Size of grid

  export const getSize = () => {
    /// reads the title of the relevant radio button
    /// it expects it to be in a format "row x column" with spaces around the x
    return document.querySelector("input[name=gameSize]:checked").title.split(' x ');
  }
      


  /// Is number already in array

  //  ******************* Not working yet
  //  ******************* Intended to be used with mine seeder
  const checkList = (listArr,numCheck) => {
    listArr.find(numberItem=>numberItem==numCheck)
  }




/// Functions that do something =========================================

  
  export const timer = () => {
    let start;
    start = Date.now();
    setInterval(()=>{
      if (isTimerRunning == false) {
        clearInterval();
      }
      const current = Date.now() - start;
      const seconds = Math.floor(current / 1000);
      document.getElementById('timer').innerHTML = seconds;

    },1000);
    

  }



  /// Function to create new grid

  const createGrid = (rowsX,columnsY) => {

    /// It will generate the neccessary html code to insert into the game-area elements

    /// Populate grid with mines
    /// Game to offer 3 levels of difficulty. Easy, Medium, Hard
    /// These reflect a density of mines, so total number may change with size of grid for the same level of difficulty

    let gridInnerHtml = "";
    
    
    /// Below creates the string for the inner HTML

    for (let rowIndex=1; rowIndex <= rowsX; rowIndex++ ) {
      for (let columnIndex = 1; columnIndex <= columnsY; columnIndex++) {
    
      /// innerHTML constructed by looping through rows and columns.
    
        let rowsString = rowIndex.toString().padStart(2,"0");
        let columnString = columnIndex.toString().padStart(2,"0");
          
        /// The above ensures that row and column references are 2 digits

        gridInnerHtml = ` 
          ${gridInnerHtml} 
          <div class="game-area__mine" id="mine${rowsString}${columnString}">
          <span class="mineNumber">8</span>
          <i class="fas fa-bomb"></i>
          <i class="fas fa-flag"></i></div>
          `
        /// Construct each cell on a loop and add to the end of the previous loops

        /// div element:
          // is the container with a class for formatting the cell
          // actions for left and right mouse clicks
          // and a unique id for each cell to be able to access later

        /// Each cell has 3 parts
          // a span element to hold number of mines around 0-8 or 9 if the cell itself has a mine
          // an icon for a bomb
          // an icon for a flag

      }
    }

    /// Generate a string to set the correct column spacings in the grid-box for game-area
    let gridColumns = "";
    for (let index=0; index < columnsY; index++) {
        gridColumns = gridColumns + " 1fr"
      }

    /// Set both the column styling for the grid and the HTML for the cells
      let gameArea = document.getElementById('game-area');
      gameArea.style.gridTemplateColumns = gridColumns;
      gameArea.innerHTML = gridInnerHtml;
    
    /// Time to seed with mines
      let minesArr = mineList();
      document.getElementById('mines-left').innerHTML = minesCount.number;
      //unshift to insert columnWidth at index=0 - way of passing 2 parameters
      minesArr.unshift(parseInt(maxColumns));
      minesArr.forEach(setMine);
      
    
    /// Calculate nearby mines for every cell without a mine
    /// Need to go around the surrounding 8 (max) cells looking for mines (value=9)
      let mineCount;
      for (let rowIndex=1; rowIndex <= rowsX; rowIndex++ ) {
        for (let columnIndex = 1; columnIndex <= columnsY; columnIndex++) {
          const myCellStatus = myCell(rowIndex,columnIndex);
          myCellStatus.setEvents();
          mineCount = 0;
          if (myCellStatus.numberValue < 9) {
            // Count the mines surrounding
            border(rowIndex, rowsX, columnIndex, columnsY).forEach( (rowCol) => {
              let myCellBorder = myCell(rowCol[0],rowCol[1]);
              if (myCellBorder.numberValue == 9) mineCount++;
            });
            myCellStatus.setNumberValue(mineCount);
          }
        }
      }
    }


  const mineList = () => {

    /// Easy = 10% of squares
    /// Medium = 15% of squares
    /// Hard = 20% of squares

    // ****************************Not currently generating random list********************************

    let mines = [1,2,5,13,19];
    minesCount.set(mines.length);
    return mines;
  }


  const setMine = (value, index, array) => {
    console.log(`value: ${value} index: ${index} array: ${array}`);
    if (index > 0) {
      const minePos = mineCoord(value, array[0]);
      //console.log(`minePos:: row ${minePos[0]} column ${minePos[1]}`);
    
      let rowsString = minePos[0].toString().padStart(2,"0");
      let columnString = minePos[1].toString().padStart(2,"0");
      const mineID = `mine${rowsString}${columnString}`;
      const mineElement = document.getElementById(mineID);
      const spanInElement = mineElement.getElementsByClassName('mineNumber')[0];
      spanInElement.innerHTML = '9';
    }

  }

  
  // function to translate cell number to co-ordinates

  const mineCoord = (cellNum, columnWide) => {
    // Need to return a row and column
    let colNum = cellNum % columnWide;
    if (colNum == 0) {colNum = 5};
    const rowNum = ((cellNum - colNum) / columnWide) + 1;
    return [rowNum, colNum];
  }


  // Get mineValue in span

  const mineValueGet = (mineRow, mineColumn) => {
    let rowsString = mineRow.toString().padStart(2,"0");
    let columnString = mineColumn.toString().padStart(2,"0");
    const mineID = `mine${rowsString}${columnString}`;
    return mineValueGetMineID(mineID);
  }


  const mineValueGetMineID = (idValue) => {
    const mineElement = document.getElementById(idValue);
    const spanInElement = mineElement.getElementsByClassName('mineNumber')[0];
    return parseInt(spanInElement.innerHTML);
  }

    
  // Set mineValue in span

  const mineValueSet = (mineRow, mineColumn, value) => {
    let rowsString = mineRow.toString().padStart(2,"0");
    let columnString = mineColumn.toString().padStart(2,"0");
    const mineID = `mine${rowsString}${columnString}`;
    const mineElement = document.getElementById(mineID);
    mineElement.getElementsByClassName('mineNumber')[0].innerHTML = value;

  }



  // Function to provide array of cells around a given cell

  const border = (rowCurrent, rowMax, columnCurrent, columnMax) => {
    let cellsArr;
    for (let rowIndex=Math.max(1, parseInt(rowCurrent)-1); rowIndex <= Math.min(parseInt(rowCurrent)+1, rowMax); rowIndex++ ) {
      for (let columnIndex = Math.max(1, parseInt(columnCurrent)-1); columnIndex <= Math.min(parseInt(columnCurrent)+1, columnMax); columnIndex++) {
        if (!(rowIndex == rowCurrent && columnIndex == columnCurrent)) {
          if (typeof(cellsArr) == 'undefined') {
            cellsArr = [[rowIndex, columnIndex]]
          } else {
            cellsArr.push([rowIndex, columnIndex]);
          }
        }
      }
    }
    return cellsArr;
  }


  
// Functions that respond to actions or events ===============================

  
  // Let's play  ===  big Yellow button
  export let isTimerRunning = false;  

  export function startGame(event) {
    
    
    isTimerRunning = false;
    document.getElementById('timer').innerHTML = '0';

    // Check the size of grid required
    let maxRows = getSize()[0];
    let maxColumns = getSize()[1];
    
    // Create the grid using size from above
    createGrid(maxRows,maxColumns);

    // Generate mines in grid

    // Calculate nearby mines for each cell not containing a mine
  }


  // This function is called when a cell in the grid is (left) clicked on
  
  

  /// This function is called when a cell in the grid is (right) clicked on
  
  
  


// Initiate some global variables =============================================

  //  let mouseTwoButtonCheck = 0;
  let maxRows = getSize()[0];
  let maxColumns = getSize()[1];
  // let totalCells = maxRows * maxColumns;
  export let minesCount = new MinesCount(0);
  
  document.getElementById('reset-button').addEventListener('click', ()=> startGame(event));
  document.querySelectorAll("input[name=gameSize]").forEach(query => query.addEventListener('click', ()=> gameSizeChange(event)));




// Code =========================================


// Start the game

  startGame();