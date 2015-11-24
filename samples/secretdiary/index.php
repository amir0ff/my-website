<?php

    include("login.php");

?>

<!DOCTYPE HTML>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Secret Diary</title>
        <!-- Font Awesome CSS -->
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet">
        <link href="css/style.css" rel="stylesheet">
        <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon" />
    </head>
    
    <body>

        <nav class="navbar navbar-inverse">
          <div class="container">
                <div class="navbar-header">
                      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="glyphicon glyphicon-user"></span>

                      </button>
                    <a class="navbar-brand" href="index.php">Secret Diary</a>
                </div>
                <div id="navbar" class="navbar-collapse collapse">
                      <form class="navbar-form navbar-right" method="post">
                            <div class="form-group">
                                <input placeholder="Email" type="email" name="loginEmail" id="loginEmail" class="form-control" value="<?php echo addslashes($_POST['loginEmail']); ?>" autocomplete="off">
                            </div>
                            <div class="form-group">
                                <input type="password" placeholder="Password" name="loginPassword" class="form-control" value="<?php echo addslashes($_POST['loginPassword']); ?>">
                            </div>
                            <input type="submit" class="btn btn-danger" name="submit" value="Log In">
                      </form>
                </div>
          </div>
        </nav>
        <div class="container contentContainer">
            <h1 class="center bold title">Secret Diary</h1>
            <p class="center bold description">Your own private diary, with you wherever you go</p>
            <div class="row">
            <div class="col-md-6 col-md-offset-3 center">
                 <?php
                if($error){
                echo '<div id="success" class="alert alert-danger center">'.addslashes($error).'</div>';
                }
                if($success){
                echo '<div id="failMessage" class="alert alert-success center">'.$success.'</div>';
                }
                 if($problem){
                echo '<div id="noCity" class="alert alert-warning center">'.$problem.'</div>';
                }
                if($loggedOut){
                echo '<div id="noCity" class="alert alert-success center">'.$loggedOut.'</div>';
                }
                 ?>   
            </div>
            </div>
            <div class="row">
            <div class="col-md-6 col-md-offset-3 center paddingBottom">
            <form method="post" class="form-group">
                <input type="email" placeholder="Email" name="email" value="<?php echo addslashes($_POST['email']); ?>" class="form-control" autocomplete="off">
                <br>
                <input type="password" placeholder="Password" class="form-control" name="password" value="">
                <br>
                <input type="submit" class="btn btn-danger" name="submit" value="Sign Up">
                </br></br>

            </form>
            </div>
            </div>
            <!-- Footer -->
          <div class="row footer">
            <div class="col-md-6 col-md-offset-3 text-center paddingTop">

            <small class="smallfooter"><span>Made with </span><i class="fa fa-heart red-heart"></i> by <a href="https://www.amiroff.me" target="_blank">Amir Off</a></small>
            <br/><br/>
            </div>
        </div>

        </div>

     <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
     <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
    </body>
</html>