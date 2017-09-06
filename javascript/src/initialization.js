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