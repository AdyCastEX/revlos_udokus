#include <stdio.h>
#include <malloc.h>
#include "board.h"
#include "solver.h"

main(int argc, char** argv){

	int **puzzles;
	int ***boards;
	int *subgrids;
	int num_puzzles;
	int i,j;

	//char filename[] = argv[1];//"puzzle7.in";

	boards = createBoard(&num_puzzles,&subgrids,argv[1]);

	for(i=0;i<num_puzzles;i+=1){	
		//printGrid(boards[i],subgrids[i]*subgrids[i]);
		printf("number of regular solutions: %d\n",solve_puzzle(boards[i],subgrids[i], 0));
		printf("number of X solutions: %d\n",solve_puzzle(boards[i],subgrids[i], 1));
		printf("number of Y solutions: %d\n",solve_puzzle(boards[i],subgrids[i], 2));
		printf("number of XY solutions: %d\n",solve_puzzle(boards[i],subgrids[i], 3));
	}
	
}
