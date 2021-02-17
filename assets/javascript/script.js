// Need event listeners for mouse clicks
  // Over mines
    // left click - test it
    // right click - flag it (or unflag it)
    // left+right - test it and adjoining squares


// Routine to generate different sized grids

// Final game to offer 3 preset options and maybe a custom option
    // How do we read the size?
    const gameSize = (event) => {
      // Not sure if this routine is needed???
      // Maybe if we want to change some formatting between selection and execution

      // DEBUG message                                                        ================================
      console.log(`gameSize ${event.target.title}`);
      // End of DEBUG message                                                 ================================
    
      // selected option to be highlighted in yellow until actioned (in Let's Play)
      // document.getElementById(event.target.id).classList.add('highlightChange') ;
    }
    // other options to be cleared of highlight



// Difficulty level
const difficulty = (event) => {

      // DEBUG message                                                        ================================
      console.log(`difficulty ${event.target.value}`);
      // End of DEBUG message                                                 ================================

}



  // Function to create new grid
    // It will generate the neccessary html code to insert into the game-area elements
    const createGrid = (rowsX,columnsY) => {
      let gridInnerHtml = "";
      let gridColumns = "";
  
      // Create the string for the inner HTML
      for (let rowIndex=1; rowIndex <= rowsX; rowIndex++ ) {
        for (let columnIndex = 1; columnIndex <= columnsY; columnIndex++) {
          let rowsString = rowIndex.toString().padStart(2,"0");
          let columnString = columnIndex.toString().padStart(2,"0");
          gridInnerHtml = ` ${gridInnerHtml} <div class="game-area__mine" id="mine${rowsString}${columnString}" onclick="mineField(event)"></div>`
        }
      }

      // Generate a string to set the correct column spacings in the grid-box for game-area
      for (let index=0; index < columnsY; index++) {
        gridColumns = gridColumns + " 1fr"
      }

      // Set both the column styling for the grid and the HTML for the cells
      let gameArea = document.getElementById('game-area');
      gameArea.style.gridTemplateColumns = gridColumns;
      gameArea.innerHTML = gridInnerHtml;
    }

// Populate grid with mines
  // Game to offer 3 levels of difficulty. Easy, Medium, Hard
  // These reflect a density of mines, so total number may change with size of grid for the same level of difficulty

// Calculate nearby mines for every cell without a mine
  // Need to go around the surrounding 8 (max) cells looking for mines (value=9)

// How to systematically work outwards from selected cell??
  // This routine may need to be called from different sections
  // Perhaps use an array of cells to be checked

// Grid referencing
  // Mine0205 refers to the second row and 5th column

  // Function to return which size option has been selected
  const getSize = () => {
    // reads the title of the relevant radio button
    // it expects it to be in a format "row x column" with spaces around the x
    //const gridSize = document.querySelector("input[name=gameSize]:checked").title.split(' x ');
    return document.querySelector("input[name=gameSize]:checked").title.split(' x ');
  }

  // Let's play  ===  big Yellow button

  function resetPlay(event) {
    // DEBUG message                                                        ================================
    console.log(`We are in resetPlay and getSize is: ${getSize()}`);
    // End of DEBUG message                                                 ================================
    
    // Check the size of grid required
    const gridSize = getSize();

    // Create the grid using size from above
    createGrid(gridSize[0],gridSize[1]);

    // Generate mines in grid

    // Calculate nearby mines for each cell not containing a mine
  }

    // This function is called when a cell in the grid is clicked on
    function mineField(event) {

      // DEBUG message                                                        ================================
      console.log(`mineField ${event.target.id}`);
      // End of DEBUG message                                                 ================================
    }

      // DEBUG message                                                        ================================
      // End of DEBUG message                                                 ================================


      // Start the game
      resetPlay();