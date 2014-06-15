$(document).ready(function() {
  var iosocket;
var test_dir_holder;
function getTimeStamp() {
       var now = new Date();
       return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':' + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())));
}

function initSocketIO()
{
	iosocket = io.connect();

	iosocket.on('onconnection', function(value) {
		$("#debug_console").append(getTimeStamp()+"> connected to server<br>");
	});
	
	$("#debug_console").append(getTimeStamp()+"> call server<br>");
	iosocket.emit("HiManager", "" ); 

	// recieve changed values by other client from server
	iosocket.on('HiManagerClient', function (recievedData) {
		$("#debug_console").append(getTimeStamp()+"> "+recievedData.text+"<br>");
	});
  
  iosocket.on('getDirTreeClient',function(response){
    console.log(response);
    if(response.success == false){
      
    }else{
      console.log('on iosocet getDirTreeClient');
      console.log(response.data);
    }    
  });
}
	initSocketIO(); 
  $('#dialog_select_dir').on('show.bs.modal',function(){
    console.log('dialog opens');
    var sendData = {};
    sendData.target='c:\\wamp\\www\\EgeFlipCard';
    iosocket.emit('getDirTree',sendData);
    //$('#target_dir').html(test_dir_holder);
    
  });
});