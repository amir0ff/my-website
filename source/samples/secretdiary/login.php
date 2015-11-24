<?php

	session_start();

	if ($_GET["logout"]==1 AND $_SESSION['id']) {
		session_destroy();
		$loggedOut = "You have been logged out.";
	}

	include("connection.php");

	// Sign up script
	if ($_POST['submit']=="Sign Up") {

		if (!$_POST['email']) {
			$error.="Please enter your email address";

			} else if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
				$error.="<br/>Please enter a valid email address";
			}

		if (!$_POST['password']) {$error.="<br/>Please enter your password";
			} else {

				if (strlen($_POST['password'])<8) $error.="<br/>Please enter a password of at least 8 characters";
				if (!preg_match('/[A-Z]/', $_POST['password'])) $error.="<br/>Please include at least one capital letter in your password";
			}

		if ($error) { $error = "<b>There were error(s) in your signup details:</b></br>".$error;
		} else {

			
		$query = "SELECT * 
		FROM `users` 
		WHERE `email`='".mysqli_real_escape_string($link, $_POST['email'])."'";
		$result = mysqli_query($link, $query);
		$results = mysqli_num_rows($result);

		if ($results) { $problem = "<b><center>That email address is already registered. Do you want to log in?</center></b>";
		   } else {
		   
		    $query = "INSERT INTO `users` (`email`, `password`) 
		    VALUES ('".mysqli_real_escape_string($link, $_POST['email'])."', '".md5(md5($_POST['email']).$_POST['password'])."')";
		    mysqli_query($link, $query); 
		    $success = "You have been signed up";

		    $_SESSION['id']=mysqli_insert_id($link);

		   }
		}

	}

		// Login script
		if ($_POST['submit']=="Log In") {
			$query = "SELECT *
	    	FROM users
	   		WHERE email='".mysqli_real_escape_string($link, $_POST['loginEmail'])."'
	    	AND password='".md5(md5($_POST['loginEmail']).$_POST['loginPassword'])."' LIMIT 1";
	    	$result=mysqli_query($link, $query);
	    	$row = mysqli_fetch_array($result);

		    if ($row) {
		        $_SESSION['id']=$row['id'];
		        header("Location:mainpage.php");
		    } else {
		        $error="<b><center>We could not find a user with that email and password. Please try again.</center></b>";
		    }    
		}
?>