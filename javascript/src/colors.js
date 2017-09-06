function Colors () {
	var set = ["turquoise", "magenta", "yellow", "orange", "green", "blue", "red"];
	var picked = [];
	
	//Return a random index within the array bounds.
	var randomIndex = function () {
		return Math.floor(Math.random() * set.length);
	};
	
	//Return a random color from the set, without repetition.
	this.randomColor = function () {
		var index = randomIndex();
		
		while (picked.indexOf(set[index]) !== -1)
			index = randomIndex();
		picked.push(set[index]);
		
		return set[index];
	};
}

//Create instance for use throughout procedure.
var picker = new Colors();