var Globals = require("../project_modules/Globals.js");
var cheerio = require('cheerio'); //https://github.com/cheeriojs/cheerio

var SocketIOHandle;

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


function parseVariableDeclaration(VarObj)
{
	var NewQ = new Object();
	NewQ.Type = "VariableDeclaration";
	NewQ.XLine = VarObj.find("loc").find("end").find("line").first().text();
	NewQ.XColumn = VarObj.find("loc").find("end").find("column").first().text();
	NewQ.XEndPosition = parseInt(VarObj.find("end").first().text(),10);

	NewQ.VarName = VarObj.find("id").find("name").first().text();

	if (VarObj.find("init").first().text()=="")
		{ NewQ.InitValue = "null"; } else
		{ NewQ.InitValue = VarObj.find("init").find("value").first().text(); }

	return NewQ;
}

function parseAssignmentExpression(varObj)
{
	var NewQ = new Object();
	NewQ.Type = "AssignmentExpression";
	NewQ.XLine = varObj.find("loc").find("end").find("line").first().text();
	NewQ.XColumn = varObj.find("loc").find("end").find("column").first().text();
	NewQ.XStartPosition = parseInt(varObj.find("start").first().text(),10);
	NewQ.XEndPosition = parseInt(varObj.find("end").first().text(),10);
	NewQ.VarName = varObj.find("left").find("name").first().text();
	NewQ.Xoperator = varObj.find("operator").first().text();
	
	NewQ.RightSideType = varObj.find("right").find("type").first().text();
	NewQ.RightSideValue = "";
	if (NewQ.RightSideType == "Literal")
	{
		NewQ.RightSideValue = varObj.find("right").find("value").first().text();
	}
	
	return NewQ;
}


function parseBinaryExpression(varObj)
{
	var NewQ = new Object();
	NewQ.Type = "BinaryExpression";
	NewQ.XLine = varObj.find("loc").find("start").find("line").first().text();
	NewQ.XColumn = varObj.find("loc").find("start").find("column").first().text();
	NewQ.XStartPosition = parseInt(varObj.find("start").first().text(),10);
	NewQ.XEndPosition = parseInt(varObj.find("end").first().text(),10);

	NewQ.LeftSideName = varObj.find("left").find("name").first().text();
	NewQ.LeftSideType = varObj.find("left").find("type").first().text();
	NewQ.LeftSideValue = "";
	if (NewQ.LeftSideType == "Literal")
	{
		NewQ.LeftSideValue = varObj.find("left").find("value").first().text();
	}
	
	NewQ.Xoperator = varObj.find("operator").first().text();
	
	NewQ.RightSideName = varObj.find("right").find("name").first().text();
	NewQ.RightSideType = varObj.find("right").find("type").first().text();
	NewQ.RightSideValue = "";
	if (NewQ.RightSideType == "Literal")
	{
		NewQ.RightSideValue = varObj.find("right").find("value").first().text();
	}
	
	return NewQ;
}


function parseForStatement(varObj)
{
	var NewQ = new Object();
	NewQ.Type = "ForStatement";
	NewQ.XLine = varObj.find("loc").find("start").find("line").first().text();
	NewQ.XColumn = varObj.find("loc").find("start").find("column").first().text();
	NewQ.XStartPosition = parseInt(varObj.find("start").first().text(),10);

	NewQ.InitName = "null";
	NewQ.InitValue = "null";

	if (varObj.find("init").find("type").first().text() == "AssignmentExpression")
	{
		var parentNode2 = varObj.find("init");
		var NewQ2 = parseAssignmentExpression(parentNode2);

		NewQ.InitName = NewQ2.VarName;
		NewQ.InitValue = NewQ2.RightSideValue;
	} else
	if (varObj.find("init").find("type").first().text() == "VariableDeclaration")
	{
		var parentNode2 = varObj.find("init").find("declarations").first();
		var NewQ2 = parseVariableDeclaration(parentNode2);

		NewQ.InitName = NewQ2.VarName;
		NewQ.InitValue = NewQ2.InitValue;
	}

	if (varObj.find("test").find("type").first().text() == "BinaryExpression")
	{
		var parentNode2 = varObj.find("test").first();
		var NewQ2 = parseBinaryExpression(parentNode2);

		NewQ.TestLeftSideName = NewQ2.LeftSideName;
		NewQ.TestLeftSideType = NewQ2.LeftSideType;
		NewQ.TestLeftSideValue = NewQ2.LeftSideValue;

		NewQ.TestOperator = NewQ2.Xoperator;

		NewQ.TestRightSideName = NewQ2.RightSideName;
		NewQ.TestRigthSideType = NewQ2.RightSideType;
		NewQ.TestRightSideValue = NewQ2.RightSideValue;
	}

	var jQuery = cheerio.load(varObj, {xmlMode: true});

	NewQ.VarParameters = [];
	jQuery(varObj).children("params").each(function(){
		NewQ.VarParameters.push(jQuery(this).find("name").text());
		//console.log( jQuery(this).find("name").text() );
	});
	
	return NewQ;
}

function parseFunctionDeclaration(varObj)
{
	var NewQ = new Object();
	NewQ.Type = "FunctionDeclaration";
	NewQ.XLine = varObj.find("loc").find("start").find("line").first().text();
	NewQ.XColumn = varObj.find("loc").find("start").find("column").first().text();
	NewQ.XStartPosition = parseInt(varObj.find("start").first().text(),10);
	NewQ.VarName = varObj.find("id").find("name").first().text();

	NewQ.VarParameters = [];
	
	var jQuery = cheerio.load(varObj, {xmlMode: true});

	jQuery(varObj).children("params").each(function(){
		NewQ.VarParameters.push(jQuery(this).find("name").text());
		//console.log( jQuery(this).find("name").text() );
	});

	return NewQ;
}

function loopBody(tree,parentType,Xlevel,VarArray)
{
	var i=0;
	Xlevel++;
	
	var jQuery = cheerio.load(tree, {xmlMode: true});
	
	jQuery(tree).children('body').each(function(){
		var BodyType = jQuery(this).find("type").first().text();
	//	console.log('l:'+Xlevel+', t:'+BodyType+', p:'+ parentType +', b:'+jQuery(this).find('body').length);
		
		
		Globals.socketServer.sockets.in("room1").emit('UpdateParserView',{
				htmlcode:'l:'+Xlevel+', b:'+jQuery(this).children('body').length +' p:'+ parentType +', t:'+BodyType+'<br>'
		});
		//------------------------------------------------------------------------------------------------
		
		if (BodyType == "ForStatement")
		{
				var parentNode =jQuery(this);
				NewQ = parseForStatement(parentNode);
				VarArray.push(NewQ); 

//				Globals.socketServer.sockets.in("room1").emit('UpdateParserView',{
//						htmlcode:"  >Function Line:"+NewQ.XLine+", Name:"+NewQ.VarName+"<br>"
//					});

		}

		if (BodyType == "FunctionDeclaration")
		{
				var parentNode =jQuery(this);
				NewQ = parseFunctionDeclaration(parentNode);
				VarArray.push(NewQ); 

//				Globals.socketServer.sockets.in("room1").emit('UpdateParserView',{
//						htmlcode:"  >Function Line:"+NewQ.XLine+", Name:"+NewQ.VarName+"<br>"
//					});
		}


		if (BodyType == "VariableDeclaration")
		{
			if (jQuery(this).find("declarations").first().find("type").first().text() == "VariableDeclarator")
			{
				var parentNode = jQuery(this).find("declarations").first();
				NewQ = parseVariableDeclaration(parentNode);
				VarArray.push(NewQ); 

//				Globals.socketServer.sockets.in("room1").emit('UpdateParserView',{
//						htmlcode:"  >Decleration Line:"+NewQ.XLine+", Name:"+NewQ.VarName+" Init:"+NewQ.InitValue+" <br>"
//					});
			}
		}

		if (BodyType == "ExpressionStatement")
		{
			if (jQuery(this).find("expression").first().find("type").first().text() == "AssignmentExpression")
			{
				var parentNode =jQuery(this).find("expression").first();				
				NewQ = parseAssignmentExpression(parentNode);
				VarArray.push(NewQ); 

//				Globals.socketServer.sockets.in("room1").emit('UpdateParserView',{
//						htmlcode:"  >Assignment Line:"+NewQ.XLine+", Name:"+NewQ.VarName+", Operator: "+ NewQ.Xoperator +"<br>"
//					});
			}
		}
		//------------------------------------------------------------------------------------------------
		
		//if this node has a body inside loop it 
		if ( jQuery(this).children('body').length > 0)
		{
			loopBody(this,parentType+" --> "+BodyType,Xlevel,VarArray );
		}
	});
	return VarArray;
}

//helper function handles file verification for the client files that will be converted
this.getFile = function(request, response)
{
	var	localFolder = __dirname + '/../liveparser-root';
	localFolder = localFolder.replace(/\\/g,'/');

	var	page404 = localFolder + '/404.html';

	var fileName = request.url;
	if ((request.url=="") || (request.url=="/")) { 
		fileName = '/index.html'; 
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

//	console.log("file:"+fileName+" url:"+request.url+" ext:"+ext+" filePath:"+filePath);

	Globals.fs.exists(filePath,function(exists)
	{
		//if it does...
		if(exists){
			//read the fiule, run the anonymous function
			Globals.fs.readFile(filePath,function(err,contents){
				if(!err){
					//if javascript file try parsing it
					if ( (mimeType=="application/javascript") && (filePath.indexOf("jquery")==-1) )
					{
						var options = {};
						options.locations = true; 
						var compact = false;
						var ExpressionPoint;
						var jQuery;
						var TreeHTML2;
						
						var SourceCode = contents.toString();
						
						
						//use https://github.com/balupton/jquery-syntaxhighlighter for highlighting
						Globals.socketServer.sockets.in("room1").emit('UpdateSourceView',{	sourcecode:'<pre class="language-javascript">'+SourceCode+'</pre>' });

						parsed = Globals.acorn.parse(contents, options); 	
						//console.log(JSON.stringify(parsed, null, compact ? null : 2));
						Globals.fs.writeFile(filePath+".gopher",JSON.stringify(parsed, null, compact ? null : 2));
						Globals.fs.writeFile(filePath+".gopher.pure",JSON.stringify(parsed));
						
						TreeHTML2 = "<ul>";
						Object.keys(parsed).forEach(function(key) {  TreeHTML2 = recurse(TreeHTML2, key, parsed[key] ); } );
						TreeHTML2 += "</ul>";
						Globals.fs.writeFile(filePath+".gopher.tree.html",TreeHTML2);
						
						Globals.socketServer.sockets.in("room1").emit('UpdateTreeView',{	htmlcode:'<div class="tree">'+TreeHTML2+'</div>' });
						
						//use json object convert it to xml and parse it with jQuery
//						parsed = parsed.replace(/</g,'&lt;');
//						parsed = parsed.replace(/>/g,'&gt;');

						var xmldata = "<project>"+ json2xml(parsed)+ "</project>";
						Globals.fs.writeFile(filePath+".gopher.xml",xmldata );
						
						var VarArray = [];
						VarArray = loopBody(xmldata,"BODY",0,VarArray);

						var nCount = VarArray.length;
						while ( nCount > 0)
						{
							nCount--;
							
							if (VarArray[nCount].Type == "AssignmentExpression")
							{
								console.log(VarArray[nCount].VarName + " " + VarArray[nCount].XEndPosition);

								contents = 
									[contents.slice(0, VarArray[nCount].XEndPosition+1), 
									"\niosocket.emit('Gopher.Tell','Line "+ VarArray[nCount].XLine + ": Variable ["+VarArray[nCount].VarName+"] set to:'+"+VarArray[nCount].VarName+"+', Right Side Type/Value:["+ VarArray[nCount].RightSideType + "/" + VarArray[nCount].RightSideValue+"]');" , 
									contents.slice(VarArray[nCount].XEndPosition+1)].join('');

								contents = 
									[contents.slice(0, VarArray[nCount].XStartPosition), 
									"\niosocket.emit('Gopher.Tell','Line "+ VarArray[nCount].XLine + ": Variable ["+VarArray[nCount].VarName+"] is being set as Type/Value ["+ VarArray[nCount].RightSideType + "/" + VarArray[nCount].RightSideValue + "]');\n" , 
									contents.slice(VarArray[nCount].XStartPosition)].join('');
							
							} else

							if (VarArray[nCount].Type == "ForStatement")
							{
//								console.log(VarArray[nCount].VarName + " " + VarArray[nCount].XEndPosition);

									var GopherTellStr = "\niosocket.emit('Gopher.Tell','Line "+ VarArray[nCount].XLine + ": For Loop init[name:"+ VarArray[nCount].InitName + ", value:"+ VarArray[nCount].InitValue + "] test[ operator["+ VarArray[nCount].TestOperator +"] left[name:"+ VarArray[nCount].TestLeftSideName + ", type:"+ VarArray[nCount].TestLeftSideType + ", value:"+ VarArray[nCount].TestLeftSideValue + "] right[name:"+ VarArray[nCount].TestRightSideName + ", type:"+ VarArray[nCount].TestRigthSideType + ", value:"+ VarArray[nCount].TestRightSideValue + "] ]' );\n"; 
		
							
								contents = [contents.slice(0, VarArray[nCount].XStartPosition), GopherTellStr , contents.slice(VarArray[nCount].XStartPosition)].join('');
							} else
							
							if (VarArray[nCount].Type == "VariableDeclaration")
							{
								console.log(VarArray[nCount].VarName + " " + VarArray[nCount].XEndPosition);

								contents = 
									[contents.slice(0, VarArray[nCount].XEndPosition+1), 
									"\niosocket.emit('Gopher.Tell','Line "+ VarArray[nCount].XLine + ": Variable Decleration ["+VarArray[nCount].VarName+"] set to:"+VarArray[nCount].InitValue+"');" , 
									contents.slice(VarArray[nCount].XEndPosition+1)].join('');
							} else
								
							if (VarArray[nCount].Type == "FunctionDeclaration")
							{
								
							  var ParamsText = "";
								var ParamsValue = "";
								for (var pcounter=0; pcounter< VarArray[nCount].VarParameters.length; pcounter++ )
								{
									ParamsText += VarArray[nCount].VarParameters[pcounter] + ", ";
									ParamsValue += "'+" + VarArray[nCount].VarParameters[pcounter] + "+', ";
								}
								
								var tempstring = contents.substring(VarArray[nCount].XStartPosition);
								
								var FirstCurleyBracket = tempstring.indexOf("{");
								
								contents = 
									[contents.slice(0, VarArray[nCount].XStartPosition+FirstCurleyBracket+1), 
									"\niosocket.emit('Gopher.Tell','Line "+ VarArray[nCount].XLine + ": Function Call ["+VarArray[nCount].VarName+"] parameters:"+ ParamsText +" values: "+ParamsValue+"');" , 
									contents.slice(VarArray[nCount].XStartPosition+FirstCurleyBracket+1)].join('');
							}	
						}
						
						contents = "\n\
var iosocket;\n\
iosocket = io.connect();\n\
iosocket.emit('HiGopherB','');\n\
iosocket.emit('HiClientServer','');\n\
\n\n" +  contents;

						

						response.writeHead(200,{
								"Content-type" : mimeType,
								"Content-Length" : contents.length
						});
						response.end(contents);
						
					}	else
					{
						response.writeHead(200,{
								"Content-type" : mimeType,
								"Content-Length" : contents.length
						});
						response.end(contents);
					}
				} else {
					//for our own troubleshooting
					console.dir(err);
				}
			});
		} else 
		{
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
		}
	});
}

this.InitLocalSocket = function(socket){

	console.log("Call binding Client Server socket");

	SocketIOHandle = socket; // store socket so we can use it in the rest of the module

	socket.on('HiClientServer', function(data) {
		console.log("HiClientServer called from client: "+socket.id);

		Globals.socketServer.sockets.in("room1").emit('HiClient', { text:"this is from Gopher Client Server"});
	});
		

}
