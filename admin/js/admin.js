var isBusy=false;
var SaveAssignment = false;
var SaveAssignmentLeft = false;
var SaveAssignmentRight = false;


var list = "<ul>";

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
	
	$("#debug_console").append(getTimeStamp()+"> call server<br>");
	iosocket.emit("HiAdmin", "" ); 

	iosocket.on('HiAdminClient', function (recievedData) {
		$("#debug_console").append(getTimeStamp()+"> "+recievedData.text+"<br>");
	});

	// recieve parsed data from server
	iosocket.on('ParsedGopher', function (recievedData) {
		$("#debug_console").append(getTimeStamp()+"> FILE: "+recievedData.filename+"<br>");
		//console.log(recievedData.jsondata);
		
	});
	
	iosocket.on('UpdateTreeView', function (recievedData) {
		$("#debug_console").append(getTimeStamp()+"> Update Tree<br>");
		$("#tree1").html(recievedData.htmlcode);		
	});
							
	iosocket.on('UpdateParserView', function (recievedData) {
		$("#debug_console").append(getTimeStamp()+"> Update Parser<br>");
		$("#AssignmentExpression").append(recievedData.htmlcode);		
	});

}
 
$(document).ready(function() {

	initSocketIO(); 
});