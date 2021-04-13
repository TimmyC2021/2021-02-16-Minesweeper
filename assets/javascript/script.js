



/// Functions that get information =============================================


  /// When the user changes the game size selection

  
  function gameSizeChange() {
    startGame();
  }


  /// Difficulty level

  const difficultyChange = (event) => {
    startGame();
  }


  /// Size of grid

  const getSize = () => {
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

  let isTimerRunning;  
  isTimerRunning = false;

  const timer = () => {
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
          <div class="game-area__mine" id="mine${rowsString}${columnString}" onclick="mineLeftClick(event)"
          oncontextmenu= "mineRightClick(event)">
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
          mineCount = 0;
          if (myCellStatus.numberValue < 9) {
            // Count the mines surrounding
            border(rowIndex, rowsX, columnIndex, columnsY).forEach( (rowCol) => {
              myCellBorder = myCell(rowCol[0],rowCol[1]);
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
    minesCount = new MinesCount(mines.length);
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


  // Function that cycles through all squares around a square

  const goAround = (rowCurrent, rowMax, columnCurrent, columnMax, func) => {
    if (func == "Count") {
      mineCount = 0;
    } else if (func == "CheckCells") {
      let myCellGo = [];
    }
    for (let rowIndex1=Math.max(1, parseInt(rowCurrent)-1); rowIndex1 <= Math.min(parseInt(rowCurrent)+1, rowMax); rowIndex1++ ) {
      //console.log(`Math.min: ${Math.min(columnCurrent+1)}`);
      
      for (let columnIndex1 = Math.max(1, parseInt(columnCurrent)-1); columnIndex1 <= Math.min(parseInt(columnCurrent)+1, columnMax); columnIndex1++) {

        if (!(rowIndex1 == rowCurrent && columnIndex1 == columnCurrent)) {

          myCellGo = myCell(rowIndex1, columnIndex1,);

          if (func == "Count") {
            if (myCellGo.numberValue == 9) mineCount++;
          }
          else if (func == "CheckCells"){
            
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
    } 
    else if (func == "CheckCells"){
      // cellsArr.shift();
      // console.log(`goAound return cellsArr: ${cellsArr}`);
      return //cellsArr
    }
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

  function startGame(event) {
    
    
    isTimerRunning = false;
    document.getElementById('timer').innerHTML = '0';

    // Check the size of grid required
    maxRows = getSize()[0];
    maxColumns = getSize()[1];
    
    // Create the grid using size from above
    createGrid(maxRows,maxColumns);

    // Generate mines in grid

    // Calculate nearby mines for each cell not containing a mine
  }


  // This function is called when a cell in the grid is (left) clicked on
  
  function mineLeftClick(event) {
  
    !isTimerRunning && timer();
    if (mouseTwoButtonCheck !== 1) {

      /// Cell is either hidden or red flagged
      /// red flag = do nothing
      /// Hidden => check for mines

      const cellLeftClick = myCell(0,0,event);

      if (cellLeftClick.flagStatus == 'hidden' || cellLeftClick.flagStatus == "") {
        const mineValue = cellLeftClick.numberValue;
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
          let rowEvent = event.currentTarget.id.slice(4,6);
          let columnEvent = event.currentTarget.id.slice(6,8);
          let checkCells = [[rowEvent,columnEvent]];
          checkCells.concat(goAround(rowEvent,maxRows,columnEvent,maxColumns,"CheckCells"));
        }
      }
      
    }
    else {
      /// Do nothing as this was called following a left and right mouse click combo
      mouseTwoButtonCheck = 0;
    }
  }


  /// This function is called when a cell in the grid is (right) clicked on
  
  function mineRightClick(event) {
  
    event.preventDefault();
    !isTimerRunning && timer();
    const myCellRight = myCell(0,0,event);
    const thisCell = document.getElementById(event.currentTarget.id);
    const thisCellBomb = thisCell.getElementsByClassName('fa-bomb')[0];
    const thisCellFlag = thisCell.getElementsByClassName('fa-flag')[0];
    const thisCellNumber = thisCell.getElementsByClassName('mineNumber')[0];
    
    // if event.buttons = 1 then the left button is being held down while clicking the right
    mouseTwoButtonCheck = event.buttons;
    

    // Choose action depending on whether left mouse button was down while clicking right
    if (mouseTwoButtonCheck != 1) {
      
      // Just the right button
      if (myCellRight.numberStatus !== 'visible' && ( myCellRight.flagStatus == 'hidden' || myCellRight.flagStatus == '')) {
        myCellRight.setFlagVisibility('visible');
        myCellRight.setBombVisibility('hidden');
        // myCellRight.setNumberVisibility('hidden');
        minesCount.subtract();
      } else {
        myCellRight.setFlagVisibility('hidden');
        minesCount.add();
      }
    }
    else {
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
  

  const myCell = (row, column, event) => {
    // Two ways of calling this
    // 1. Provide a valid row and column value to address a specific cell. (event ignored)
    // 2. Set row=0 and provide an event (column ignored). The event can be used to identify the square selected

    let thisCellID;
    let rowsString;
    let columnString;
    if ( row == 0) {
      // using event
      thisCellID = document.getElementById(event.currentTarget.id);
      rowsString = thisCellID.id.slice(4,6);
      columnString = thisCellID.id.slice(6,8);
      
    } else {
      // using row and column
      rowsString = row.toString().padStart(2,"0");
      columnString = column.toString().padStart(2,"0");
      const mineID = `mine${rowsString}${columnString}`;
      thisCellID = document.getElementById(mineID);
    }
    const thisCellBombID = thisCellID.getElementsByClassName('fa-bomb')[0];
    const thisCellBombStatus = thisCellBombID.style.visibility;
    const thisCellFlagID = thisCellID.getElementsByClassName('fa-flag')[0];
    const thisCellFlagStatus = thisCellFlagID.style.visibility;
    const thisCellNumberID = thisCellID.getElementsByClassName('mineNumber')[0];
    const thisCellNumberStatus = thisCellNumberID.style.visibility;
    const thisCellNumberValue = parseInt(thisCellNumberID.innerHTML);
    const cellObj = new MyCell(thisCellID, rowsString, columnString, thisCellBombID, thisCellBombStatus, 
      thisCellFlagID, thisCellFlagStatus, thisCellNumberID, thisCellNumberStatus, thisCellNumberValue);
    return cellObj;
  }


// Initiate some global variables =============================================

  let mouseTwoButtonCheck = 0;
  let maxRows = getSize()[0];
  let maxColumns = getSize()[1];
  let totalCells = maxRows * maxColumns;
  // let minesCount = 0;

  class MinesCount {
    constructor (minesCount) {
      this.number = minesCount;
    }
    add() {
      this.number = this.number + 1;
      this.update();
    }
    subtract(){
      this.number = this.number - 1;
      this.update();
    }
    update(){
      document.getElementById('mines-left').innerHTML = this.number
      if (this.number < 0) {
        document.getElementById('mines-left').style.color = 'red'
      } else {
        document.getElementById('mines-left').style.color = 'black'
      }
    }
  }

  class MyCell {
    constructor( cellID, row, column, bombID, bombStatus, flagID, flagStatus, numberID, numberStatus, numberValue) {
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
    setBombVisibility (value) {
      this.bombID.style.visibility = value
    }
    setFlagVisibility (value) {
      this.flagID.style.visibility = value
    }
    setNumberVisibility (value) {
      this.numberID.style.visibility = value;
      this.cellID.style.background = 'green';
    }
    setZeroNumberVisibility (value) {
      this.numberID.style.color = 'green'
    }
    setNumberValue (value) {
      this.numberID.innerHTML = value
    }
  }




// Code =========================================


// Start the game

  startGame();