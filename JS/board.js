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
		//var fileDisplayArea = document.getElementById('fileDisplayArea');
		$('#solution_field').hide()

		var file = fileInput.files[0];
		var reader = new FileReader();
		var nl = "\n";
		var re = new RegExp(nl, 'g');
		var k=0;
		reader.onload = function(e) {
			//fileDisplayArea.innerHTML = "";
			var contents = e.target.result.split('\n');
			numPuz = parseInt(contents[0],10);
			
			$('#functions').show()
			$('#puzzleNo').empty()
			for(var i=0; i<numPuz; i++){
				//add item to Puzzle dropdownlist
				var option = $("<option></option>")
				option.append(i+1)
				$('#puzzleNo').append(option)

				var puzzleGrid=[];
				subGrids[i] = parseInt(contents[i+1+k],10);
				for(var j=1; j<=subGrids[i]*subGrids[i];j++){
					var myArray = contents[i+1+k+j].split(" ");
					for(var m=0; m<myArray.length; m++){
						myArray[m] = parseInt(myArray[m], 10);
					}
					puzzleGrid.push(myArray);
				}
				puzzleArray.push(puzzleGrid);
				k=subGrids[i]*subGrids[i];
				convert_puzzle_to_board(puzzleArray[current_puzzle],subGrids[current_puzzle],$("#main_board"),'main')	
			}
		}
		reader.readAsText(file);

	    $('#puzzleNo').change(function() {
	    	current_puzzle = this.value-1
		    current_solution = 0
	       	convert_puzzle_to_board(puzzleArray[current_puzzle],subGrids[current_puzzle],$("#main_board"),'main')
		    fill_solutions_summary(all_solutions[current_puzzle],$("#solutions"))
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
				fill_solutions_summary(all_solutions[current_puzzle],$("#solutions"))
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
	var flag = true
	var new_puzzle = []
	size = subgrid_size*subgrid_size
	for(var i=0; i<size;i++){
		var row = []
		for(var j=0; j<size; j++){
			if(orig_puzzle[i][j] != 0)
				row[j] = orig_puzzle[i][j]
			else
			{
				row[j] = parseInt($('#'+i+'_'+j).val(),10)
			}
		}
		new_puzzle.push(row)
	}
	
	if(flag)
	{
		var sol = solve_puzzle(orig_puzzle,subgrid_size,type)
		trial = sol
		trial2 = new_puzzle
		for(var k=0; k<sol['num_solutions']; k++)
		{
			for(var i=0; i<size;i++){
				for(var j=0; j<size; j++){
					if(sol['solutions'][k][i][j] != new_puzzle[i][j])
						break;
				}
			}
		}
	}
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

			if(puzzle[i][j] != 0){
				var read_only = $("<div></div>")
				read_only.attr("class","read_only")
				read_only.html(puzzle[i][j])

				if(type == 'solution' && puzzleArray[current_puzzle][i][j] == 0)
					col.css("background-color", '#c5e7f4')

				col.append(read_only)
			} else {
				var writable = $("<input/>")
				writable.attr("type","text")
				writable.attr("class","writable")
				writable.attr("id",i+"_"+j)
				col.append(writable)
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
				alert("no change")
			} else{
				$(this).parent().data("number",$(this).val())
			}
		})
	})

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
