<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Who Is Mr. Robot?</title>
</head>

<body style="background-color: #1E1E1E;">
    <div style="text-align: center; vertical-align-middle;">
        <a href="http://www.usanetwork.com/mrrobot"><img src="unnamed.jpg"></a>
    </div>

<?php

function getUserIP()
{
    $client  = @$_SERVER['HTTP_CLIENT_IP'];
    $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
    $remote  = $_SERVER['REMOTE_ADDR'];

    if(filter_var($client, FILTER_VALIDATE_IP))
    {
        $ip = $client;
    }
    elseif(filter_var($forward, FILTER_VALIDATE_IP))
    {
        $ip = $forward;
    }
    else
    {
        $ip = $remote;
    }
    return $ip;
}

$user_ip = getUserIP();

$to = "ameer157@gmail.com";
$subject = "IP address received:";
$headers = "From:  $to";
mail($to, $subject, $user_ip, $headers);

?>
</body>

</html>
