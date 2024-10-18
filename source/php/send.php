<?php
if ($_POST)
{
    $to = "inbox@amiroff.me";
    $sender = $_POST['name'];
    $email = $_POST['email'];
    $subject = "You have been contacted via amiroff.me by ($sender / $email)";
    $message = $_POST['message'];
    $headers = "From:  no-reply@amiroff.me";
    
    mail($to, $subject, $message, $headers);
}
?>
