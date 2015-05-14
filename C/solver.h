#include <stdio.h>
#include <malloc.h>
#include "checker.h"
#include "stack.h"

int ** copy_puzzle(int ** source, int size){
	int i,j;
	int **destination;
	destination = (int **)malloc(sizeof(int*)*size);

	for(i=0;i<size;i+=1){
		destination[i] = (int *)malloc(sizeof(int)*size);
	}

	for(i=0;i<size;i+=1){
		for(j=0;j<size;j+=1){
			destination[i][j] = source[i][j];
		}
	}

	return destination;
}

void print_array(int *arr,int size){
	int i;

	for(i=0;i<size;i+=1){
		printf("%3d\n",arr[i]);
	}
}

void print_matrix(int ** matrix,int size){
	int i,j;

	for(i=0;i<size;i+=1){
		for(j=0;j<size;j+=1){
			printf("%3d",matrix[i][j]);
		}
		printf("\n");
	}
}

void initialize_stacks(int * row,int row_size,NumberStack ***stack_set,int row_index,int **col_indices,int *solution_length){
	int i,num_zeros=0;
	int counter=0;
	for(i=0;i<row_size;i+=1){
		if(row[i] == 0){
			num_zeros += 1;
		}
	}
	//printf("num zeros: %d\n",num_zeros);
	(*solution_length) = num_zeros;
	(*col_indices) = (int *)malloc(sizeof(int)*num_zeros);

	for(i=0;i<row_size;i+=1){
		if(row[i] == 0){
			(*col_indices)[counter] = i;
			counter += 1;
		}
	}

	(*stack_set) = (NumberStack **)malloc(sizeof(NumberStack*)*num_zeros);

	for(i=0;i<num_zeros;i+=1){
		(*stack_set)[i] = create_number_stack(row_size);
		//printf("col: %d\n",(*col_indices)[i]);
	}
}
/**
 * Params
 * numStack => holds the candidates
 * limit => number of 0 in the row
 * index => index for the arrOfCandidates
 * arrOfCandidates => array that holds the candidates that can replace the 0 on row of puzzle
 */
void update_feasible_solution(NumberStack* numStack, int limit, int index, int ***puzzle, int rowSize, int **arrOfCandidates, RowStack *rs,int row, int col)
{
	int i, k;

	int x = pop_number(numStack);
	//print_number_stack(numStack,rowSize);
	(*arrOfCandidates)[index] = x;
	
	(*puzzle)[row][col] = x;
	
	//check if the limit or the number of 0 is reached
	if((limit-1) == index)
	{
		//create row to be pushed to rs
		int *numRow = (int *) malloc(sizeof(int)*rowSize);
		
		k = 0;
		//get all of the numbers in the array
		for(i=0; i<rowSize; i++)
		{
			if((*puzzle)[row][i] > 0)
				numRow[i] = (*puzzle)[row][i];
			else
				numRow[i] = (*arrOfCandidates)[k++];

			//printf("%d ", numRow[i]);
		}
		//printf("\n");
		push_row(rs, numRow);
	}
}

void push_candidate_numbers(NumberStack *ns,int ** puzzle,int row, int col, int subgrid_size, int type){
	int i;
	int grid_size;

	grid_size = subgrid_size * subgrid_size;
	for(i=1;i<=grid_size;i+=1){
		if(checkRow(grid_size, row, puzzle,i) == 1 && checkColumn(col, grid_size, puzzle, i) == 1 && checkGrid(subgrid_size, puzzle, row, col,i) == 1){
			if(type == 1)
			{
				if(checkX(grid_size, puzzle, i, row, col) == 1)
				{
					push_number(ns,i);
				}
			}
			else if(type == 2)
			{
				//printf("row: %d; col:%d\n", row, col);
				if(checkY(grid_size, puzzle, i, row, col) == 1)
					push_number(ns,i);
			}
			else if(type == 3)
			{
				if(checkY(grid_size, puzzle, i, row, col) == 1 && checkX(grid_size, puzzle, i, row, col) == 1)
					push_number(ns,i);
			}
			else
				push_number(ns,i);
		}
	}
}

/**
 * Change the row of the puzzle with the specified row of candidates
 * Params:
 * arrRow => row of candidates
 * indexRow => row to be changed
 */
int **add_row_to_puzzle(int **puzzle, int *arrRow, int rowSize, int indexRow)
{
	int i, j, k = 0;
	//create the new puzzle
	int **newPuzzle = (int **) malloc(sizeof(int *)*rowSize);

	for(i=0; i<rowSize; i++)
	{
		newPuzzle[i] = (int *) malloc(sizeof(int)*rowSize);

		//get the values to be stored in the new puzzle
		for(j=0; j<rowSize; j++)
		{
			//get row from the array of candidates
			if(i == indexRow)
				newPuzzle[i][j] = arrRow[j];
			else
				newPuzzle[i][j] = puzzle[i][j];
		}
	}
	return newPuzzle;
}

RowStack * solve_row(int **puzzle, int grid_size, int row_index, int type){
	/*
		solves a row of a sudoku puzzle

		Parameters:
		puzzle   -- a 2d array containing the sudoku puzzle
		row      --an array containing the row of the puzzle
		grid)size  -- the size of each subgrid

		Return Value
		candidate_rows -- a stack of rows that can possibly solve the puzzle
	*/

	int ** temp_puzzle;
	int * col_indices;
	int num_stacks;
	NumberStack ** stack_set;
	int * candidates;
	int solution_length;

	RowStack * rs;
	rs = create_row_stack(grid_size*grid_size);

	temp_puzzle = copy_puzzle(puzzle,grid_size*grid_size);
	initialize_stacks(puzzle[row_index],grid_size*grid_size,&stack_set,row_index,&col_indices,&num_stacks);
	solution_length = num_stacks;

	int index = 0;
	int i;
	int backtrack = 0; //flag to indicate whether in backtrack mode or not
	int rowSize = grid_size * grid_size;
	int *numRow;
	
	candidates = (int *)malloc(sizeof(int)*solution_length);
	for(i=0;i<solution_length;i+=1){
		candidates[i] = 0;
	}

	while(index > -1)
	{
		//printf("solution_length: %d\n", solution_length);
		//printf("number index: %d\n",index);
		//index is out of the bounds of the solution
		if(index >= solution_length){
			//move back by 1 index
			index -= 1;
			//activate backtrack mode
			backtrack = 1;
			continue;
		}
		//if in backtracking mode
		if(backtrack == 1){
			if(num_stack_is_empty(stack_set[index]) == 1){
				
				temp_puzzle[row_index][col_indices[index]] = 0; //set to zero
				index -= 1;
			} else {
				//there is still a candidate number from previous iterations
				update_feasible_solution(stack_set[index],solution_length,index,&temp_puzzle, grid_size * grid_size, &candidates,rs,row_index, col_indices[index]);
				index += 1;
				//go out of backtracking mode
				backtrack = 0;
			}
		} else if(backtrack == 0){ //forwardtracking mode
			//push all candidate numbers
			push_candidate_numbers(stack_set[index],temp_puzzle,row_index,col_indices[index],grid_size, type);
			//there was no number that met the condition
			if(num_stack_is_empty(stack_set[index]) == 1){
				index -= 1;
				backtrack = 1;
			} else {
				update_feasible_solution(stack_set[index],solution_length,index,&temp_puzzle, grid_size * grid_size, &candidates,rs,row_index, col_indices[index]);
				index += 1;
			}
		}

		//print_array(temp_puzzle[row_index],grid_size*grid_size);
		//printf("\n");
	}
	//print_row_stack(rs);
	return rs;
}

int count_zeros(int **puzzle, int colSize, int row_index)
{
	int i;
	for(i=0; i<colSize; i++)
	{
		if(puzzle[row_index][i] == 0)
			return 1;
	}
	return 0;
}

int solve_puzzle(int **puzzle,int grid_size, int type){
	/*
		solves a given sudoku puzzle

		Parameters:
		puzzle     -- a 2d array containing the sudoku puzzle
		grid_size  -- the size of each subgrid

		Return Value:
		num_solutions  -- the number of possible solutions for the puzzle
	*/

	int i;
	int index;
	int colSize = grid_size*grid_size;
	int ** temp_puzzle;
	int backtrack;
	int num_solutions = 0;

	RowStack **candidate_rows = (RowStack **) malloc(sizeof(RowStack *)*colSize);

	index = 0;
	backtrack = 0;
	//create_row_stack();
	temp_puzzle = copy_puzzle(puzzle,grid_size*grid_size);

	do{
		//printf("index : %d\n",index);

		if(index >= colSize){
			backtrack = 1;
			index -= 1;
			if(index == colSize-1)
			{	
				print_matrix(temp_puzzle,grid_size*grid_size);
				printf("\n");
				num_solutions += 1;
			}
			continue;
		}

		if(backtrack == 1){
			if(count_zeros(temp_puzzle, colSize, index) == 1)
			{
				if(row_stack_is_empty(candidate_rows[index]) == 1){
					temp_puzzle = add_row_to_puzzle(temp_puzzle,puzzle[index], colSize, index); //reset to orig row
					index -= 1;
					
				} else{
					temp_puzzle = add_row_to_puzzle(temp_puzzle,pop_row(candidate_rows[index]),grid_size*grid_size,index);
					//print_matrix(temp_puzzle,grid_size*grid_size);
					index += 1;
					backtrack = 0;
				}
			}
			else index -= 1;
		} else if(backtrack == 0){
			//print_matrix(temp_puzzle,grid_size*grid_size);

			//if row has 0's
			if(count_zeros(temp_puzzle, colSize, index) == 1)
			{
				candidate_rows[index] = solve_row(temp_puzzle, grid_size, index, type);

				if(row_stack_is_empty(candidate_rows[index]) == 1){
					index -= 1;
					backtrack = 1;
				} else{
					temp_puzzle = add_row_to_puzzle(temp_puzzle,pop_row(candidate_rows[index]),grid_size*grid_size,index);
					//print_matrix(temp_puzzle,grid_size*grid_size);
					index += 1;
				}
			}
			else
				index += 1;
		}
		//print_matrix(temp_puzzle,grid_size*grid_size);
	}while (index > -1);
	return num_solutions;
	/*index += 1;
	candidate_rows[index] = solve_row(temp_puzzle,grid_size,index);
	temp_puzzle = add_row_to_puzzle(temp_puzzle,pop_row(candidate_rows[index]),grid_size*grid_size,index);
	print_matrix(temp_puzzle,grid_size*grid_size);

	index += 1;
	candidate_rows[index] = solve_row(temp_puzzle,grid_size,index);
	temp_puzzle = add_row_to_puzzle(temp_puzzle,pop_row(candidate_rows[index]),grid_size*grid_size,index);
	print_matrix(temp_puzzle,grid_size*grid_size);
	*/
}
