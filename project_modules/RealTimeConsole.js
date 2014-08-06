var Globals = require("../project_modules/Globals.js"); 
var util = require('util');

var SocketIOHandle;



function PadLeft(nr, n, str) {
	return Array(n-String(nr).length+1).join(str||' ')+nr;
}

//----------------------------------------------------------------------------------------
function escapeSingleQuuote (inStr) {
    return String(inStr).replace(/\'/g, "\\'");
}


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
function parseForStatement(VarObj)
{
	var NewQ = new Object();
	NewQ.Type = "ForStatement";
	NewQ.XLine = VarObj.find("loc").find("start").find("line").first().text();
	NewQ.XColumn = VarObj.find("loc").find("start").find("column").first().text();
	NewQ.XStartPosition = parseInt(VarObj.find("start").first().text(),10);

//	console.log("loop:"+VarObj.find("body").first().find("start").first().text());
	NewQ.XBodyStartPosition = parseInt(VarObj.find("body").first().find("start").first().text(),10);
	NewQ.InitName = "null";

	return NewQ;
}


//----------------------------------------------------------------------------------------
function parseFunctionDeclaration(VarObj)
{
	var NewQ = new Object();
	NewQ.Type = "FunctionDeclaration";
	NewQ.XLine = VarObj.find("loc").find("start").find("line").first().text();
	NewQ.XColumn = VarObj.find("loc").find("start").find("column").first().text();
	NewQ.XStartPosition = parseInt(VarObj.find("start").first().text(),10);
	NewQ.VarName = VarObj.find("id").find("name").first().text();

	NewQ.VarParameters = [];
	
	var jQuery = cheerio.load(VarObj, {xmlMode: true});

	jQuery(VarObj).children("params").each(function(){
		NewQ.VarParameters.push(jQuery(this).find("name").text());
		//console.log( jQuery(this).find("name").text() );
	});

	return NewQ;
}


//----------------------------------------------------------------------------------------
function loopFunctionCalls(tree,SourceCode)
{
	var GopherFuctionCallA = [];
	var jQuery = cheerio.load(tree, {xmlMode: true});
	
	jQuery(tree).find('type').each(function(){
		var BodyType = jQuery(this).first().text();
		if (BodyType == "CallExpression")
		{
			var CalleType  = jQuery(this).parent().find("callee").find("type").first().text();
			var CalleName  = jQuery(this).parent().find("callee").find("name").first().text();
			var CalleStart = parseInt(jQuery(this).parent().find("start").first().text(),10);
			var CalleEnd   = parseInt(jQuery(this).parent().find("end").first().text(),10);
			var CalleLine  = jQuery(this).parent().find("loc").find("start").find("line").first().text()
			var CalleParamCount = 0;
			jQuery(this).parent().children("arguments").each(function(){ CalleParamCount++;});
			
			if ( (CalleType == "Identifier") && (CalleName!="$") && (CalleName.indexOf("Gopher")==-1) )
			{
				
				//--- console.log("FUNCTION: "+ SourceCode.slice(CalleStart,CalleEnd) + " - " + BodyType + " - " + CalleLine +" - "+CalleName+" - "+CalleEnd+" - "+CalleParamCount);
				var NewQ = new Object();
				NewQ.CalleLine = CalleLine;
				NewQ.CalleEnd = CalleEnd;
				NewQ.CalleParamCount = CalleParamCount;
				GopherFuctionCallA.push(NewQ); 
			}
		}
	});

	return GopherFuctionCallA;
}


//----------------------------------------------------------------------------------------
function loopBody(tree,parentType,Xlevel,GopherObjectsA,ParentName,SourceCode)
{
	var i=0;
	Xlevel++;
	
	var RecursiveParentName = ParentName;
	
	var jQuery = cheerio.load(tree, {xmlMode: true});
	
	jQuery(tree).children('body').each(function(){
		var BodyType = jQuery(this).find("type").first().text();
//		console.log('l:'+Xlevel+', t:'+BodyType+', p:'+ parentType +', b:'+jQuery(this).find('body').length);
		
		
		Globals.socketServer.sockets.in("room1").emit('UpdateParserView',{
			htmlcode:'l:'+Xlevel+', b:'+jQuery(this).children('body').length +' p:'+ parentType +', t:'+BodyType+'<br>'
		});
		//------------------------------------------------------------------------------------------------

		if (BodyType == "ReturnStatement")
		{
			var parentNode =jQuery(this);
			//console.log( parseInt(parentNode.find("start").first().text(),10) );
			var NewQ = new Object();
			NewQ.Type = "ReturnStatement";
			NewQ.XLine = parentNode.find("loc").find("start").find("line").first().text();
			NewQ.XColumn = parentNode.find("loc").find("start").find("column").first().text();
			NewQ.XStartPosition = parseInt(parentNode.find("start").first().text(),10);
			NewQ.XEndPosition = parseInt(parentNode.find("end").first().text(),10);

			NewQ.parentID = ParentName;

			GopherObjectsA.push(NewQ); 
		}
		
		if (BodyType == "ForStatement")
		{
			GopherObjectsA.LoopCounter++;
			var parentNode =jQuery(this);
			NewQ = parseForStatement(parentNode);
			NewQ.parentID = ParentName;
			GopherObjectsA.push(NewQ);
			RecursiveParentName = ParentName + " / " + "l"+GopherObjectsA.LoopCounter;
		}

		if (BodyType == "FunctionDeclaration")
		{
			GopherObjectsA.FunctionCounter++;
			var parentNode =jQuery(this);
			NewQ = parseFunctionDeclaration(parentNode);
			NewQ.parentID = ParentName;
			GopherObjectsA.push(NewQ);
			RecursiveParentName = ParentName + " / " + "f"+ GopherObjectsA.FunctionCounter +"("+NewQ.VarName+")";
		}
		
		//------------------------------------------------------------------------------------------------
		
		//if this node has a body inside loop it 
		if ( jQuery(this).children('body').length > 0)
		{
			loopBody(this,parentType+" --> "+BodyType,Xlevel,GopherObjectsA,RecursiveParentName,SourceCode);
		}
	});
	return GopherObjectsA;
}


//----------------------------------------------------------------------------------------
function InsertGopherTells(contents,GopherObjectsA)
{
	//insert gohper tells starting for the end going backwards so position data doesnt change
	var nCount = GopherObjectsA.length;
	while ( nCount > 0)
	{
		nCount--;

		//========================================
		if (GopherObjectsA[nCount].Type == "ReturnStatement")
		{
			var returnstr = contents.slice(GopherObjectsA[nCount].XStartPosition,GopherObjectsA[nCount].XEndPosition);

			returnstr = returnstr.replace("return","var returnstr = " );

			var GopherTellInsert = returnstr + " GopherTell("+ GopherObjectsA[nCount].XLine + ",'<b>Return:</b>'+ returnstr + '','"+ GopherObjectsA[nCount].parentID  +"',GopherCallerID); return returnstr;";

			contents = 
				[contents.slice(0, GopherObjectsA[nCount].XStartPosition), 
				GopherTellInsert , 
				contents.slice(GopherObjectsA[nCount].XEndPosition)].join('');
		}
		
		//========================================
		if (GopherObjectsA[nCount].Type == "VariableDeclarator")
		{
			var GopherTellInsert = "GopherVarDecl("+ GopherObjectsA[nCount].XLine + 
											"," + GopherObjectsA[nCount].VarDeclTrackID + 
											",'" + GopherObjectsA[nCount].VarName+"'," + 
											GopherObjectsA[nCount].VarSource + "," + 
											"'" + escapeSingleQuuote(GopherObjectsA[nCount].VarSource) + "','"+ 
							GopherObjectsA[nCount].parentID  +"',GopherCallerID)";

			//console.log(GopherTellInsert);

			contents = 
				[contents.slice(0, GopherObjectsA[nCount].DeclStart), 
				GopherTellInsert , 
				contents.slice(GopherObjectsA[nCount].DeclEnd)].join('');
		}

		//========================================
		if (GopherObjectsA[nCount].Type == "VariableDeclaratorNull")
		{
			var GopherTellInsert = "=GopherVarDecl("+ GopherObjectsA[nCount].XLine + 
											"," + GopherObjectsA[nCount].VarDeclTrackID + 
											",'" + GopherObjectsA[nCount].VarName+"'," + 
											GopherObjectsA[nCount].VarSource + "," + 
											"'" + escapeSingleQuuote(GopherObjectsA[nCount].VarSource) + "','"+ 
							GopherObjectsA[nCount].parentID  +"',GopherCallerID)";

			//console.log(GopherTellInsert);

			contents = 
				[contents.slice(0, GopherObjectsA[nCount].DeclStart), 
				GopherTellInsert , 
				contents.slice(GopherObjectsA[nCount].DeclEnd)].join('');
		}

		//========================================
		if (GopherObjectsA[nCount].Type == "AssignmentExpression")
		{
			var GopherTellInsert = "GopherAssignment("+ GopherObjectsA[nCount].XLine + 
							"," + GopherObjectsA[nCount].VarDeclTrackID + 
							",'" + GopherObjectsA[nCount].VarName+"'," + 
							GopherObjectsA[nCount].VarSource + "," + 
							"'" + escapeSingleQuuote(GopherObjectsA[nCount].VarSource) + "','"+ 
							GopherObjectsA[nCount].parentID  +"',GopherCallerID,'" + GopherObjectsA[nCount].VarOperator + "')";

			//console.log(GopherTellInsert);

			contents = 
				[contents.slice(0, GopherObjectsA[nCount].DeclStart), 
				GopherTellInsert , 
				contents.slice(GopherObjectsA[nCount].DeclEnd)].join('');
		}

		//========================================
		if (GopherObjectsA[nCount].Type == "UpdateExpression")
		{
			var GopherTellInsert = ",GopherUpdateExpr("+ GopherObjectsA[nCount].XLine + 
							",'" + GopherObjectsA[nCount].VarName+"'," + 
							GopherObjectsA[nCount].VarName + "," + 
							"'" + GopherObjectsA[nCount].VarOperator + "'," +
							"'" + GopherObjectsA[nCount].parentID  +"',GopherCallerID)";

			//console.log(GopherTellInsert);

			contents = 
				[contents.slice(0, GopherObjectsA[nCount].DeclEnd), 
				GopherTellInsert , 
				contents.slice(GopherObjectsA[nCount].DeclEnd)].join('');
		}
		
		//========================================
		if (GopherObjectsA[nCount].Type == "ForStatement")
		{
			
			/*
			 * will not need this because the test part of loop will become a function
			var GopherTellInsert = "\nGopherTell("+ GopherObjectsA[nCount].XLine + ",'" +
							"<b>For Loop</b> var:"+ GopherObjectsA[nCount].InitName + 
							", value:'+"+ GopherObjectsA[nCount].InitName + "+'', '" +
							GopherObjectsA[nCount].parentID  +"',GopherCallerID);\n"; 
		
			contents = [contents.slice(0, GopherObjectsA[nCount].XBodyStartPosition+1), GopherTellInsert , contents.slice(GopherObjectsA[nCount].XBodyStartPosition+1)].join('');
			*/
/*			
			var GopherTellInsert = "GopherTell("+ GopherObjectsA[nCount].XLine + ",'" +
							"<b>For Loop Init</b> [name:"+ GopherObjectsA[nCount].InitName + 
							"] test[ operator["+ GopherObjectsA[nCount].TestOperator +
							"] left[name:"+ GopherObjectsA[nCount].TestLeftSideName + 
							", type:"+ GopherObjectsA[nCount].TestLeftSideType + 
							", value:"+ GopherObjectsA[nCount].TestLeftSideValue + 
							"] right[name:"+ GopherObjectsA[nCount].TestRightSideName + 
							", type:"+ GopherObjectsA[nCount].TestRigthSideType + 
							", value:"+ GopherObjectsA[nCount].TestRightSideValue + "] ]','"+ 
							GopherObjectsA[nCount].parentID  +"',GopherCallerID);\n"; 
*/
			var GopherTellInsert = "GopherTell("+ GopherObjectsA[nCount].XLine + ",'<b>For Loop Init</b>','"+ 
							GopherObjectsA[nCount].parentID  +"',GopherCallerID); "; 

			contents = [contents.slice(0, GopherObjectsA[nCount].XStartPosition), GopherTellInsert , contents.slice(GopherObjectsA[nCount].XStartPosition)].join('');
		}

		//========================================
		if (GopherObjectsA[nCount].Type == "FunctionDeclaration")
		{
			var ParamsText = "";
			var ParamsValue = "";
			for (var pcounter=0; pcounter< GopherObjectsA[nCount].VarParameters.length; pcounter++ )
			{
				ParamsText += GopherObjectsA[nCount].VarParameters[pcounter] + ", ";
				ParamsValue += "'+" + GopherObjectsA[nCount].VarParameters[pcounter] + "+', ";
			}

			var tempstring = contents.substring(GopherObjectsA[nCount].XStartPosition);

			var FirstCurleyBracket = tempstring.indexOf("{");

			var GopherTellInsert = " var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default';"+
" GopherTell("+ GopherObjectsA[nCount].XLine + ",'<b>Function Run</b> ["+GopherObjectsA[nCount].VarName+"] parameters:"+ ParamsText +" values: "+ParamsValue+"','"+ GopherObjectsA[nCount].parentID +"',GopherCallerID);";

			contents = 
				[contents.slice(0, GopherObjectsA[nCount].XStartPosition+FirstCurleyBracket+1), 
				GopherTellInsert, 
				contents.slice(GopherObjectsA[nCount].XStartPosition+FirstCurleyBracket+1)].join('');
		}	
	}
	return contents;
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
function LoopGopherS(DataListSource,SourceCode)
{
	var LoopGopherSDebug = false;
	var XStartIndent = 0;
	var NewRecordType = "";
	
	GopherObjectsA = [];
	
	/* //For Debugging JSON to Array Fuction
	for (var i=0; i<200; i++) {
		console.log(DataListSource[i].XIndent+" "+ DataListSource[i].XID+" "+ DataListSource[i].XParentID + "." + DataListSource[i].XPath + " " + DataListSource[i].XParentNode+"   "+ DataListSource[i].XSelf+" = "+ DataListSource[i].XValue);
	} */
	
	
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
			var ParentType = DataListSource[DataListSource[C1].XParentID].XSelf;
			var CalleLine = "0";
			var CalleCol  = "0";

			var xstr = "";
			for (var i2=0; i2<DataListSource[C1].XIndent; i2++) { xstr += " "; }
			
			for (var C2=C1; C2<DataListSource.length;C2++)
			{
				if ((DataListSource[C2].XPath == DataListSource[C1].XPath+".loc.start") && (DataListSource[C2].XSelf == "line"))
				{	CalleLine = DataListSource[C2].XValue;	}
				if ((DataListSource[C2].XPath == DataListSource[C1].XPath+".loc.start") && (DataListSource[C2].XSelf == "column"))
				{	CalleCol = DataListSource[C2].XValue;	}
				
				if ( (CalleLine!="0") && (CalleCol!="0")) { break; }
			}

			if (	(FirstType == "ForStatement") || 
					(FirstType == "BlockStatement") ||
					(FirstType == "VariableDeclaration") ||
					(FirstType == "ExpressionStatement") ||
					(FirstType == "SequenceExpression") ||
					(FirstType == "FunctionDeclaration") ||
					(FirstType == "IfStatement") ||
					(FirstType == "ForInStatement") )
			{
				if (LoopGopherSDebug) console.log(CalleLine+": "+xstr+FirstType); 
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

					if (NewRecordType!="")
					{
						var NewQParent = new Object();
						NewQParent.NewRecordType = NewRecordType;
						NewQParent.Records = [];
						NewQParent.LeftRightPairs = [];
						NewQParent.StartIndent = DataListSource[C1].XIndent; 
						NewQParent.ArrayIndex = C1;
						NewQParent.InsertStr = "";
						
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



//----------------------------------------------------------------------------------------
function GopherTellify(contents,inFile)
{
	var options = {};
	options.locations = true; 
	var parsed = Globals.acorn.parse(contents, options); 

	var DebugLines = true;

	MakeJSONTreeFromJS(parsed,inFile);

	var DataList = [];
	Object.keys(parsed).forEach(function(key) {  
		DataList = recurseJSON(key, parsed[key],0,DataList, "p", "", 0);
	});

	var GopherObjectsA = [];
	GopherObjectsA = LoopGopherS(DataList,contents);

	for (var i=0; i < GopherObjectsA.length; i++)
	{
		
		if ( (GopherObjectsA[i].NewRecordType=="UpdateExpression")  )
		{
			//first print to screen
			if (DebugLines) {
				console.log( "\nUPDATE: " + GopherObjectsA[i].NewRecordType + 
				" Source: " + GopherObjectsA[i].Records[0].xSource + 
				" Var Name: " + GopherObjectsA[i].Records[1].xSource + " Op:" + GopherObjectsA[i].Records[0].Operator + " Prefix: "+ GopherObjectsA[i].Records[0].Prefix );
			}
			
			GopherObjectsA[i].InsertStr = "(tempVar = "+GopherObjectsA[i].Records[1].xSource+", " + 
			               GopherObjectsA[i].Records[1].xSource + "= GopherSetF('" + escapeSingleQuuote(GopherObjectsA[i].Records[1].xSource) + "','" + escapeSingleQuuote(GopherObjectsA[i].Records[0].xSource) + "',"+GopherObjectsA[i].Records[1].xSource+",'" + GopherObjectsA[i].Records[0].Operator + "',false,'"+ GopherObjectsA[i].Records[0].Prefix +"'), tempVar)";
						   
			if (DebugLines) {
				console.log( GopherObjectsA[i].InsertStr + "\n"   );
			}
		}
		
		//If AssignmentExpression,VariableDeclarator and first operator is =
		if ( (GopherObjectsA[i].NewRecordType=="AssignmentExpression") || 
		     (GopherObjectsA[i].NewRecordType=="VariableDeclarator") || 
			  (GopherObjectsA[i].NewRecordType=="LogicalExpression") )
		{
			//first print to screen
			if (DebugLines) {
				console.log( "\n" +GopherObjectsA[i].NewRecordType + 
				" Source: " + GopherObjectsA[i].Records[0].xSource + 
				" Var Name: " + GopherObjectsA[i].Records[1].xSource + " " + GopherObjectsA[i].Records[0].Operator);
			}
			
			for (var j=2; j < GopherObjectsA[i].Records.length; j++)
			{
				var xstr = "";
				for (var i2=0; i2<GopherObjectsA[i].Records[j].Indent; i2++) { xstr += " "; }

				if (DebugLines) {
					console.log( " ID/Pa: "+ PadLeft(GopherObjectsA[i].Records[j].xID,4) + " / "+ PadLeft(GopherObjectsA[i].Records[j].ParentID,4) + " :" + GopherObjectsA[i].Records[j].XLine + xstr +
					  " I: " + (GopherObjectsA[i].Records[j].Indent-GopherObjectsA[i].StartIndent ) + 
					  " Source: "+ GopherObjectsA[i].Records[j].xSource +
					  " Op: "+ GopherObjectsA[i].Records[j].Operator +
					  " Children: " + GopherObjectsA[i].Records[j].HasChildren +
					  " Type:" + GopherObjectsA[i].Records[j].ThisType 
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
				for (var j=2; j < GopherObjectsA[i].Records.length; j++)
				{
					//if variable is a fuction ignore all children
					if (GopherObjectsA[i].Records[j].ThisType=="CallExpression") 
					{
						GopherObjectsA[i].Records[j].HasChildren = false;
						var j2 = j+1;
						
						while ( ( GopherObjectsA[i].Records[j2].Indent>GopherObjectsA[i].Records[j].Indent ) && (j2 < GopherObjectsA[i].Records.length-1))
						{
							GopherObjectsA[i].Records[j2].Processed = true;
							j2++;
						}
					}
					
					//find node without children, also make sure to find node with the highenst indent
					if ( (!GopherObjectsA[i].Records[j].HasChildren) && (!GopherObjectsA[i].Records[j].Processed) )
					{
						if (GopherObjectsA[i].Records[j].Indent>NodeWithouChildIndent)
						{
							NodeWithouChildFound = true;
							NodeWithouChildIndent = GopherObjectsA[i].Records[j].Indent;
							NodeWithouChildID = j;
						}
						
					}
				}
				
				if (NodeWithouChildFound)
				{
					//if (parent is the previous node then)
					if (GopherObjectsA[i].Records[NodeWithouChildID-1].xID==GopherObjectsA[i].Records[NodeWithouChildID].ParentID)
					{
						var LeftRightC = 0;
						var LeftV = "null";
						var RightV = "null";
						var LeftC = "";
						var RightC = "";
						for (var j2=NodeWithouChildID; j2 < GopherObjectsA[i].Records.length; j2++)
						{
							if ( (GopherObjectsA[i].Records[j2].ParentID==GopherObjectsA[i].Records[NodeWithouChildID-1].xID) && (LeftRightC<2))
							{
								LeftRightC++;
								if (LeftRightC==1) { LeftV = GopherObjectsA[i].Records[j2].TempVarName; LeftC = GopherObjectsA[i].Records[j2].xSource; }
								if (LeftRightC==2) { RightV = GopherObjectsA[i].Records[j2].TempVarName; RightC = GopherObjectsA[i].Records[j2].xSource; }

								TheCowsAreAway = true;
								GopherObjectsA[i].Records[j2].Processed = true;
							}
						}

						TempC++;
						xPrefix = "var ";
						if ( (GopherObjectsA[i].NewRecordType=="VariableDeclarator") && (TempC==1) ) { xPrefix = "";}

						GopherObjectsA[i].InsertStr = GopherObjectsA[i].InsertStr + xPrefix +"Temp_" + TempC + " = GopherHelperF('" + GopherObjectsA[i].Records[NodeWithouChildID-1].Operator + "'," + LeftV + "," + RightV + ",'Temp_" + TempC+"','" + escapeSingleQuuote(LeftC) + "','" + escapeSingleQuuote(RightC) + "');\n";
						
						if (DebugLines) {
							console.log(xPrefix +"Temp_" + TempC + " = GopherHelperF('" + GopherObjectsA[i].Records[NodeWithouChildID-1].Operator + "'," + LeftV + "," + RightV + ",'Temp_" + TempC+"','" + escapeSingleQuuote(LeftC) + "','" + escapeSingleQuuote(RightC) + "');");
						}

						//set parent to childless and update its tempvarname 
						GopherObjectsA[i].Records[NodeWithouChildID-1].TempVarName = "Temp_" + TempC;
						GopherObjectsA[i].Records[NodeWithouChildID-1].HasChildren=false;
					}
				}

				k++;
				if (k>100) { TheCowsAreAway = false; }
			}
			var xPrefix = "";
			if (GopherObjectsA[i].NewRecordType=="VariableDeclarator") { xPrefix = "var ";}
			
			if (TempC==0)
			{
				var xSource = "null";
				if (GopherObjectsA[i].Records.length>2) { xSource = GopherObjectsA[i].Records[2].xSource; }

				//GopherHelperF( Operator, LeftVal, RightVal, TempName, LeftValStr, RightVarStr)				
				//var = GopherSetF( VarName, CommandLine, Value, Operator, UseTempVars, Prefix)
				
				if ( (GopherObjectsA[i].NewRecordType=="VariableDeclarator") ) { xPrefix = "";}

				GopherObjectsA[i].InsertStr = GopherObjectsA[i].InsertStr + 
					xPrefix + GopherObjectsA[i].Records[1].xSource + " = GopherSetF('" + escapeSingleQuuote(GopherObjectsA[i].Records[1].xSource) + "','" + escapeSingleQuuote(GopherObjectsA[i].Records[0].xSource) + "'," + xSource + ",'" + GopherObjectsA[i].Records[0].Operator + "',false,'"+ GopherObjectsA[i].Records[0].Prefix +"')";
				 
				 
				//console.log( GopherObjectsA[i].InsertStr + "\n"   );
			} else
			{
				GopherObjectsA[i].InsertStr = GopherObjectsA[i].InsertStr + 
					xPrefix + GopherObjectsA[i].Records[1].xSource + " = GopherSetF('" + escapeSingleQuuote(GopherObjectsA[i].Records[1].xSource) + "','" + escapeSingleQuuote(GopherObjectsA[i].Records[0].xSource) + "',Temp_" + TempC + ",'" + GopherObjectsA[i].Records[0].Operator + "',true,'"+ GopherObjectsA[i].Records[0].Prefix +"')";
				
				//console.log( GopherObjectsA[i].InsertStr + "\n"   );
			}
		}
	}
	
	for (var i=GopherObjectsA.length-1; i >= 0; i--)
	{
		if ( (GopherObjectsA[i].InsertStr!="") && (GopherObjectsA[i].CopyStart>0) && (GopherObjectsA[i].CopyEnd>0) )
		{
			//console.log( GopherObjectsA[i].InsertStr + "\n"   );
			contents = [contents.slice(0, GopherObjectsA[i].CopyStart), GopherObjectsA[i].InsertStr, 	contents.slice(GopherObjectsA[i].CopyEnd)].join('');
		}
	}
	//
	//
	//-------------------------------- INSERT EXTRA PARAMETER TO ALL FUNCTIONS
	//var parsed = Globals.acorn.parse(contents, options); 	
	/*
	var GopherFuctionCallA = [];
	GopherFuctionCallA = loopFunctionCalls(xmldata,contents);

	var nCount = GopherFuctionCallA.length;
	while ( nCount > 0)
	{
		nCount--;

		var GopherTellInsert = "";
		if (GopherFuctionCallA[nCount].CalleParamCount>0)
		{
			GopherTellInsert = ",";
		}
		GopherTellInsert += "'" + GopherFuctionCallA[nCount].CalleLine + ":'+(GopherCallerIDCouter++)";
		//console.log(GopherTellInsert);

		contents = 
			[contents.slice(0, GopherFuctionCallA[nCount].CalleEnd-1), 
			GopherTellInsert , 
			contents.slice(GopherFuctionCallA[nCount].CalleEnd-1)].join('');
	}	
	*/
  
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
	"	return OutPut;\n"+
	"}\n\n"+

	"//------------------------------------------------------------------------------\n"+
	"function GopherSetF( VarName, CommandLine, Value, Operator, UseTempVars, Prefix) {\n" +
	"	var OutPut = Value;\n" +
	"  if (Operator=='++') {  OutPut = Value+1; }\n" +
	"	return OutPut;\n"+
	"}\n\n"+


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
			Globals.fs.writeFile(inFile.replace(".js","-gopher.js"),contents);
		}
	});
}

GopherTellFile(__dirname + '/../liveparser-root/js/app.js');
//GopherTellFile(__dirname + '/../liveparser-root/js/course-engine-video.js');

/* LOOP EXPERIMENT
var jQuery = cheerio.load(xmldata, {xmlMode: true});
var i = 0;
jQuery(xmldata).find("type").each(function(){
	i++;
	console.log(i+" "+jQuery(this).text());
	if (i==2) { console.log( util.inspect( jQuery(this) ) );  }
});
*/


	
this.getFile = function(request, response){
	
	var	localFolder = __dirname + '/..';
	
	localFolder = localFolder.replace(/\\/g,'/');
	
	var	page404 = localFolder + '/admin/404.html';
	
	var fileName = request.url;
	if ((request.url=="/admin") || (request.url=="/admin/")) { 
		fileName = '/admin/index.html'; 
	}
	
	
	var	ext = Globals.path.extname(fileName);
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
