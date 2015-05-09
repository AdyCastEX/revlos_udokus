#include <stdio.h>
#include <malloc.h>
#include "board.h"
#include "solver.h"

main(){

	int **puzzles;
	int ***boards;
	int *subgrids;
	int num_puzzles;
	int i,j;

	char filename[] = "puzzle3.in";

	boards = createBoard(&num_puzzles,&subgrids,filename);

	for(i=0;i<num_puzzles;i+=1){	
		//printGrid(boards[i],subgrids[i]*subgrids[i]);
		printf("number of solutions: %d\n",solve_puzzle(boards[i],subgrids[i]));
	}
	
}
