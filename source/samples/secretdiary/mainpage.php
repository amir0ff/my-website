<?php

    session_start();

    include("connection.php");

    $query="SELECT diary
            FROM users
            WHERE id = '".$_SESSION['id']."' LIMIT 1";

    $result = mysqli_query($link, $query);

    $row = mysqli_fetch_array($result);

    $diary = $row['diary'];
?>

<!DOCTYPE HTML>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Your Own Secret Diary!</title>
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet">
        <link href="css/style.css" rel="stylesheet">
        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
    </head>
    
    <body>

        <nav class="navbar navbar-inverse">
          <div class="container">
                <div class="navbar-header pull-left">
                    <a class="navbar-brand" href="#">Secret Diary</a>
                </div>
                <div class="pull-right">
                    <ul class="navbar-nav nav pull-right">
                        <li><a href="index.php?logout=1"><span class="glyphicon glyphicon-off" aria-hidden="true"></span> Log Out</a></li>

                </div>
          </div>
        </nav>
        <div class="container">
            <h1 class="center bold title">Secret Diary</h1>
            <p class="center bold description">Your own private diary, with you wherever you go</p>
             <div class="diaryContainer">
                <div class="col-md-6 col-md-offset-3">
                <textarea class="form-control"><?php echo $diary; ?></textarea>
                                </br></br>
                <pre><strong>LOGIN DETAILS DEBUG:</strong><br><?php print_r($_POST) ?></pre>
                <pre><strong>SESSION DEBUG:</strong><br><?php print_r($_SESSION) ?></pre>
                </div>
            </div>
        </div>
        <script>
            $(".diaryContainer").css("min-height",$(window).height()-172);
            $("textarea").css("height",$(window).height()-222);
            $("textarea").keyup(function(){
                $.post("updatediary.php", {diary:$("textarea").val()});
            });
        </script>

    </body>
</html>