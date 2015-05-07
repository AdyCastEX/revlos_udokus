
int ***createBoard(int *numPuz,int **subgrids, char *filename){
FILE *fp;
char *arr, ch;
int ***puzzle,subgrid,i,j,k=1,l=0,m=0;

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
		puzzle=(int ***) malloc(sizeof(int **)*(*numPuz));
		
		*subgrids = (int *)malloc(sizeof(int)*(*numPuz));
		for(i=0;i<*numPuz;i++){
			ch = fgetc(fp);
			//get subgrid of the entire grid
			subgrid=ch-'0';
			(*subgrids)[i] = subgrid;
			j=(subgrid*subgrid)*(subgrid*subgrid);
			printf("\n%d\n",(*subgrids)[i]);
			printf("\n%d\n",j);

			//allocate size for the puzzle
			puzzle[i]=(int **)malloc(sizeof(int *)*(subgrid*subgrid));
			puzzle[i][l] = (int *) malloc (sizeof(int)*(subgrid*subgrid));
			k=0;
			while( ( ch = fgetc(fp) ) != EOF && k<=j){
				if(ch==' ' || ch==10){continue;}
				else{
					puzzle[i][l][m]=ch-'0'; //convert to int
					k++;
					m++;
					if((k%(subgrid*subgrid))==0){
						l++;
						m=0;
						puzzle[i][l] = (int *) malloc (sizeof(int)*(subgrid*subgrid));
					}
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
	fp = fopen("output","w");
	if(fp==NULL){
		printf("File not found.\n");
	}else{
		for(i=0;i<rowCol;i++){
			for(j=0;j<rowCol;j++){
				printf("%d ",puzzle[i][j]);
		//		fprintf(fp,"%d ",puzzle[i][j]);
			}
			printf("\n");
		//	fprintf(fp,"\n");
		}
	}
	fclose(fp);
}

