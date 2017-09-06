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