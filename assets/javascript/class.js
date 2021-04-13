import { isTimerRunning, timer, getSize, minesCount, startGame } from './script.js';

// Initiate some global variables =============================================

let mouseTwoButtonCheck = 0;





export function mineLeftClick(event) {
  
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
        checkCells.concat(goAround(rowEvent,getSize()[0],columnEvent,getSize()[1],"CheckCells"));
      }
    }
    
  }
  else {
    /// Do nothing as this was called following a left and right mouse click combo
    mouseTwoButtonCheck = 0;
  }
}



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


export const myCell = (row, column, event) => {
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



export class MyCell {
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
  setEvents () {
    this.cellID.addEventListener('click', ()=> mineLeftClick(event));
    this.cellID.addEventListener('contextmenu', ()=> mineRightClick(event));
  }
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

          let myCellGo = myCell(rowIndex1, columnIndex1,);

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




export class MinesCount {
  constructor (minesCount) {
    this.number = minesCount;
  }
  set(value) {
    this.number = value;
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

