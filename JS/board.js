window.onload = function() {

	numPuz=0;
	subGrids=[];	
	puzzleArray=[];
	all_solutions = [];

	var solution_field = document.getElementById('solution_field')
	solution_field.style.display = "none"
	
	fileInput.addEventListener('change', function(e) {
		numPuz=0
		subGrids=[]	
		puzzleArray=[]

		var fileInput = document.getElementById('fileInput');
		//var fileDisplayArea = document.getElementById('fileDisplayArea');

		var file = fileInput.files[0];
		var reader = new FileReader();
		var nl = "\n";
		var re = new RegExp(nl, 'g');
		var k=0;
		reader.onload = function(e) {
			//fileDisplayArea.innerHTML = "";
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
			}
		}
		reader.readAsText(file);	
	});

	var solve_button = document.getElementById('solve_button')
	solve_button.addEventListener('click',function(e){
		solution_field.style.display = ""
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
}
