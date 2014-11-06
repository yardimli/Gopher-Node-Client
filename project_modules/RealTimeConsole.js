var Globals = require("../project_modules/Globals.js"); 
var util = require('util');

var SocketIOHandle;


//----------------------------------------------------------------------------------------
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


//----------------------------------------------------------------------------------------
function MakeJSONTreeFromJS(parsed,filePath)
{
	var TreeHTML2;

	//console.log(JSON.stringify(parsed, null, compact ? null : 2));

	TreeHTML2 = "<ul>";
	Object.keys(parsed).forEach(function(key) {  TreeHTML2 = recurse(TreeHTML2, key, parsed[key] ); } );
	TreeHTML2 += "</ul>";

	Globals.fs.writeFile(filePath.replace(".js","-gopher.html"),TreeHTML2);
// TODO: escape characters that will break the conversion from JSON to XML
//						parsed = parsed.replace(/</g,'&lt;');
//						parsed = parsed.replace(/>/g,'&gt;');
	
}


//----------------------------------------------------------------------------------------
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


//----------------------------------------------------------------------------------------
function LoopGopherS(DataListSource,SourceCode,  IncludeBlocks,  LoopGopherSDebug)
{
	IncludeBlocks = (typeof IncludeBlocks === "undefined") ? false : IncludeBlocks;
	LoopGopherSDebug = (typeof LoopGopherSDebug === "undefined") ? false : LoopGopherSDebug;
	var XStartIndent = 0;
	var NewRecordType = "";
	
	GopherObjectsA = [];
	
	 //For Debugging JSON to Array Fuction
	 /*
	for (var i=0; i<500; i++) {
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
			if (LoopGopherSDebug) console.log("--------------- END --------------- "); XStartIndent = 0;
		}

		if ( (FirstKey=="type")
		&& ( (FirstType == "VariableDeclarator") || 
			  (FirstType == "AssignmentExpression") ||
			  (FirstType == "UnaryExpression") ||

			  (FirstType == "ForStatement") ||
			  (FirstType == "BlockStatement") ||
			  (FirstType == "VariableDeclaration") ||
			  (FirstType == "ExpressionStatement") ||
			  (FirstType == "SequenceExpression") ||
			  (FirstType == "ReturnStatement") ||
			  (FirstType == "FunctionDeclaration") ||
			  (FirstType == "ObjectExpression") ||
			  (FirstType == "ForInStatement") ||
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
					((FirstType == "BlockStatement") && (!IncludeBlocks)) ||
					(FirstType == "VariableDeclaration") ||
					((FirstType == "ExpressionStatement") && (!IncludeBlocks)) ||
					(FirstType == "SequenceExpression") ||
					(FirstType == "FunctionDeclaration") ||
					(FirstType == "IfStatement") ||
					(FirstType == "ForInStatement") )
			{
				if (LoopGopherSDebug) console.log(CalleLine+": "+xstr+FirstType);
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
						if (LoopGopherSDebug) console.log("--------------- START BLOCK --------------- "); 
						NewRecordType = "ExpressionStatement";
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
						NewQParent.HelperParentStart = HelperParentStart;
						NewQParent.HelperParentEnd = HelperParentEnd;
						
						NewQParent.HelperParentName = HelperParentName;
						
						
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


function IFArrayCompare(a,b) {
  if (a.AddPosition < b.AddPosition)
     return -1;
  if (a.AddPosition > b.AddPosition)
    return 1;
  return 0;
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
	var GopherObjectsA = [];
	var parsed = Globals.acorn.parse(contents, options); 
	MakeJSONTreeFromJS(parsed,inFile);
	Object.keys(parsed).forEach(function(key) {  
		DataList = recurseJSON(key, parsed[key],0,DataList, "p", "", 0);
	});
	GopherObjectsA = LoopGopherS(DataList,contents,false,true);
	//********

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
			contents = [contents.slice(0, ExpressionStatementList[ObjectCounter].CopyStart), "{\n" + ExpressionStatementList[ObjectCounter].XSource + "\n}", 	contents.slice(ExpressionStatementList[ObjectCounter].CopyEnd)].join('');
	}
	
	
	//******** Reparse Source since it was changed
	var DataList = [];
	var GopherObjectsA = [];
	var parsed = Globals.acorn.parse(contents, options); 
	Object.keys(parsed).forEach(function(key) {  
		DataList = recurseJSON(key, parsed[key],0,DataList, "p", "", 0);
	});
	GopherObjectsA = LoopGopherS(DataList,contents,false,false);
	//********
	
	
	//Loop All IF statements and move the IF statement to a variable then use the variable in the IF
	var ContentToAdd = [];
	var TempVarCounter = 0;
	var IfGroupVariableBlock = "";
	for (var ObjectCounter=GopherObjectsA.length-1; ObjectCounter >= 0; ObjectCounter--)
	{
		if ( ( (GopherObjectsA[ObjectCounter].NewRecordType=="LogicalExpression") || (GopherObjectsA[ObjectCounter].NewRecordType=="BinaryExpression"))  
			  && (GopherObjectsA[ObjectCounter].HelperParentType=="IfStatement") )
		{
			console.log("IF Parent:"+GopherObjectsA[ObjectCounter].HelperParentType+"  --  "+GopherObjectsA[ObjectCounter].HelperParentName);
			console.log("IF: "+GopherObjectsA[ObjectCounter].Records[0].xSource+"  -- "+GopherObjectsA[ObjectCounter].HelperParentStart+" -- "+GopherObjectsA[ObjectCounter].Records[0].Indent);

			TempVarCounter++;

			IfGroupVariableBlock = "TempIfVar_"+TempVarCounter +" = "  + GopherObjectsA[ObjectCounter].Records[0].xSource +";\n";
			
			var NewQ = new Object();
			NewQ.AddPosition = GopherObjectsA[ObjectCounter].CopyStart;
			NewQ.AddEnd = GopherObjectsA[ObjectCounter].CopyEnd;
			NewQ.AddString = "TempIfVar_"+TempVarCounter;
			ContentToAdd.push( NewQ );
			
			if (GopherObjectsA[ObjectCounter].HelperParentName!="alternate")
			{
				var NewQ = new Object();
				NewQ.AddPosition = GopherObjectsA[ObjectCounter].HelperParentStart;
				NewQ.AddEnd = 0;
				NewQ.AddString = IfGroupVariableBlock;
				ContentToAdd.push( NewQ );
			} else
			{
				//find parent if, that is the if that is not an alternate and startindent is bellow the current alternate (else) if statment
				for (var ObjectCounter2=ObjectCounter; ObjectCounter2 >= 0; ObjectCounter2--)
				{
					if ( GopherObjectsA[ ObjectCounter2 ].StartIndent < GopherObjectsA[ ObjectCounter ].StartIndent )
					{
						if ( ( (GopherObjectsA[ObjectCounter2].NewRecordType=="LogicalExpression") || (GopherObjectsA[ObjectCounter2].NewRecordType=="BinaryExpression"))  
							  && (GopherObjectsA[ObjectCounter2].HelperParentType=="IfStatement") && (GopherObjectsA[ObjectCounter2].HelperParentName!="alternate") )
						{
							var NewQ = new Object();
							NewQ.AddPosition = GopherObjectsA[ObjectCounter2].HelperParentStart;
							NewQ.AddEnd = 0;
							NewQ.AddString = IfGroupVariableBlock;
							ContentToAdd.push( NewQ );
							ObjectCounter2 = 0;
						}
					}
				}
			}
		}
	}
	
	//sort the content to add IF statements array, then reverse order add the strings
	ContentToAdd = ContentToAdd.sort(IFArrayCompare);
	for (var ObjectCounter=ContentToAdd.length-1; ObjectCounter >= 0; ObjectCounter--)
	{
		if (ContentToAdd[ObjectCounter].AddEnd==0)
		{
			contents = [contents.slice(0, ContentToAdd[ObjectCounter].AddPosition), ContentToAdd[ObjectCounter].AddString, 	contents.slice(ContentToAdd[ObjectCounter].AddPosition)].join('');
			
		} else
		{
			contents = [contents.slice(0, ContentToAdd[ObjectCounter].AddPosition), ContentToAdd[ObjectCounter].AddString, 	contents.slice(ContentToAdd[ObjectCounter].AddEnd)].join('');
		}
	}
//	console.log(contents);
	

	//******** Reparse Source since it was changed
	var DataList = [];
	var GopherObjectsA = [];
	var parsed = Globals.acorn.parse(contents, options); 
	Object.keys(parsed).forEach(function(key) {  
		DataList = recurseJSON(key, parsed[key],0,DataList, "p", "", 0);
	});
	GopherObjectsA = LoopGopherS(DataList,contents,false,false);
	//********

	//Loop all Variable Expressions and convert them to multiline statements
	for (var ObjectCounter=0; ObjectCounter < GopherObjectsA.length; ObjectCounter++)
	{
		if ( (GopherObjectsA[ObjectCounter].NewRecordType=="UpdateExpression")  )
		{
			//first print to screen
			if (DebugLines) {
				console.log( "\nUPDATE: " + GopherObjectsA[ObjectCounter].NewRecordType + 
				" Source: " + GopherObjectsA[ObjectCounter].Records[0].xSource + 
				" Var Name: " + GopherObjectsA[ObjectCounter].Records[1].xSource + " Op:" + GopherObjectsA[ObjectCounter].Records[0].Operator + " Prefix: "+ GopherObjectsA[ObjectCounter].Records[0].Prefix );
			}
			
			GopherObjectsA[ObjectCounter].InsertStr = "(tempVar = "+GopherObjectsA[ObjectCounter].Records[1].xSource+", " + 
			               GopherObjectsA[ObjectCounter].Records[1].xSource + "= GopherSetF('" + Globals.escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[1].xSource) + "','" + Globals.escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[0].xSource) + "',"+GopherObjectsA[ObjectCounter].Records[1].xSource+",'" + GopherObjectsA[ObjectCounter].Records[0].Operator + "',false,'"+ GopherObjectsA[ObjectCounter].Records[0].Prefix +"'), tempVar)";
						   
			if (DebugLines) {
				console.log( GopherObjectsA[ObjectCounter].InsertStr + "\n"   );
			}
		}
		
		//If AssignmentExpression,VariableDeclarator and first operator is =
		if ( (GopherObjectsA[ObjectCounter].NewRecordType=="AssignmentExpression") || 
		     (GopherObjectsA[ObjectCounter].NewRecordType=="VariableDeclarator") || 
			  (GopherObjectsA[ObjectCounter].NewRecordType=="LogicalExpression") )
		{
			//first print to screen
			if (DebugLines) {
				console.log( "\n" +GopherObjectsA[ObjectCounter].NewRecordType + 
				" Source: " + GopherObjectsA[ObjectCounter].Records[0].xSource + 
				" Var Name: " + GopherObjectsA[ObjectCounter].Records[1].xSource + " " + GopherObjectsA[ObjectCounter].Records[0].Operator);
			}
			
			for (var j=2; j < GopherObjectsA[ObjectCounter].Records.length; j++)
			{
				var xstr = "";
				for (var i2=0; i2<GopherObjectsA[ObjectCounter].Records[j].Indent; i2++) { xstr += " "; }

				if (DebugLines) {
					console.log( " ID/Pa: "+ Globals.PadLeft(GopherObjectsA[ObjectCounter].Records[j].xID,4) + " / "+ Globals.PadLeft(GopherObjectsA[ObjectCounter].Records[j].ParentID,4) + " :" + GopherObjectsA[ObjectCounter].Records[j].XLine + xstr +
					  " I: " + (GopherObjectsA[ObjectCounter].Records[j].Indent-GopherObjectsA[ObjectCounter].StartIndent ) + 
					  " Source: "+ GopherObjectsA[ObjectCounter].Records[j].xSource +
					  " Op: "+ GopherObjectsA[ObjectCounter].Records[j].Operator +
					  " Children: " + GopherObjectsA[ObjectCounter].Records[j].HasChildren +
					  " Type:" + GopherObjectsA[ObjectCounter].Records[j].ThisType 
					);
				}
			}
			
			
			var TheCowsAreAway = true;
			var k = 0;
			var TempC = 0;
			while (TheCowsAreAway)
			{
				TheCowsAreAway = false;
				NodeWithouChildFound = false;
				NodeWithouChildID = 0;
				NodeWithouChildIndent = 0;
				//find nodes without children where NewQ.Processed = false
				for (var j=2; j < GopherObjectsA[ObjectCounter].Records.length; j++)
				{
					//if variable is a fuction ignore all children
					if (GopherObjectsA[ObjectCounter].Records[j].ThisType=="CallExpression") 
					{
						GopherObjectsA[ObjectCounter].Records[j].HasChildren = false;
						var j2 = j+1;
						
						while ( ( GopherObjectsA[ObjectCounter].Records[j2].Indent>GopherObjectsA[ObjectCounter].Records[j].Indent ) && (j2 < GopherObjectsA[ObjectCounter].Records.length-1))
						{
							GopherObjectsA[ObjectCounter].Records[j2].Processed = true;
							j2++;
						}
					}
					
					//find node without children, also make sure to find node with the highenst indent
					if ( (!GopherObjectsA[ObjectCounter].Records[j].HasChildren) && (!GopherObjectsA[ObjectCounter].Records[j].Processed) )
					{
						if (GopherObjectsA[ObjectCounter].Records[j].Indent>NodeWithouChildIndent)
						{
							NodeWithouChildFound = true;
							NodeWithouChildIndent = GopherObjectsA[ObjectCounter].Records[j].Indent;
							NodeWithouChildID = j;
						}
						
					}
				}
				
				if (NodeWithouChildFound)
				{
					//if (parent is the previous node then)
					if (GopherObjectsA[ObjectCounter].Records[NodeWithouChildID-1].xID==GopherObjectsA[ObjectCounter].Records[NodeWithouChildID].ParentID)
					{
						var LeftRightC = 0;
						var LeftV = "null";
						var RightV = "null";
						var LeftC = "";
						var RightC = "";
						for (var j2=NodeWithouChildID; j2 < GopherObjectsA[ObjectCounter].Records.length; j2++)
						{
							if ( (GopherObjectsA[ObjectCounter].Records[j2].ParentID==GopherObjectsA[ObjectCounter].Records[NodeWithouChildID-1].xID) && (LeftRightC<2))
							{
								LeftRightC++;
								if (LeftRightC==1) { LeftV = GopherObjectsA[ObjectCounter].Records[j2].TempVarName; LeftC = GopherObjectsA[ObjectCounter].Records[j2].xSource; }
								if (LeftRightC==2) { RightV = GopherObjectsA[ObjectCounter].Records[j2].TempVarName; RightC = GopherObjectsA[ObjectCounter].Records[j2].xSource; }

								TheCowsAreAway = true;
								GopherObjectsA[ObjectCounter].Records[j2].Processed = true;
							}
						}

						TempC++;
						
						if (TempVarStr!="") { TempVarStr += ", "; }
						TempVarStr += "Temp_" + ObjectCounter + "_" + TempC;

						GopherObjectsA[ObjectCounter].InsertStr = GopherObjectsA[ObjectCounter].InsertStr + "Temp_" + ObjectCounter + "_" + TempC + " = GopherHelperF('" + GopherObjectsA[ObjectCounter].Records[NodeWithouChildID-1].Operator + "'," + LeftV + "," + RightV + ",'Temp_" + ObjectCounter + "_" + TempC+"','" + Globals.escapeSingleQuote(LeftC) + "','" + Globals.escapeSingleQuote(RightC) + "');\n";
						
						if (DebugLines) {
							console.log("Temp_" + TempC + " = GopherHelperF('" + GopherObjectsA[ObjectCounter].Records[NodeWithouChildID-1].Operator + "'," + LeftV + "," + RightV + ",'Temp_" + TempC+"','" + Globals.escapeSingleQuote(LeftC) + "','" + Globals.escapeSingleQuote(RightC) + "');");
						}

						//set parent to childless and update its tempvarname 
						GopherObjectsA[ObjectCounter].Records[NodeWithouChildID-1].TempVarName = "Temp_" + ObjectCounter + "_" + TempC;
						GopherObjectsA[ObjectCounter].Records[NodeWithouChildID-1].HasChildren=false;
					}
				}

				k++;
				if (k>100) { TheCowsAreAway = false; }
			}
			var xPrefix = "";
			if (GopherObjectsA[ObjectCounter].NewRecordType=="VariableDeclarator") { xPrefix = "var ";}
			
			if (TempC==0)
			{
				var xSource = "null";
				if (GopherObjectsA[ObjectCounter].Records.length>2) { xSource = GopherObjectsA[ObjectCounter].Records[2].xSource; }

				//GopherHelperF( Operator, LeftVal, RightVal, TempName, LeftValStr, RightVarStr)				
				//var = GopherSetF( VarName, CommandLine, Value, Operator, UseTempVars, Prefix)
				
				if ( (GopherObjectsA[ObjectCounter].NewRecordType=="VariableDeclarator") ) { xPrefix = "";}

				GopherObjectsA[ObjectCounter].InsertStr = GopherObjectsA[ObjectCounter].InsertStr + 
					xPrefix + GopherObjectsA[ObjectCounter].Records[1].xSource + " = GopherSetF('" + Globals.escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[1].xSource) + "','" + Globals.escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[0].xSource) + "'," + xSource + ",'" + GopherObjectsA[ObjectCounter].Records[0].Operator + "',false,'"+ GopherObjectsA[ObjectCounter].Records[0].Prefix +"')";
				 
				 
				//console.log( GopherObjectsA[ObjectCounter].InsertStr + "\n"   );
			} else
			{
				GopherObjectsA[ObjectCounter].InsertStr = GopherObjectsA[ObjectCounter].InsertStr + 
					xPrefix + GopherObjectsA[ObjectCounter].Records[1].xSource + " = GopherSetF('" + Globals.escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[1].xSource) + "','" + Globals.escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[0].xSource) + "',Temp_" + ObjectCounter + "_" + TempC + ",'" + GopherObjectsA[ObjectCounter].Records[0].Operator + "',true,'"+ GopherObjectsA[ObjectCounter].Records[0].Prefix +"')";
				
				//console.log( GopherObjectsA[ObjectCounter].InsertStr + "\n"   );
			}
		}
	}
	
	for (var ObjectCounter=GopherObjectsA.length-1; ObjectCounter >= 0; ObjectCounter--)
	{
		if ( (GopherObjectsA[ObjectCounter].InsertStr!="") && (GopherObjectsA[ObjectCounter].CopyStart>0) && (GopherObjectsA[ObjectCounter].CopyEnd>0) )
		{
			//console.log( GopherObjectsA[i].InsertStr + "\n"   );
			contents = [contents.slice(0, GopherObjectsA[ObjectCounter].CopyStart), GopherObjectsA[ObjectCounter].InsertStr, 	contents.slice(GopherObjectsA[ObjectCounter].CopyEnd)].join('');
		}
	}
	// **** IN RealTimeConsole_Temps.JS REF #001
  
	//========================================
	//Insert the gohper callback fuctions and socket.io setup
	contents =	"//GopherB node Socket setup \n"+
	"var iosocket;\n"+
	"iosocket = io.connect();\n"+
	"iosocket.emit('HiGopherB','');\n"+
	"iosocket.emit('HiClientServer','');\n"+
	"\n\n" +
	"var GopherCallerIDCouter = 100;\n"+
	"var GopherCallerID = '0:0';\n"+


	"function GopherTell(xCodeLine, xGopherMsg, xParentID, xGopherCallerID) {\n" +
	" iosocket.emit( 'Gopher.Tell', {CodeLine:xCodeLine, GopherMsg:xGopherMsg, ParentID:xParentID, GopherCallerID:xGopherCallerID } );\n"+
	"}\n\n"+

	"//------------------------------------------------------------------------------\n"+
	"function GopherUnaryExpr(xCodeLine, xVarStr, xVarValue) {\n" +
	" xVarValue = !xVarValue;\n" +
	" iosocket.emit( 'Gopher.GopherUnaryExp', {CodeLine:xCodeLine, VarStr:xVarStr, VarValue:xVarValue, } );\n"+
	" return xVarValue;\n"+
	"}\n\n"+

	"//------------------------------------------------------------------------------\n"+
	"function GopherUpdateExpr(xCodeLine, xVarName, xVarValue, xVarOperator, xParentID, xGopherCallerID ) {\n" +
	" iosocket.emit( 'Gopher.GopherUpdateExp', {CodeLine:xCodeLine, VarName:xVarName, VarValue:xVarValue, VarOperator:xVarOperator,  ParentID:xParentID, GopherCallerID:xGopherCallerID } );\n"+
	"}\n\n"+

	"//------------------------------------------------------------------------------\n"+
	"function GopherVarDecl(xCodeLine, xVarDeclTrackID, xVarName, xVarValue, xVarStr, xParentID, xGopherCallerID ) {\n" +
	" iosocket.emit( 'Gopher.VarDecl', {CodeLine:xCodeLine, VarDeclTrackID:xVarDeclTrackID, VarName:xVarName, VarValue:xVarValue, VarStr:xVarStr, ParentID:xParentID, GopherCallerID:xGopherCallerID } );\n"+
	"return xVarValue;\n"+
	"}\n\n"+

	"//------------------------------------------------------------------------------\n"+
	"function GopherAssignment(xCodeLine, xVarDeclTrackID, xVarName, xVarValue, xVarStr, xParentID, xGopherCallerID, xVarOperator, VarOperator ) {\n" +
	" iosocket.emit( 'Gopher.GopherAssignment', {CodeLine:xCodeLine, VarDeclTrackID:xVarDeclTrackID, VarName:xVarName, VarValue:xVarValue, VarStr:xVarStr, ParentID:xParentID, GopherCallerID:xGopherCallerID, VarOperator:xVarOperator } );\n"+
	"return xVarValue;\n"+
	"}\n\n"+

	"//------------------------------------------------------------------------------\n"+
	"function GopherFunctionCall(xCodeLine, xFuncTrackID, xFuncStr, xFuncValue, xParentID, xGopherCallerID) {\n" +
	" iosocket.emit( 'Gopher.FuncCall', {CodeLine:xCodeLine, FuncTrackID:xFuncTrackID, VarStr:xFuncStr, FuncValue:xFuncValue, ParentID:xParentID, GopherCallerID:xGopherCallerID } );\n"+
	"return xFuncValue;\n"+
	"}\n\n"+
	
	"//------------------------------------------------------------------------------\n"+
	"function GopherHelperF( Operator, LeftVal, RightVal, TempName, LeftValStr, RightVarStr) {\n" +
	"	var OutPut = '';\n" +
	"  if (Operator=='+') {  OutPut = LeftVal + RightVal; }\n" +
	"  if (Operator=='*') {  OutPut = LeftVal * RightVal; }\n" +
	"  if (Operator=='-') {  OutPut = LeftVal - RightVal; }\n" +
	"  if (Operator=='==') {  OutPut = LeftVal == RightVal; }\n" +
	"  if (Operator=='>') {  OutPut = LeftVal > RightVal; }\n" +
	"  if (Operator=='<') {  OutPut = LeftVal < RightVal; }\n" +
	"  if (Operator=='>=') {  OutPut = LeftVal >= RightVal; }\n" +
	"  if (Operator=='<=') {  OutPut = LeftVal <= RightVal; }\n" +
	"  if (Operator=='&&') {  OutPut = LeftVal && RightVal; }\n" +
	"  if (Operator=='||') {  OutPut = LeftVal || RightVal; }\n" +
	"	return OutPut;\n"+
	"}\n\n"+

	"//------------------------------------------------------------------------------\n"+
	"function GopherSetF( VarName, CommandLine, Value, Operator, UseTempVars, Prefix) {\n" +
	"	var OutPut = Value;\n" +
	"  if (Operator=='++') {  OutPut = Value+1; }\n" +
	"	return OutPut;\n"+
	"}\n\n"+


	"//------------------------------------------------------------------------------\n"+
	"\n"+
	
	"var "+TempVarStr+";\n\n"+
	"//------------------------------------------------------------------------------\n"+
	"\n\n"+
 
	contents;
 
	return contents;
}


function GopherTellFile(inFile)
{
	Globals.fs.readFile(inFile,function(err,contents){
		if(!err){
			contents = GopherTellify(contents,inFile);
			Globals.fs.writeFile(inFile.replace(".js","-gopher.js"),Globals.beautify(contents, { indent_size: 4 }));
		}
	});
}

GopherTellFile(__dirname + '/../liveparser-root/js/app.js');

// **** IN RealTimeConsole.JS REF #002


	
this.getFile = function(request, response){
	
	var	localFolder = __dirname + '/..';
	
	localFolder = localFolder.replace(/\\/g,'/');
	
	var	page404 = localFolder + '/admin/404.html';
	
	var fileName = request.url;
	if ((request.url=="/admin") || (request.url=="/admin/")) { 
		fileName = '/admin/index.html'; 
	}
	
	
	var ext = Globals.path.extname(fileName);
	var mimeType = Globals.extensions[ext];

	//do we support the requested file type?
	if(!Globals.extensions[ext]){
		//for now just send a 404 and a short message
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.end("<html><head></head><body>The requested file type is not supported</body></html>");
	};
	
	
	var filePath = localFolder+fileName;

	//console.log("file:"+fileName+" url:"+request.url+" ext:"+ext+" filePath:"+filePath);
	
	//does the requested file exist?
    Globals.fs.exists(filePath,function(exists){
        //if it does...
        if(exists){
            //read the fiule, run the anonymous function
            Globals.fs.readFile(filePath,function(err,contents){
                if(!err){
                    //if there was no error
                    //send the contents with the default 200/ok header
                    response.writeHead(200,{
                        "Content-type" : mimeType,
                        "Content-Length" : contents.length
                    });
                    response.end(contents);
                } else {
                    //for our own troubleshooting
                    console.dir(err);
                };
            });
        } else {
            //if the requested file was not found
            //serve-up our custom 404 page
            Globals.fs.readFile(page404,function(err,contents){
                //if there was no error
                if(!err){
                    //send the contents with a 404/not found header 
                    response.writeHead(404, {'Content-Type': 'text/html'});
                    response.end(contents);
                } else {
                    //for our own troubleshooting
                    console.dir(err);
                };
            });
        };
    });
};

this.InitLocalSocket = function(socket){

	// console.log("Call binding Real Time Console socket");

	SocketIOHandle = socket; // store socket so we can use it in the rest of the module
	
	socket.on('HiAdmin', function(data) {
		console.log("HiAdmin called from client: "+socket.id);
		
		Globals.socketServer.sockets.in("room1").emit('HiAdminClient', { text:"this is from Gopher Admin Server"});
	});

	socket.on('Gopher.Tell', function(data) {
//		console.log(data);
		Globals.socketServer.sockets.in("room1").emit('ConsoleTell', { text:"L:"+data.CodeLine+" C:"+data.GopherCallerID +": "+data.GopherMsg+", <b>parent:</b>"+data.ParentID });
	});

	socket.on('Gopher.GopherUnaryExp', function(data) {
//		console.log(data);
		Globals.socketServer.sockets.in("room1").emit('ConsoleTell', { text:"L:" + data.CodeLine + " C:0:0: <b>UNARY</b>:" + data.VarStr + " set to: " + data.VarValue });
	});

	socket.on('Gopher.VarDecl', function(data) {
//		console.log(data);
		Globals.socketServer.sockets.in("room1").emit('ConsoleTell', { text:"L:"+data.CodeLine+" C:"+data.GopherCallerID +": <b>Var "+ data.VarName+"</b> set to <b>"+data.VarValue+"</b>, ("+data.VarStr+") <b>parent:</b>"+data.ParentID });
	});	
	
	socket.on('Gopher.GopherAssignment', function(data) {
//		console.log(data);
		Globals.socketServer.sockets.in("room1").emit('ConsoleTell', { text:"L:"+data.CodeLine+" C:"+data.GopherCallerID +": <b>Assignment("+ data.VarOperator +") "+ data.VarName+"</b> set to <b>"+data.VarValue+"</b>, ("+data.VarStr+") <b>parent:</b>"+data.ParentID });
	});	
	
	
	socket.on('Gopher.GopherUpdateExp', function(data) {
//		console.log(data);
		Globals.socketServer.sockets.in("room1").emit('ConsoleTell', { text:"L:"+data.CodeLine+" C:"+data.GopherCallerID +": <b>Update("+ data.VarOperator +") "+ data.VarName+"</b> set to <b>"+data.VarValue+"</b> <b>parent:</b>"+data.ParentID });
	});	
		
}
