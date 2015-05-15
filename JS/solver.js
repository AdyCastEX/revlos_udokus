
/*
	Description : produces a copy of a puzzle
	Parameters: 
		puzzle 		-- a 2D array that contains the elements of a puzzle
		size  		-- the integer dimension of a puzzle (e.g 9 for 9 x 9 puzzle)
	Return Value:
		copy        -- a 2D array that contains the copied elements
*/

function copy_puzzle(puzzle,size){

	var copy = []
	var row = []
	for(var i=0;i<size;i+=1){
		row = []
		for(var j=0;j<size;j+=1){
			row.push(puzzle[i][j])
			//console.log(row)
		}
		copy.push(row)
	}

	return copy
}

/*
	Description: produces a copy of a row
	Parameters:
		puzzle 		-- a 2D array that represents a puzzle
		row 		-- an integer value indicating the index of the row to copy
	Return Value:
		new_row     -- an array that the copied values
*/

function copy_row(puzzle,row){
	var new_row = []
	var size = puzzle[row].length

	for(var i=0;i<size;i+=1){
		new_row.push(puzzle[row][i])
	}

	return new_row
}

/*
	Description: creates a stack set for solving rows
	Parameters:
		row 		-- an array that contains the row to solve
	Return Value:
		stack_set 	-- a JSON object that contains the following:
			stacks  	-- an array that contains the stacks used for storing candidate numbers
			col_indices -- an array that contains the indices of numbers to solve in the row
			solution    -- an array that contains the numbers chosen from the candidates
*/

function initialize_stacks(row){

	stack_set = {
		'stacks' : [],
		'col_indices' : [],
		'solution' : []
	}


	n = row.length
	for(var i=0;i<n;i+=1){
		//the size of the stack set depends on the number of zeros in the row
		if(row[i] == 0){
			stack_set['stacks'].push([])
			stack_set['col_indices'].push(i)
			stack_set['solution'].push(0)
		}
	}

	return stack_set
}

/*
	Description: adds candidate numbers to the specified stack
	Parameters:
		stack 			-- the stack where numbers will be stored
		puzzle  		-- a 2D array representing the puzzle
		row     		-- the row of the cell to solve (int)
		col     		-- the column of the cell to solve (int)
		subgrid_size 	-- the int size of each subgrid (e.g 9 x 9 puzzle has a subgrid size of 3)
		type            -- the type of solution for the puzzle represented as string (regular,x,y,xy)
*/

function push_candidate_numbers(stack,puzzle,row,col,subgrid_size,type){
	grid_size = subgrid_size * subgrid_size


	for(var i=1;i<=grid_size;i+=1){
		//default conditions for any sudoku puzzle
		if(check_row(i,puzzle,row,grid_size) && check_column(i,puzzle,col,grid_size) && check_grid(i, puzzle, row, col, subgrid_size)){
			
			if(type === "x"){ //added condition for sudoku X
				if(check_x(grid_size, puzzle,i,row,col)){
					stack.push(i)
				}
			} else if(type === "y"){ //added condition for sudoku Y
				if(check_y(grid_size, puzzle,i,row,col)){
					stack.push(i)
				}
			} else if(type === "xy"){ //added conditions for sudoku XY
				if(check_x(grid_size, puzzle,i,row,col) && check_y(grid_size, puzzle,i,row,col)){
					stack.push(i)
				}
			} else { //regular sudoku
				stack.push(i)
			}
		}
	}
}

/*
	Description: gets a number from a specified stack, adds it to the puzzle, and checks if the row is a possible solution
	Parameters:
		puzzle 		-- a 2D array representing the puzzle
		num_stack   -- an array that represents the number stack of the specified cell
		row_stack   -- an array that contains the possible solution/s for a row
		solution    -- an array containing the numbers chosen so far
		index       -- the current index of the solution array (int)
		limit       -- the size of the solution array
		row         -- the row of the cell in consideration
		col         -- the column of the cell in consideration
		row_size    -- the size of the entire row
*/
function update_feasible_solution(puzzle,num_stack,row_stack,solution,index,limit,row,col,row_size){

	var x = num_stack.pop()
	var new_row = []

	solution[index] = x;
	puzzle[row][col] = x;

	//create a new row when the solution is filled
	if(index == limit-1){
		new_row = []
		k = 0;
		//get all of the numbers in the array
		for(var i=0; i<row_size; i+=1)
		{
			if(puzzle[row][i] > 0){
				new_row.push(puzzle[row][i])
			}else{
				new_row.push(solution[k])
				k += 1
			}
		}
		row_stack.push(new_row)
	}
}

/*
	Description: solves a row of the puzzle
	Parameters:
		puzzle 			-- a 2D array representing the puzzle
		row         	-- the integer index of the row to solve
		subgrid_size	-- the size of each subgrid (e.g. A 9 x 9 puzzle has a subgrid size of 3)
		type            -- the type of solution (string - regular,x,y,xy)
	Return Value:
		row_stack       -- a stack (array) that contains the possible solutions to the row

*/

function solve_row(puzzle,row,subgrid_size,type){

	//console.log(puzzle)

	stack_set = initialize_stacks(puzzle[row])
	row_stack = []
	index = 0
	solution_size = stack_set['solution'].length
	backtrack = 0

	while(index > -1){

		//the solution is complete so start backtracking
		if(index >= solution_size){
			index -= 1
			backtrack = 1
			continue
		}

		if(backtrack == 1){ //backtracking mode
			if(stack_set['stacks'][index].length == 0){
				//no candidates so reset the cell to zero and go backwards
				puzzle[row][stack_set['col_indices'][index]] = 0
				index -= 1
			} else{
				//there was a candidate so update the solution and go back to forwardtracking mode
				column = stack_set['col_indices'][index]
				update_feasible_solution(puzzle,stack_set['stacks'][index],row_stack,stack_set['solution'],index,solution_size,row,column,subgrid_size*subgrid_size)
				index += 1
				backtrack = 0
			}
		} else if(backtrack == 0){ //forwardtracking mode
			column = stack_set['col_indices'][index]
			//push the candidate numbers to specified stack
			push_candidate_numbers(stack_set['stacks'][index],puzzle,row,column,subgrid_size,type)
			//no candidates were found so backtrack
			if(stack_set['stacks'][index].length == 0){
				index -= 1
				backtrack = 1
			}else{ //add the candidate to the solution of the puzzle and go forward
				update_feasible_solution(puzzle,stack_set['stacks'][index],row_stack,stack_set['solution'],index,solution_size,row,column,subgrid_size*subgrid_size)
				index += 1
			}
		}

	}
	return row_stack
}

/*
	Description: checks if there are zeros in the row
	Parameters:
		row 	 	-- the index of the row to check
		grid_size 	-- the length of the row
	Return Value:
		true 		-- there is at least one zero
		false       -- there are no zeros
*/

function check_zeros(row,grid_size){
	for(var i=0;i<grid_size;i+=1){
		if(row[i] == 0){
			return true
		}
	}
	return false
}

/*
	Description: outputs the contents of a puzzle in the console
	Parameters:
		puzzle 		-- a 2D array that represents the puzzle
		grid_size   -- the number of rows in the puzzle
*/

function print_puzzle(puzzle,grid_size){
	for(var i=0;i<grid_size;i+=1){
		console.log(puzzle[i])
	}
}

/*
	Description: solves a puzzle per row using backtracking
	Parameters:
		puzzle     		-- a 2D array that represents the puzzle
		subgrid_size 	-- the int size of a subgrid (e.g. a 9 x 9 puzzle has a subgrid size of 3)
		type			-- the type of solution (string - regular,x,y,xy)
	Return Value:
		result 			-- a JSON object that contains the following:
			solution    	-- an array of 2D arrays that represent solutions to the puzzle
			num_solutions	-- the number of solutions for the puzzle (int)
*/

function solve_puzzle(puzzle,subgrid_size,type){

	var candidate_rows = []
	var solutions = []
	var index = 0
	var backtrack = 0
	var num_solutions = 0
	grid_size = subgrid_size * subgrid_size
	var temp_puzzle = copy_puzzle(puzzle,grid_size)

	for(var i=0;i<grid_size;i+=1){
		candidate_rows.push([])
	}

	while(index > -1){

		//the puzzle solution is complete so bactrack
		if(index >= grid_size){
			backtrack = 1
			index -= 1

			//the puzzle was solved completely so add to solutions
			if(index == grid_size-1)
			{	
				solutions.push(copy_puzzle(temp_puzzle,grid_size))
				num_solutions += 1
			}
			continue;
		}

		if(backtrack == 1){ //backtrack mode
			//there were no candidate rows so keep backtracking
			if(candidate_rows[index].length == 0){
				temp_puzzle[index] = puzzle[index]
				index -= 1
			} else{ //a candidate was found so stop backtracking
				temp_puzzle[index] = candidate_rows[index].pop()
				index += 1
				backtrack = 0
			}
		} else {
			//solve the row only if there are zeros
			if(check_zeros(temp_puzzle[index],grid_size)){
				candidate_rows[index] = solve_row(temp_puzzle,index,subgrid_size,type)
				if(candidate_rows[index].length == 0){ //no candidates so backtrack
					index -= 1
					backtrack = 1
				} else{ //candidate was found so go forward
					temp_puzzle[index] = candidate_rows[index].pop()
					index += 1
				}
			} else{ //skip solving the row
				index += 1
			}
		}
	}

	var result = {
		'solutions' : solutions,
		'num_solutions' : num_solutions
	}

	return result
}

function solve(solutions,num_puzzles,subgrid_sizes,puzzles){

	alert("solving...")
	for(var i=0;i<num_puzzles;i+=1){
		var regular = solve_puzzle(puzzles[i],subgrid_sizes[i],"regular")
		var x = solve_puzzle(puzzles[i],subgrid_sizes[i],"x")
		var y = solve_puzzle(puzzles[i],subgrid_sizes[i],"y")
		var xy = solve_puzzle(puzzles[i],subgrid_sizes[i],"xy")
		var results = {
			'regular' : regular,
			'x' : x,
			'y' : y,
			'xy' : xy
		}
		solutions.push(results)
	}
}