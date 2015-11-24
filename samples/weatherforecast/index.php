<!DOCTYPE HTML>
<html>

<head>
    <title>Weather Forecast</title>
    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="images/favicon.ico" rel="icon" type="image/x-icon" />
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <!-- Google Font -->
    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans:400,700">

    <style>
    html,
    body {
        height: 100%;
    }
    .container-fluid {
        background-image: url("images/background.jpg");
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        padding-top: 25vh;
    }
    .center {
        text-align: center;
    }
    .white {
        color: white;
    }
    h1 {
    	text-shadow: 2px 2px #333333;
        font-family: 'Open Sans', sans-serif;
        font-weight: 700; 
    }
    .lead {
        padding-top: 15px;
        padding-bottom: 15px;
        text-shadow: 2px 2px #333333;
        font-family: 'Open Sans', sans-serif;
    }
    button {
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .alert {
        margin-top: 20px;
        display: none;
    }
    </style>
</head>

<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-6 col-md-offset-3 center">
                <h1 class="center white">Weather Forecast</h1>
                <p class="lead center white">Enter your city below to get a forecast for the weather.</p>
                <form>
                    <div class="form-group">
                        <input type="text" class="form-control" name="city" id="city" placeholder="Eg. Berlin, Paris, San Francisco..." />
                    </div>
                    <button id="findMyWeather" class="btn btn-primary btn-lg">Find My Weather</button>
                </form>
                <div id="success" class="alert alert-success">Success!</div>
                <div id="failMessage" class="alert alert-danger">Could not find weather data for that city. Please try again.</div>
                <div id="noCity" class="alert alert-danger">Please enter a city!</div>
            </div>
        </div>
    </div>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <!-- Latest compiled and minified JavaScript -->
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>

    <!-- Get Weather Script -->
    <script>
    
        $("#findMyWeather").click(function(event) {

            event.preventDefault();

            $(".alert").hide();

            if ($("#city").val() != "") {

                $.get("scraper.php?city="+$("#city").val(),
                    function(data) {
                        if (data == "") {
                            $("#failMessage").fadeIn();
                        } else {
                            $("#success").html(data).fadeIn();
                        }
                    });

            } else {

                $("#noCity").fadeIn();
            }
        });

    </script>
</body>

</html>