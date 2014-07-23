var Globals = require("../project_modules/Globals.js"); 
var util = require('util');

var SocketIOHandle;



//----------------------------------------------------------------------------------------
function escapeSingleQuuote (inStr) {
    return String(inStr).replace(/\'/g, "\\'");
}

//----------------------------------------------------------------------------------------
function json2xml(o, tab) {
   var toXml = function(v, name, ind) {
      var xml = "";
      if (v instanceof Array) {
         for (var i=0, n=v.length; i<n; i++)
            xml += ind + toXml(v[i], name, ind+"\t") + "\n";
      }
      else if (typeof(v) == "object") {
         var hasChild = false;
         xml += ind + "<" + name;
         for (var m in v) {
            if (m.charAt(0) == "@")
               xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
            else
               hasChild = true;
         }
         xml += hasChild ? ">" : "/>";
         if (hasChild) {
            for (var m in v) {
               if (m == "#text")
                  xml += v[m];
               else if (m == "#cdata")
                  xml += "<![CDATA[" + v[m] + "]]>";
               else if (m.charAt(0) != "@")
                  xml += toXml(v[m], m, ind+"\t");
            }
            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
         }
      }
      else {
         xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
      }
      return xml;
   }, xml="";
   for (var m in o)
      xml += toXml(o[m], m, "");
   return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
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
function loopBodyCommands(tree,sourcecode)
{
	var jQuery = cheerio.load(tree, {xmlMode: true});
	
	jQuery(tree).find('declarations').each(function(){
		console.log( "D: " + jQuery(this).find("loc").find("start").find("line").first().text() + ": " +
			sourcecode.slice( parseInt( jQuery(this).find("start").first().text() , 10) , parseInt( jQuery(this).find("end").first().text() , 10)  ) +
			" T:" + jQuery(this).find("type").first().text()
		);
	});
	
	jQuery(tree).find('expressions').each(function(){
		console.log( "E: " + jQuery(this).find("loc").find("start").find("line").first().text() + ": " +
			sourcecode.slice( parseInt( jQuery(this).find("start").first().text() , 10) , parseInt( jQuery(this).find("end").first().text() , 10)  ) +
			" T:" + jQuery(this).find("type").first().text()
		);
	});
	
	jQuery(tree).find('expression').each(function(){
		if (jQuery(this).find("expressions").length == 0 )
		{
			console.log( "X: " + jQuery(this).find("loc").find("start").find("line").first().text() + ": " +
				sourcecode.slice( parseInt( jQuery(this).find("start").first().text() , 10) , parseInt( jQuery(this).find("end").first().text() , 10)  ) +
				" T:" + jQuery(this).find("type").first().text()
			);
		}
	});
	

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
function loopFunctionCalls(tree,sourcecode)
{
	var JSGopherFuctionCallArray = [];
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
				
				//--- console.log("FUNCTION: "+ sourcecode.slice(CalleStart,CalleEnd) + " - " + BodyType + " - " + CalleLine +" - "+CalleName+" - "+CalleEnd+" - "+CalleParamCount);
				var NewQ = new Object();
				NewQ.CalleLine = CalleLine;
				NewQ.CalleEnd = CalleEnd;
				NewQ.CalleParamCount = CalleParamCount;
				JSGopherFuctionCallArray.push(NewQ); 
			}
		}
	});

	return JSGopherFuctionCallArray;
}


//----------------------------------------------------------------------------------------
function loopBody(tree,parentType,Xlevel,JSGopherObjectsArray,ParentName,sourcecode)
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

			JSGopherObjectsArray.push(NewQ); 
		}
		
		if (BodyType == "ForStatement")
		{
			JSGopherObjectsArray.LoopCounter++;
			var parentNode =jQuery(this);
			NewQ = parseForStatement(parentNode);
			NewQ.parentID = ParentName;
			JSGopherObjectsArray.push(NewQ);
			RecursiveParentName = ParentName + " / " + "l"+JSGopherObjectsArray.LoopCounter;
		}

		if (BodyType == "FunctionDeclaration")
		{
			JSGopherObjectsArray.FunctionCounter++;
			var parentNode =jQuery(this);
			NewQ = parseFunctionDeclaration(parentNode);
			NewQ.parentID = ParentName;
			JSGopherObjectsArray.push(NewQ);
			RecursiveParentName = ParentName + " / " + "f"+ JSGopherObjectsArray.FunctionCounter +"("+NewQ.VarName+")";
		}
		
		  
		 //** TRY PUTTING THE INDEPENDANT LOOPS BACK IN HERE SO PARENT TRACKING CAN WORK...
		 
		if (BodyType == "VariableDeclaration")
		{
			jQuery(this).find('type').each(function(){
				var BodyType2 = jQuery(this).first().text();
				if (BodyType2 == "VariableDeclarator")
				{
					var VarStart = parseInt(jQuery(this).parent().find("init").find("start").first().text(),10);
					var VarEnd = parseInt(jQuery(this).parent().find("init").find("end").first().text(),10); 

					if (jQuery(this).parent().find("init").first().text() == "")
					{
						JSGopherObjectsArray.VarDeclTrackID++;

						var NewQ = new Object();
						NewQ.Type = "VariableDeclaratorNull";
						NewQ.XLine = jQuery(this).parent().find("loc").find("end").find("line").first().text();
						NewQ.XColumn = jQuery(this).parent().find("loc").find("end").find("column").first().text();
						NewQ.XStartPosition = parseInt(jQuery(this).parent().find("start").first().text(),10);
						NewQ.XEndPosition = parseInt(jQuery(this).parent().find("end").first().text(),10);
						NewQ.VarName = jQuery(this).parent().find("id").find("name").first().text();
						NewQ.VarSource = "null";
						NewQ.DeclStart = parseInt(jQuery(this).parent().find("end").first().text(),10);
						NewQ.DeclEnd = parseInt(jQuery(this).parent().find("end").first().text(),10);
						NewQ.VarDeclTrackID = JSGopherObjectsArray.VarDeclTrackID;
						NewQ.parentID = ParentName;
						JSGopherObjectsArray.push( NewQ );

						//--- console.log("Var Dec Null: --------- Name:" + jQuery(this).parent().find("id").find("name").first().text()  );
					}

					if (!isNaN(VarStart))
					{
						JSGopherObjectsArray.VarDeclTrackID++;

						var NewQ = new Object();
						NewQ.Type = "VariableDeclarator";
						NewQ.XLine = jQuery(this).parent().find("loc").find("end").find("line").first().text();
						NewQ.XColumn = jQuery(this).parent().find("loc").find("end").find("column").first().text();
						NewQ.XStartPosition = parseInt(jQuery(this).parent().find("start").first().text(),10);
						NewQ.XEndPosition = parseInt(jQuery(this).parent().find("end").first().text(),10);
						NewQ.VarName = jQuery(this).parent().find("id").find("name").first().text();
						NewQ.VarSource = sourcecode.slice(VarStart,VarEnd);
						NewQ.DeclStart = VarStart;
						NewQ.DeclEnd = VarEnd;
						NewQ.VarDeclTrackID = JSGopherObjectsArray.VarDeclTrackID;
						NewQ.parentID = ParentName;
						
						
						JSGopherObjectsArray.push( NewQ );

						// --- console.log("Var Dec: --------- Name:" + jQuery(this).parent().find("id").find("name").first().text() +  " Init:" + VarStart + " " + VarEnd + " " + sourcecode.slice(VarStart,VarEnd));
						
					}
				}
			});
		}
		
		
		if (BodyType == "ExpressionStatement")
		{
			jQuery(this).find('type').each(function(){
				var BodyType2 = jQuery(this).first().text();
				if (BodyType2 == "AssignmentExpression")
				{
					var VarStart = parseInt(jQuery(this).parent().find("right").find("start").first().text(),10);
					var VarEnd = parseInt(jQuery(this).parent().find("right").find("end").first().text(),10); 

					if (!isNaN(VarStart))
					{
						JSGopherObjectsArray.VarDeclTrackID++;
						var NewQ = new Object();
						NewQ.XLine = jQuery(this).parent().find("loc").find("end").find("line").first().text();
						NewQ.XColumn = jQuery(this).parent().find("loc").find("end").find("column").first().text();
						NewQ.XStartPosition = parseInt(jQuery(this).parent().find("start").first().text(),10);
						NewQ.XEndPosition = parseInt(jQuery(this).parent().find("end").first().text(),10);
						NewQ.Type = "AssignmentExpression";
						
						NewQ.VarName = jQuery(this).parent().find("left").find("name").first().text();
						NewQ.VarOperator = jQuery(this).parent().find("operator").first().text();
						NewQ.VarSource = sourcecode.slice(VarStart,VarEnd);
						NewQ.DeclStart = VarStart;
						NewQ.DeclEnd = VarEnd;
						NewQ.VarDeclTrackID = JSGopherObjectsArray.VarDeclTrackID;
						NewQ.parentID = ParentName;
						JSGopherObjectsArray.push( NewQ );

						//--- console.log("Assignment Expression: --------- Name:" + jQuery(this).parent().find("left").find("name").first().text() +  " Init:" + VarStart + " " + VarEnd + " " + sourcecode.slice(VarStart,VarEnd)  );
					}
				} else
				
				if (BodyType2 == "UpdateExpression")
				{
					VarStart = parseInt( jQuery(this).parent().find("start").first().text() , 10);
					VarEnd = parseInt( jQuery(this).parent().find("end").first().text() , 10);
					
					JSGopherObjectsArray.VarDeclTrackID++;
					var NewQ = new Object();
					NewQ.XLine = jQuery(this).parent().find("loc").find("end").find("line").first().text();
					NewQ.XColumn = jQuery(this).parent().find("loc").find("end").find("column").first().text();
					NewQ.XStartPosition = parseInt(jQuery(this).parent().find("start").first().text(),10);
					NewQ.XEndPosition = parseInt(jQuery(this).parent().find("end").first().text(),10);
					NewQ.Type = "UpdateExpression";
					
					NewQ.VarName = jQuery(this).parent().find("argument").find("name").first().text();
					NewQ.VarOperator = jQuery(this).parent().find("operator").first().text();
					NewQ.VarSource = sourcecode.slice(VarStart,VarEnd);
					NewQ.DeclStart = VarStart;
					NewQ.DeclEnd = VarEnd;
					NewQ.VarDeclTrackID = JSGopherObjectsArray.VarDeclTrackID;
					NewQ.parentID = ParentName;
					JSGopherObjectsArray.push( NewQ );
					
					/*console.log( "update E: " + jQuery(this).parent().find("loc").find("start").find("line").first().text() + ": " +
					sourcecode.slice( parseInt( jQuery(this).parent().find("start").first().text() , 10) , parseInt( jQuery(this).parent().find("end").first().text() , 10)  ) +
					" T:" + jQuery(this).parent().find("type").first().text() + " OP:" + jQuery(this).parent().find("operator").first().text()
					);*/
				}
			});
		}
		//**********************
		
		 
		//------------------------------------------------------------------------------------------------
		
		//if this node has a body inside loop it 
		if ( jQuery(this).children('body').length > 0)
		{
			loopBody(this,parentType+" --> "+BodyType,Xlevel,JSGopherObjectsArray,RecursiveParentName,sourcecode);
		}
	});
	return JSGopherObjectsArray;
}


//----------------------------------------------------------------------------------------
function InsertGopherTells(contents,JSGopherObjectsArray)
{
	//insert gohper tells starting for the end going backwards so position data doesnt change
	var nCount = JSGopherObjectsArray.length;
	while ( nCount > 0)
	{
		nCount--;

		//========================================
		if (JSGopherObjectsArray[nCount].Type == "ReturnStatement")
		{
			var returnstr = contents.slice(JSGopherObjectsArray[nCount].XStartPosition,JSGopherObjectsArray[nCount].XEndPosition);

			returnstr = returnstr.replace("return","var returnstr = " );

			var GopherTellInsert = returnstr + " GopherTell("+ JSGopherObjectsArray[nCount].XLine + ",'<b>Return:</b>'+ returnstr + '','"+ JSGopherObjectsArray[nCount].parentID  +"',GopherCallerID); return returnstr;";

			contents = 
				[contents.slice(0, JSGopherObjectsArray[nCount].XStartPosition), 
				GopherTellInsert , 
				contents.slice(JSGopherObjectsArray[nCount].XEndPosition)].join('');
		}
		
		//========================================
		if (JSGopherObjectsArray[nCount].Type == "VariableDeclarator")
		{
			var GopherTellInsert = "GopherVarDecl("+ JSGopherObjectsArray[nCount].XLine + 
											"," + JSGopherObjectsArray[nCount].VarDeclTrackID + 
											",'" + JSGopherObjectsArray[nCount].VarName+"'," + 
											JSGopherObjectsArray[nCount].VarSource + "," + 
											"'" + escapeSingleQuuote(JSGopherObjectsArray[nCount].VarSource) + "','"+ 
							JSGopherObjectsArray[nCount].parentID  +"',GopherCallerID)";

			//console.log(GopherTellInsert);

			contents = 
				[contents.slice(0, JSGopherObjectsArray[nCount].DeclStart), 
				GopherTellInsert , 
				contents.slice(JSGopherObjectsArray[nCount].DeclEnd)].join('');
		}

		//========================================
		if (JSGopherObjectsArray[nCount].Type == "VariableDeclaratorNull")
		{
			var GopherTellInsert = "=GopherVarDecl("+ JSGopherObjectsArray[nCount].XLine + 
											"," + JSGopherObjectsArray[nCount].VarDeclTrackID + 
											",'" + JSGopherObjectsArray[nCount].VarName+"'," + 
											JSGopherObjectsArray[nCount].VarSource + "," + 
											"'" + escapeSingleQuuote(JSGopherObjectsArray[nCount].VarSource) + "','"+ 
							JSGopherObjectsArray[nCount].parentID  +"',GopherCallerID)";

			//console.log(GopherTellInsert);

			contents = 
				[contents.slice(0, JSGopherObjectsArray[nCount].DeclStart), 
				GopherTellInsert , 
				contents.slice(JSGopherObjectsArray[nCount].DeclEnd)].join('');
		}

		//========================================
		if (JSGopherObjectsArray[nCount].Type == "AssignmentExpression")
		{
			var GopherTellInsert = "GopherAssignment("+ JSGopherObjectsArray[nCount].XLine + 
							"," + JSGopherObjectsArray[nCount].VarDeclTrackID + 
							",'" + JSGopherObjectsArray[nCount].VarName+"'," + 
							JSGopherObjectsArray[nCount].VarSource + "," + 
							"'" + escapeSingleQuuote(JSGopherObjectsArray[nCount].VarSource) + "','"+ 
							JSGopherObjectsArray[nCount].parentID  +"',GopherCallerID,'" + JSGopherObjectsArray[nCount].VarOperator + "')";

			//console.log(GopherTellInsert);

			contents = 
				[contents.slice(0, JSGopherObjectsArray[nCount].DeclStart), 
				GopherTellInsert , 
				contents.slice(JSGopherObjectsArray[nCount].DeclEnd)].join('');
		}

		//========================================
		if (JSGopherObjectsArray[nCount].Type == "UpdateExpression")
		{
			var GopherTellInsert = ",GopherUpdateExpr("+ JSGopherObjectsArray[nCount].XLine + 
							",'" + JSGopherObjectsArray[nCount].VarName+"'," + 
							JSGopherObjectsArray[nCount].VarName + "," + 
							"'" + JSGopherObjectsArray[nCount].VarOperator + "'," +
							"'" + JSGopherObjectsArray[nCount].parentID  +"',GopherCallerID)";

			//console.log(GopherTellInsert);

			contents = 
				[contents.slice(0, JSGopherObjectsArray[nCount].DeclEnd), 
				GopherTellInsert , 
				contents.slice(JSGopherObjectsArray[nCount].DeclEnd)].join('');
		}
		
		//========================================
		if (JSGopherObjectsArray[nCount].Type == "ForStatement")
		{
			
			/*
			 * will not need this because the test part of loop will become a function
			var GopherTellInsert = "\nGopherTell("+ JSGopherObjectsArray[nCount].XLine + ",'" +
							"<b>For Loop</b> var:"+ JSGopherObjectsArray[nCount].InitName + 
							", value:'+"+ JSGopherObjectsArray[nCount].InitName + "+'', '" +
							JSGopherObjectsArray[nCount].parentID  +"',GopherCallerID);\n"; 
		
			contents = [contents.slice(0, JSGopherObjectsArray[nCount].XBodyStartPosition+1), GopherTellInsert , contents.slice(JSGopherObjectsArray[nCount].XBodyStartPosition+1)].join('');
			*/
/*			
			var GopherTellInsert = "GopherTell("+ JSGopherObjectsArray[nCount].XLine + ",'" +
							"<b>For Loop Init</b> [name:"+ JSGopherObjectsArray[nCount].InitName + 
							"] test[ operator["+ JSGopherObjectsArray[nCount].TestOperator +
							"] left[name:"+ JSGopherObjectsArray[nCount].TestLeftSideName + 
							", type:"+ JSGopherObjectsArray[nCount].TestLeftSideType + 
							", value:"+ JSGopherObjectsArray[nCount].TestLeftSideValue + 
							"] right[name:"+ JSGopherObjectsArray[nCount].TestRightSideName + 
							", type:"+ JSGopherObjectsArray[nCount].TestRigthSideType + 
							", value:"+ JSGopherObjectsArray[nCount].TestRightSideValue + "] ]','"+ 
							JSGopherObjectsArray[nCount].parentID  +"',GopherCallerID);\n"; 
*/
			var GopherTellInsert = "GopherTell("+ JSGopherObjectsArray[nCount].XLine + ",'<b>For Loop Init</b>','"+ 
							JSGopherObjectsArray[nCount].parentID  +"',GopherCallerID); "; 

			contents = [contents.slice(0, JSGopherObjectsArray[nCount].XStartPosition), GopherTellInsert , contents.slice(JSGopherObjectsArray[nCount].XStartPosition)].join('');
		}

		//========================================
		if (JSGopherObjectsArray[nCount].Type == "FunctionDeclaration")
		{
			var ParamsText = "";
			var ParamsValue = "";
			for (var pcounter=0; pcounter< JSGopherObjectsArray[nCount].VarParameters.length; pcounter++ )
			{
				ParamsText += JSGopherObjectsArray[nCount].VarParameters[pcounter] + ", ";
				ParamsValue += "'+" + JSGopherObjectsArray[nCount].VarParameters[pcounter] + "+', ";
			}

			var tempstring = contents.substring(JSGopherObjectsArray[nCount].XStartPosition);

			var FirstCurleyBracket = tempstring.indexOf("{");

			var GopherTellInsert = " var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default';"+
" GopherTell("+ JSGopherObjectsArray[nCount].XLine + ",'<b>Function Run</b> ["+JSGopherObjectsArray[nCount].VarName+"] parameters:"+ ParamsText +" values: "+ParamsValue+"','"+ JSGopherObjectsArray[nCount].parentID +"',GopherCallerID);";

			contents = 
				[contents.slice(0, JSGopherObjectsArray[nCount].XStartPosition+FirstCurleyBracket+1), 
				GopherTellInsert, 
				contents.slice(JSGopherObjectsArray[nCount].XStartPosition+FirstCurleyBracket+1)].join('');
		}	
	}
	return contents;
}

function LoopLeft(DataListSource,sourcecode,JSGopherObjectsArray)
{
	console.log("-------------");
	var LoopLeftDebug = true;
	
	for (var C1=0; C1<DataListSource.length;C1++)
	{
		var FirstType = DataListSource[C1].XValue;
		var FirstKey = DataListSource[C1].XSelf;

		if ( (FirstKey=="type")
		&& ( (FirstType == "VariableDeclarator") || 
			  (FirstType == "AssignmentExpression") ||
			  (FirstType == "UnaryExpression") ||

			  (FirstType == "ForStatement") ||
			  (FirstType == "BlockStatement") ||
			  (FirstType == "VariableDeclaration") ||
			  (FirstType == "ExpressionStatement") ||
			  (FirstType == "SequenceExpression") ||

			  (FirstType == "UpdateExpression") ||
			  (FirstType == "BinaryExpression") ||
			  (FirstType == "LogicalExpression") ||
			  (FirstType == "Identifier") ||
			  (FirstType == "Literal") ||
			  (FirstType == "CallExpression") 
		  )  )
		{
/*
			console.log(
							DataListSource[C1].XIndent+" "+ 
							DataListSource[C1].XID+" "+ 
							DataListSource[C1].XParentID+"."+DataListSource[C1].XPath+" "+ 
							DataListSource[C1].XParentNode+"   "+ 
							DataListSource[C1].XSelf+" = "+ 
							DataListSource[C1].XValue);

		*/

		/*
			var TempX = jQuery(this).parent();
			var ParentType = TempX[0]["name"];
			var ThisName = "("+jQuery(this)[0]["name"]+")";
		*/
	  
			var ParentType = DataListSource[DataListSource[C1].XParentID].XSelf;
			var ThisName = "("+FirstKey+")";
			var CalleLine = "0";
			var CalleCol  = "0";

			var xstr = "";
			for (var i2=0; i2<DataListSource[C1].XIndent; i2++) { xstr += " "; }
			
			
			for (var C2=C1; C2<DataListSource.length;C2++)
			{
				if ((DataListSource[C2].XPath == DataListSource[C1].XPath+".loc.start") && (DataListSource[C2].XSelf == "line"))
				{
					CalleLine = DataListSource[C2].XValue;
				}
				if ((DataListSource[C2].XPath == DataListSource[C1].XPath+".loc.start") && (DataListSource[C2].XSelf == "column"))
				{
					CalleCol = DataListSource[C2].XValue;
				}
				if ( (CalleLine!="0") && (CalleCol!="0")) { break; }
			}


			if ( (FirstType == "ForStatement") || 
				  (FirstType == "BlockStatement") ||
				  (FirstType == "VariableDeclaration") ||
				  (FirstType == "ExpressionStatement") ||
				  (FirstType == "SequenceExpression") ||
				  (FirstType == "CallExpression") )
			{
				if (LoopLeftDebug) console.log(CalleLine+": "+xstr+FirstType+" "+ThisName); 
				//console.log(CalleLine);
				/*
				var NewQ = new Object();
				NewQ.XLine = CalleLine;
				NewQ.XColumn = CalleCol;
				NewQ.XStartPosition = 0;
				NewQ.XEndPosition = 0;
				NewQ.Type = FirstType;
				NewQ.XType = ThisName;
				NewQ.Helper = true;
				NewQ.Operator = "";
				NewQ.xSource = "";
				NewQ.Indent = indent;
				NewQ.xID = JSGopherObjectsCount;
				NewQ.ParentID = ParentID;
				NewQ.HasChildren = false;
				JSGopherObjectsArray.push( NewQ );
				*/
			} else
			{
				
				var CopyStart = 0;
				var CopyEnd = 0;
				var xOperator = "";
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
					
					if ( (CopyStart!=0) && (CopyEnd!=0) && (xOperator!="") ) { break; }
					if (C2>C1+1000) { break; }
				}
				
				var SourceX = sourcecode.slice( CopyStart  , CopyEnd );
				if (FirstType == "VariableDeclarator") { xOperator = "="; }

				if (LoopLeftDebug) console.log(CalleLine+": "+xstr+FirstType+" "+ThisName+" ("+xOperator+") ["+SourceX+"] "); 
				/*

				var NewQ = new Object();
				NewQ.XLine = CalleLine;
				NewQ.XColumn = CalleCol;

				NewQ.XStartPosition = CopyStart;
				NewQ.XEndPosition = CopyEnd;
				NewQ.Type = FirstType;
				NewQ.XType = ThisName;
				NewQ.Helper = false;
				NewQ.Operator = xOperator;
				NewQ.xSource = SourceX.toString();
				NewQ.Indent = indent;
				NewQ.xID = JSGopherObjectsCount;
				NewQ.ParentID = ParentID;
				NewQ.HasChildren = false;
				JSGopherObjectsArray.push( NewQ );
				*/
			}
		}
	}
	return JSGopherObjectsArray;
}


//----------------------------------------------------------------------------------------
function recurseJSON(key, val, indent, JSGopherObjectsArray,parentStr,SelfValue,ParentID) 
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
		var TempVar = 0; if (JSGopherObjectsArray.length>0) { TempVar =JSGopherObjectsArray[JSGopherObjectsArray.length -1].XID+1; }
		NewQ.XID = TempVar;

		var xParentID = TempVar;
		JSGopherObjectsArray.push( NewQ );
		
		if (SelfValue!="") {
			var xParentStr = parentStr+"."+SelfValue;
		} else
		{
			var xParentStr = parentStr;
		}
		
//		console.log("("+indent+" "+ParentID+" "+TempVar+"."+parentStr + ")");
		
		Object.keys(val).forEach(function(key) {
			JSGopherObjectsArray = recurseJSON(key, val[key], indent, JSGopherObjectsArray, xParentStr, key, xParentID ); 
		});
	} else {
		
		var NewQ = new Object();
		NewQ.XPath = parentStr;
		NewQ.XSelf = SelfValue;
		NewQ.XParentNode = false;
		NewQ.XParentID = ParentID;
		NewQ.XValue = val;
		NewQ.XIndent = indent+1;
		
		var TempVar = 0; if (JSGopherObjectsArray.length>0) { TempVar =JSGopherObjectsArray[JSGopherObjectsArray.length -1].XID+1; }
		NewQ.XID = TempVar;

		JSGopherObjectsArray.push( NewQ );

//		console.log(" "+(indent+1)+" "+ParentID+" "+ParentID+"."+parentStr +  " = " + val);
	}
	
	return JSGopherObjectsArray;
}

function GopherTellFile(inFile)
{
	Globals.fs.readFile(inFile,function(err,contents){
		if(!err){
			///---------------------------------------------------------------------------

			var options = {};
			options.locations = true; 
			var parsed = Globals.acorn.parse(contents, options); 	

//			console.log(util.inspect(parsed,true,20 ) );	
			
			MakeJSONTreeFromJS(parsed,inFile);
			
			var DataList = [];

			Object.keys(parsed).forEach(function(key) {  
				DataList = recurseJSON(key, parsed[key],0,DataList, "p", "", 0);
			});
			
			/*
			for (var i=0; i<200; i++)
			{
				console.log(
							   DataList[i].XIndent+" "+ 
								DataList[i].XID+" "+ 
								DataList[i].XParentID+"."+DataList[i].XPath+" "+ 
								DataList[i].XParentNode+"   "+ 
								DataList[i].XSelf+" = "+ 
								DataList[i].XValue);
			}
			*/
			


//			loopBodyCommands(xmldata,contents);
			
			var JSGopherObjectsArray = [];
			JSGopherObjectsArray = LoopLeft(DataList,contents,JSGopherObjectsArray);
			
			/*
			for (var i=0; i < JSGopherObjectsArray.length; i++)
			{
				var xstr = "";
				for (var i2=0; i2<JSGopherObjectsArray[i].Indent; i2++) { xstr += " "; }
				
				//if (JSGopherObjectsArray[i].Operator !="") { console.log( xstr+JSGopherObjectsArray[i].xSource ); }
				if (JSGopherObjectsArray[i].HasChildren) 
				{ console.log( xstr+JSGopherObjectsArray[i].xID+" "+JSGopherObjectsArray[i].ParentID+" "+JSGopherObjectsArray[i].xSource + " ("+JSGopherObjectsArray[i].Operator+")*" ); } else
				{ console.log( xstr+JSGopherObjectsArray[i].xID+" "+JSGopherObjectsArray[i].ParentID+" "+JSGopherObjectsArray[i].xSource + " ("+JSGopherObjectsArray[i].Operator+")" );}
				
			}
			*/
			
			var parsed = Globals.acorn.parse(contents, options); 	

			var JSGopherObjectsArray = [];
			JSGopherObjectsArray.FunctionCounter = 0;
			JSGopherObjectsArray.LoopCounter = 0;
			JSGopherObjectsArray.VarDeclTrackID = 0;
//			JSGopherObjectsArray = loopBody(xmldata,"BODY",0,JSGopherObjectsArray,"body",contents);
										  

//			contents = InsertGopherTells(contents,JSGopherObjectsArray);

			Globals.fs.writeFile(inFile.replace(".js","-gopher.js"),contents);
			
			//-------------------------------- INSERT EXTRA PARAMETER TO ALL FUNCTIONS
			var parsed = Globals.acorn.parse(contents, options); 	

			var JSGopherFuctionCallArray = [];
//			JSGopherFuctionCallArray = loopFunctionCalls(xmldata,contents);
			
			var nCount = JSGopherFuctionCallArray.length;
			while ( nCount > 0)
			{
				nCount--;

				var GopherTellInsert = "";
				if (JSGopherFuctionCallArray[nCount].CalleParamCount>0)
				{
					GopherTellInsert = ",";
				}
				GopherTellInsert += "'" + JSGopherFuctionCallArray[nCount].CalleLine + ":'+(GopherCallerIDCouter++)";
				//console.log(GopherTellInsert);
				
				contents = 
					[contents.slice(0, JSGopherFuctionCallArray[nCount].CalleEnd-1), 
					GopherTellInsert , 
					contents.slice(JSGopherFuctionCallArray[nCount].CalleEnd-1)].join('');
			}	
			//Globals.fs.writeFile(filePath+".funcdec.temp",contents);
			
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
			"\n\n"+
			contents;
			
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
