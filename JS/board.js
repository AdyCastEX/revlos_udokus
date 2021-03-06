window.onload = function() {

	numPuz=0
	subGrids=[]	
	puzzleArray=[]
	all_solutions = []
	current_puzzle = 0
	current_solution = 0
	current_solution_type = $('input[name=solution_type]:checked').val()
	trial = []
	trial2 = []

	$('#solution_field').hide()
	$('#functions').hide()

	$( "#correct" ).dialog({
		autoOpen: false,
		width: 400,
		buttons: [
			{
				text: "Ok",
				click: function() {
					$( this ).dialog( "close" )
				}
			}
		]
	})

	$( "#wrong" ).dialog({
		autoOpen: false,
		width: 400,
		buttons: [
			{
				text: "Ok",
				click: function() {
					$( this ).dialog( "close" )
				}
			}
		]
	})

    $('input:radio[name=solution_type]').change(function() {
        if (this.value == 'regular') 
        {	
        	current_solution_type = 'regular'
        	current_solution = 0
        	displaySolution(all_solutions[current_puzzle][current_solution_type],subGrids[current_puzzle],$("#solutions"))
        }
        else if (this.value == 'x') 
        {	
        	current_solution_type = 'x'
        	current_solution = 0
        	displaySolution(all_solutions[current_puzzle][current_solution_type],subGrids[current_puzzle],$("#solutions"))
        }
        else if (this.value == 'y') 
        {	
        	current_solution_type = 'y'
        	current_solution = 0
        	displaySolution(all_solutions[current_puzzle][current_solution_type],subGrids[current_puzzle],$("#solutions"))
        }
        else if (this.value == 'xy') 
        {	
        	current_solution_type = 'xy'
        	current_solution = 0
        	displaySolution(all_solutions[current_puzzle][current_solution_type],subGrids[current_puzzle],$("#solutions"))
        }
    })
	
	fileInput.addEventListener('change', function(e) {
		numPuz=0
		subGrids=[]	
		puzzleArray=[]

		var fileInput = document.getElementById('fileInput');
		$('#solution_field').hide()

		var file = fileInput.files[0];
		var reader = new FileReader();
		var nl = "\n";
		var re = new RegExp(nl, 'g');
		var j,k,l;
		reader.onload = function(e) {
			var contents = e.target.result.split('\n');
			var filelength = contents.length;
			k=0,j=0,l=0;
			var puzzleGrid=[];
			$('#functions').show()
			$('#puzzleNo').empty()
			while(k<=filelength){

				if(k<2){
					numPuz = parseInt(contents[0],10);
					subGrids[j] = parseInt(contents[1],10);
					l=subGrids[j]*subGrids[j];
				}else{
					if(k<l+j+2){
						var myArray = contents[k].split(" ");
						for(var m=0; m<myArray.length; m++){
							myArray[m] = parseInt(myArray[m], 10);
						}
						puzzleGrid.push(myArray);
					}else if(k==filelength){
						var option = $("<option></option>")
						option.append(j+1)
						$('#puzzleNo').append(option)
						puzzleArray.push(puzzleGrid);
					}else{
						var option = $("<option></option>")
						option.append(j+1)
						$('#puzzleNo').append(option)
						puzzleArray.push(puzzleGrid);
						puzzleGrid=[];
						j++;
						subGrids[j] = parseInt(contents[k],10);
						l+=subGrids[j]*subGrids[j];
					}
				}
				k++;
			}
			convert_puzzle_to_board(puzzleArray[current_puzzle],subGrids[current_puzzle],$("#main_board"),'main')			
		}
		reader.readAsText(file);

	    $('#puzzleNo').change(function() {
	    	current_puzzle = this.value-1
		    current_solution = 0
	       	convert_puzzle_to_board(puzzleArray[current_puzzle],subGrids[current_puzzle],$("#main_board"),'main')
		    fill_solutions_summary(all_solutions[current_puzzle])
	       	displaySolution(all_solutions[current_puzzle][current_solution_type],subGrids[current_puzzle],$("#solutions"))
	    })
	});

	var solve_button = document.getElementById('solve_button')
	solve_button.addEventListener('click',function(e){
		all_solutions = []
		for(var i=0;i<numPuz;i+=1){
			var regular = solve_puzzle(puzzleArray[i],subGrids[i],"regular")
			var x = solve_puzzle(puzzleArray[i],subGrids[i],"x")
			var y = solve_puzzle(puzzleArray[i],subGrids[i],"y")
			var xy = solve_puzzle(puzzleArray[i],subGrids[i],"xy")
			var results = {
				'regular' : regular,
				'x' : x,
				'y' : y,
				'xy' : xy
			}
			all_solutions.push(results)
		}

		if(all_solutions.length > 0)
		{
			if($('#solve_button').val() == 'Show Solutions')
			{
				$('#solve_button').val('Hide Solutions')
				$('#solution_field').show()
				fill_solutions_summary(all_solutions[current_puzzle])
				displaySolution(all_solutions[current_puzzle][current_solution_type],subGrids[current_puzzle],$("#solutions"))
			}
			else
			{
				$('#solve_button').val('Show Solutions')
				$('#solution_field').hide()
			}
		}
	})

	var check_button = document.getElementById('check_button')
	check_button.addEventListener('click',function(e){
		checkSudoku(puzzleArray[current_puzzle],subGrids[current_puzzle],current_solution_type)
	})

	var reset_button = $("#reset_button")
	reset_button.on('click', function(e){
		convert_puzzle_to_board(puzzleArray[current_puzzle],subGrids[current_puzzle],$("#main_board"),'main')
	})

	/*var prev_button = document.getElementById('prev_btn')
	prev_button.addEventListener('click',function(e){
		if(current_puzzle == 0){
			current_puzzle = numPuz-1
		} else{
			current_puzzle = Math.abs((current_puzzle-1) % numPuz)
		}
		console.log(current_puzzle)
		convert_puzzle_to_board(puzzleArray[current_puzzle],subGrids[current_puzzle],$('#main_board'))
	})
	var next_button = document.getElementById('next_btn')
	next_button.addEventListener('click',function(e){
		current_puzzle = Math.abs((current_puzzle+1) % numPuz)
		console.log(current_puzzle)
		convert_puzzle_to_board(puzzleArray[current_puzzle],subGrids[current_puzzle],$('#main_board'))
	})*/
}

function checkSudoku(orig_puzzle,subgrid_size,type)
{
	//get the puzzle in the main_board
	var new_puzzle = []
	size = subgrid_size*subgrid_size

	for(var i=0; i<size;i++){
		var row = []
		for(var j=0; j<size; j++){
			if(orig_puzzle[i][j] != 0)
				row[j] = orig_puzzle[i][j]
			else
			{
				if($.isNumeric(parseInt($('#'+i+'_'+j).val(),10)))
					row[j] = parseInt($('#'+i+'_'+j).val(),10)
				else
					row[j] = parseInt(0,10)
			}
		}
		new_puzzle.push(row)
	}

	//initialize the counters
	var current_counter = 0;
	var max_counter = 0;
	var sol_index = 0;
	
	//get the solutions
	var sol = solve_puzzle(orig_puzzle,subgrid_size,type)

	//check the solution of the user against every solution generated by the program
	for(var k=0; k<sol['num_solutions']; k++)
	{
		//reset the counter 
		current_counter = 0

		for(var i=0; i<size;i++){
			for(var j=0; j<size; j++){
				//get the number of equal items from the puzzle
				if(sol['solutions'][k][i][j] == new_puzzle[i][j])
					current_counter++
			}
		}

		//get the solution with the most number of similarities with the user's answer
		if(current_counter > max_counter)
		{
			max_counter = current_counter
			sol_index = k
		}
	}

	//check if the user got all of the cells correctly then output the result
	if(max_counter == (size*size))
	{
		$( "#correct" ).dialog( "open" )
		event.preventDefault()
	}
	else
	{
		$( "#wrong" ).dialog( "open" )
		event.preventDefault()
	}

	convert_puzzle_to_board(new_puzzle,subgrid_size,$("#main_board"),sol_index)
}

function displaySolution(puzzle,subgrid_size,container)
{
	num_solutions = puzzle['num_solutions']
	if(num_solutions == 0)
	{
		$('#nav_button').hide()
		container.hide()
		container.empty()
		$('#sol_text').empty()
		$('#sol_text').append("<center>No solutions available</center>")
	}
	else
	{
		$('#sol_counter').text((current_solution+1)+'/'+num_solutions)
		$('#sol_text').empty()
		$('#nav_button').show()
		container.show()
		convert_puzzle_to_board(puzzle['solutions'][current_solution],subgrid_size,container,'solution')
	}

	if(current_solution == 0)
		$('#prev_button').attr('disabled','disabled')
	else
		$('#prev_button').removeAttr('disabled')

	if(current_solution == num_solutions-1)
		$('#next_button').attr('disabled','disabled')
	else
		$('#next_button').removeAttr('disabled')
}

function prev_sol()
{
	if(0 < current_solution)
	{
		current_solution -= 1
		displaySolution(all_solutions[current_puzzle][current_solution_type],subGrids[current_puzzle],$("#solutions"))
	}
}

function next_sol()
{
	if(current_solution < all_solutions[current_puzzle][current_solution_type]['num_solutions'])
	{
		current_solution += 1
		displaySolution(all_solutions[current_puzzle][current_solution_type],subGrids[current_puzzle],$("#solutions"))
	}
}

function fill_solutions_summary(puzzle)
{
	$('#reg_sol').text('No. of Regular Solutions:' + puzzle["regular"]["num_solutions"])
	$('#x_sol').text('No. of X Solutions:' + puzzle["x"]["num_solutions"])
	$('#y_sol').text('No. of Y Solutions:' + puzzle["y"]["num_solutions"])
	$('#xy_sol').text('No. of XY Solutions:' + puzzle["xy"]["num_solutions"])
}

function convert_puzzle_to_board(puzzle,subgrid_size,container,type){
	var grid_size = subgrid_size * subgrid_size
	
	$(container).empty()

	for(var i=0;i<grid_size;i+=1){
		var row = $("<tr></tr>")
		row.attr("id","r"+i)
		row.attr("class","row")
		for(var j=0;j<grid_size;j+=1){
			var col = $("<td></td>")
			col.attr("id","c"+i+j)
			col.attr("class","col")

			//provide color for each subgrid
			var r = 210
			var g = Math.floor(100/(subgrid_size+5))
			var b = Math.floor(100/(subgrid_size+6))

			b = (Math.floor(i/subgrid_size)+4)*b
			g = (Math.floor(j/subgrid_size)+5)*g

			var color = 'rgb('+r+'%,'+g+'%,'+b+'%)'
			col.css("background-color", color)

			if((type == 'solution' || type == 'main'))
			{
				if(puzzle[i][j] != 0){
					var read_only = $("<div></div>")
					read_only.attr("class","read_only")
					read_only.html(puzzle[i][j])

					if(type == 'solution' && puzzleArray[current_puzzle][i][j] == 0)
						col.css("color", 'rgb(0%,0%,100%)')

					col.append(read_only)
				} else {
					var writable = $("<input/>")
					writable.attr("type","text")
					writable.attr("class","writable")
					writable.attr("id",i+"_"+j)

					col.append(writable)
				}
			}
			else
			{
				var sol = solve_puzzle(puzzleArray[current_puzzle],subgrid_size,current_solution_type)

				//display the number of the cell from the original puzzle
				if(puzzleArray[current_puzzle][i][j] != 0)
				{
					var read_only = $("<div></div>")
					read_only.attr("class","read_only")
					read_only.html(puzzle[i][j])
					col.append(read_only)
				}
				else
				{
					var writable = $("<input/>")
					writable.attr("type","text")
					writable.attr("class","writable")
					writable.attr("id",i+"_"+j)

					if(sol['solutions'][type][i][j] != puzzle[i][j])
						col.css("color", '#F00')
					else
						col.css("color", '#0F0')

					writable.val(puzzle[i][j])

					col.append(writable)
				}
			}

			col.data("number",puzzle[i][j])

			row.append(col)
		}
		$(container).append(row)
	}

	$(".writable").each(function(){
		$(this).ForceNumericOnly()
		$(this).on('change',function(){
			if($(this).val() > grid_size || $(this).val() == 0){
				//alert("no change")
				$(this).val(0)
			} else{
				$(this).parent().data("number",$(this).val())
				//alert($(this).val())
			}
			//check the number
			var new_puzzle = convert_board_to_puzzle(puzzle,subgrid_size,type)
			checkInput(new_puzzle,subgrid_size,$(this).attr('id'))
		})
	})
}

function checkInput(puzzle,subgrid_size,id)
{
	//get the data on the number to be checked
	var number = $("#"+id).val()
	var location = id.split("_")
	var row = location[0]
	var col = location[1]
	var size = subgrid_size*subgrid_size

	//remove the number in the array
	puzzle[row][col] = 0

	//check the number to be added to the current puzzle on the main_board
	if(check_row(number,puzzle,row,size) && check_column(number,puzzle,col,size) && check_grid(number, puzzle, row, col, subgrid_size))
	{
		if(current_solution_type == "x" && check_x(size,puzzle,number,row,col))
			$("#"+id).css("color", '#0F0')
		else if(current_solution_type == "y" && check_y(size,puzzle,number,row,col))
			$("#"+id).css("color", '#0F0')
		else if(current_solution_type == "xy" && check_x(size,puzzle,number,row,col) && check_y(size,puzzle,number,row,col))
			$("#"+id).css("color", '#0F0')
		else if(current_solution_type == "regular")
			$("#"+id).css("color", '#0F0')
		else
			$("#"+id).css("color", '#F00')
	}
	else
		$("#"+id).css("color", '#F00')
}

// Numeric only control handler - http://stackoverflow.com/questions/995183/how-to-allow-only-numeric-0-9-in-html-inputbox-using-jquery
jQuery.fn.ForceNumericOnly = function(){
    return this.each(function()
    {
        $(this).keydown(function(e)
        {
            var key = e.charCode || e.keyCode || 0
            // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
            // home, end, period, and numpad decimal
            return (
                key == 8 || 
                key == 9 ||
                key == 13 ||
                key == 46 ||
                key == 110 ||
                key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105))
        })
    })
}

function convert_board_to_puzzle(board,subgrid_size,type){

	var grid_size = subgrid_size * subgrid_size
	var puzzle = []
	//get all <tr> tags with the class "row"
	var rows = $('.row')
	//traverse through each row
	rows.each(function(){
		var puzzle_row = []
		//get all elements with classes "writable" or "read_only", which give the values of the cells in the board
		var values = $(this).find('.writable,.read_only')
		//traverse through each element
		$(values).each(function(){
			//if the class is "read_only", it is a div so get the value from the inner html
			if($(this).attr("class") == "read_only"){
				puzzle_row.push(parseInt($(this).html(),10))
			//if the class is "writable", it is an input field so get the value from the value attribute
			} else if($(this).attr("class") == "writable"){
				var w_value = parseInt($(this).val(),10)
				//if not a number (e.g. blank) or an invalid number (e.g. 10 for a 9x9 sudoku puzzle), default value to 0 (empty)
				if(isNaN(w_value) || w_value > grid_size){
					w_value = 0
				}
				puzzle_row.push(w_value)
			}
		})
		puzzle.push(puzzle_row)
	})

	return puzzle
}
