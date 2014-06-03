var isBusy=false;

var iosocket;
<<<<<<< HEAD


=======
var pollOneH = 0;
var poll1;
var text;
var potValue;
var prevPotValue;
//var onOff = false; 
var toggleVal = 0;
var WaitForLockerClose = false;
var WaitForLockerID = 0;

var returntomaintimer;

function ReturnToMain()
{
	$("#debug_console").append("returning to main...<br>");

	$("#declined_screen").fadeOut(500);
	$("#processing_screen").fadeOut(500);
	$("#open_locker_screen").fadeOut(500);
	$("#retrieve_phone_screen").fadeOut(500);
	$("#locker_full_screen").fadeOut(500);
	$("#locker_closed_charging_screen").fadeOut(500);
	
	$("#main_screen").fadeIn(500);
	isBusy = false;
}
  
>>>>>>> 30d15eb5fd25f66b26c9c7b2389ea9f9d93d532e
function initSocketIO()
{
	iosocket = io.connect();
	iosocket.on('onconnection', function(value) {

		// recieve changed values by other client from server
		iosocket.on('updateData', function (recievedData) {
			pollOneH = recievedData.pollOneValue/2; // recieve start poll value from server
			$("#rData").html(recievedData.pollOneValue+" "+Date());
		});
		
<<<<<<< HEAD

		//iosocket.emit('turnchargeroff', (parseInt(recievedData.LockerID,10)) );
	});
}
  
$(document).ready(function() {
	initSocketIO(); 
	iosocket.emit("hello", "" );
});
=======
		// recieve card data
		iosocket.on('CardResponse', function (recievedData) {
			
			if (recievedData.OpStatus=="update") {
				//$("#debug_console").append("received response for update. LockerID: "+recievedData.LockerID+" -"+recievedData.InUse+"<br>");
			
				ResultStr = "Locker "+recievedData.LockerID+": ";
				if (recievedData.InUse==true) { ResultStr += "In Use, "; } else
				if (recievedData.InUse==false) { ResultStr += "Not in Use, "; };
				
				if (recievedData.LockerState=="open") { ResultStr += " Locker Open"; } else
				if (recievedData.LockerState=="closed") { ResultStr += " Locker Closed"; };
				
				ResultStr += ", Card: "+recievedData.CardNumber;

				$("#locker"+recievedData.LockerID).html(ResultStr);
			}

			if (recievedData.OpStatus=="NoLockersLeft") {
				$("#processing_screen").fadeOut(500);
				$("#locker_full_screen").fadeIn(500);
				
				$("#debug_console").append("card:"+recievedData.CardNumber+" no empty lockers left<br>");
				setTimeout(function(){ ReturnToMain(); },3000);
			}

			if (recievedData.OpStatus=="release") {
				$("#processing_screen").fadeOut(500);
				$("#retrieve_phone_screen").fadeIn(500);
				
				$("#debug_console").append("card:"+recievedData.CardNumber+" is found to be in use for LockerID:"+recievedData.LockerID+"<br>");
				
				iosocket.emit("getlockerstatus", "" );
				setTimeout(function(){ ReturnToMain(); },3000);
			}
			
			if (recievedData.OpStatus=="approved") {
				$("#processing_screen").fadeOut(500);
				$("#open_locker_screen").fadeIn(500);
				
				$("#debug_console").append("card:"+recievedData.CardNumber+" is approved for LockerID:"+recievedData.LockerID+"<br>");
				
				iosocket.emit("getlockerstatus", "" );
				
				//turn charging off and return to start screen after 10 seconds if door has not been closed
				returntomaintimer = setTimeout(function(){ 
					//turn locker charger off if door has not been closed in time
					iosocket.emit('turnchargeroff', (parseInt(recievedData.LockerID,10)) );
					ReturnToMain(); 
				},10000);
				
				WaitForLockerClose = true;
				WaitForLockerID = parseInt(recievedData.LockerID,10)+1;
			}
			
			if (recievedData.OpStatus=="declined") {
				$("#processing_screen").fadeOut(500);
				$("#declined_screen").fadeIn(500);
				
				setTimeout(function(){ ReturnToMain(); },3000);
			}
		});
	});
}
  
function ResizeScreens()
{
	$("#main_screen").css({"width":$(window).width()+"px","height":$(window).height()+"px"});
	$("#processing_screen").css({"width":$(window).width()+"px","height":$(window).height()+"px"});
	$("#declined_screen").css({"width":$(window).width()+"px","height":$(window).height()+"px"});
	$("#open_locker_screen").css({"width":$(window).width()+"px","height":$(window).height()+"px"});
	$("#retrieve_phone_screen").css({"width":$(window).width()+"px","height":$(window).height()+"px"});
	$("#locker_full_screen").css({"width":$(window).width()+"px","height":$(window).height()+"px"});
	$("#locker_closed_charging_screen").css({"width":$(window).width()+"px","height":$(window).height()+"px"});
}  

window.onload = function() {
	initSocketIO(); 
	iosocket.emit("getlockerstatus", "" );
};

$(window).resize(function() { ResizeScreens(); });
  
$(document).ready(function() {
	ReturnToMain();
	
	
	//check for door state every 3 sec
	setInterval(function(){ iosocket.emit("getlockerstatus", "" ); },3000);
	
	
	$("#check").button();
	$(".cardbutton").button();
	$(".lockerbutton").button();
	
	ResizeScreens();
	

	$(".cardbutton").click(function() {
		if (isBusy) {
			$("#debug_console").append("busy, please wait...<br>");
		} else
		{
			isBusy = true;

			$("#debug_console").append($(this).attr("id") + " pressed...<br>");
			
			$("#main_screen").fadeOut(500);
			$("#processing_screen").fadeIn(500);
			
			iosocket.emit('cardbuttonpress', $(this).attr("id") );
		}
	});
	
	$(".lockerbutton").click(function() {
		$("#debug_console").append($(this).attr("id") + " pressed...<br>");
		
		iosocket.emit('lockerclosepress', $(this).attr("id") );
		iosocket.emit("getlockerstatus", "" );
		
		if ( (WaitForLockerClose) && ("locker"+WaitForLockerID==$(this).attr("id")) ) {
		
			$("#open_locker_screen").fadeOut(500);
			$("#locker_closed_charging_screen").fadeIn(500);
			
			//turn locker charger on if it closed because of the timeout
			iosocket.emit('turnchargeron', (WaitForLockerID-1) );
		
			setTimeout(function(){ ReturnToMain(); },3000);
			WaitForLockerClose=false;

			clearTimeout(returntomaintimer);
			
		}
	});
	

	$('#check').click(function() {
		toggleVal += 1;
		toggleVal %= 2;
		iosocket.emit('buttonval',toggleVal);
	});
});
>>>>>>> 30d15eb5fd25f66b26c9c7b2389ea9f9d93d532e
