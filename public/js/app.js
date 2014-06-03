var isBusy=false;

var iosocket;
function initSocketIO()
{
	iosocket = io.connect();
	iosocket.on('onconnection', function(value) {

		// recieve changed values by other client from server
		iosocket.on('updateData', function (recievedData) {
			pollOneH = recievedData.pollOneValue/2; // recieve start poll value from server
			$("#rData").html(recievedData.pollOneValue+" "+Date());
		});
		
		//iosocket.emit('turnchargeroff', (parseInt(recievedData.LockerID,10)) );
	});
}
  
$(document).ready(function() {
	initSocketIO(); 
	iosocket.emit("hello", "" );
});