fs = require('fs');
http = require('http');
socketio = require('socket.io');
url = require("url");
path = require('path');
acorn = require("./acorn/acorn.js"); 
beautify = require('js-beautify').js_beautify;
util = require('util');

//------------------------------------------------------------------------------------------------------------------------------
var PadLeft = function (nr, n, str) {
	return Array(n-String(nr).length+1).join(str||' ')+nr;
}

//------------------------------------------------------------------------------------------------------------------------------
var escapeSingleQuote = function (inStr) {
    return String(inStr).replace(/\'/g, "\\'");
}


//------------------------------------------------------------------------------------------------------------------------------
function recurse(TreeHTML, key, val) 
{
//		list += "<li>";
	if (val instanceof Object) {

		if (key=="loc")
		{
//			TreeHTML += key + "<ul>";
			TreeHTML += "<li><a>"+ key + "</a><ul>";
			Object.keys(val).forEach(function(key) {  TreeHTML = recurse(TreeHTML, key, val[key] ); } );
			TreeHTML += "</ul>";
		} else
		{
			TreeHTML += "<li><a>"+ key + "</a><ul>";
			Object.keys(val).forEach(function(key) {  TreeHTML = recurse(TreeHTML, key, val[key] ); } );
			TreeHTML += "</ul></li>";
		}
	} else {
//		if (key=="start") {} else
//		if (key=="end") {} else
		{
			TreeHTML +=  "<li><a>" + key +  " = " + val + "</a></li>";
		}

		if ( (key=="type") && (val=="AssignmentExpression") )
		{
			SaveAssignment = true;
		}
	}
	return TreeHTML;
//		list += "</li>";
}


//------------------------------------------------------------------------------------------------------------------------------
function MakeJSONTreeFromJS(parsed,filePath)
{
	var TreeHTML2;

	//console.log(JSON.stringify(parsed, null, compact ? null : 2));

	TreeHTML2 = "<ul>";
	Object.keys(parsed).forEach(function(key) {  TreeHTML2 = recurse(TreeHTML2, key, parsed[key] ); } );
	TreeHTML2 += "</ul>";

	fs.writeFile(filePath.replace(".js","-gopher.html"),TreeHTML2);
// TODO: escape characters that will break the conversion from JSON to XML
//						parsed = parsed.replace(/</g,'&lt;');
//						parsed = parsed.replace(/>/g,'&gt;');
	
}


//------------------------------------------------------------------------------------------------------------------------------
function recurseJSON(key, val, indent, GopherObjectsA,parentStr,SelfValue,ParentID) 
{
	if (val instanceof Object) {
		indent++;
		var NewQ = new Object();
		NewQ.XPath = parentStr;
		NewQ.XSelf = key;
		NewQ.XParentNode = true;
		NewQ.XParentID = ParentID;
		NewQ.XValue = '';
		NewQ.XIndent = indent;
		var TempVar = 0; if (GopherObjectsA.length>0) { TempVar =GopherObjectsA[GopherObjectsA.length -1].XID+1; }
		NewQ.XID = TempVar;

		var xParentID = TempVar;
		GopherObjectsA.push( NewQ );
		
		if (SelfValue!="") {
			var xParentStr = parentStr+"."+SelfValue;
		} else
		{
			var xParentStr = parentStr;
		}
		
//		console.log("("+indent+" "+ParentID+" "+TempVar+"."+parentStr + ")");
		
		Object.keys(val).forEach(function(key) {
			GopherObjectsA = recurseJSON(key, val[key], indent, GopherObjectsA, xParentStr, key, xParentID ); 
		});
	} else {
		
		var NewQ = new Object();
		NewQ.XPath = parentStr;
		NewQ.XSelf = SelfValue;
		NewQ.XParentNode = false;
		NewQ.XParentID = ParentID;
		NewQ.XValue = val;
		NewQ.XIndent = indent+1;
		
		var TempVar = 0; if (GopherObjectsA.length>0) { TempVar =GopherObjectsA[GopherObjectsA.length -1].XID+1; }
		NewQ.XID = TempVar;

		GopherObjectsA.push( NewQ );

//		console.log(" "+(indent+1)+" "+ParentID+" "+ParentID+"."+parentStr +  " = " + val);
	}
	
	return GopherObjectsA;
}


//------------------------------------------------------------------------------------------------------------------------------
function LoopGopherS(DataListSource,SourceCode,  IncludeBlocks,  LoopGopherSDebug)
{
	IncludeBlocks = (typeof IncludeBlocks === "undefined") ? false : IncludeBlocks;
	LoopGopherSDebug = (typeof LoopGopherSDebug === "undefined") ? false : LoopGopherSDebug;
	var XStartIndent = 0;
	var NewRecordType = "";
	
	var NestedParentType = "";
	
	var ResetNestedType = true;
	
	GopherObjectsA = [];
	
	 //For Debugging JSON to Array Fuction
	 /*
	for (var i=0; i<DataListSource.length; i++) {
		console.log(DataListSource[i].XIndent+" "+ DataListSource[i].XID+" "+ DataListSource[i].XParentID + "." + DataListSource[i].XPath + " " + DataListSource[i].XParentNode+"   "+ DataListSource[i].XSelf+" = "+ DataListSource[i].XValue);
	}
	*/
	
	
	var HelperParentType = "";
	var HelperParentName = "";
	for (var C1=0; C1<DataListSource.length;C1++)
	{
		var FirstType = DataListSource[C1].XValue;
		var FirstKey = DataListSource[C1].XSelf;

		if ((XStartIndent!=0) && (DataListSource[C1].XIndent<=XStartIndent-1))
		{
			if (LoopGopherSDebug) console.log("--------------- END --------------- "); 
			XStartIndent = 0;
			ResetNestedType = true;
		}

		if ( (FirstKey=="type")
		&& ( (FirstType == "VariableDeclarator") || 
			  (FirstType == "AssignmentExpression") ||
			  (FirstType == "UnaryExpression") ||
			  (FirstType == "ArrayExpression") ||

			  (FirstType == "ForStatement") ||
			  (FirstType == "ForInStatement") ||
			  (FirstType == "WhileStatement") ||
			  (FirstType == "BlockStatement") ||
			  (FirstType == "VariableDeclaration") ||
			  (FirstType == "ExpressionStatement") ||
			  (FirstType == "SequenceExpression") ||
			  (FirstType == "ReturnStatement") ||
			  (FirstType == "FunctionDeclaration") ||
			  (FirstType == "ObjectExpression") ||
			  (FirstType == "IfStatement") ||
			  

			  (FirstType == "UpdateExpression") ||
			  (FirstType == "BinaryExpression") ||
			  (FirstType == "LogicalExpression") ||
			  (FirstType == "Identifier") ||
			  (FirstType == "Literal") ||
			  (FirstType == "CallExpression") ||
			  (FirstType == "LogicalExpression") ||
			  (FirstType == "MemberExpression")
		  ) )
		{
			
//			console.log(DataListSource[C1].XPath+" "+DataListSource[DataListSource[C1].XParentID].XSelf);
			
			
			var ParentType = DataListSource[DataListSource[C1].XParentID].XSelf;
			var CalleLine = "0";
			var CalleCol  = "0";

			var CalleStart = "0";
			var CalleEnd   = "0";

			var xstr = "";
			for (var i2=0; i2<DataListSource[C1].XIndent; i2++) { xstr += " "; }
			
			for (var C2=C1; C2<DataListSource.length;C2++)
			{
				if ((DataListSource[C2].XPath == DataListSource[C1].XPath+".loc.start") && (DataListSource[C2].XSelf == "line"))
				{	CalleLine = parseInt( DataListSource[C2].XValue,10);	}

				if ((DataListSource[C2].XPath == DataListSource[C1].XPath+".loc.start") && (DataListSource[C2].XSelf == "column"))
				{	CalleCol = parseInt( DataListSource[C2].XValue,10);	}

				if ((DataListSource[C2].XPath == DataListSource[C1].XPath) && (DataListSource[C2].XSelf == "start"))
				{	CalleStart = parseInt( DataListSource[C2].XValue,10);	}
				
				if ((DataListSource[C2].XPath == DataListSource[C1].XPath) && (DataListSource[C2].XSelf == "end"))
				{	CalleEnd = parseInt( DataListSource[C2].XValue,10);	}

				if ( (CalleLine!="0") && (CalleCol!="0")) { break; }
			}

			if (	(FirstType == "ForStatement") || 
					(FirstType == "ForInStatement") ||
	 			   (FirstType == "WhileStatement") ||
					(FirstType == "VariableDeclaration") ||
					((FirstType == "BlockStatement") && (!IncludeBlocks)) ||
					((FirstType == "ExpressionStatement") && (!IncludeBlocks)) ||
					(FirstType == "SequenceExpression") ||
					(FirstType == "FunctionDeclaration") ||
					(FirstType == "IfStatement")  )
			{
				if (LoopGopherSDebug) console.log(CalleLine+": "+xstr+FirstType);
				
				if (ResetNestedType) {NestedParentType = ""; ResetNestedType=false; }
				if (NestedParentType=="") {NestedParentType = FirstType;} else {
				NestedParentType = NestedParentType + " > " + FirstType; }
				HelperParentType = FirstType;
				HelperParentName = ParentType;
				HelperParentStart = CalleStart;
				HelperParentEnd = CalleEnd;
			} else
			{
				
				if (XStartIndent==0)
				{
					NewRecordType = "";
					if ((FirstType=="VariableDeclarator")) { 
						if (LoopGopherSDebug) console.log("--------------- START VAR --------------- "); 
						NewRecordType = "VariableDeclarator";
					} else

					if ((FirstType=="AssignmentExpression")) { 
						if (LoopGopherSDebug) console.log("--------------- START ASSIGN --------------- "); 
						NewRecordType = "AssignmentExpression";
					} else

					if (FirstType=="BinaryExpression") { 
						if (LoopGopherSDebug) console.log("--------------- START BINARY --------------- "); 
						NewRecordType = "BinaryExpression";
					} else
					
					if (FirstType=="ReturnStatement") { 
						if (LoopGopherSDebug) console.log("--------------- START RETURN  --------------- "); 
						NewRecordType = "ReturnStatement";
					} else

					if (FirstType=="UpdateExpression") { 
						if (LoopGopherSDebug) console.log("--------------- START UPDATE --------------- "); 
						NewRecordType = "UpdateExpression";
					}
				
					if (FirstType=="LogicalExpression") { 
						if (LoopGopherSDebug) console.log("--------------- START LOGICAL --------------- "); 
						NewRecordType = "LogicalExpression";
					}
					
					if ((FirstType=="BlockStatement") && (IncludeBlocks)) { 
						if (LoopGopherSDebug) console.log("--------------- START BLOCK --------------- "); 
						NewRecordType = "BlockStatement";
					}
					
					if ((FirstType=="ExpressionStatement") && (IncludeBlocks)) { 
						if (LoopGopherSDebug) console.log("--------------- START EXPRESSION --------------- "); 
						NewRecordType = "ExpressionStatement";
					}
					
					if ((FirstType == "CallExpression") && (IncludeBlocks)) { 
						if (LoopGopherSDebug) console.log("--------------- START CALL BLOCK --------------- "); 
						NewRecordType = "CallExpression";
					}

					if (NewRecordType!="")
					{
						var NewQParent = new Object();
						NewQParent.NewRecordType = NewRecordType;
						NewQParent.Records = [];
						NewQParent.LeftRightPairs = [];
						NewQParent.StartIndent = DataListSource[C1].XIndent; 
						NewQParent.ArrayIndex = C1;
						NewQParent.InsertStr = "";
						NewQParent.HelperParentType = HelperParentType;
						NewQParent.NestedParentType = NestedParentType;
						NewQParent.HelperParentStart = HelperParentStart;
						NewQParent.HelperParentEnd = HelperParentEnd;
						
						NewQParent.HelperParentName = HelperParentName;
						NewQParent.HelperXPath = DataListSource[C1].XPath;
						if (LoopGopherSDebug) console.log(" path:"+DataListSource[C1].XPath); 
						
						
						var CopyStart = 0;
						var CopyEnd = 0;
						for (var C2=C1; C2<DataListSource.length;C2++)
						{
							if ((DataListSource[C2].XPath == DataListSource[C1].XPath) && (DataListSource[C2].XSelf == "start"))
							{
								CopyStart = parseInt( DataListSource[C2].XValue, 10);
							}
							
							if ((DataListSource[C2].XPath == DataListSource[C1].XPath) && (DataListSource[C2].XSelf == "end"))
							{
								CopyEnd = parseInt( DataListSource[C2].XValue, 10);
							}

							if ( (CopyStart!=0) && (CopyEnd!=0) ) { break; }
							if (C2>C1+1000) { break; }
						}
						NewQParent.CopyStart = CopyStart;
						NewQParent.CopyEnd = CopyEnd;
						
						GopherObjectsA.push( NewQParent );
						XStartIndent = DataListSource[C1].XIndent; 
					}
				}
				
				var ThisIsLeft = false;
				if (XStartIndent>0)
				{
					if (NewQParent.LeftRightPairs.length==0)
					{
						ThisIsLeft = true;
						var NewQ = new Object();
						NewQ.XLeft = C1;
						NewQ.XRight = 0;
						NewQ.XIndent = DataListSource[C1].XIndent;
						NewQParent.LeftRightPairs.push( NewQ );
					} else
					{
						var C11 = -1;
						for (var C10=0; C10<NewQParent.LeftRightPairs.length; C10++)
						{
							if ((NewQParent.LeftRightPairs[C10].XIndent == DataListSource[C1].XIndent) && (NewQParent.LeftRightPairs[C10].XRight==0))
							{
								C11 = C10;
								break;
							}
						}
						if (C11!=-1)
						{
							NewQParent.LeftRightPairs[C11].XRight = DataListSource[C1].XIndent;
							ThisIsLeft = false;
						} else
						{
							ThisIsLeft = true;
							var NewQ = new Object();
							NewQ.XLeft = C1;
							NewQ.XRight = 0;
							NewQ.XIndent = DataListSource[C1].XIndent;
							NewQParent.LeftRightPairs.push( NewQ );
						}
					}
				}
				
				var CopyStart = 0;
				var CopyEnd = 0;
				var xOperator = "";
				var xPrefix = "";
				for (var C2=C1; C2<DataListSource.length;C2++)
				{
					if ((DataListSource[C2].XPath == DataListSource[C1].XPath) && (DataListSource[C2].XSelf == "start"))
					{
						CopyStart = parseInt( DataListSource[C2].XValue, 10);
					}
					
					if ((DataListSource[C2].XPath == DataListSource[C1].XPath) && (DataListSource[C2].XSelf == "end"))
					{
						CopyEnd = parseInt( DataListSource[C2].XValue, 10);
					}

					if ((DataListSource[C2].XPath == DataListSource[C1].XPath) && (DataListSource[C2].XSelf == "operator"))
					{
						xOperator = DataListSource[C2].XValue;
					}
					
					if ((DataListSource[C2].XPath == DataListSource[C1].XPath) && (DataListSource[C2].XSelf == "prefix"))
					{
						xPrefix = DataListSource[C2].XValue;
					}

					if ( (CopyStart!=0) && (CopyEnd!=0) && (xOperator!="") && (xPrefix!="") ) { break; }
					if (C2>C1+1000) { break; }
				}
				
				var SourceX = SourceCode.slice( CopyStart  , CopyEnd );
				if (FirstType == "VariableDeclarator") { xOperator = "="; }
				
				if ((XStartIndent>0) && (DataListSource[C1].XIndent>NewQParent.StartIndent))
				{
					var XLeft="R:";
					if (ThisIsLeft) {XLeft="L:"; }

					var NewQ = new Object();
					NewQ.XLine = CalleLine;
					NewQ.XCol = CalleCol;
					NewQ.XStartPosition = CopyStart;
					NewQ.XEndPosition = CopyEnd;
					NewQ.ThisType = FirstType;
					NewQ.ParentType = ParentType;

					NewQ.HasChildren = false;

					NewQ.Prefix = xPrefix;
					NewQ.Operator = xOperator;
					NewQ.xSource = SourceX.toString();
					NewQ.Indent = DataListSource[C1].XIndent;
					NewQ.xID = DataListSource[C1].XID;
					NewQ.ParentID = 0;
					NewQ.LeftRight = true;
					NewQ.IsLeft = ThisIsLeft;

					NewQ.Processed = false;
					NewQ.TempVarName  = SourceX.toString();

					if (NewQParent.Records.length>0)
					{
						for (jj=NewQParent.Records.length-1; jj>0; jj--)
						{
							if (NewQParent.Records[jj].Indent == DataListSource[C1].XIndent-1 )
							{
								NewQParent.Records[jj].HasChildren = true;
								NewQ.ParentID = NewQParent.Records[jj].xID;
								break;
							}
						}
					}
					
					NewQParent.Records.push( NewQ );

					if (LoopGopherSDebug) console.log(CalleLine+": "+xstr+XLeft+DataListSource[C1].XIndent+" "+FirstType+" "+ParentType+" ("+xOperator+") ["+SourceX+"]  Parent:"+DataListSource[C1].XParentID+", Self:"+DataListSource[C1].XID); 
					
				} else
				{
					if (XStartIndent>0)
					{
						var NewQ = new Object();
						NewQ.XLine = CalleLine;
						NewQ.XCol = CalleCol;
						NewQ.XStartPosition = CopyStart;
						NewQ.XEndPosition = CopyEnd;
						NewQ.ThisType = FirstType;
						NewQ.ParentType = ParentType;
						NewQ.HasChildren = false;
						NewQ.Prefix = xPrefix;
						NewQ.Operator = xOperator;
						NewQ.xSource = SourceX.toString();
						NewQ.Indent = DataListSource[C1].XIndent;
						NewQ.xID = DataListSource[C1].XID;
						NewQ.ParentID = 0;
						NewQ.LeftRight = false;
						NewQ.IsLeft = false;
						
						NewQ.Processed = false;
						NewQ.TempVarName  = SourceX.toString();

						if (NewQParent.Records.length>0)
						{
							for (jj=NewQParent.Records.length-1; jj>0; jj--)
							{
								if (NewQParent.Records[jj].Indent == DataListSource[C1].XIndent-1 )
								{
									NewQParent.Records[jj].HasChildren = true;
									NewQ.ParentID = NewQParent.Records[jj].xID;
									break;
								}
							}
						}

						NewQParent.Records.push( NewQ );
					}

					if (LoopGopherSDebug) console.log(CalleLine+": "+xstr+FirstType+" "+ParentType+" ("+xOperator+") ["+SourceX+"]  Parent:"+DataListSource[C1].XParentID+", Self:"+DataListSource[C1].XID); 
				}
			}
		}
	}
	return GopherObjectsA;
}


//------------------------------------------------------------------------------------------------------------------------------
function IFArrayCompare(a,b) {
  if (a.AddPosition < b.AddPosition)
     return -1;
  if (a.AddPosition > b.AddPosition)
    return 1;
  return 0;
}


//------------------------------------------------------------------------------------------------------------------------------
function AddCurly2IFs(contents)
{
	//******** Reparse Source
	var options = {};
	options.locations = true; 

	var DataList = [];
	var parsed = acorn.parse(contents, options); 
	Object.keys(parsed).forEach(function(key) {  
		DataList = recurseJSON(key, parsed[key],0,DataList, "p", "", 0);
	});
	
	//Loop All IF consequent/alternate statements check if it has no curly brackets (ExpressionStatement) instead of curly brackets (BlockStatment) 
	//if it is ExpressionStatement add curly brackets and semicolumn to last character if not already semicolumn
	//first find all consequent/alternate and save pos and source in list
	//then loop the result last to first and change it
	
	var ExpressionStatementList = [];
	for (var C1=0; C1<DataList.length;C1++)
	{
		if ((DataList[C1].XSelf=="consequent") || (DataList[C1].XSelf=="alternate"))
		{
			C1++;
			if ((DataList[C1].XValue=="ExpressionStatement") && (DataList[C1].XSelf=="type"))
			{
//				console.log("************ consequent");
				var CopyStart=0;
				var CopyEnd=0;
				
				while ( ( (CopyStart==0) || (CopyEnd==0) ) && (C1<DataList.length) )
				{
					C1++;
					if (DataList[C1].XSelf=="start") { CopyStart = parseInt(DataList[C1].XValue,10); }
					if (DataList[C1].XSelf=="end") { CopyEnd = parseInt(DataList[C1].XValue,10); }
				}
				if ( (CopyStart>0) && (CopyEnd>CopyStart) )
				{
					var NewQ = new Object();
					NewQ.CopyEnd = CopyEnd;
					NewQ.CopyStart = CopyStart;
					NewQ.XSource = contents.slice( CopyStart  , CopyEnd ).toString();
					ExpressionStatementList.push( NewQ );
//					console.log( contents.slice( CopyStart  , CopyEnd ).toString() );
				}
				
			}
		}
	}
	
	for (var ObjectCounter=ExpressionStatementList.length-1; ObjectCounter >= 0; ObjectCounter--)
	{
//			console.log( ObjectCounter+": "+ExpressionStatementList[ObjectCounter].XSource );
			if (ExpressionStatementList[ObjectCounter].XSource.slice(-1)!=";") { ExpressionStatementList[ObjectCounter].XSource += ";" }
			contents = [contents.slice(0, ExpressionStatementList[ObjectCounter].CopyStart), " { " + ExpressionStatementList[ObjectCounter].XSource + " } ", 	contents.slice(ExpressionStatementList[ObjectCounter].CopyEnd)].join('');
	}
	
	return contents;
	
	
}


//------------------------------------------------------------------------------------------------------------------------------
function AddCurly2LOOPs(contents)
{
	//******** Reparse Source
	var options = {};
	options.locations = true; 
	
	var DataList = [];
	var parsed = acorn.parse(contents, options); 
	Object.keys(parsed).forEach(function(key) {  
		DataList = recurseJSON(key, parsed[key],0,DataList, "p", "", 0);
	});
	
	//Loop All ForStatement, WhileStatement check if the body is ExpressionStatement if so add curly brackets and semicolumn to last character if not already semicolumn
	//first find all bodies and save pos and source in list
	//then loop the result last to first and change it


	var ExpressionStatementList = [];
	for (var C1=0; C1<DataList.length;C1++)
	{
		if ((DataList[C1].XSelf=="body") )
		{
			C1++;
			if ((DataList[C1].XValue=="ExpressionStatement") && (DataList[C1].XSelf=="type"))
			{
				var CopyStart=0;
				var CopyEnd=0;
				
				while ( ( (CopyStart==0) || (CopyEnd==0) ) && (C1<DataList.length) )
				{
					C1++;
					if (DataList[C1].XSelf=="start") { CopyStart = parseInt(DataList[C1].XValue,10); }
					if (DataList[C1].XSelf=="end") { CopyEnd = parseInt(DataList[C1].XValue,10); }
				}
				if ( (CopyStart>0) && (CopyEnd>CopyStart) )
				{
					var NewQ = new Object();
					NewQ.CopyEnd = CopyEnd;
					NewQ.CopyStart = CopyStart;
					NewQ.XSource = contents.slice( CopyStart  , CopyEnd ).toString();
					ExpressionStatementList.push( NewQ );
//					console.log( contents.slice( CopyStart  , CopyEnd ).toString() );
				}
			}
		}
	}
	for (var ObjectCounter=ExpressionStatementList.length-1; ObjectCounter >= 0; ObjectCounter--)
	{
			if (ExpressionStatementList[ObjectCounter].XSource.slice(-1)!=";") { ExpressionStatementList[ObjectCounter].XSource += ";" }
			contents = [contents.slice(0, ExpressionStatementList[ObjectCounter].CopyStart), " { " + ExpressionStatementList[ObjectCounter].XSource + " } ", 	contents.slice(ExpressionStatementList[ObjectCounter].CopyEnd)].join('');
	}
	
	return contents;
}	


//------------------------------------------------------------------------------------------------------------------------------
function AddVariableTracking(contents)
{
	//******** Reparse Source
	var options = {};
	options.locations = true; 
	
	//******** Reparse Source since it was changed
	var DataList = [];
	var GopherObjectsA = [];
	var parsed = acorn.parse(contents, options); 
	Object.keys(parsed).forEach(function(key) {  
		DataList = recurseJSON(key, parsed[key],0,DataList, "p", "", 0);
	});
	
	//-------------------------------------------------------------------------------------------------------------------
	//1) Loop all Variable Expressions and add Gopher.Tell's 
	//2) find the function calls and enclose them in tracking variables
	GopherObjectsA = LoopGopherS(DataList,contents,false,true);
	
	var GTVarCounter = 0;
	
	for (var ObjectCounter=0; ObjectCounter < GopherObjectsA.length; ObjectCounter++)
	{
		//----------------------------------------------------------------------------------------------------------------
		if ( (GopherObjectsA[ObjectCounter].NewRecordType=="UpdateExpression")  ) //++, --
		{
			//first print to screen
			//function _$set(xCodeLine, NestedParent, ParentType, LeftSideStr, LeftSideValue, RightSideStr, RightSideValue, Operator, InnerFunctionCount)
			GopherObjectsA[ObjectCounter].InsertStr = "(tempVar = "+GopherObjectsA[ObjectCounter].Records[1].xSource+", " + 
			               GopherObjectsA[ObjectCounter].Records[1].xSource + "= " +
								"_$set("+GopherObjectsA[ObjectCounter].Records[0].XLine + "," +
											  "'" + GopherObjectsA[ObjectCounter].NestedParentType + "'," +
											  "'" + GopherObjectsA[ObjectCounter].Records[0].ParentType + "'," +
											  "'" + escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[1].xSource) + "'," +
											  escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[1].xSource) + "," +
											  "'',0,'" + GopherObjectsA[ObjectCounter].Records[0].Operator + "',_$gXLocal,0), tempVar)";
						   
//			if (DebugLines) 
			{
				console.log( "\n" +GopherObjectsA[ObjectCounter].NewRecordType);
				console.log( 
				" HelperParentType: " + GopherObjectsA[ObjectCounter].HelperParentType + 
				" HelperParentName: " + GopherObjectsA[ObjectCounter].HelperParentName + 
				" NestedParentType: " + GopherObjectsA[ObjectCounter].NestedParentType + 
				
				" Parent Type: " + GopherObjectsA[ObjectCounter].Records[0].ParentType + 
				" Indent: " + GopherObjectsA[ObjectCounter].Records[0].Indent + 
				" Length : " + GopherObjectsA[ObjectCounter].Records.length + 
				" Source: " + GopherObjectsA[ObjectCounter].Records[0].xSource + 
				" Operator: " + GopherObjectsA[ObjectCounter].Records[0].Operator);
			}
		} else

		//----------------------------------------------------------------------------------------------------------------
		if (GopherObjectsA[ObjectCounter].NewRecordType=="BinaryExpression") //j>10, k+1, "hello "+"world"
		{
			//if (DebugLines) 
			{
				console.log( "\n" +GopherObjectsA[ObjectCounter].NewRecordType);
				console.log( 
				" HelperParentType: " + GopherObjectsA[ObjectCounter].HelperParentType + 
				" HelperParentName: " + GopherObjectsA[ObjectCounter].HelperParentName + 
				" NestedParentType: " + GopherObjectsA[ObjectCounter].NestedParentType + 

				  " Parent Type: " + GopherObjectsA[ObjectCounter].Records[0].ParentType + 
				" Indent: " + GopherObjectsA[ObjectCounter].Records[0].Indent + 
				" Length : " + GopherObjectsA[ObjectCounter].Records.length + 
				" Source: " + GopherObjectsA[ObjectCounter].Records[0].xSource + 
				" Operator: " + GopherObjectsA[ObjectCounter].Records[0].Operator);
			}
			
			//find and list all function calls on the right side
			var RecordCounter = 0;
			var FunctionCalls = [];
			while ( (RecordCounter<GopherObjectsA[ObjectCounter].Records.length-1) )
			{
				RecordCounter++;
				var ObjRef = GopherObjectsA[ObjectCounter].Records[RecordCounter];
				
				if ( (ObjRef.ThisType=="CallExpression") )
				{
					if ( (ObjRef.ParentType=="left") || (ObjRef.ParentType=="right") || (ObjRef.ParentType=="property") || (ObjRef.ParentType=="0") )
					{
						var NewQ = new Object();
						NewQ.xSource = ObjRef.xSource;
						NewQ.xStart = ObjRef.XStartPosition;
						NewQ.xEnd = ObjRef.XEndPosition;
						FunctionCalls.push(NewQ);

						//if (DebugLines) {							
							console.log("        EXT. VAR: "+ObjRef.xSource+ " " + ObjRef.ThisType + " " + ObjRef.ParentType + " " + ObjRef.Indent);
						//}
					}
				}


				if (ObjRef.ThisType=="MemberExpression")
				{
					if ( ( ObjRef.xSource.indexOf("window.") == 0) ||
						  ( ObjRef.xSource.indexOf("parent.") == 0) ||
						  ( ObjRef.xSource.indexOf("document.") == 0) )
					{
						var NewQ = new Object();
						NewQ.xSource = ObjRef.xSource;
						NewQ.xStart = ObjRef.XStartPosition;
						NewQ.xEnd = ObjRef.XEndPosition;
						FunctionCalls.push(NewQ);

						//if (DebugLines) {							
							console.log("        EXT. VAR: "+ObjRef.xSource+ " " + ObjRef.ThisType + " " + ObjRef.ParentType + " " + ObjRef.Indent);
						//}
					}
				}
			}

			//1) insert the _$v[]= in function calls so gopher can know the return of the functions.
			//2) since inserting text into the string positions that are futher ahead will change updeat the start and end positions of those items
			var Tcontents = GopherObjectsA[ObjectCounter].Records[0].xSource;
			for (var zCounter = FunctionCalls.length-1; zCounter>=0; zCounter--)
			{
				GTVarCounter++;

				FunctionCalls[zCounter].xSource = GTVarCounter+"="+FunctionCalls[zCounter].xSource;
				
				var InsertStr = "(_$v["+GTVarCounter+"]=";
				for (var zCounter2 = zCounter-1; zCounter2>=0; zCounter2--)
				{
					if (FunctionCalls[zCounter2].xStart>FunctionCalls[zCounter].xStart) { 
						FunctionCalls[zCounter2].xStart = FunctionCalls[zCounter2].xStart + InsertStr.length + 1;
					}
					if (FunctionCalls[zCounter2].xEnd>FunctionCalls[zCounter].xStart) { 
						FunctionCalls[zCounter2].xEnd = FunctionCalls[zCounter2].xEnd + InsertStr.length + 1;
					}
				}

				var xEnd   = FunctionCalls[zCounter].xEnd-GopherObjectsA[ObjectCounter].Records[1].XStartPosition;
				var xStart = FunctionCalls[zCounter].xStart-GopherObjectsA[ObjectCounter].Records[1].XStartPosition;

				Tcontents = [ Tcontents.slice(0, xEnd), ")", Tcontents.slice(xEnd) ].join('');
				Tcontents = [ Tcontents.slice(0, xStart), InsertStr, Tcontents.slice(xStart) ].join('');

				//console.log("--- "+Tcontents);
			}
			
			var ExtraParams = "";
			for (var zCounter = 0; zCounter<FunctionCalls.length; zCounter++)	{
				ExtraParams = ",'" + escapeSingleQuote(FunctionCalls[zCounter].xSource) + "'" + ExtraParams;
			}

			//function _$evl(xCodeLine, NestedParent, ParentType, StatemetStr, StatemetValue, InnerFunctionCount)
			GopherObjectsA[ObjectCounter].InsertStr = 
			  "_$evl("+GopherObjectsA[ObjectCounter].Records[0].XLine + "," +
			                   "'" + GopherObjectsA[ObjectCounter].NestedParentType + "'," +
									 "'" + GopherObjectsA[ObjectCounter].Records[0].ParentType + "'," +
									 "'" + escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[0].xSource) + "', " +
									 "" + escapeSingleQuote(Tcontents) + ",_$gXLocal, " +
									 (FunctionCalls.length) + ExtraParams + ")";
			
		} else
		
		//----------------------------------------------------------------------------------------------------------------
		//If AssignmentExpression,VariableDeclarator and first operator is =
		if ( (GopherObjectsA[ObjectCounter].NewRecordType=="AssignmentExpression") || //a = 5;
		     (GopherObjectsA[ObjectCounter].NewRecordType=="VariableDeclarator") || //var a = 5;
			  (GopherObjectsA[ObjectCounter].NewRecordType=="LogicalExpression") ) // ((10>5) && (3<4))
		{
			//if (DebugLines) 
			{
				console.log( "\n" +GopherObjectsA[ObjectCounter].NewRecordType);
				console.log( 
				" HelperParentType: " + GopherObjectsA[ObjectCounter].HelperParentType + 
				" HelperParentName: " + GopherObjectsA[ObjectCounter].HelperParentName + 
				" NestedParentType: " + GopherObjectsA[ObjectCounter].NestedParentType + 

				  " Parent Type: " + GopherObjectsA[ObjectCounter].Records[0].ParentType + 
				" Indent: " + GopherObjectsA[ObjectCounter].Records[0].Indent + 
				" Length : " + GopherObjectsA[ObjectCounter].Records.length + 
				" Source: " + GopherObjectsA[ObjectCounter].Records[0].xSource + 
				" Operator: " + GopherObjectsA[ObjectCounter].Records[0].Operator);
			 
				console.log(" Left Var Name: " + GopherObjectsA[ObjectCounter].Records[1].xSource );
			}
			
			//find the right side with the same indent as left
			var RightSideFound = 0;
			var RecordCounter = 1;
			while ( (RightSideFound==0) && (RecordCounter<GopherObjectsA[ObjectCounter].Records.length-1) )
			{
				RecordCounter++;
				if (GopherObjectsA[ObjectCounter].Records[RecordCounter].Indent==GopherObjectsA[ObjectCounter].Records[1].Indent)
				{
					RightSideFound = RecordCounter;
				}
			}
			if (RightSideFound!=0)
			{
				//if (DebugLines) {
					console.log(" Right("+RightSideFound+") Var Name: " + GopherObjectsA[ObjectCounter].Records[RightSideFound].xSource );
				// }
				
				//find and list all function calls on the right side
				var RecordCounter = RightSideFound-1;
				if (GopherObjectsA[ObjectCounter].NewRecordType=="LogicalExpression") //if it is a LogicalExpression then unlike an assignment both Left and Rigth side will be one whole expression
				{
					var RecordCounter = 1;
				}

				var FunctionCalls = [];
				while ( (RecordCounter<GopherObjectsA[ObjectCounter].Records.length-1) )
				{
					RecordCounter++;
					var ObjRef = GopherObjectsA[ObjectCounter].Records[RecordCounter];
					
					if ( (ObjRef.ThisType=="CallExpression") )
					{
						if ( (ObjRef.ParentType=="left") ||(ObjRef.ParentType=="right") ||(ObjRef.ParentType=="property") ||(ObjRef.ParentType=="0") )
						{
							var NewQ = new Object();
							NewQ.xSource = ObjRef.xSource;
							NewQ.xStart = ObjRef.XStartPosition;
							NewQ.xEnd = ObjRef.XEndPosition;
							FunctionCalls.push(NewQ); 

							//if (DebugLines) {							
								console.log("        EXT. VAR: "+ObjRef.xSource+ " " + ObjRef.ThisType + " " + ObjRef.ParentType + " " + ObjRef.Indent);
							//}
						}
					}
					
					
					if (ObjRef.ThisType=="MemberExpression")
					{
						if ( ( ObjRef.xSource.indexOf("window.") == 0) ||
						     ( ObjRef.xSource.indexOf("parent.") == 0) ||
						     ( ObjRef.xSource.indexOf("document.") == 0) )
						{
							var NewQ = new Object();
							NewQ.xSource = ObjRef.xSource;
							NewQ.xStart = ObjRef.XStartPosition;
							NewQ.xEnd = ObjRef.XEndPosition;
							FunctionCalls.push(NewQ); 

							//if (DebugLines) {							
								console.log("        EXT. VAR: "+ObjRef.xSource+ " " + ObjRef.ThisType + " " + ObjRef.ParentType + " " + ObjRef.Indent);
							//}
						}
					}
				}
				
				//1) insert the _$v[]= in function calls so gopher can know the return of the functions.
				//2) since inserting text into the string positions that are futher ahead will change updeat the start and end positions of those items
				//3) if the block is an if statment there is no left = right instead the statment will begin from the first block
				var Tcontents = GopherObjectsA[ObjectCounter].Records[RightSideFound].xSource;
				if (GopherObjectsA[ObjectCounter].HelperParentType=="IfStatement") {
					Tcontents = GopherObjectsA[ObjectCounter].Records[0].xSource;
				}
				for (var zCounter = FunctionCalls.length-1; zCounter>=0; zCounter--)
				{
					GTVarCounter++;
					
					FunctionCalls[zCounter].xSource = ""+GTVarCounter+"="+FunctionCalls[zCounter].xSource;
					
					var InsertStr = "(_$v["+GTVarCounter+"]=";
					for (var zCounter2 = zCounter-1; zCounter2>=0; zCounter2--)
					{
						if (FunctionCalls[zCounter2].xStart>FunctionCalls[zCounter].xStart) { 
							FunctionCalls[zCounter2].xStart = FunctionCalls[zCounter2].xStart + InsertStr.length + 1;
						}
						if (FunctionCalls[zCounter2].xEnd>FunctionCalls[zCounter].xStart) { 
							FunctionCalls[zCounter2].xEnd = FunctionCalls[zCounter2].xEnd + InsertStr.length + 1;
						}
					}

					if (GopherObjectsA[ObjectCounter].HelperParentType=="IfStatement") {
						var xEnd   = FunctionCalls[zCounter].xEnd-GopherObjectsA[ObjectCounter].Records[0].XStartPosition;
						var xStart = FunctionCalls[zCounter].xStart-GopherObjectsA[ObjectCounter].Records[0].XStartPosition;
					} else {
						var xEnd   = FunctionCalls[zCounter].xEnd-GopherObjectsA[ObjectCounter].Records[RightSideFound].XStartPosition;
						var xStart = FunctionCalls[zCounter].xStart-GopherObjectsA[ObjectCounter].Records[RightSideFound].XStartPosition;
					}
					
					Tcontents = [ Tcontents.slice(0, xEnd), ")", Tcontents.slice(xEnd) ].join('');
					Tcontents = [ Tcontents.slice(0, xStart), InsertStr, Tcontents.slice(xStart) ].join('');

					//console.log("--- "+Tcontents);
				}
				var ExtraParams = "";
				for (var zCounter = 0; zCounter<FunctionCalls.length; zCounter++)	{
					ExtraParams = ",'" + escapeSingleQuote(FunctionCalls[zCounter].xSource) + "'" + ExtraParams;
				}
				
				
				
				if (GopherObjectsA[ObjectCounter].HelperParentType=="IfStatement")
				{
					//function _$evl(xCodeLine, NestedParent, ParentType, StatemetStr, StatementValue, InnerFunctionCount)
					GopherObjectsA[ObjectCounter].InsertStr = 
						"_$evl("+GopherObjectsA[ObjectCounter].Records[0].XLine + "," +
											  "'" + GopherObjectsA[ObjectCounter].NestedParentType + "'," +
											  "'" + GopherObjectsA[ObjectCounter].Records[0].ParentType + "'," +
											  "'" + escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[0].xSource) + "', " +
											  "" + escapeSingleQuote(Tcontents) + ",_$gXLocal, " +
											  (FunctionCalls.length) + ExtraParams + ")";
				} else
				{
					//function _$set(xCodeLine, NestedParent, ParentType, LeftSideStr, LeftSideValue, RightSideStr, RightSideValue, Operator, InnerFunctionCount)
					GopherObjectsA[ObjectCounter].InsertStr = 
					  GopherObjectsA[ObjectCounter].Records[1].xSource + " = " + 
					  "_$set("+GopherObjectsA[ObjectCounter].Records[0].XLine + "," +
										"'" + GopherObjectsA[ObjectCounter].NestedParentType + "'," +
										"'" + GopherObjectsA[ObjectCounter].Records[0].ParentType + "'," +
										"'" + escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[1].xSource) + "'," +
										escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[1].xSource) + "," +
										"'" + escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[RightSideFound].xSource) + "'," + 
										"" + escapeSingleQuote(Tcontents) + "," + 
										"'" + GopherObjectsA[ObjectCounter].Records[0].Operator + "',_$gXLocal," + 
										(FunctionCalls.length) + ExtraParams + ")";
				}
			}
		}
	}

	//change the code with InsertStr
	for (var ObjectCounter=GopherObjectsA.length-1; ObjectCounter >= 0; ObjectCounter--)
	{
		if ( (GopherObjectsA[ObjectCounter].InsertStr!="") && (GopherObjectsA[ObjectCounter].CopyStart>0) && (GopherObjectsA[ObjectCounter].CopyEnd>0) )
		{
			//console.log( GopherObjectsA[i].InsertStr + "\n"   );
			contents = [contents.slice(0, GopherObjectsA[ObjectCounter].CopyStart), GopherObjectsA[ObjectCounter].InsertStr, 	contents.slice(GopherObjectsA[ObjectCounter].CopyEnd)].join('');
		}
	}
	
	return contents;
}



//------------------------------------------------------------------------------------------------------------------------------
function AddFunctionTracking(contents)
{
	//******** Reparse Source
	var options = {};
	options.locations = true; 
	
	var DataList = [];
	var parsed = acorn.parse(contents, options); 
	Object.keys(parsed).forEach(function(key) {  
		DataList = recurseJSON(key, parsed[key],0,DataList, "p", "", 0);
	});
	
	//1) Loop All Function Declerations 
	//2) add tracking to begining 
	//3) add tracking to ending


	var FunctionsList = [];
	for (var C1=0; C1<DataList.length;C1++)
	{
		if ((DataList[C1].XSelf=="type") && ( (DataList[C1].XValue=="FunctionDeclaration") || (DataList[C1].XValue=="FunctionExpression")) )
		{
			
			
			//find ID
			var FunctionID = "";
			
			if (DataList[C1].XValue=="FunctionExpression") {
				//go backwards find first name
				var C2 =C1;
				while ( (C2>0) &&	!(DataList[C2].XSelf=="name")) {
					C2--;
				}
				if (C2>0) {
					FunctionID = "FunctionExpression:"+DataList[C2].XValue;
				}
			} else
			{
				//if FunctionDeclaration
				while ( (C1<DataList.length) &&
						!(DataList[C1].XSelf=="name") )
				{
					C1++;
				}
				if (C1<DataList.length) {
					FunctionID = "FunctionDeclaration:"+DataList[C1].XValue;
				}
			}
			
			//find params
			var FunctionParams = "";
			//if FunctionDeclaration
			while ( (C1<DataList.length) &&
					!(DataList[C1].XSelf=="body") )
			{
				C1++;
				
				if (DataList[C1].XSelf=="name") { 
					if (FunctionParams != "") { FunctionParams += ",";}
					FunctionParams += DataList[C1].XValue; 
				}
			}
			
			var CopyStart=0;
			var CopyEnd=0;
			
			while ( (C1<DataList.length) &&
			      !((DataList[C1].XSelf=="type") && (DataList[C1].XValue=="BlockStatement") ) )
			{
				C1++;
			}

			while ( ( (CopyStart==0) || (CopyEnd==0) ) && (C1<DataList.length) )
			{
				C1++;
				if (DataList[C1].XSelf=="start") { CopyStart = parseInt(DataList[C1].XValue,10); }
				if (DataList[C1].XSelf=="end") { CopyEnd = parseInt(DataList[C1].XValue,10); }
			}
			
			if ( (CopyStart>0) && (CopyEnd>CopyStart) )
			{
				var NewQ = new Object();
				NewQ.CopyEnd = CopyEnd;
				NewQ.CopyStart = CopyStart;
				NewQ.FunctionID = FunctionID;
				NewQ.FunctionParams = FunctionParams;
				
//				NewQ.XSource = contents.slice( CopyStart  , CopyEnd ).toString();
				FunctionsList.push( NewQ );
				console.log( contents.slice( CopyStart  , CopyEnd ).toString() );
				console.log("-----------");
			}
		}
	}
	for (var ObjectCounter=FunctionsList.length-1; ObjectCounter >= 0; ObjectCounter--)
	{
		var StartStr = "_$gX++; var _$gXLocal = _$gX; _$fs(0,'"+ FunctionsList[ObjectCounter].FunctionID + "','"+FunctionsList[ObjectCounter].FunctionParams+"',_$gXLocal); ";
		var EndStr = "_$fe(0,'"+ FunctionsList[ObjectCounter].FunctionID + "',_$gXLocal); ";
		
		contents = [contents.slice(0, FunctionsList[ObjectCounter].CopyStart+1), StartStr, 	contents.slice(FunctionsList[ObjectCounter].CopyStart+1)].join('');
		contents = [contents.slice(0, FunctionsList[ObjectCounter].CopyEnd+StartStr.length-1), EndStr, 	contents.slice(FunctionsList[ObjectCounter].CopyEnd+StartStr.length-1)].join('');
		
		for (var ObjectCounter2=ObjectCounter-1; ObjectCounter2 >= 0; ObjectCounter2--)
		{
			if (FunctionsList[ObjectCounter2].CopyStart>FunctionsList[ObjectCounter].CopyStart){ 
				FunctionsList[ObjectCounter2].CopyStart = FunctionsList[ObjectCounter2].CopyStart + StartStr.length;
			}
			
			if (FunctionsList[ObjectCounter2].CopyStart>FunctionsList[ObjectCounter].CopyEnd){ 
				FunctionsList[ObjectCounter2].CopyStart = FunctionsList[ObjectCounter2].CopyStart + EndStr.length;
			}

			if (FunctionsList[ObjectCounter2].CopyEnd>FunctionsList[ObjectCounter].CopyStart){ 
				FunctionsList[ObjectCounter2].CopyEnd = FunctionsList[ObjectCounter2].CopyEnd + StartStr.length;
			}

			if (FunctionsList[ObjectCounter2].CopyEnd>FunctionsList[ObjectCounter].CopyEnd){ 
				FunctionsList[ObjectCounter2].CopyEnd = FunctionsList[ObjectCounter2].CopyEnd + EndStr.length;
			}
			
			
			
//			if (FunctionsList[ObjectCounter2].CopyEnd>FunctionsList[ObjectCounter].CopyStart){ 
//				FunctionsList[ObjectCounter].CopyStart = FunctionsList[ObjectCounter].CopyStart + StartStr.length;
//			}
		}
	}

	return contents;
}	



//----------------------------------------------------------------------------------------
function GopherTellify(contents,inFile)
{
	var DebugLines = false;
	var TempVarStr = "";

	var options = {};
	options.locations = true; 
	
	//******** Reparse Source for the first time
	var DataList = [];
	var parsed = acorn.parse(contents, options); 
	MakeJSONTreeFromJS(parsed,inFile);
	Object.keys(parsed).forEach(function(key) {  
		DataList = recurseJSON(key, parsed[key],0,DataList, "p", "", 0);
	});
	//********

	var jj = DataList.length;
	if (jj>3000) { jj=3000;}
	for (var i=0; i<jj; i++) {
		console.log(DataList[i].XIndent+" "+ DataList[i].XID+" "+ DataList[i].XParentID + "." + DataList[i].XPath + " " + DataList[i].XParentNode+"   "+ DataList[i].XSelf+" = "+ DataList[i].XValue);
	}

	contents = AddCurly2IFs(contents);
	contents = AddCurly2LOOPs(contents);
	contents = AddVariableTracking(contents);
	contents = AddFunctionTracking(contents);
	
	
	
	
	
	// **** IN RealTimeConsole_Temps.JS REF #001
  
	//========================================
	//Insert the gohper callback fuctions and socket.io setup
	if (TempVarStr!="")
	{
		contents = "var " + TempVarStr + "\n" + contents;
	}

	return contents;
}


function GopherTellFile(inFile)
{
	var InsertContent = fs.readFileSync(__dirname + '/GopherBInsert.js');
	
	fs.readFile(inFile,function(err,contents){
		if(!err){
			contents = GopherTellify(contents,inFile);
			fs.writeFile(inFile.replace(".js","-gopher.js"),beautify(InsertContent+contents, { indent_size: 4 }));
		}
	});
}

GopherTellFile(__dirname + '/liveparser-root/js/app.js');

// **** IN RealTimeConsole.JS REF #002
