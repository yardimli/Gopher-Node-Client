var isBusy=false;

function getTimeStamp() {
       var now = new Date();
       return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':' + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())));
}

var iosocket;
function initSocketIO()
{
	iosocket = io.connect();
	
	iosocket.on('onconnection', function(value) {
		$("#debug_console").append(getTimeStamp()+"> connected to server<br>");
	});
	
	// recieve changed values by other client from server
	iosocket.on('hiGopher', function (recievedData) {
		$("#debug_console").append(getTimeStamp()+"> "+recievedData.text+"<br>");
	});
}
  
$(document).ready(function() {
	initSocketIO(); 
	
	setTimeout(function() {
		$("#debug_console").append(getTimeStamp()+"> call server<br>");
		console.log("call server");
		iosocket.emit("hellogopher", "" ); 
	},3000);
	
	
});