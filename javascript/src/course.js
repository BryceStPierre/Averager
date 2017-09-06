function Course (courseN, color) {
	
	var course = courseN;
	var entries = [];
	var average = 0;
	var created = false;
	var active = false;
	
	var html = '<div class="course ' + color + '-0 centered" id="course-' + course + '">';
	html += 	'<input class="average ' + color + '-2 centered" id="average-' + course + '" type="text" value="0.00%" readonly/>';
	html +=		'<div class="out-col"></div>';
	html += 	'<div class="exp-col head-col">G</div>';
	html += 	'<div class="num-col head-col">W</div>';
	html +=		'<div class="out-col"></div>';
	html +=		'<span id="initial-target-' + course + '"></span>';
	html += 	'<div class="add button ' + color + '-button ' + color + '-3 glyphicon glyphicon-plus" id="add-button-' + course + '"></div>';
	html += '</div>';
	
	var initialWeight = function () {
		var value = 100;
		for (var i = 0; i < entries.length; i++)
			value -= entries[i].getWeight();
		return value;
	};
	
	var addEntry = function () {
		var newEntry;
		var target;
		
		if (entries.length === 0) {
			newEntry = new Entry (course, entries.length, -1, color);
			target = "#initial-target-" + course;
		} else {
			newEntry = new Entry (course, entries.length, initialWeight(), color);
			target = "#row-wrap-" + course + "-" + (entries.length - 1);
		}
		$(target).after(newEntry.create());
		entries.push(newEntry);
		entries[entries.length - 1].setActive();
	};
	
	this.saveEntries = function () {
		var saveLog = "";
		
		for (var i = 0; i < entries.length; i++) {
			if (i !== entries.length - 1)
				saveLog += entries[i].getPair() + ",";
			else
				saveLog += entries[i].getPair();
		}
		return saveLog;
	};
	
	var setDetails = function (entryN, grade, weight) {
		entries[entryN].setGrade(grade);
		entries[entryN].setWeight(weight);
	};
	
	this.setEntries = function (entryData) {
		for (var i = 0; i < entryData.length; i++) {
			if (i > 0)
				$("#add-button-" + course).click();
			var pairData = tools.separate(entryData[i]);
			setDetails(i, pairData[0], pairData[1]);
		}
	};
	
	this.removeEntry = function (entryN) {
		entries[entryN].remove(); //Remove entry elements.
		
		if (entryN !== entries.length - 1) { //If this is not the last entry.
			for (var i = entryN + 1; i < entries.length; i++)
				entries[i].adjust();		 //Adjust each entry after it.
		}
		entries.splice(entryN, 1); //Remove array position.
	};

	this.setActive = function () {
		if (!active) {
			addEntry(); //Insert first entry.
			$("#add-button-" + course).click(function() { addEntry(); });
			active = true;
		}
	};
	
	this.create = function () { 
		if (!created) { 
			created = true; 
			return html; 
		} 
	};
	
	this.setAverage = function () {
		average = 0;
		for (var i = 0; i < entries.length; i++)
			average += entries[i].getProduct();
		$("#average-" + course).val(average.toFixed(2) + "%");
	};
	
	this.getAverage = function () { return average; };
	
	this.getNumberOfEntries = function () { return entries.length; };
}