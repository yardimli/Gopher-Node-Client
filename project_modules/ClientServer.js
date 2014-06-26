var Globals = require("../project_modules/Globals.js");
var cheerio = require('cheerio'); //https://github.com/cheeriojs/cheerio

var SocketIOHandle;

var	localFolder = __dirname + '/../liveparser-root';
localFolder = localFolder.replace(/\\/g,'/');

var	page404 = localFolder + '/404.html';

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
//todo parse multiple declerations
function parseVariableDeclaration(VarObj)
{
	var NewQ = new Object();
	NewQ.Type = "VariableDeclaration";
	NewQ.XLine = VarObj.find("loc").find("end").find("line").first().text();
	NewQ.XColumn = VarObj.find("loc").find("end").find("column").first().text();
	NewQ.XStartPosition = parseInt(VarObj.find("start").first().text(),10);
	NewQ.XEndPosition = parseInt(VarObj.find("end").first().text(),10);

	
	var jQuery = cheerio.load(VarObj, {xmlMode: true});
	NewQ.VarNames = [];
	jQuery(VarObj).children("declarations").each(function(){
		
		if (jQuery(this).find("type").first().text()=="VariableDeclarator")
		{
			NewQ.VarNames.push( jQuery(this).find("id").find("name").first().text() );
//			console.log( jj+"------------"+jQuery(this).find("id").find("name").first().text() );
		}
	});

	return NewQ;
}

//----------------------------------------------------------------------------------------
function parseAssignmentExpression(VarObj)
{
	var NewQ = new Object();
	NewQ.Type = "AssignmentExpression";
	NewQ.XLine = VarObj.find("loc").find("end").find("line").first().text();
	NewQ.XColumn = VarObj.find("loc").find("end").find("column").first().text();
	NewQ.XStartPosition = parseInt(VarObj.find("start").first().text(),10);
	NewQ.XEndPosition = parseInt(VarObj.find("end").first().text(),10);
	
	var jQuery = cheerio.load(VarObj, {xmlMode: true});
	NewQ.VarNames = [];
	jQuery(VarObj).children("expressions").each(function(){
		
		if (jQuery(this).find("type").first().text()=="AssignmentExpression")
		{
			NewQ.VarNames.push( jQuery(this).find("left").find("name").first().text() );
		}
	});

	return NewQ;
}


//----------------------------------------------------------------------------------------
function parseBinaryExpression(VarObj)
{
	var NewQ = new Object();
	NewQ.Type = "BinaryExpression";
	NewQ.XLine = VarObj.find("loc").find("start").find("line").first().text();
	NewQ.XColumn = VarObj.find("loc").find("start").find("column").first().text();
	NewQ.XStartPosition = parseInt(VarObj.find("start").first().text(),10);
	NewQ.XEndPosition = parseInt(VarObj.find("end").first().text(),10);

	NewQ.LeftSideName = VarObj.find("left").find("name").first().text();
	NewQ.LeftSideType = VarObj.find("left").find("type").first().text();
	NewQ.LeftSideValue = "";
	if (NewQ.LeftSideType == "Literal")
	{
		NewQ.LeftSideValue = VarObj.find("left").find("value").first().text();
	}
	
	NewQ.Xoperator = VarObj.find("operator").first().text();
	
	NewQ.RightSideName = VarObj.find("right").find("name").first().text();
	NewQ.RightSideType = VarObj.find("right").find("type").first().text();
	NewQ.RightSideValue = "";
	if (NewQ.RightSideType == "Literal")
	{
		NewQ.RightSideValue = VarObj.find("right").find("value").first().text();
	}
	
	return NewQ;
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

	if (VarObj.find("init").find("type").first().text() == "AssignmentExpression")
	{
		var parentNode2 = VarObj.find("init");
		var NewQ2 = parseAssignmentExpression(parentNode2);

		NewQ.InitName = NewQ2.VarName;
	} else
	if (VarObj.find("init").find("type").first().text() == "VariableDeclaration")
	{
		var parentNode2 = VarObj.find("init").find("declarations").first();
		var NewQ2 = parseVariableDeclaration(parentNode2);

		NewQ.InitName = NewQ2.VarNames[0];
	}

	if (VarObj.find("test").find("type").first().text() == "BinaryExpression")
	{
		var parentNode2 = VarObj.find("test").first();
		var NewQ2 = parseBinaryExpression(parentNode2);

		NewQ.TestLeftSideName = NewQ2.LeftSideName;
		NewQ.TestLeftSideType = NewQ2.LeftSideType;
		NewQ.TestLeftSideValue = NewQ2.LeftSideValue;

		NewQ.TestOperator = NewQ2.Xoperator;

		NewQ.TestRightSideName = NewQ2.RightSideName;
		NewQ.TestRigthSideType = NewQ2.RightSideType;
		NewQ.TestRightSideValue = NewQ2.RightSideValue;
	}
	
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
function loopBody(tree,parentType,Xlevel,JSGopherObjectsArray,ParentName)
{
	var i=0;
	Xlevel++;
	
	var RecursiveParentName = ParentName;
	
	var jQuery = cheerio.load(tree, {xmlMode: true});
	
	jQuery(tree).children('body').each(function(){
		var BodyType = jQuery(this).find("type").first().text();
	//	console.log('l:'+Xlevel+', t:'+BodyType+', p:'+ parentType +', b:'+jQuery(this).find('body').length);
		
		
		Globals.socketServer.sockets.in("room1").emit('UpdateParserView',{
			htmlcode:'l:'+Xlevel+', b:'+jQuery(this).children('body').length +' p:'+ parentType +', t:'+BodyType+'<br>'
		});
		//------------------------------------------------------------------------------------------------

		if (BodyType == "ReturnStatement")
		{
			var parentNode =jQuery(this);
			console.log( parseInt(parentNode.find("start").first().text(),10) );
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
			RecursiveParentName = ParentName + "/" + "L"+JSGopherObjectsArray.LoopCounter;
		}

		if (BodyType == "FunctionDeclaration")
		{
			JSGopherObjectsArray.FunctionCounter++;
			var parentNode =jQuery(this);
			NewQ = parseFunctionDeclaration(parentNode);
			NewQ.parentID = ParentName;
			JSGopherObjectsArray.push(NewQ);
			RecursiveParentName = ParentName + "/" + "F"+ JSGopherObjectsArray.FunctionCounter +": "+NewQ.VarName;
		}

		if (BodyType == "VariableDeclaration")
		{
			var parentNode = jQuery(this);
			NewQ = parseVariableDeclaration(parentNode);
			NewQ.parentID = ParentName;
			JSGopherObjectsArray.push(NewQ); 
		}

		if (BodyType == "ExpressionStatement")
		{
			if (jQuery(this).find("expression").first().find("type").first().text() == "CallExpression")
			{
				
			} else

			if (jQuery(this).find("expression").first().find("type").first().text() == "AssignmentExpression")
			{
				var parentNode =jQuery(this).find("expression").first();
				NewQ = parseAssignmentExpression(parentNode);
				NewQ.parentID = ParentName;
				JSGopherObjectsArray.push(NewQ); 
			}
		}
		//------------------------------------------------------------------------------------------------
		
		//if this node has a body inside loop it 
		if ( jQuery(this).children('body').length > 0)
		{
			loopBody(this,parentType+" --> "+BodyType,Xlevel,JSGopherObjectsArray,RecursiveParentName);
		}
	});
	return JSGopherObjectsArray;
}


//----------------------------------------------------------------------------------------
function loopFunctionCalls(tree)
{
	var JSGopherFuctionCallArray = [];
	var jQuery = cheerio.load(tree, {xmlMode: true});
	
	jQuery(tree).find('type').each(function(){
		var BodyType = jQuery(this).first().text();
		if (BodyType == "CallExpression")
		{
			var CalleType = jQuery(this).parent().find("callee").find("type").first().text();
			var CalleName = jQuery(this).parent().find("callee").find("name").first().text();
			var CalleEnd  = jQuery(this).parent().find("end").first().text();
			var CalleLine = jQuery(this).parent().find("loc").find("start").find("line").first().text()
			var CalleParamCount = 0;
			jQuery(this).parent().children("arguments").each(function(){ CalleParamCount++;});
			
			if ( (CalleType == "Identifier") && (CalleName!="$") )
			{
				console.log(BodyType + " - " + CalleLine +" - "+CalleName+" - "+CalleEnd+" - "+CalleParamCount);
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
function MakeJSONTreeFromJS(contents,filePath)
{
	var options = {};
	options.locations = true; 
	var compact = false;
	var ExpressionPoint;
	var jQuery;
	var TreeHTML2;
	var parsed;

	var SourceCode = contents.toString();

	parsed = Globals.acorn.parse(contents, options); 	
	//console.log(JSON.stringify(parsed, null, compact ? null : 2));
	Globals.fs.writeFile(filePath+".gopher",JSON.stringify(parsed, null, compact ? null : 2));
	Globals.fs.writeFile(filePath+".gopher.pure",JSON.stringify(parsed));

	TreeHTML2 = "<ul>";
	Object.keys(parsed).forEach(function(key) {  TreeHTML2 = recurse(TreeHTML2, key, parsed[key] ); } );
	TreeHTML2 += "</ul>";
	Globals.fs.writeFile(filePath+".gopher.tree.html",TreeHTML2);

	Globals.socketServer.sockets.in("room1").emit('UpdateTreeView',{	htmlcode:'<div class="tree">'+TreeHTML2+'</div>' });
	
//						parsed = parsed.replace(/</g,'&lt;');
//						parsed = parsed.replace(/>/g,'&gt;');
	
	return parsed;
}



//----------------------------------------------------------------------------------------
function InsertGopherTells(contents,JSGopherObjectsArray)
{
	var nCount = JSGopherObjectsArray.length;
	while ( nCount > 0)
	{
		nCount--;

		if (JSGopherObjectsArray[nCount].Type == "ReturnStatement")
		{
			var returnstr = contents.slice(JSGopherObjectsArray[nCount].XStartPosition,JSGopherObjectsArray[nCount].XEndPosition);

			returnstr = returnstr.replace("return","var returnstr = " );

			var GopherTellInsert = returnstr + "\n GopherTell("+ JSGopherObjectsArray[nCount].XLine + ",'<b>Return:</b>'+ returnstr + '','"+ JSGopherObjectsArray[nCount].parentID  +"',GopherCallerID); \n return returnstr;";

			contents = 
				[contents.slice(0, JSGopherObjectsArray[nCount].XStartPosition), 
				GopherTellInsert , 
				contents.slice(JSGopherObjectsArray[nCount].XEndPosition)].join('');
		}


		if (JSGopherObjectsArray[nCount].Type == "AssignmentExpression")
		{
			for (var pcounter=0; pcounter< JSGopherObjectsArray[nCount].VarNames.length; pcounter++ )
			{
				var GopherTellInsert = "\nGopherTell("+ JSGopherObjectsArray[nCount].XLine + ",'<b>Variable</b> ["+JSGopherObjectsArray[nCount].VarNames[pcounter]+"] set to:'+"+JSGopherObjectsArray[nCount].VarNames[pcounter]+",'"+ JSGopherObjectsArray[nCount].parentID  +"',GopherCallerID);";

				contents = 
					[contents.slice(0, JSGopherObjectsArray[nCount].XEndPosition+1), 
					GopherTellInsert , 
					contents.slice(JSGopherObjectsArray[nCount].XEndPosition+1)].join('');
			}
			
			for (var pcounter=0; pcounter< JSGopherObjectsArray[nCount].VarNames.length; pcounter++ )
			{
				GopherTellInsert = "\nGopherTell("+ JSGopherObjectsArray[nCount].XLine + ",'<b>Variable</b> ["+JSGopherObjectsArray[nCount].VarNames[pcounter]+"] is being set...','"+ JSGopherObjectsArray[nCount].parentID  +"',GopherCallerID);\n";

				contents = 
					[contents.slice(0, JSGopherObjectsArray[nCount].XStartPosition), 
					GopherTellInsert , 
					contents.slice(JSGopherObjectsArray[nCount].XStartPosition)].join('');
			}
			
		} else

		if (JSGopherObjectsArray[nCount].Type == "VariableDeclaration")
		{
			for (var pcounter=0; pcounter< JSGopherObjectsArray[nCount].VarNames.length; pcounter++ )
			{

				var GopherTellInsert = "\nGopherTell("+ JSGopherObjectsArray[nCount].XLine + ",'<b>Variable</b> ["+JSGopherObjectsArray[nCount].VarNames[pcounter]+"] set to:'+"+JSGopherObjectsArray[nCount].VarNames[pcounter]+",'"+ JSGopherObjectsArray[nCount].parentID  +"',GopherCallerID);\n";

				contents = 
					[contents.slice(0, JSGopherObjectsArray[nCount].XEndPosition+1), 
					GopherTellInsert , 
					contents.slice(JSGopherObjectsArray[nCount].XEndPosition+1)].join('');
			}

			for (var pcounter=0; pcounter< JSGopherObjectsArray[nCount].VarNames.length; pcounter++ )
			{
			var GopherTellInsert = "\nGopherTell("+ JSGopherObjectsArray[nCount].XLine + ",'<b>Var Decl.</b> ["+JSGopherObjectsArray[nCount].VarNames[pcounter]+"]','"+ JSGopherObjectsArray[nCount].parentID  +"',GopherCallerID);\n";

				contents = 
					[contents.slice(0, JSGopherObjectsArray[nCount].XStartPosition), 
					GopherTellInsert , 
					contents.slice(JSGopherObjectsArray[nCount].XStartPosition)].join('');
			}
		} else

	if (JSGopherObjectsArray[nCount].Type == "ForStatement")
		{
			
			var GopherTellInsert = "\nGopherTell("+ JSGopherObjectsArray[nCount].XLine + ",'" +
							"<b>For Loop</b> var:"+ JSGopherObjectsArray[nCount].InitName + 
							", value:'+"+ JSGopherObjectsArray[nCount].InitName + "+'', '" +
							JSGopherObjectsArray[nCount].parentID  +"',GopherCallerID);\n"; 
		
			contents = [contents.slice(0, JSGopherObjectsArray[nCount].XBodyStartPosition+1), GopherTellInsert , contents.slice(JSGopherObjectsArray[nCount].XBodyStartPosition+1)].join('');
			
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

			contents = [contents.slice(0, JSGopherObjectsArray[nCount].XStartPosition), GopherTellInsert , contents.slice(JSGopherObjectsArray[nCount].XStartPosition)].join('');
		} else

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

			var GopherTellInsert = "\nvar GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default';"+
"\nGopherTell("+ JSGopherObjectsArray[nCount].XLine + ",'<b>Function Run</b> ["+JSGopherObjectsArray[nCount].VarName+"] parameters:"+ ParamsText +" values: "+ParamsValue+"','"+ JSGopherObjectsArray[nCount].parentID +"',GopherCallerID);";

			contents = 
				[contents.slice(0, JSGopherObjectsArray[nCount].XStartPosition+FirstCurleyBracket+1), 
				GopherTellInsert, 
				contents.slice(JSGopherObjectsArray[nCount].XStartPosition+FirstCurleyBracket+1)].join('');
		}	
	}

	contents =	"//GopherB node Socket setup \n"+
							"var iosocket;\n"+
							"var GopherCallerIDCouter = 100;;\n"+
							"iosocket = io.connect();\n"+
							"iosocket.emit('HiGopherB','');\n"+
							"iosocket.emit('HiClientServer','');\n"+
							"\n\n" +
							"var GopherCallerID = '0:0';\n"+
							"function GopherTell(xCodeLine, xGopherMsg, xParentID, xGopherCallerID ) {\n" +
							" iosocket.emit( 'Gopher.Tell', {CodeLine:xCodeLine, GopherMsg:xGopherMsg, ParentID:xParentID, GopherCallerID:xGopherCallerID } );\n"+
							"}\n\n"+
							"//------------------------------------------------------------------------------\n"+
							"\n\n"+
							contents;
	return contents;
}


//----------------------------------------------------------------------------------------
//helper function handles file verification for the client files that will be converted
this.getFile = function(request, response)
{
	var fileName = request.url;
	if ((request.url=="") || (request.url=="/")) { fileName = '/index.html'; }
	
	var	ext = Globals.path.extname(fileName);
	var mimeType = Globals.extensions[ext];
	
	if(!Globals.extensions[ext]){ //do we support the requested file type?
		//for now just send a 404 and a short message
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.end("<html><head></head><body>The requested file type is not supported</body></html>");
	};

	var filePath = localFolder+fileName;
//	console.log("file:"+fileName+" url:"+request.url+" ext:"+ext+" filePath:"+filePath);

	Globals.fs.exists(filePath,function(exists)
	{
		//if it does...
		if(exists){
			Globals.fs.readFile(filePath,function(err,contents){
				if(!err){
					if ( (mimeType=="application/javascript") && 
							 (filePath.indexOf("jquery")==-1) ) //if javascript file try parsing it
					{
						
						//use https://github.com/balupton/jquery-syntaxhighlighter for highlighting
						Globals.socketServer.sockets.in("room1").emit('UpdateSourceView',{	sourcecode:'<pre class="language-javascript">'+contents+'</pre>' });
						
						var parsed = MakeJSONTreeFromJS(contents,filePath);

						//-------------------------------- INSERT EXTRA PARAMETER TO ALL FUNCTION CALLS
						var xmldata = "<project>"+ json2xml(parsed)+ "</project>";
						Globals.fs.writeFile(filePath+".gopher.xml",xmldata );

						var JSGopherFuctionCallArray = [];

						JSGopherFuctionCallArray = loopFunctionCalls(xmldata);
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
							console.log(GopherTellInsert);
							
							contents = 
								[contents.slice(0, JSGopherFuctionCallArray[nCount].CalleEnd-1), 
								GopherTellInsert , 
								contents.slice(JSGopherFuctionCallArray[nCount].CalleEnd-1)].join('');
						}
						Globals.fs.writeFile(filePath+".temp",contents);

						parsed = MakeJSONTreeFromJS(contents,filePath);
						var xmldata = "<project>"+ json2xml(parsed)+ "</project>";
						
						///----------------------------------------------------------------------------
						var JSGopherObjectsArray = [];
						JSGopherObjectsArray.FunctionCounter = 0;
						JSGopherObjectsArray.LoopCounter = 0;
						JSGopherObjectsArray = loopBody(xmldata,"BODY",0,JSGopherObjectsArray,"body");

						
						contents = InsertGopherTells(contents,JSGopherObjectsArray)

						response.writeHead(200,{ "Content-type" : mimeType, "Content-Length" : contents.length });
						response.end(contents);
					}	else
					{
						response.writeHead(200,{ "Content-type" : mimeType, "Content-Length" : contents.length });
						response.end(contents);
					}
				} else {
					//for our own troubleshooting
					console.dir(err);
				}
			});
		} else 
		{
			//if the requested file was not found serve-up our custom 404 page
			Globals.fs.readFile(page404,function(err,contents){
				if(!err){
						response.writeHead(404, {'Content-Type': 'text/html'});
						response.end(contents);
				} else {
						//for our own troubleshooting
						console.dir(err);
				};
			});
		}
	});
}


//----------------------------------------------------------------------------------------
this.InitLocalSocket = function(socket){

	console.log("Call binding Client Server socket");

	SocketIOHandle = socket; // store socket so we can use it in the rest of the module

	socket.on('HiClientServer', function(data) {
		console.log("HiClientServer called from client: "+socket.id);

		Globals.socketServer.sockets.in("room1").emit('HiClient', { text:"this is from Gopher Client Server"});
	});
		

}
