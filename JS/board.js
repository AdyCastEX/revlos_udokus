window.onload = function() {

	numPuz=0
	subGrids=[]	
	puzzleArray=[]
	all_solutions = []
	current_puzzle = 0
	
	fileInput.addEventListener('change', function(e) {
		numPuz=0
		subGrids=[]	
		puzzleArray=[]

		var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = document.getElementById('fileDisplayArea');

		var file = fileInput.files[0];
		var reader = new FileReader();
		var nl = "\n";
		var re = new RegExp(nl, 'g');
		var k=0;
		reader.onload = function(e) {
			fileDisplayArea.innerHTML = "";
			var contents = e.target.result.split('\n');
			numPuz = parseInt(contents[0],10);
			
			for(var i=0; i<numPuz; i++){
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
				convert_puzzle_to_board(puzzleArray[current_puzzle],subGrids[current_puzzle],$("#main_board"))	
			}
		}
		reader.readAsText(file);

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
	})

	var prev_button = document.getElementById('prev_btn')
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
	})
}

function convert_puzzle_to_board(puzzle,subgrid_size,container){
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
				col.append(read_only)
			} else {
				var writable = $("<input/>")
				writable.attr("type","text")
				writable.attr("class","writable")
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
