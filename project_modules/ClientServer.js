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




//----------------------------------------------------------------------------------------
function AssignmentExpression(ExpressionPoint,VarArray)
{
	NewQ = new Object();
	NewQ.XLine = ExpressionPoint.find("loc").find("end").find("line").first().text();
	NewQ.XColumn = ExpressionPoint.find("loc").find("end").find("column").first().text();
	NewQ.XEndPosition = parseInt(ExpressionPoint.find("end").first().text(),10);
	NewQ.VarName = ExpressionPoint.find("left").find("name").first().text();
	NewQ.Xoperator = ExpressionPoint.find("operator").first().text();
	VarArray.push(NewQ); 

	Globals.socketServer.sockets.in("room1").emit('UpdateParserView',{
			htmlcode:"> Operator: "+ NewQ.Xoperator +", Line:"+NewQ.XLine+", Name:"+NewQ.VarName+" <br>"
		});
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
						var jQuery = cheerio.load(xmldata, {xmlMode: true});
						var i=0;
						jQuery(xmldata).children('body').each(function(){

							Globals.socketServer.sockets.in("room1").emit('UpdateParserView',{
									htmlcode:"> "+i+": "+ jQuery(this).find("type").first().text() +"<br>"
							});
							
							if (jQuery(this).find("type").first().text() == "ExpressionStatement")
							{

								if (jQuery(this).find("expression").first().find("type").first().text() == "AssignmentExpression")
								{

									NewQ = new Object();
									NewQ.XLine = jQuery(this).find("expression").first().find("loc").find("end").find("line").first().text();
									NewQ.XColumn = jQuery(this).find("expression").first().find("loc").find("end").find("column").first().text();
									NewQ.XEndPosition = parseInt(jQuery(this).find("expression").first().find("end").first().text(),10);
									NewQ.VarName = jQuery(this).find("expression").first().find("left").find("name").first().text();
									NewQ.Xoperator = jQuery(this).find("expression").first().find("operator").first().text();
									VarArray.push(NewQ); 

									Globals.socketServer.sockets.in("room1").emit('UpdateParserView',{
											htmlcode:"> Operator: "+ NewQ.Xoperator +", Line:"+NewQ.XLine+", Name:"+NewQ.VarName+" <br>"
										});
								}
							}
							
							i++;
						
						});
/*
						var VarArray = [];
						jQuery(xmldata).find('expression').each(function(){

							var ExpressionPoint = jQuery(this);

							var FirstLoop = true; //use Boolean to find to make sure the first type is AssignmentExpression, otherwise type could be a function with another type AssignmentExpression within 
							//seems like using :first has the same effect

							ExpressionPoint.find('type').each(function(){

								if ((jQuery(this).text() == "AssignmentExpression") && (FirstLoop))
								{
								//	$("#AssignmentExpression").append("> "+ $(this).text() +"<br>");
									AssignmentExpression(ExpressionPoint,VarArray);
								}
								FirstLoop = false;
							});
						});
	*/					
						var nCount = VarArray.length;
						while ( nCount > 0)
						{
							nCount--;
							console.log(VarArray[nCount].VarName + " " + VarArray[nCount].XEndPosition);
						
							contents = 
								[contents.slice(0, VarArray[nCount].XEndPosition+1), 
								"\niosocket.emit('Gopher.Tell','Line "+ VarArray[nCount].XLine + ": Variable ["+VarArray[nCount].VarName+"] set to:'+"+VarArray[nCount].VarName+");" , 
								contents.slice(VarArray[nCount].XEndPosition+1)].join('');
							
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
