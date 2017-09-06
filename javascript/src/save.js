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