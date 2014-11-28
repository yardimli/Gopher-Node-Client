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

//------------------------------------------------------------------------------
_$fs = function (xCodeLine, FunctionName, FunctionParams,_$gXLocal) {
	$("#debug-div").append("<span title='"+ xCodeLine + ": Params: " + FunctionParams + "'>F "+FunctionName+" start " + _$gXLocal + "</span><br>");
}

//------------------------------------------------------------------------------
_$fe = function (xCodeLine, FunctionName,_$gXLocal) {
	$("#debug-div").append("<span title='"+ xCodeLine + ":'>F "+FunctionName+" end " + _$gXLocal + "</span><br>");
}

//------------------------------------------------------------------------------
_$set = function (xCodeLine, NestedParent, ParentType, LeftSideStr, LeftSideValue, RightSideStr, RightSideValue, Operator, _$gXLocal, InnerFunctionCount) {

	if (InnerFunctionCount>0)
	{
		for (var i = 0; i < (InnerFunctionCount); i++)
		{
//			 console.log("EX "+i+":" + arguments[(i*2)+7+1] + " ... " + arguments[(i*2)+7+2]);
		}	
	}
	var OutPut = null;
//		console.log("eval:"+RightSideStr);

//	$("#debug-div").append(xCodeLine + ': SET: ' + NestedParent + ' - '+ParentType+"  ---> ");
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

	$("#debug-div").append("<span title='"+ xCodeLine + ": " + NestedParent + " - " + ParentType + " - " + RightSideStr + " Op:" + Operator + "'>"+LeftSideStr+"="+JSON.stringify(OutPut)+" - " + _$gXLocal + "</span><br>");
	
//	$("#debug-div").append('Left: ' + LeftSideStr + LS +', Op: '+Operator+', Right: '+RightSideStr+' ('+RightSideValue+') New Value:'+OutPut+"<br>");
	return OutPut;
}

//------------------------------------------------------------------------------
_$evl = function (xCodeLine, NestedParent, ParentType, StatemetStr, StatemetValue, _$gXLocal, InnerFunctionCount) {
	if (InnerFunctionCount>0)
	{
		for (var i = 0; i < (InnerFunctionCount); i++)
		{
//			 console.log("EX "+i+":" + arguments[(i*2)+4+1] + " ... " + arguments[(i*2)+4+2]);
		}	
	}
//	$("#debug-div").append(xCodeLine + ': EVAL: ' + NestedParent + ' - '+ParentType+"  ---> ");

	OutPut = StatemetValue;
//	$("#debug-div").append('Statement: ' + StatemetStr + ', Value: '+OutPut+"<br>");

	$("#debug-div").append("<span title='"+ xCodeLine + ": " + NestedParent + " - " + ParentType + "'>"+StatemetStr+" ? "+OutPut+" - " + _$gXLocal + "</span><br>");

	return OutPut;
}

//------------------------------------------------------------------------------

