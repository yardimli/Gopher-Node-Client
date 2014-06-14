var Globals = require("../project_modules/Globals.js");
var cheerio = require('cheerio'); //https://github.com/cheeriojs/cheerio

var	localFolder = __dirname + '/../liveparser-root';
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
			TreeHTML += key + "<ul>";
			
			Object.keys(val).forEach(function(key) {  TreeHTML = recurse(TreeHTML, key, val[key] ); } );
			TreeHTML += "</ul>";
		} else
		{
			TreeHTML += "<li>"+ key + "<ul>";
			Object.keys(val).forEach(function(key) {  TreeHTML = recurse(TreeHTML, key, val[key] ); } );
			TreeHTML += "</ul></li>";
		}
	} else {
//		if (key=="start") {} else
//		if (key=="end") {} else
		{
			TreeHTML +=  "<li>" + key +  " = " + val + "</li>";
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
	var XLine = ExpressionPoint.find("loc").find("end").find("line").first().text();
	var XColumn = ExpressionPoint.find("loc").find("end").find("column").first().text();
	var XEndPosition = ExpressionPoint.find("end").first().text();

	var Xoperator = ExpressionPoint.find("operator").first().text();

	var XLeftType = ExpressionPoint.find("left").find("type").first().text();
	var XLeftName = ExpressionPoint.find("left").find("name").first().text();
	var XLeftValue = ExpressionPoint.find("left").find("value").first().text();

	var XRightType = ExpressionPoint.find("right").find("type").first().text();
	var XRightName = ExpressionPoint.find("right").find("name").first().text();
	var XRightValue = ExpressionPoint.find("right").find("value").first().text();

	NewQ = new Object();
	NewQ.XLine = XLine;
	NewQ.XColumn = XColumn;
	NewQ.XEndPosition = parseInt(XEndPosition,10);
	NewQ.VarName = XLeftName;
	VarArray.push(NewQ); 

	if (Globals.socketVar!=0) { 
		Globals.socketVar.emit('UpdateParserView',{
			htmlcode:"> Operator: "+ Xoperator +", Line:"+XLine+", Left: Type:"+XLeftType+", Name:"+XLeftName+", Value:"+XLeftValue+", Right: Type:"+XRightType+", Name:"+XRightName+", Value:"+XRightValue+", <br>"
		});
	}
}


//helper function handles file verification for the client files that will be converted
this.getFile = function(request, response)
{
	// (localFolder + filePathName + fileName),response,page404,Globals.extensions[ext]);	  	
	var fileName = Globals.path.basename(request.url) || 'index.html';
	var	ext = Globals.path.extname(fileName);
	var mimeType = Globals.extensions[ext];
	var filePathName = Globals.path.dirname(request.url);
	if (filePathName=="/") { } else { filePathName+="/";}

	console.log("path:"+filePathName+" file:"+fileName+" url:"+request.url+" ext:"+ext+" ");
	console.log("url:"+request.url);

	//do we support the requested file type?
	if(!Globals.extensions[ext]){
		//for now just send a 404 and a short message
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.end("<html><head></head><body>The requested file type is not supported</body></html>");
	};

	var filePath = localFolder+filePathName+fileName;

	
	console.log(filePath);
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

						parsed = Globals.acorn.parse(contents, options); 	
						//console.log(JSON.stringify(parsed, null, compact ? null : 2));
						Globals.fs.writeFile(filePath+".gopher",JSON.stringify(parsed, null, compact ? null : 2));
						Globals.fs.writeFile(filePath+".gopher.pure",JSON.stringify(parsed));
						
						TreeHTML2 = "<ul>";
						Object.keys(parsed).forEach(function(key) {  TreeHTML2 = recurse(TreeHTML2, key, parsed[key] ); } );
						TreeHTML2 += "</ul>";
						
						if (Globals.socketVar!=0) { 
							Globals.socketVar.emit('UpdateTreeView',{
								htmlcode:TreeHTML2
							});
						}
						
						//use json object convert it to xml and parse it with jQuery
						var xmldata = "<project>"+ json2xml(parsed)+ "</project>";
						Globals.fs.writeFile(filePath+".gopher.xml",xmldata );
						
						var jQuery = cheerio.load(xmldata, {xmlMode: true});

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
						
						var nCount = VarArray.length;
						while ( nCount > 0)
						{
							nCount--;
							console.log(VarArray[nCount].VarName + " " + VarArray[nCount].XEndPosition);
						
							contents = 
								[contents.slice(0, VarArray[nCount].XEndPosition+1), 
								"\nconsole.log('Line "+ VarArray[nCount].XLine + ": Variable ["+VarArray[nCount].VarName+"] set to:'+"+VarArray[nCount].VarName+");" , 
								contents.slice(VarArray[nCount].XEndPosition+1)].join('');
							
						}
						

						
						if (Globals.socketVar!=0) { 
							Globals.socketVar.emit('ParsedGopher',{
								filename:filePath,
								jsondata:JSON.stringify(parsed, null, compact ? null : 2) 
							});
						}

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