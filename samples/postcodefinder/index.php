<!DOCTYPE HTML>
<html>

<head>
    <title>Postcode Finder</title>
    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="images/favicon.ico" rel="icon" type="image/x-icon" />
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.2/css/bootstrap.min.css">
    <!-- Google Font -->
    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans:400,700">

    <style>
    html,
    body {
        height: 100%;
    }
    .container {
        background-image: url("images/background.jpg");
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        padding-top: 15%;
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
    <div class="container">
        <div class="row">
            <div class="col-md-6 col-md-offset-3 center">
                <h1 class="center white">Postcode Finder</h1>
                <p class="lead center white">Enter your address below to find it's postcode.</p>
                <form>
                    <div class="form-group">
                        <input type="text" class="form-control" name="address" id="address" placeholder="Eg. 360 3rd St. Suite 400, San Francisco, CA..." />
                    </div>
                    <button id="findMyPostcode" class="btn btn-warning btn-lg">Find My Postcode</button>
                </form>
                <div id="success" class="alert alert-success">Success!</div>
                <div id="failMessage" class="alert alert-danger">Could not find the postcode data for that address. Please try again.</div>
                <div id="failMessage2" class="alert alert-danger">Could not connect to server. Please try again.</div>
                <div id="failMessage3" class="alert alert-danger">Please enter an address!</div>
            </div>
        </div>
    </div>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <!-- Latest compiled and minified JavaScript -->
    <script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.2/js/bootstrap.min.js"></script>

    <!-- Get Postcode Script -->
    <script>
    
    $("#findMyPostcode").click(function(event) {

        var result=0;
        $(".alert").hide();

        event.preventDefault();

        $.ajax({
        type: "GET",
        url: "https://maps.googleapis.com/maps/api/geocode/xml?address="+encodeURIComponent($('#address').val())+"&sensor=false&key=AIzaSyBQt9MvDieuyQFcKVGxLljadN8Cd9cll2A",
        dataType: "xml",
        success: processXML,
        error: error,
        });

        function error() {

            $("#failMessage2").fadeIn();

        }

        function processXML(xml) {

            $(xml).find("address_component").each(function() {

                if ($(this).find("type").text() == "postal_code") {

                    $("#success").html("The postcode for this address is: "+$(this).find('long_name').text()).fadeIn();

                    result=1;

                }

            });

            if (result == 0) {

                $("#failMessage").fadeIn();

            }

            if ($("#address").val() == "") {

                $("#failMessage").hide(); // Hiding the initial error message caused by submitting an empty address.
                $("#failMessage3").fadeIn();

            }

        }

    });

    </script>

</body>

</html>