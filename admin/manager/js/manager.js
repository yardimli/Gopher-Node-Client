var iosocket;

function getTimeStamp() {
       var now = new Date();
       return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':' + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())));
}

function initSocketIO()
{
	iosocket = io.connect();
	
	iosocket.emit("HiManager", "" ); 

	// recieve changed values by other client from server
	iosocket.on('HiManagerClient', function (recievedData) {
		$("#debug_console").append(getTimeStamp()+"> "+recievedData.text+"<br>");
	});
}
 
$(document).ready(function() {
	initSocketIO(); 
});