<?php
if ($_POST)
{
    $to = "ameer157@gmail.com";
    $sender = $_POST['name'];
    $subject = "You have been contacted via your website by $sender";
    $email = $_POST['email'];
    $message = $_POST['message'];
    $headers = "From:  $email";
    mail($to, $subject, $message, $headers);
}
?>
