//------------------------------------------------------------------------------
//GopherB Helpers
//------------------------------------------------------------------------------

var GopherCallerIDCouter = 100;
var GopherCallerID = '0:0';
var _$v = [];
var _$gX = 1000; //gopher scope tracker
var _$gXLocal = _$gX;

//------------------------------------------------------------------------------
GopherFunctionCall = function(xCodeLine, xFuncTrackID, xFuncStr, xFuncValue, xParentID, xGopherCallerID) {
	return xFuncValue;

}

function censor(censor) {
  var i = 0;

  return function(key, value) {
    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
      return '[Circular]'; 

    if(i >= 4) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';

    ++i; // so we know we aren't using the original object anymore

    return value;  
  }
}

//------------------------------------------------------------------------------
_$fs = function (xCodeLine, FunctionName, FunctionType, FunctionParams,_$gXLocal) {
	
	$("#DebugTable").append("\
				<tr style='background-color:#bbb'>\
					<td>"+xCodeLine+"</td>\
					<td>"+_$gXLocal+"</td>\
					<td>"+FunctionName+"</td>\
					<td>"+FunctionType+"</td>\
					<td>"+FunctionParams+"</td>\
					<td></td>\
					<td></td>\
				</tr>");
	
//	$("#debug-div").append("<span title='"+ xCodeLine + ": Params: " + FunctionParams + "'>F "+FunctionName+" ("+FunctionType+") start " + _$gXLocal + "</span><br>");
}

//------------------------------------------------------------------------------
_$fe = function (xCodeLine, FunctionName,_$gXLocal) {
	$("#DebugTable").append("\
				<tr style='background-color:#bbb'>\
					<td>"+xCodeLine+"</td>\
					<td>"+_$gXLocal+"</td>\
					<td>"+FunctionName+"</td>\
					<td></td>\
					<td>FUNCTION END</td>\
					<td></td>\
					<td></td>\
				</tr>");
	
//	$("#debug-div").append("<span title='"+ xCodeLine + ":'>F "+FunctionName+" end " + _$gXLocal + "</span><br>");
}

//------------------------------------------------------------------------------
_$sb = function (xCodeLine, LeftSideStr,_$gXLocal) {
	$("#DebugTable").append("\
				<tr style='background-color:#ccc'>\
					<td>"+xCodeLine+"</td>\
					<td>"+_$gXLocal+"</td>\
					<td>"+LeftSideStr+"</td>\
					<td></td>\
					<td>BEGIN SET VARIABLE</td>\
					<td></td>\
					<td></td>\
				</tr>");
	
//	$("#debug-div").append(xCodeLine + ": begin set variable " + LeftSideStr+ "<br>");
	return 0;
}

//------------------------------------------------------------------------------
_$set = function (xCodeLine, NestedParent, ParentType, LeftSideStr, LeftSideValue, RightSideStr, RightSideValue, Operator, VarDeclerator, _$gXLocal, InnerFunctionCount) {

	if (InnerFunctionCount>0)
	{
		for (var i = 0; i < (InnerFunctionCount); i++)
		{
			var TempVar = arguments[11+i].split(/=(.+)?/);
			
			$("#DebugTable").append("\
				<tr style='background-color:#aaa'>\
							<td>"+xCodeLine+"</td>\
							<td>"+_$gXLocal+"</td>\
							<td><span title='"+TempVar[0]+"'>"+TempVar[1]+"</span></td>\
							<td>"+_$v[parseInt(TempVar[0],10)]+"</td>\
							<td>HELPER</td>\
							<td></td>\
							<td></td>\
						</tr>");

			
//			$("#debug-div").append("Helper:"+TempVar[0]+" -- " + TempVar[1] + "=" + _$v[parseInt(TempVar[0],10)] +" - " + _$gXLocal +  "<br>"  );
		}	
	}
	var OutPut = null;

	if (Operator == '++') {
		 OutPut = LeftSideValue + 1;
	} else
	if (Operator == '--') {
		 OutPut = LeftSideValue - 1;
	} else
	if (Operator == '+=') {
		 OutPut = LeftSideValue + RightSideValue;
	} else
	if (Operator == '-=') {
		 OutPut = LeftSideValue - RightSideValue;
	} else
	{
		OutPut = RightSideValue;
	}
	var LS = "(" + LeftSideValue + ")";
	if (typeof LeftSideValue=="undefined") { var LS="";}
	var VarDeclerator2="";
	if (VarDeclerator=="1") { VarDeclerator2 = "var ";}

	$("#DebugTable").append("\
				<tr>\
					<td>"+xCodeLine+"</td>\
					<td>"+_$gXLocal+"</td>\
					<td><span title='"+LS+"'>"+VarDeclerator2+LeftSideStr+"</span></td>\
					<td><span title='"+RightSideStr+"'>"+OutPut+"</span></td>\
					<td></td>\
					<td>"+NestedParent + " - " + ParentType+"</td>\
					<td>"+Operator+"</td>\
				</tr>");

//	$("#debug-div").append("<span title='"+NestedParent + " - " + ParentType + " - " + RightSideStr + " Op:" + Operator + "'>"+ xCodeLine + ": " + VarDeclerator2+LeftSideStr+"="+JSON.stringify(OutPut)+" - " + _$gXLocal + "</span><br>");

	return OutPut;
}

//------------------------------------------------------------------------------
_$evl = function (xCodeLine, NestedParent, ParentType, StatemetStr, StatemetValue, _$gXLocal, InnerFunctionCount) {
	if (InnerFunctionCount>0)
	{
		for (var i = 0; i < (InnerFunctionCount); i++)
		{
			var TempVar = arguments[7+i].split(/=(.+)?/);
			
			$("#DebugTable").append("\
				<tr style='background-color:#aaa'>\
							<td>"+xCodeLine+"</td>\
							<td>"+_$gXLocal+"</td>\
							<td><span title='"+TempVar[0]+"'>"+TempVar[1]+"</span></td>\
							<td>"+_$v[parseInt(TempVar[0],10)]+"</td>\
							<td>HELPER</td>\
							<td></td>\
							<td></td>\
						</tr>");
			
//			$("#debug-div").append("Helper:"+TempVar[0]+" -- " + TempVar[1] + "=" + _$v[parseInt(TempVar[0],10)] +" - " + _$gXLocal + "<br>"  );
		}	
	}

	OutPut = StatemetValue;
//	$("#debug-div").append("<span title='"+ NestedParent + " - " + ParentType + "'>"+xCodeLine + ": "+StatemetStr+" ? "+OutPut+" - " + _$gXLocal + "</span><br>");
	
	$("#DebugTable").append("\
				<tr>\
					<td>"+xCodeLine+"</td>\
					<td>"+_$gXLocal+"</td>\
					<td>"+StatemetStr+"</td>\
					<td>"+OutPut+"</span></td>\
					<td>EVALUATE</td>\
					<td>"+NestedParent + " - " + ParentType+"</td>\
					<td></td>\
				</tr>");
	

	return OutPut;
}

//------------------------------------------------------------------------------

