//------------------------------------------------------------------------------
//GopherB Helpers
//------------------------------------------------------------------------------

var GopherCallerIDCouter = 100;
var GopherCallerID = '0:0';
var _$v = [];
var _$gX = 1000; //gopher scope tracker
var _$gXLocal = _$gX;

var GMsgArray = [];




var xRuntimeTimeStamp = Math.floor(Date.now() / 1000);

/*PLACEHOLDERFORINSERT*/

/*
var GFileMap = [];
var xProjectID = "1"; //**** updated from proxy
var xParentFileName = "index.html"; //**** updated from proxy
*/
//***** list built from proxy ***
/*
GFileMap[0] = "app.js";
GFileMap[1] = "app-func.js";
GFileMap[2] = "calculator.js";
GFileMap[3] = "snake.js";
*/

TrackObjectArray = [];
TrackObjectArray.push("a");
TrackObjectArray.push("info");
TrackObjectArray.push("blockA");
TrackObjectArray.push("block1");
TrackObjectArray.push("block2");
TrackObjectArray.push("operators");


setTimeout(function() {
	$.ajax({				
		url: "http://localhost/gopherA/getgopher.php"
	,   type: 'POST'
	,	crossDomain:true
	,   contentType: "application/x-www-form-urlencoded; charset=UTF-8"
	,   data: {type:"header", ProjectID:xProjectID, RuntimeTimeStamp:xRuntimeTimeStamp, ParentFileName:xParentFileName, FileMap:GFileMap.toString(), TrackObject:TrackObjectArray.toString() }
	,	dataType: "json"
	,   success: function() 
		{ 
			while(GMsgArray.length > 0) {   GMsgArray.pop(); } 
		} 
	});
			
},1000);





function array_search(arr, val) {
	for (var i = 0, len = arr.length; i < len; i++) {
		if (arr[i] == val) return i;
	}
	return -1;
}




JSON.stringifyOnce = function(obj, replacer, indent){
    var printedObjects = [];
    var printedObjectKeys = [];

    function printOnceReplacer(key, value){
        if ( printedObjects.length > 100){ // browsers will not print more than 20K, I don't see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
        return 'object too long';
        }
        var printedObjIndex = false;
        printedObjects.forEach(function(obj, index){
            if(obj===value){
                printedObjIndex = index;
            }
        });

        if ( key == ''){ //root element
             printedObjects.push(obj);
            printedObjectKeys.push("root");
             return value;
        }

        else if(printedObjIndex+"" != "false" && typeof(value)=="object"){
            if ( printedObjectKeys[printedObjIndex] == "root"){
                return "(pointer to root)";
            }else{
                return "(see " + ((!!value && !!value.constructor) ? value.constructor.name.toLowerCase()  : typeof(value)) + " with key " + printedObjectKeys[printedObjIndex] + ")";
            }
        }else{

            var qualifiedKey = key || "(empty key)";
            printedObjects.push(value);
            printedObjectKeys.push(qualifiedKey);
            if(replacer){
                return replacer(key, value);
            }else{
                return value;
            }
        }
    }
    return JSON.stringify(obj, printOnceReplacer, indent);
};


function isFunctionA(object) {
 return object && getClass.call(object) == '[object Function]';
}

function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

var DebugUpdate = setInterval(function() {
	console.log(GMsgArray.length);
	if (GMsgArray.length !== 0)
	{
		//var strdata = JSON.stringifyOnce(GMsgArray);
		var strdata = JSON.stringify(GMsgArray);
		
//		console.log(strdata);
		
		$.ajax({				
			url: "http://localhost/gopherA/getgopher.php"
		,   type: 'POST'
		,	crossDomain:true
		,   contentType: "application/x-www-form-urlencoded; charset=UTF-8"
		,   data: {type:"body", ProjectID:xProjectID, RuntimeTimeStamp:xRuntimeTimeStamp, ParentFileName:xParentFileName, data:strdata }
		,	dataType: "json"
		,   success: function() 
			{ 
				while(GMsgArray.length > 0) {   GMsgArray.pop(); } 
			} 
		});
			
		while(GMsgArray.length > 0) {
			GMsgArray.pop();
		}
	}
	
},1000);






//-------------------------------------------------------------------------------
var ESQ = function (inStr) {
	var outStr = String(inStr).replace(/\'/g, "\\'");
	outStr = String(outStr).replace(/\"/g, '\\"');
	outStr = outStr.replace(/(?:\r\n|\r|\n)/g, '\\n');

	return outStr;
};

//------------------------------------------------------------------------------
_$fs = function (FileID, xCodeLine, FunctionName, FunctionType, FunctionParams, _$gXLocal) {

	var GMsg = new Object();
	GMsg.Type = "fs";
	GMsg.FileID = FileID;
	GMsg.Line = xCodeLine;
	GMsg.FName = FunctionName;
	GMsg.FType = FunctionType;
	GMsg.FParam = FunctionParams;
	GMsg.Scope = _$gXLocal;
	GMsgArray.push(GMsg);
};

//------------------------------------------------------------------------------
_$fe = function (FileID, xCodeLine, FunctionName, _$gXLocal) {
	var GMsg = new Object();
	GMsg.Type = "fe";
	GMsg.FileID = FileID;
	GMsg.Line = xCodeLine;
	GMsg.FName = FunctionName;
	GMsg.Scope = _$gXLocal;
	GMsgArray.push(GMsg);
};

//------------------------------------------------------------------------------
_$sb = function (FileID, xCodeLine, LeftSideStr, _$gXLocal) {
	var GMsg = new Object();
	GMsg.Type = "sb";
	GMsg.FileID = FileID;
	GMsg.Line = xCodeLine;
	GMsg.VarName = LeftSideStr;
	GMsg.Scope = _$gXLocal;
	GMsgArray.push(GMsg);


//	$("#debug-div").append(xCodeLine + ": begin set variable " + LeftSideStr+ "<br>");
	return 0;
};


//------------------------------------------------------------------------------
_$set = function (FileID, xCodeLine, NestedParent, ParentType, LeftSideStr, LeftSideValue, RightSideStr, RightSideValue, Operator, VarDeclerator, _$gXLocal, InnerFunctionCount) {

	if (InnerFunctionCount > 0)
	{
		for (var i = 0; i < (InnerFunctionCount); i++)
		{
			var TempVar = arguments[12 + i].split(/=(.+)?/);

			var GMsg = new Object();
			GMsg.Type = "hs";
			GMsg.FileID = FileID;
			GMsg.Line = xCodeLine;

			GMsg.VarName = TempVar[1];
			if (typeof(_$v[parseInt(TempVar[0], 10)])==="undefined")
			{
				GMsg.VarVal = "{UNDEFINED}";
			} else
			if (Array.isArray(_$v[parseInt(TempVar[0], 10)]))
			{
				GMsg.VarVal = "{ARRAY}";
				if (array_search(TrackObjectArray, GMsg.VarName) != -1) {
					GMsg.VarVal = _$v[parseInt(TempVar[0], 10)].toString();
				}
			} else
			if (typeof(_$v[parseInt(TempVar[0], 10)])==="object")
			{
				GMsg.VarVal = "{OBJECT}";
				if (array_search(TrackObjectArray, GMsg.VarName) != -1) {
					GMsg.VarVal = JSON.stringifyOnce(_$v[parseInt(TempVar[0], 10)]);
				}
			} else
			if (isFunction(_$v[parseInt(TempVar[0], 10)]))
			{
				GMsg.VarVal = "{FUNCTION}";
			} else
			{
				GMsg.VarVal = _$v[parseInt(TempVar[0], 10)];
			}

			GMsg.Scope = _$gXLocal;
			GMsgArray.push(GMsg);
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
	if (typeof LeftSideValue == "undefined") {
		var LS = "";
	}
	var VarDeclerator2 = "";
	if (VarDeclerator == "1") {
		VarDeclerator2 = "var ";
	}
	
	var GMsg = new Object();
	GMsg.Type = "se";
	GMsg.FileID = FileID;
	GMsg.Line = xCodeLine;
	GMsg.Parent = NestedParent;
	GMsg.ParentType = ParentType;

	GMsg.VarName = LeftSideStr;
	if (typeof(LeftSideValue)==="undefined")
	{
		GMsg.VarVal = "{UNDEFINED}";
	} else
	if (Array.isArray(LeftSideValue))
	{
		GMsg.VarVal = "{ARRAY}";
		if (array_search(TrackObjectArray, GMsg.VarName) != -1) {
			GMsg.VarVal = LeftSideValue.toString();
		}
	} else
	if (typeof(LeftSideValue)==="object")
	{
		GMsg.VarVal = "{OBJECT}";
		if (array_search(TrackObjectArray, GMsg.VarName) != -1) {
			GMsg.VarVal = JSON.stringifyOnce(LeftSideValue);
		}
	} else
	if (isFunction(LeftSideValue))
	{
		GMsg.VarVal = "{FUNCTION}";
	} else
	{
		GMsg.VarVal = LeftSideValue;
	}
	

	GMsg.AssignStr = RightSideStr;
	if (typeof(OutPut)==="undefined")
	{
		GMsg.AssignVal = "{UNDEFINED}";
	} else
	if (Array.isArray(OutPut))
	{
		GMsg.AssignVal = "{ARRAY}";
		if (array_search(TrackObjectArray, GMsg.VarName) != -1) {
			GMsg.AssignVal = OutPut.toString();
		}
	} else
	if (typeof(OutPut)==="object")
	{
		GMsg.AssignVal = "{OBJECT}";
		if (array_search(TrackObjectArray, GMsg.VarName) != -1) {
			GMsg.AssignVal = JSON.stringifyOnce(OutPut);
		}
	} else
	if (isFunction(OutPut))
	{
		GMsg.AssignVal = "{FUNCTION}";
	} else
	{
		GMsg.AssignVal = OutPut;
	}


	GMsg.Op = Operator;
	GMsg.VarDec = VarDeclerator;

	GMsg.Scope = _$gXLocal;
	GMsgArray.push(GMsg);
	
	return OutPut;
};

//------------------------------------------------------------------------------
_$evl = function (FileID, xCodeLine, NestedParent, ParentType, StatementStr, StatementValue, _$gXLocal, InnerFunctionCount) {
	if (InnerFunctionCount > 0)
	{
		for (var i = 0; i < (InnerFunctionCount); i++)
		{
			var TempVar = arguments[8 + i].split(/=(.+)?/);

			var GMsg = new Object();
			GMsg.Type = "he";
			GMsg.FileID = FileID;
			GMsg.Line = xCodeLine;

			GMsg.VarName = TempVar[1];
			if (typeof(_$v[parseInt(TempVar[0], 10)])==="undefined")
			{
				GMsg.VarVal = "{UNDEFINED}";
			} else
			if (Array.isArray(_$v[parseInt(TempVar[0], 10)]))
			{
				GMsg.VarVal = "{ARRAY}";
				if (array_search(TrackObjectArray, GMsg.VarName) != -1) {
					GMsg.VarVal = _$v[parseInt(TempVar[0], 10)].toString();
				}
			} else
			if (typeof(_$v[parseInt(TempVar[0], 10)])==="object")
			{
				GMsg.VarVal = "{OBJECT}";
				if (array_search(TrackObjectArray, GMsg.VarName) != -1) {
					GMsg.VarVal = JSON.stringifyOnce(_$v[parseInt(TempVar[0], 10)]);
				}
			} else
			if (isFunction(_$v[parseInt(TempVar[0], 10)]))
			{
				GMsg.VarVal = "{FUNCTION}";
			} else
			{
				GMsg.VarVal = _$v[parseInt(TempVar[0], 10)];
			}

			GMsg.Scope = _$gXLocal;
			GMsgArray.push(GMsg);
		}
	}

	OutPut = StatementValue;
	
	var GMsg = new Object();
	GMsg.Type = "ev";
	GMsg.FileID = FileID;
	GMsg.Line = xCodeLine;
	GMsg.Parent = NestedParent;
	GMsg.ParentType = ParentType;

	GMsg.StatementStr = StatementStr;

	if (typeof(StatementValue)==="undefined")
	{
		GMsg.StatementVal = "{UNDEFINED}";
	} else
	if (Array.isArray(StatementValue))
	{
		GMsg.StatementVal = "{ARRAY}";
		if (array_search(TrackObjectArray, GMsg.StatementStr) != -1) {
			GMsg.StatementVal = StatementValue.toString();
		}
	} else
	if (typeof(StatementValue)==="object")
	{
		GMsg.StatementVal = "{OBJECT}";
		if (array_search(TrackObjectArray, GMsg.StatementStr) != -1) {
			GMsg.StatementVal = JSON.stringifyOnce(StatementValue);
		}
	} else
	if (isFunction(StatementValue))
	{
		GMsg.StatementVal = "{FUNCTION}";
	} else
	{
		GMsg.StatementVal = StatementValue;
	}
	

	GMsg.Scope = _$gXLocal;
	GMsgArray.push(GMsg);

	return OutPut;
};
