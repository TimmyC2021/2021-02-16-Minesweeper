// Need event listeners for mouse clicks
  // Over mines
    // left click - test it
    // right click - flag it (or unflag it)
    // left+right - test it and adjoining squares


// Routine to generate different sized grids
  // Need to know size of grid Rows x Columns
  // Final game to offer 3 preset options and maybe a custom
  // For testing purposes lets work with 5 x 5

  const rowsX = 5;
  const columnsY = 5;



// Populate grid with mines
  // Game to offer 3 levels of difficulty. Easy, Medium, Hard
  // These reflect a density of mines, so total number may change with size of grid for the same level of difficulty

// Calculate nearby mines for every cell without a mine
  // Need to go around the surrounding 8 (max) cells looking for mines (value=9)

// How to systamatically work outwards from selected cell??
  // This routine may need to be called from different sections
  // Perhaps use an array of cells to be checked

// Grid referencing, will be slightly at odds with array indices
  // Rows 10 to xx (xx == X rows + 10) starting at 10 to force double digits
  // Columns 01 to yy (yy == Y columns + 10) starting at 10 to force double digits


  // Let's play big Yellow button
  function resetPlay(event) {
    console.log("We are in resetPlay");
  }
