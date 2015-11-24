<?php

	if($_POST){
		$to = "ameer157@gmail.com";
		$theName = $_POST['name'];
		$subject = "You have been contacted via your website by $theName";
	    $theEmail = $_POST['email'];
	    $theMessage = $_POST['message'];
	    $headers = "From:  $theEmail";
	
	   mail($to, $subject, $theMessage, $headers);
	}

?>