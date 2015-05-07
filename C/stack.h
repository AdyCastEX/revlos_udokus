#include <stdio.h>
#include <malloc.h>

typedef struct s_stack1{
	int * arr;
	int size;
	int top;
	int max_size;
}NumberStack;

void print_number_stack(NumberStack * ns, int size){
	/*
		Prints the contents of a number stack and other information related to the stack

		Parameters:
		ns    -- the number stack to print
		size  -- the number of elements in the stack
	*/
	int i;

	printf("size :%d, top : %d, max size: %d\n",ns->size,ns->top,ns->max_size);

	for(i=0;i<size;i+=1){
		printf("%d\n",ns->arr[i]);
	}
}

void init_array(int *arr, int n){
	/*
		Initialize an array to contain all zeroes

		Parameters:
			arr   -- the array to initialize
			n     -- the number of elements in the array
	*/

	int i;

	for(i=0;i<n;i+=1){
		arr[i] = 0;
	}
}

NumberStack* create_number_stack(int size){
	/*
		Dynamically creates a pointer to an instance of a number stack

		Parameters:
			size   -- the size of the array portion of a number stack

		Return Value:
			ns     -- a pointer to an instance of a number stack
	*/

	//create a the instance of the number stack
	NumberStack* ns = (NumberStack *)malloc(sizeof(NumberStack));
	//create an array of size n
	ns->arr = (int *)malloc(sizeof(int)*size);
	//initialize other parameters
	init_array(ns->arr,size);
	ns->size = 0;
	ns->top = 0;
	ns->max_size = size;
}

int num_stack_is_empty(NumberStack *ns){

	/*
		Checks if a number stack is empty

		Parameters:
		ns  -- the number stack to check

		Return Value:
		1 -> stack is empty
		0 -> stack is not empty
	*/

	if(ns->top == 0 && ns->size == 0){
		return 1;
	} else{
		return 0;
	}
}

int num_stack_is_full(NumberStack *ns){

	/* 
		Checks if a number stack is full

		Parameters:
		ns   -- the number stack to check

		Return Value:
		1 -> stack is full
		0 -> stack is not full
	*/
	if(ns->size == ns->max_size){
		return 1;
	} else{
		return 0;
	}
}

void push_number(NumberStack * ns,int number){

	/* 
		adds a number to the top of the stack

		Parameters:
		ns --the number stack to push to
		number -- the number to add

	*/

	ns->arr[ns->top] = number;
	ns->top += 1;
	ns->size += 1;
}

int pop_number(NumberStack *ns){

	/*
		removes a value from top of the stack

		Parameters:
		ns     -- the number stack to pop from

		Return Value
		n      -- the number that was removed from the stack
	*/

	int n;

	if(num_stack_is_empty(ns) == 0){
		n = ns->arr[ns->top-1];
		ns->top -= 1;
		ns->size -= 1;
	}
	

	return n;
}

int top_number(NumberStack *ns){

	/*
		gets the index of the top of the number stack

		Parameters:
		ns     -- the number stack to check

		Return Value
		the index of the top of the stack
	*/

	return ns->top;
}

typedef struct s_node{
	int * row;
	struct s_node *next;
}Node;

typedef struct s_stack2{
	Node * head; //pointer to the first node
	int size;
	int row_size;
	Node * tail; //pointer to the last node
}RowStack;

void print_row_stack(RowStack *rs){

	/*
		Prints the contents of the row stack and other important information

		Parameters
		rs    -- the row stack to print
	*/

	Node * temp;
	temp = rs->head;
	int i;


	printf("Size: %d\n",rs->size);

	//traverse only a non-empty stack
	if(rs->head != NULL){
		//keep traversing until the end of the linked-list
		while(temp != NULL){
			
			for(i=0;i<rs->row_size;i+=1){
				printf("%2d",temp->row[i]);
			}

			printf("\n");

			temp = temp->next;
		}
	}
}

RowStack * create_row_stack(int row_size){

	/*
		creates a row stack that stores rows of size n

		Parameters:
		row_size     -- the size of the array contained in each node in the list

		Return Value:
		rs           -- a pointer to the row stack created
	*/

	//initialize a pointer to an instance of a row stack
	RowStack *rs = (RowStack *)malloc(sizeof(RowStack));
	//initialize values
	rs->head = NULL;
	rs->size = 0;
	rs->tail = NULL;
	rs->row_size = row_size;
}

void push_row(RowStack *rs,int *row){

	/*
		adds a new row node to the row stack

		Parameters:
		rs     -- the row stack to add to
		row    -- the array representing the row	
	*/

	//create a new node and initialize its values
	Node *new_node = (Node *)malloc(sizeof(Node));
	new_node->row = row;
	new_node->next = NULL;

	//if the row stack is empty, set the new node as the tail
	if(rs->tail == NULL){
		rs->tail = new_node;
	} else{ //else connect the new node to the previous one and move the tail
		rs->tail->next = new_node;
		rs->tail = new_node;
	}
	
	//if the row stack is empty, set the new node as the head
	if(rs->head == NULL){
		rs->head = new_node;
	}
	//increment to indicate growth
	rs->size += 1;
}

int * pop_row(RowStack *rs){

	/*
		removes a row node from the row stack

		Parameters:
		rs    -- the row stack to pop from

		Return Value:
		row   -- the row that was removed
	*/

	Node * temp1;
	Node * temp2;
	//get the value of the row in the node
	int * row = rs->tail->row;

	temp1 = rs->head;
	temp2 = rs->tail;
	//pop only if the row stack is not empty
	if(rs->head != NULL){

		if(temp1 != temp2){
			//find the second to the last node
			while(temp1->next->next != NULL){
				temp1 = temp1->next;
			}
			//set the second to the last node as the tail
			rs->tail = temp1;
			//disconnect the previous tail
			free(temp1->next);
			temp1->next = NULL;
		} else if(temp1 == temp2){ //if there is only one node left set both head and tail to NULL
			free(rs->head);
			rs->head = NULL;
			rs->tail = NULL;
		}
		//decrement to indicate shrinkage
		rs->size -= 1;

	}
	return row;
}

int row_stack_is_empty(RowStack *rs){

	/*
		checks if a row stack is empty

		Parameters:
		rs     -- the row stack to check

		Return Value:
		1 -> the row stack is empty
		0 -> the row stack is not empty
	*/

	if(rs->size == 0  && rs->head == NULL){
		return 1;
	} else {
		return 0;
	}
}

