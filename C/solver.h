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

void initialize_stacks(int * row,int row_size,NumberStack ***stack_set,int row_index,int **col_indices){
	int i,num_zeros=0;
	int counter=0;
	for(i=0;i<row_size;i+=1){
		if(row[i] == 0){
			num_zeros += 1;
		}
	}
	printf("num zeros: %d\n",num_zeros);

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
		printf("col: %d\n",(*col_indices)[i]);
	}

}

RowStack * solve_row(int **puzzle,int * row, int grid_size){
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

	temp_puzzle = copy_puzzle(puzzle,grid_size*grid_size);
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

}