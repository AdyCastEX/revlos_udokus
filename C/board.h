void createBoard(){
FILE *fp;
char *arr, ch;
int numPuz,**puzzle,subgrid,i,j,k=1;
	fp = fopen("puzzle.in","r");
	if(fp==NULL){
		printf("File not found.\n");
	}else{
		printf("File found.\n");
		fscanf(fp,"%d\n",&numPuz);
		printf("Num of Puzzles: %d\n",numPuz);
		puzzle=(int **) malloc(sizeof(int *)*numPuz);
		for(i=0;i<numPuz;i++){
			ch = fgetc(fp);
			//printf("%d ",ch-'0');
			subgrid=ch-'0';
			j=(subgrid*subgrid)*(subgrid*subgrid);
			printf("subGrid : %d\n",subgrid);
			printf("gridSize : %d\n",j);
			puzzle[i] = (int *) malloc (sizeof(int)*j);
			puzzle[i][0]=subgrid;

			k=1;
			while( ( ch = fgetc(fp) ) != EOF && k<=j){
				if(ch==' '){continue;}
				else if(ch==10){}//printf("\n");
				else{
//				printf("%c",ch);
//				printf("%d ",k);
				puzzle[i][k]=ch-'0';
				k++;
				}
			}			
			printf("\n");
		}
		for(i=0;i<numPuz;i++){
			j=puzzle[i][0];
			for(k=1;k<=j*j*j*j;k++){
				printf("%d ",puzzle[i][k]);
				if(k%(j*j)==0) printf("\n");
			}
		}
	}


}
