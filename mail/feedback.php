<?php
	$email = $_POST['email'];
	$subject = $_POST['subject'];
	$message = $_POST['message'];

	$receiver = "brycelstpierre@gmail.com";

	$headers = "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
	$headers .= 'From: <Averager>' . "\r\n";
	
	$today = getdate(date("U"));
	$date = "$today[weekday], $today[month] $today[mday], $today[year]";
	
	if (!empty($email)) {
	    $body = "New message sent on {$date}.<br/><br/><strong>Email</strong>: {$email}<br/><strong>Subject</strong>: {$subject}";
	    $body .= "<br/><br/><strong>Message</strong>: {$message}<br/><br/>Averager Feedback System";

	    $send = mail($receiver, 'User Feedback', $body, $headers);
	    if ($send) {
	        echo '0';
	    }
	}
?>