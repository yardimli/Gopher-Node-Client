var isBusy=false;


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
	
	// recieve changed values by other client from server
	iosocket.on('hiGopher', function (recievedData) {
		$("#debug_console").append(getTimeStamp()+"> "+recievedData.text+"<br>");
	});

	// recieve parsed data from server
	iosocket.on('ParsedGopher', function (recievedData) {
		$("#debug_console").append(getTimeStamp()+"> FILE: "+recievedData.filename+"<br>");
		//console.log(recievedData.jsondata);
		
		var obj = JSON.parse(recievedData.jsondata);

		$.each(obj, recurse);
		list += "</ul>";
		$("#tree1").html(list);
	});
	
}
	function recurse(key, val) 
	{
//		list += "<li>";
		if (val instanceof Object) {
			
			if (key=="loc")
			{
//				list += key + "<ul>";
//				$.each(val, recurse);
//				list += "</ul>";
			} else
			{
				list += "<li>"+ key + "<ul>";
				$.each(val, recurse);
				list += "</ul></li>";
			}
		} else {
			if (key=="start") {} else
			if (key=="end") {} else
			{
				list +=  "<li>" + key +  " = " + val + "</li>";
			}
		}
//		list += "</li>";
	}
	
  
 
function actualFunction(key, val) {
   console.log(key);
} 

$(document).ready(function() {

	initSocketIO(); 
	
	setTimeout(function() {
		$("#debug_console").append(getTimeStamp()+"> call server<br>");
		console.log("call server");
		iosocket.emit("hellogopher", "" ); 
	},3000);
	
	
});