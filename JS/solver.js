
sample_row = [8,0,5,0,0,9,7,4,2]
sample_puzzle = [
	[8, 0, 5, 0, 0, 9, 7, 4, 2],
    [1, 0, 0, 4, 0, 0, 0, 9, 0],
    [0, 0, 0, 3, 2, 5, 0, 0, 1],
    [5, 1, 0, 6, 0, 0, 9, 0, 8],
    [6, 7, 0, 0, 0, 0, 0, 5, 4],
    [2, 0, 4, 0, 0, 1, 0, 3, 7],
    [4, 0, 0, 7, 3, 2, 0, 0, 0],
    [0, 6, 0, 0, 0, 4, 0, 0, 3],
    [3, 5, 2, 8, 0, 0, 4, 0, 9]
]

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

function initialize_stacks(row){

	stack_set = {
		'stacks' : [],
		'col_indices' : [],
		'solution' : []
	}


	n = row.length
	for(var i=0;i<n;i+=1){
		if(row[i] == 0){
			stack_set['stacks'].push([])
			stack_set['col_indices'].push(i)
			stack_set['solution'].push(0)
		}
	}

	return stack_set

}

function push_candidate_numbers(stack,puzzle,row,col,subgrid_size){
	grid_size = subgrid_size * subgrid_size


	for(var i=1;i<=grid_size;i+=1){
		if(check_row(i,puzzle,row,grid_size) && check_column(i,puzzle,col,grid_size) && check_grid(i, puzzle, row, col, subgrid_size)){
			stack.push(i)
		}
	}

	return stack
}

function update_feasible_solution(puzzle,num_stack,row_stack,solution,index,limit,row,col,row_size){

	var x = num_stack.pop()
	var new_row = []

	solution[index] = x;
	puzzle[row][col] = x;

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

function solve_row(puzzle,row,subgrid_size){
	stack_set = initialize_stacks(puzzle[row])
	row_stack = []
	index = 0
	temp_puzzle = copy_puzzle(puzzle,subgrid_size*subgrid_size)
	solution_size = stack_set['solution'].length
	backtrack = 0

	while(index > -1){

		if(index >= solution_size){
			index -= 1
			backtrack = 1
			continue
		}

		if(backtrack == 1){
			if(stack_set['stacks'][index].length == 0){
				temp_puzzle[row][stack_set['col_indices'][index]] = 0
				index -= 1
			} else{
				column = stack_set['col_indices'][index]
				update_feasible_solution(temp_puzzle,stack_set['stacks'][index],row_stack,stack_set['solution'],index,solution_size,row,column,subgrid_size*subgrid_size)
				index += 1
				backtrack = 0
			}
		} else if(backtrack == 0){
			column = stack_set['col_indices'][index]
			push_candidate_numbers(stack_set['stacks'][index],temp_puzzle,row,column,subgrid_size)
			if(stack_set['stacks'][index].length == 0){
				index -= 1
				backtrack = 1
			}else{
				update_feasible_solution(temp_puzzle,stack_set['stacks'][index],row_stack,stack_set['solution'],index,solution_size,row,column,subgrid_size*subgrid_size)
				index += 1
			}
		}

		//console.log(index)
		//console.log(stack_set)
		//console.log(temp_puzzle)
	}
	return row_stack
}