
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

