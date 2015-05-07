#include <stdio.h>
#include <malloc.h>
#include "board.h"
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