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
function GopherTellify(contents,inFile)

{
	
		// **** IN RealTimeConsole.JS REF #001
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
		
}



		// **** IN RealTimeConsole.JS REF #002
/* LOOP EXPERIMENT
var jQuery = cheerio.load(xmldata, {xmlMode: true});
var i = 0;
jQuery(xmldata).find("type").each(function(){
	i++;
	console.log(i+" "+jQuery(this).text());
	if (i==2) { console.log( util.inspect( jQuery(this) ) );  }
});
*/
