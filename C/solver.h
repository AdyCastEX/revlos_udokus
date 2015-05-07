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

void initialize_stacks(int * row,int row_size,NumberStack ***stack_set,int row_index,int **col_indices,int *solution_length){
	int i,num_zeros=0;
	int counter=0;
	for(i=0;i<row_size;i+=1){
		if(row[i] == 0){
			num_zeros += 1;
		}
	}
	printf("num zeros: %d\n",num_zeros);
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

	//get the number in the op of stack
	int x = pop_number(numStack);
	print_number_stack(numStack,rowSize);
	printf("x: %d\n",x);
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

			printf("%d ", numRow[i]);
		}
		printf("\n");
		push_row(rs, numRow);
	}
}

void push_candidate_numbers(NumberStack *ns,int ** puzzle,int row, int col, int subgrid_size){
	int i;
	int grid_size;

	grid_size = subgrid_size * subgrid_size;
	for(i=0;i<grid_size;i+=1){
		//printf("check row %d: %d\n",i,checkRow(grid_size, row, puzzle,i));
		//printf("check col %d: %d\n",i,checkColumn(grid_size, row, puzzle,i));
		//printf("check grid %d: %d\n",i,checkGrid(subgrid_size,puzzle,row,col,i));
		if(checkRow(grid_size, row, puzzle,i) == 1 && checkColumn(col, grid_size, puzzle, i) == 1 && checkGrid(subgrid_size, puzzle, row, col,i) == 1){
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

RowStack * solve_row(int **puzzle, int grid_size, int row_index){
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
	
	candidates = (int *)malloc(sizeof(int)*solution_length);

	while(index != -1)
	//for(index=0; index<5; index++)
	{		
		if((index == solution_length) || num_stack_is_empty(stack_set[index]) == 1)
		{
			index--;
			
			if(num_stack_is_empty(stack_set[index]) == 0)
			{
				pop_number(stack_set[index]);
			}
		}
		else
		{
			push_candidate_numbers(stack_set[index],puzzle,row_index,col_indices[index],grid_size);
			update_feasible_solution(stack_set[index],solution_length,index,&temp_puzzle, grid_size * grid_size, &candidates,rs,row_index, col_indices[index]);
			index ++;
		}
	}
	print_row_stack(rs);
	//print_array(candidates,solution_length);
}

int solve_puzzle(int **puzzle,int grid_size){
	/*
		solves a given sudoku puzzle

		Parameters:
		puzzle     -- a 2d array containing the sudoku puzzle
		grid_size  -- the size of each subgrid

		Return Value:
		num_solutions  -- the number of possible solutions for the puzzle
	*/

	int i;
	int colSize = grid_size*grid_size;

	RowStack **candidate_rows = (RowStack **) malloc(sizeof(RowStack *)*colSize);
	//create_row_stack();
	solve_row(puzzle, grid_size, 0);
}
