/**
 * Checks if an element is found in the specified row
 */
int checkRow(int noCol, int row, int **puzzle, int x)
{
	int i;
	for(i=0; i<noCol; i++)
	{
		if(puzzle[row][i] == x)
			return 0;
	}
	return 1;
}

/**
 * Checks if an element is found in the specified column
 */
int checkColumn(int col, int noRow, int **puzzle, int x)
{
	int i;
	for(i=0; i<noRow; i++)
	{
		if(puzzle[i][col] == x)
			return 0;
	}
	return 1;
}

/**
 * Checks if an element is found in its grid
 */
int checkGrid(int gridSize, int **puzzle, int row, int col, int x)
{
	// get the grid location of the element
	int gRow = row/gridSize;
	int gCol = col/gridSize;
	int i,j;

	// i and j will start at the upper left of the its grid then traverse downward
	for(i=(gRow*gridSize); i/gridSize == gRow; i++)
	{
		// traverse through the columns of the grid
		for(j=(gCol*gridSize); j/gridSize == gCol; j++)
		{
			if(puzzle[i][j] == x)
				return 0;
		}
	}
	return 1;
}

/**
 * Checks if an element is found in the diagonals of the sudoku board
 */
int checkX(int noRow, int **puzzle, int x, int row, int col)
{
	int i;


	if(noRow%2==1){
		if((row == col) || ((noRow-1) == (row+col)))
		{
			//printf("row: %d; col: %d; x: %d\n", row, col, x);
			/*for(i=0; i<noRow; i++)
			{
				// for the negative sloped line of the X
				if(puzzle[i][i] == x)
					return 0;
			}*/
			for(i=0;i<noRow;i++)
				if(puzzle[i][i] == x || puzzle[noRow-1-i][i]==x) return 0;

		}
	}else{
		if(row == col)
		{
			for(i=0; i<noRow; i++)
			{
				// for the negative sloped line of the X
				if(puzzle[i][i] == x)
					return 0;
			}
		}
		else if(col == (noRow-1-row))
		{
			for(i=0; i<noRow; i++)
			{
				// for the positive sloped line of the X
				if(puzzle[i][(noRow-1)-i] == x)
					return 0;
			}
		}
	}
	return 1;
}

/**
 * For odd numbered gridSize
  * Checks if an element is found in the Y locations of the sudoku board
 */
int checkY(int noRow, int **puzzle, int x, int row, int col)
{
	if((noRow%2) != 0)
	{
		int i;
		int k = (noRow-1)/2;

		if((row == col && row < k) || (col == k && row > k))
		{
			for(i=0; i<noRow; i++)
			{
				// for the upper part of the Y
				if(i < k)
				{	
					// left line of the Y
					if(puzzle[i][i] == x)
					{
						return 0;
					}
				}
				else	// for the lower part of the Y
				{
					if(puzzle[i][k] == x)
					{
						return 0;
					}
				}
			}
		}

		if((col == (noRow-1-row) && row < k) || (col == k && row > k))
		{
			for(i=0; i<noRow; i++)
			{
				// for the upper part of the Y
				if(i < k)
				{	
					// right line of the Y
					if(puzzle[i][(noRow-1)-i] == x)
					{
						return 0;
					}
				}
				else	// for the lower part of the Y
				{
					if(puzzle[i][k] == x)
					{
						return 0;
					}
				}
			}
		}

		return 1;
	}
	else
		return 0;
}