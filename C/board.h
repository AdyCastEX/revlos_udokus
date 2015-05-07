
int **createBoard(int *numPuz, char *filename){
FILE *fp;
char *arr, ch;
int **puzzle,subgrid,i,j,k=1;
	//read and open file
	fp = fopen(filename,"r");
	if(fp==NULL){
		printf("File not found.\n");
	}else{
		//scan first line in file to know the number of puzzles
		printf("File found.\n");
		fscanf(fp,"%d\n",&(*numPuz));
		printf("Num of Puzzles: %d",(*numPuz));
		//allocate space for the puzzles
		puzzle=(int **) malloc(sizeof(int *)*(*numPuz));
		for(i=0;i<*numPuz;i++){
			ch = fgetc(fp);
			//get subgrid of the entire grid
			subgrid=ch-'0';
			j=(subgrid*subgrid)*(subgrid*subgrid);
			//allocate size for the puzzle
			puzzle[i] = (int *) malloc (sizeof(int)*j);
			puzzle[i][0]=subgrid;

			k=1;
			while( ( ch = fgetc(fp) ) != EOF && k<=j){
				if(ch==' ' || ch==10){continue;}
				else{
					puzzle[i][k]=ch-'0'; //convert to int
					k++;
				}
			}			
			printf("\n");
		}
		fclose(fp);
		return puzzle;
	}
}

//print array to file
void printGrid(int **puzzle, int rowCol){
int i,j;
FILE *fp;
	fp = fopen("output","a");
	if(fp==NULL){
		printf("File not found.\n");
	}else{
		for(i=0;i<rowCol;i++){
			for(j=0;j<rowCol;j++){
			//	printf("%d ",puzzle[i][j]);
				fprintf(fp,"%d ",puzzle[i][j]);
			}
		//	printf("\n");
			fprintf(fp,"\n");
		}
	}
	fclose(fp);
}

int** create2Darray(int **puzzle){
int i,j,k=0,l=0,subgrid,rowCol,**grid;
	//get subgrid size
	subgrid=puzzle[0][0];
	rowCol=subgrid*subgrid;	//size of row and column
	grid=(int**)malloc(sizeof(int*)*rowCol);
	
	for(i=0;i<rowCol;i++){
		grid[i]=(int*)malloc(sizeof(int)*rowCol);
		for(j=0;j<rowCol;j++){
			k++;
			grid[i][j]=puzzle[0][k];
		}
	}		
	return grid;
}
