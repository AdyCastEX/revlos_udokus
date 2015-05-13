window.onload = function() {

	var numPuz=0;
	var subGrids=[];	
	var puzzleArray=[];
	
	fileInput.addEventListener('change', function(e) {
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
			}
		}
		reader.readAsText(file);	
	});
	
}
