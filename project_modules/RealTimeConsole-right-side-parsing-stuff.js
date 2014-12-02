		//******** Reparse Source since it was changed
	var DataList = [];
	var GopherObjectsA = [];
	var parsed = Globals.acorn.parse(contents, options); 
	Object.keys(parsed).forEach(function(key) {  
		DataList = recurseJSON(key, parsed[key],0,DataList, "p", "", 0);
	});
	GopherObjectsA = LoopGopherS(DataList,contents,false,true);
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

		if (GopherObjectsA[ObjectCounter].NewRecordType=="BinaryExpression")
		{
			
		}

		//If AssignmentExpression,VariableDeclarator and first operator is =
		if ( (GopherObjectsA[ObjectCounter].NewRecordType=="AssignmentExpression") || 
		     (GopherObjectsA[ObjectCounter].NewRecordType=="VariableDeclarator") || 
			  (GopherObjectsA[ObjectCounter].NewRecordType=="LogicalExpression") ||
			  (GopherObjectsA[ObjectCounter].NewRecordType=="BinaryExpression") )
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
					console.log(GopherObjectsA[ObjectCounter].Records[j].xSource+"--"+GopherObjectsA[ObjectCounter].Records[j].ThisType);
					//if variable is a fuction or MemberExpression ignore all children
					if ( (GopherObjectsA[ObjectCounter].Records[j].ThisType=="CallExpression") ||
					     (GopherObjectsA[ObjectCounter].Records[j].ThisType=="MemberExpression"))
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

						//if parent is BinaryExpression then this block will return a TRUE/FALSE and the statments should be separated with comma(,) instead
						var CloseFunctionStr = ";\n";
						if ((GopherObjectsA[ObjectCounter].NewRecordType=="BinaryExpression"))
						{ 
							CloseFunctionStr = ", ";
						}
					

						GopherObjectsA[ObjectCounter].InsertStr = GopherObjectsA[ObjectCounter].InsertStr + "Temp_" + ObjectCounter + "_" + TempC + " = GopherHelperF('" + GopherObjectsA[ObjectCounter].Records[NodeWithouChildID-1].Operator + "'," + LeftV + "," + RightV + ",'Temp_" + ObjectCounter + "_" + TempC+"','" + Globals.escapeSingleQuote(LeftC) + "','" + Globals.escapeSingleQuote(RightC) + "')"+CloseFunctionStr;
						
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
				
				//if the parent is BinaryExpression then this means nothing is set so use GopherHelperF to return TRUE/FALSE instead of setting a variable with GopherSetF
				if ((GopherObjectsA[ObjectCounter].NewRecordType=="BinaryExpression"))
				{
					//function GopherHelperF( Operator, LeftVal, RightVal, TempName, LeftValStr, RightVarStr)
					GopherObjectsA[ObjectCounter].InsertStr = "( "+GopherObjectsA[ObjectCounter].InsertStr + " GopherHelperF('" + GopherObjectsA[ObjectCounter].Records[0].Operator + "'," + GopherObjectsA[ObjectCounter].Records[1].xSource + ", " + GopherObjectsA[ObjectCounter].Records[2].xSource + ",'','" + Globals.escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[1].xSource) + "','" + Globals.escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[2].xSource) + "') )";
				} else
				{
					GopherObjectsA[ObjectCounter].InsertStr = GopherObjectsA[ObjectCounter].InsertStr + 
						xPrefix + GopherObjectsA[ObjectCounter].Records[1].xSource + " = GopherSetF('" + Globals.escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[1].xSource) + "','" + Globals.escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[0].xSource) + "'," + xSource + ",'" + GopherObjectsA[ObjectCounter].Records[0].Operator + "',false,'"+ GopherObjectsA[ObjectCounter].Records[0].Prefix +"')";
				}

				 
				//console.log( GopherObjectsA[ObjectCounter].InsertStr + "\n"   );
			} else
			{
				//if the parent is BinaryExpression then this means nothing is set so use GopherHelperF to return TRUE/FALSE instead of setting a variable with GopherSetF
				if ((GopherObjectsA[ObjectCounter].NewRecordType=="BinaryExpression"))
				{
					//function GopherHelperF( Operator, LeftVal, RightVal, TempName, LeftValStr, RightVarStr)
					GopherObjectsA[ObjectCounter].InsertStr = "( "+GopherObjectsA[ObjectCounter].InsertStr + " GopherHelperF('" + GopherObjectsA[ObjectCounter].Records[0].Operator + "'," + GopherObjectsA[ObjectCounter].Records[1].xSource + ", Temp_" + ObjectCounter + "_" + TempC + ",'','" + Globals.escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[1].xSource) + "','" + Globals.escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[2].xSource) + "') )";
				} else
				{
					GopherObjectsA[ObjectCounter].InsertStr = GopherObjectsA[ObjectCounter].InsertStr + 
						xPrefix + GopherObjectsA[ObjectCounter].Records[1].xSource + " = GopherSetF('" + Globals.escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[1].xSource) + "','" + Globals.escapeSingleQuote(GopherObjectsA[ObjectCounter].Records[0].xSource) + "',Temp_" + ObjectCounter + "_" + TempC + ",'" + GopherObjectsA[ObjectCounter].Records[0].Operator + "',true,'"+ GopherObjectsA[ObjectCounter].Records[0].Prefix +"')";
				}
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
	"function GopherAssignment(xCodeLine, xVarDeclTrackID, xVarName, xVarValue, xVarStr, xParentID, xGopherCallerID, xVarOperator, VarOperator ) {\n" +
	" iosocket.emit( 'Gopher.GopherAssignment', {CodeLine:xCodeLine, VarDeclTrackID:xVarDeclTrackID, VarName:xVarName, VarValue:xVarValue, VarStr:xVarStr, ParentID:xParentID, GopherCallerID:xGopherCallerID, VarOperator:xVarOperator } );\n"+
	"return xVarValue;\n"+
	"}\n\n"+


	"//------------------------------------------------------------------------------\n"+
	"function GopherUpdateExpr(xCodeLine, xVarName, xVarValue, xVarOperator, xParentID, xGopherCallerID ) {\n" +
	" iosocket.emit( 'Gopher.GopherUpdateExp', {CodeLine:xCodeLine, VarName:xVarName, VarValue:xVarValue, VarOperator:xVarOperator,  ParentID:xParentID, GopherCallerID:xGopherCallerID } );\n"+
	"}\n\n"+


	"//------------------------------------------------------------------------------\n"+
	"function GopherUnaryExpr(xCodeLine, xVarStr, xVarValue) {\n" +
	" xVarValue = !xVarValue;\n" +
	" iosocket.emit( 'Gopher.GopherUnaryExp', {CodeLine:xCodeLine, VarStr:xVarStr, VarValue:xVarValue, } );\n"+
	" return xVarValue;\n"+
	"}\n\n"+

	"function GopherTell(xCodeLine, xGopherMsg, xParentID, xGopherCallerID) {\n" +
	" iosocket.emit( 'Gopher.Tell', {CodeLine:xCodeLine, GopherMsg:xGopherMsg, ParentID:xParentID, GopherCallerID:xGopherCallerID } );\n"+
	"}\n\n"+
