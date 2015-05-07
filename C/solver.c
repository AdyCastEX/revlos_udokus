#include <stdio.h>
#include <malloc.h>
#include "board.h"
#include "solver.h"

main(){

	int **puzzles;
	int ***boards;
	int num_puzzles;
	int i,j;

	char filename[] = "puzzle.in";

	puzzles = createBoard(&num_puzzles,filename);
	boards = (int ***)malloc(sizeof(int **)*num_puzzles);

	/*for(i=0;i<num_puzzles;i+=1){
		boards[i] = create2Darray(&puzzles[i]);
	}

	for(i=0;i<num_puzzles;i+=1){
		printGrid(boards[i],puzzles[i][0]*puzzles[i][0]);
	}*/
	
}