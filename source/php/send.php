<?php
// Debug: Check if PHP is working
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo "PHP is working! Server method: " . $_SERVER['REQUEST_METHOD'];
    exit;
}

if ($_POST)
{
    $to = "inbox@amiroff.me";
    $sender = $_POST['name'];
    $email = $_POST['email'];
    $subject = "You have been contacted via amiroff.me by ($sender / $email)";
    $message = $_POST['message'];
    $headers = "From:  no-reply@amiroff.me";
    
    mail($to, $subject, $message, $headers);
    echo "Email sent successfully!";
}
?>
