GopherB = require('./GopherBParser.js');
// 	contents = GopherB.ParseJSSource(contents, inFile, FileID);

var http = require('http');
var fs = require('fs');
var qs = require('querystring');

//var index = fs.readFileSync('index.html');

http.createServer(function (req, res) {
	

    if (req.method == 'POST') {
        //console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
//            console.log("Partial body: " + body);
        });
		
        req.on('end', function () {
//         console.log("Body: " + body);

		var POST =  qs.parse(body);
			console.log("PARSE:  "+POST['filename']);
//			console.log("CONTENT:  "+POST['content']);
		
			contents = GopherB.ParseJSSource(POST['content'], "c:/temp/gopherdebug.js", "1");
			res.end(contents);
        });
		
//        res.writeHead(200, {'Content-Type': 'text/html'});
        
    }
    else
    {
        console.log("GET");
        //var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
        
		//var html = fs.readFileSync('index.html');
		var html = "hello";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
    }
	/*
    res.writeHead(200, {'Content-Type': 'text/html'});
	
	var index = fs.readFileSync('index.html');
	
	contents = GopherTellify(contents, inFile, FileID);
    // change the to 'text/plain' to 'text/html' it will work as your index page
	
    res.end(index);
	*/
}).listen(1337);


/*
function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}



function GopherTellFile(inFile,FileID)
{
//	var InsertContent = fs.readFileSync(__dirname + '/GopherBInsert.js');
	
	copyFile(__dirname + '/GopherBInsert.js',__dirname + '/liveparser-root/js/GopherBInsert.js', function() {} );
	
	fs.readFile(inFile, function (err, contents) {
		if (!err) {
			contents = GopherB.ParseJSSource(contents, inFile, FileID);
			fs.writeFile(inFile.replace(".js", "-gopher.js"), beautify(contents, {indent_size: 4})); //InsertContent + contents
		}
	});
}

GopherTellFile(__dirname + '/liveparser-root/js/app.js',0);
GopherTellFile(__dirname + '/liveparser-root/js/app-func.js',1);
GopherTellFile(__dirname + '/liveparser-root/js/calculator.js',2);
GopherTellFile(__dirname + '/liveparser-root/js/snake.js',3);

// **** IN RealTimeConsole.JS REF #002


//***** From Proxy Modify content with:
//contents = GopherTellify(contents, inFile, FileID);
*/