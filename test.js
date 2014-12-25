//require secure http module
var https = require("https");

//My google API key
var googleApiKey = "AIzaSyDaoI-rdkdsje62daynvcdrIRqsLgRtv5k";

//error function
function printError(error) {
    console.error(error.message);
}

function locate(address) {
//accept an address as an argument to geolocate

    //replace spaces in the address string with + charectors to make string browser compatiable
    address = address.split(' ').join('+');

    //var geolocate is the url to get our json object from google's geolocate api
    var geolocate = "https://maps.googleapis.com/maps/api/geocode/json?key=";
    geolocate += googleApiKey + "&address=" + address;

    var reqeust = https.get(geolocate, function (response){

        //create empty variable to store response stream
        var responsestream = "";

        response.on('data', function (chunk){
            responsestream += chunk;
        }); //end response on data

        response.on('end', function (){
            if (response.statusCode === 200){
                try {
                    var location = JSON.parse(responsestream);
					console.log(responsestream);
                    var fullLocation = {
                        "address" : location.results[0].formatted_address,
                        "cord" : location.results[0].geometry.location.lat + "," + location.results[0].geometry.location.lng
                    };
                    return fullLocation;
                } catch(error) {
                    printError(error);
                }
            } else {
                printError({ message: "There was an error with Google's Geolocate. Please contact system administrator"});
            }
        }); //end response on end

    }); //end https get request

} //end locate function


var testing = locate("7678 old spec rd");
console.dir(testing);