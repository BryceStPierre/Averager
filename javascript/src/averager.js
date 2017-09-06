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

function Tools () {
	
	var saveCookie = "savedInputs";
	
	//Handle numeric inputs.
	var parse = function (numberExpression) {
		var value = parseFloat(numberExpression) || 0;
		if (value < 1)
			return value;
		else
			return value/100;
	};
	
	//Handle fractional inputs.
	var solve = function (stringExpression) {
		var values = stringExpression.split("/");
		var numerator = parseFloat(values[0]) || 0;
		var denominator = parseFloat(values[1]) || 0;
		
		return numerator/denominator;
	};
	
	//Delegate all inputs to a handler.
	this.convert = function (expression) {
		if (typeof expression === "number")
			return parse(expression);
		else if (typeof expression === "string") {
			if (expression.search("/") === -1)
				return parse(expression);
			else
				return solve(expression);
		}
		else
			alert("Input error!");
	};
	
	//Set cookie on user's host.
	var createCookie = function (cookieName, cookieValue, days) {
	    var d = new Date();
	    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
	    var expires = "expires=" + d.toUTCString();
	    document.cookie = cookieName + "=" + cookieValue + "; " + expires;
	};
	this.setCookie = function (name, value, days) { createCookie(name, value, days); };
	
	//Get cookie from user's host.
	var retrieveCookie = function (cookieName) {
	    var name = cookieName + "=";
	    var components = document.cookie.split(';');
	    for (var i = 0; i < components.length; i++) {
	        var c = components[i];
	        while (c.charAt(0) == ' ') 
	        	c = c.substring(1);
	        if (c.indexOf(name) == 0)
	        	return c.substring(name.length, c.length);
	    }
	    return "";
	};
	this.getCookie = function (name) { return retrieveCookie(name); };
	
	//Check if the save cookie has been set.
	this.isSavedCookieSet = function () {
	    var result = retrieveCookie(saveCookie);
	    if (result != "")
	        return true;
	    return false;
	};
	
	//Extract the course and entry numbers from a string.
	this.extract = function (entryString) {
		var indices = [];
		
		var values = entryString.split("-");
		var courseN = parseInt(values[0]) || 0;
		indices.push(courseN);
		var entryN = parseInt(values[1]) || 0;
		indices.push(entryN);
		
		return indices;
	};
	
	//Extract the grade and weight from a pair.
	this.separate = function (pairString) {
		return pairString.split("-");
	};
	
	//Only allow inputs that are numeric, '.', or '/'.
	this.expressionsOnly = function (e) {
		var charCode = (e.which) ? e.which : e.keyCode;
		if (charCode != 46 && charCode != 47 && charCode > 31 && (charCode < 48 || charCode > 57))
			return false;
		return true;
	};
}

//Create instance for use throughout procedure.
var tools = new Tools();

function Save () {
	
	var name = "savedInputs";
	var value = "";
	var time = 30;
	
	this.set = function (compiledValue) {
		value = compiledValue;
		//console.log("Cookie:" + value);
		tools.setCookie(name, value, time);
	};
	
	this.get = function () { 
		value = tools.getCookie(name);
		//console.log("Cookie:" + value);
		courseList.setCourses(value.split('+'));
	};
}

//Create instance for use throughout procedure.
var save = new Save();

function Entry (courseN, entryN, initialW, color) {
	
	var id = courseN + "-" + entryN;
	var course = courseN;
	var entry = entryN;
	var rawGrade = 0;
	var grade = 0;
	var rawWeight = "";
	var weight = 0;
	var created = false;
	var active = false;
	
	if (initialW === -1) { rawWeight = 100; weight = 100; } 
	else 				 { rawWeight = initialW; weight = initialW; }

	var html = '<span class="row-wrap" id="row-wrap-' + id + '">';
	html += 		'<div class="out-col" id="row-' + id + '">' + (entry + 1) + '</div>';
	html += 		'<input class="exp-col ' + color + '-line" id="grade-' + id + '" type="text" value="0" onkeypress="return tools.expressionsOnly(event)">';
	html += 		'<input class="num-col ' + color + '-line" id="weight-' + id + '" type="number" value="' + weight + '" min="0" max="100">';
	html += 		'<div class="out-col">';
	if (initialW !== -1)
		html +=	'<span class="remove button glyphicon glyphicon-remove" id="close-' + id + '" data-close="' + id + '"></span>';
	html +=			'</div>';
	html += '</span>';
		
	this.getPair = function () {
		return rawGrade + "-" + rawWeight;
	};
	
	this.getProduct = function () {
		return grade * weight;
	};
	
	this.remove = function () {
		$("#row-wrap-" + id).remove();
	};
	
	this.adjust = function () {
		//Update object properties.
		var idBefore = id;
		entry--;
		id = course + "-" + entry;
		
		//Update HTML properties and values.
		$("#row-wrap-" + idBefore).attr("id", "row-wrap-" + id);
		$("#row-" + idBefore).html("" + (entry + 1));
		$("#row-" + idBefore).attr("id", "row-" + id);
		$("#grade-" + idBefore).attr("id", "grade-" + id);
		$("#weight-" + idBefore).attr("id", "weight-" + id);
		$("#close-" + idBefore).attr("data-close", id);
		$("#close-" + idBefore).attr("id", "close-" + id);
	};
	
	this.setActive = function () {
		if (!active) {
			$(".exp-col, .num-col").click(function() {
				$(this).select();
			});
			$("#grade-" + id).on("change keyup", function() {
				rawGrade = $(this).val();
				courseList.saveCourses();
				grade = tools.convert($(this).val()) || 0;
				courseList.setAverage();
			});
			$("#weight-" + id).on("change keyup", function() {
				rawWeight = $(this).val();
				courseList.saveCourses();
				weight = parseFloat($(this).val()) || 0;
				courseList.setAverage();
			});
			$("#close-" + id).click(function() {
				var entryToRemove = tools.extract($(this).data("close"));
				courseList.removeEntry(entryToRemove[0], entryToRemove[1]);
				courseList.setAverage();
			});
			active = true;
		}
	};
	
	this.create = function () { 
		if (!created) { 
			created = true; 
			return html; 
		} 
	};
	
	this.setGrade = function (rawGrade) { 
		$("#grade-" + id).val(rawGrade);
		$("#grade-" + id).change();
	};
	this.getGrade = function () { return grade; };
	
	this.setWeight = function (rawWeight) {
		$("#weight-" + id).val(rawWeight); 
		$("#weight-" + id).change();
	};
	this.getWeight = function () { return weight; };

	this.setCourse = function (newCourse) { course = newCourse; };
	this.getCourse = function () { return course; };
}

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

function ArrayOfCourses () {
	
	var courseLimit = 5;
	var courses = [];
	var average = 0;
	
	this.addCourse = function () {
		if (courses.length < courseLimit) {
			var newCourse = new Course (courses.length, picker.randomColor());
			courses.push(newCourse);
			return courses[courses.length - 1].create();
		}
	};
	
	this.saveCourses = function () {
		var saveLog = "";
		
		for (var i = 0; i < courses.length; i++) {
			if (i !== courses.length - 1)
				saveLog += courses[i].saveEntries() + "+";
			else
				saveLog += courses[i].saveEntries();
		}
		save.set(saveLog);
	};
	
	this.setCourses = function (courseData) {
		for (var i = 0; i < courseData.length; i++) {
			if (i > 0)
				$("#add-course").click();
			courses[i].setEntries(courseData[i].split(","));
		}
	};

	this.removeEntry = function (courseN, entryN) {
		courses[courseN].removeEntry(entryN);
	};
	
	this.setActive = function () {
		for (var i = 0; i < courses.length; i++)
			courses[i].setActive();
	};
	
	this.setAverage = function () {
		var total = 0;
		for (var i = 0; i < courses.length; i++) {
			courses[i].setAverage();
			total += courses[i].getAverage();
		}
		average = total/courses.length;
		$("#average-bubble").val(average.toFixed(2) + "%");
	};
	
	this.getAverage = function () { return average; };
	
	this.getNumberOfCourses = function () { return courses.length; };
}

var courseList = new ArrayOfCourses();

$(function() {
	//Initialization.
	$("#average-bubble").val("0.00%");
	$("#save-alert").css("display", "none");
	$("#container").html(courseList.addCourse());
	courseList.setActive();
	
	if (tools.isSavedCookieSet())
		$("#save-alert").css("display", "block");
	
	//Restore results from cookie.
	$("#restore-results").click(function() {
		save.get();
		$("#close-alert").click();
	});
	
	//Adding a new course.
	$("#add-course").click(function() {
		var target = "#course-" + (courseList.getNumberOfCourses() - 1);
		$(target).after(courseList.addCourse());
		courseList.setActive();
	});
	
	//Feedback form submission using Ajax.
	$("#feedback").on("submit", function(e) {
		e.preventDefault();
		$.ajax({
			url: $(this).attr("action"),
			type: 'POST',
			data: $(this).serialize(),
			beforeSend: function() {},
			success: function(data) {
				$("#feedback-close").click();
				$("#success-trigger").click();
			}
		});
	});
});