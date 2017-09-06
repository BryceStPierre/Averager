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