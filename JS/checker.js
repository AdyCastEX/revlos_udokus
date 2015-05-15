
function check_row(number,puzzle,row,row_size){
	
	for(var i=0;i<row_size;i+=1){
		if(puzzle[row][i] == number){
			return false
		}
	}

	return true
}

function check_column(number,puzzle,col,col_size){
	for(var i=0;i<col_size;i+=1){
		if(puzzle[i][col] == number){
			return false
		}
	}
	return true
}

function check_grid(number, puzzle, row, col, subgrid_size){
	// get the grid location of the element
	g_row = Math.floor(row/subgrid_size)
	g_col = Math.floor(col/subgrid_size)
	
	// i and j will start at the upper left of the its grid then traverse downward
	for(var i=(g_row*subgrid_size); Math.floor(i/subgrid_size) == g_row; i+=1)
	{
		// traverse through the columns of the grid
		for(var j=(g_col*subgrid_size); Math.floor(j/subgrid_size) == g_col; j+=1)
		{
			if(puzzle[i][j] == number)
				return false
		}
	}
	return true
}

/**
 * Checks if an element is found in the diagonals of the sudoku board
 */
function check_x(num_row, puzzle,x,row,col)
{
	
	if(num_row % 2 == 1){
		if((row == col) || ((num_row-1) == (row+col)))
		{
			for(var i=0;i<num_row;i++)
				if(puzzle[i][i] == x || puzzle[num_row-1-i][i]==x) return true

		}
	}else{
		if(row == col)
		{
			for(var i=0; i<num_row; i++)
			{
				// for the negative sloped line of the X
				if(puzzle[i][i] == x)
					return false
			}
		}
		else if(col == (num_row-1-row))
		{
			for(var i=0; i<num_row; i++)
			{
				// for the positive sloped line of the X
				if(puzzle[i][(num_row-1)-i] == x)
					return false
			}
		}
	}
	return true
}

/**
 * For odd numbered gridSize
  * Checks if an element is found in the Y locations of the sudoku board
 */
function check_y(num_row, puzzle, x, row, col)
{
	if((num_row % 2) != 0)
	{
		var k = Math.floor((num_row-1)/2)

		if((row == col && row < k) || (col == k && row > k))
		{
			for(var i=0; i<num_row; i++)
			{
				// for the upper part of the Y
				if(i < k)
				{	
					// left line of the Y
					if(puzzle[i][i] == x)
					{
						return false
					}
				}
				else	// for the lower part of the Y
				{
					if(puzzle[i][k] == x)
					{
						return false
					}
				}
			}
		}

		if((col == (num_row-1-row) && row < k) || (col == k && row > k))
		{
			for(var i=0; i<num_row; i++)
			{
				// for the upper part of the Y
				if(i < k)
				{	
					// right line of the Y
					if(puzzle[i][(num_row-1)-i] == x)
					{
						return false
					}
				}
				else	// for the lower part of the Y
				{
					if(puzzle[i][k] == x)
					{
						return false
					}
				}
			}
		}

		return true
	}
	else
		return false
}