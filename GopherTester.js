GopherB = require('./GopherBParser.js');
// 	contents = GopherB.ParseJSSource(contents, inFile, FileID);



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
