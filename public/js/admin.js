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
	
	// recieve changed values by other client from server
	iosocket.on('hiGopher', function (recievedData) {
		$("#debug_console").append(getTimeStamp()+"> "+recievedData.text+"<br>");
	});

	// recieve parsed data from server
	iosocket.on('ParsedGopher', function (recievedData) {
		$("#debug_console").append(getTimeStamp()+"> FILE: "+recievedData.filename+"<br>");
		//console.log(recievedData.jsondata);
		
		//make tree from json data`
		var obj = JSON.parse(recievedData.jsondata);
		$.each(obj, recurse);
		list += "</ul>";
		$("#tree1").html(list);

		//use json object convert it to xml and parse it with jQuery
		var xmldata = "<project>"+ json2xml(obj)+ "</project>";
		var ExpressionPoint;
		
		$(xmldata).find('expression').each(function(){

			var ExpressionPoint = $(this);

			var FirstLoop = true; //use Boolean to find to make sure the first type is AssignmentExpression, otherwise type could be a function with another type AssignmentExpression within 
			//seems like using :first has the same effect

			ExpressionPoint.find('type:first').each(function(){
			
				if (($(this).text() == "AssignmentExpression")) // && (FirstLoop))
				{
					$("#AssignmentExpression").append("> "+ $(this).text() +"<br>");
					AssignmentExpression(ExpressionPoint);
				}
//				FirstLoop = false;
			});
		});
	});
}

	function AssignmentExpression(ExpressionPoint)
	{
		var XLine = $(ExpressionPoint).find("loc").find("start").find("line").first().text();

		var Xoperator = $(ExpressionPoint).find("operator").first().text();
	
		var XLeftType = $(ExpressionPoint).find("left").find("type").first().text();
		var XLeftName = $(ExpressionPoint).find("left").find("name").first().text();
		var XLeftValue = $(ExpressionPoint).find("left").find("value").first().text();

		var XRightType = $(ExpressionPoint).find("right").find("type").first().text();
		var XRightName = $(ExpressionPoint).find("right").find("name").first().text();
		var XRightValue = $(ExpressionPoint).find("right").find("value").first().text();
		
		$("#AssignmentExpression").append("> Operator: "+ Xoperator +", Line:"+XLine+", Left: Type:"+XLeftType+", Name:"+XLeftName+", Value:"+XLeftValue+", Right: Type:"+XRightType+", Name:"+XRightName+", Value:"+XRightValue+", <br>");

	}



	function recurse(key, val) 
	{
//		list += "<li>";
		if (val instanceof Object) {
			
			if (key=="loc")
			{
				list += key + "<ul>";
				$.each(val, recurse);
				list += "</ul>";
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
			
			if ( (key=="type") && (val=="AssignmentExpression") )
			{
				SaveAssignment = true;
			}
			
			
		}
//		list += "</li>";
	}
	
  
 
$(document).ready(function() {

	initSocketIO(); 
	
	setTimeout(function() {
		$("#debug_console").append(getTimeStamp()+"> call server<br>");
		console.log("call server");
		iosocket.emit("hellogopher", "" ); 
	},3000);
	
	
});