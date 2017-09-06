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