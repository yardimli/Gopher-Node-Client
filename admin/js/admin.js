var isBusy=false;
var SaveAssignment = false;
var SaveAssignmentLeft = false;
var SaveAssignmentRight = false;


var list = "<ul>";

function getTimeStamp() {
	var now = new Date();
	//return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':' + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())));

	return (now.getHours() + ':' + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())));

}




var iosocket;
function initSocketIO()
{
	iosocket = io.connect();
	
	iosocket.on('onconnection', function(value) {
		$("#debug_console").append(getTimeStamp()+"> connected to server<br>");
	});
	
	$("#debug_console").append(getTimeStamp()+"> call server<br>");
	iosocket.emit("HiGopherB", "" ); 
	iosocket.emit("HiAdmin", "" ); 

	iosocket.on('HiAdminClient', function (recievedData) {
		$("#debug_console").append(getTimeStamp()+"> "+recievedData.text+"<br>");
	});

	// recieve parsed data from server
	iosocket.on('ParsedGopher', function (recievedData) {
		$("#debug_console").append(getTimeStamp()+"> FILE: "+recievedData.filename+"<br>");
		//console.log(recievedData.jsondata);
		
	});
	
	iosocket.on('UpdateSourceView', function (recievedData) {
		$("#debug_console").append(getTimeStamp()+"> Update Source<br>");
		$("#source1").html(recievedData.sourcecode);
		$("#source1").syntaxHighlight(); 
	});

	iosocket.on('UpdateTreeView', function (recievedData) {
		$("#debug_console").append(getTimeStamp()+"> Update Tree<br>");
		$("#tree1").html(recievedData.htmlcode);
		
		//http://techlister.com/treeview/

		$( '.tree li' ).each( function() {
			if( $( this ).children( 'ul' ).length > 0 ) {
				$( this ).addClass( 'parent' ); 
			}
		});
		 
		$( '.tree li.parent > a' ).click( function( ) {	
			$( this ).parent().toggleClass( 'active' );
			$( this ).parent().children( 'ul' ).slideToggle( 'fast' );
		});
		 
		$( '#all' ).click( function() {
			$( '.tree li' ).each( function() {
				$( this ).toggleClass( 'active' );
				$( this ).children( 'ul' ).slideToggle( 'fast' );
			});
		});

	});
	
	iosocket.on('UpdateParserView', function (recievedData) {
		$("#debug_console").append(recievedData.htmlcode);		
	});

	iosocket.on('ConsoleTell', function (recievedData) {
		$("#big_console").append(recievedData.text +"<br>");		//getTimeStamp()+"> "+ 
	});
}
 
$(document).ready(function() {
	$.SyntaxHighlighter.init(); 
	initSocketIO(); 
});