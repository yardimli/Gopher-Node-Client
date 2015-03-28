<?php
$ProjectID = "105";

if(version_compare(phpversion(), "5.4.0") != -1){
  if (session_status() == PHP_SESSION_NONE) {
	session_start();
  }
} else {
  if(session_id() == '') {
	session_start();
  }
}


  
if (!isset($_SESSION['phpgopherstore'])){
	$phpgopherstore = array();
	$_SESSION["phpgopherstore"] = $phpgopherstore;
}

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$port      = $_SERVER['SERVER_PORT'];
$disp_port = ($protocol == 'http' && $port == 80 || $protocol == 'https' && $port == 443) ? '' : ":$port";


function preparePostFields($array) {
  $params = array();

  foreach ($array as $key => $value) {
    $params[] = $key . '=' . urlencode($value);
  }

  return implode('&', $params);
}


$ParentFileName = htmlentities($_SERVER['HTTP_REFERER']);


function GopherTell($xMessage,$xTags = "")
{
  $phpgopherstore = $_SESSION["phpgopherstore"];
  $backtr = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
//  var_dump($backtr); //DEBUG_BACKTRACE_IGNORE_ARGS
//  echo "Msg:".$xMessage." File:".$backtr[0]['file']." Line:".$backtr[0]['line']."--------------<br>";
  
  $phpgopherstore[] = (object) array("Msg"=>$xMessage, "Tags"=>$xTags, "FileName"=>$backtr[0]['file'], "CodeLine"=>$backtr[0]['line'],"Type"=>"pgt" );
  $_SESSION["phpgopherstore"] = $phpgopherstore;
  
//  echo "!".json_encode($phpgopherstore);
}


function GopherTrack($xValue,$xTags = "")
{
  $phpgopherstore = $_SESSION["phpgopherstore"];
  $backtr = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
//  var_dump($backtr); //DEBUG_BACKTRACE_IGNORE_ARGS
//  echo "Val:".json_encode($xValue)." File:".$backtr[0]['file']." Line:".$backtr[0]['line']."--------------<br>";

  $phpgopherstore[] = (object) array("VarValue"=>json_encode($xValue), "Tags"=>$xTags,  "FileName"=>$backtr[0]['file'], "CodeLine"=>$backtr[0]['line'],"Type"=>"pvt" );
  $_SESSION["phpgopherstore"] = $phpgopherstore;
  
//  echo "!".json_encode($phpgopherstore);
}


if ( ($_POST["type"]=="") && ($_GET["type"]=="") && 
	 (realpath(__FILE__) == realpath($_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_NAME'])) ) { 
	echo "Gopher Mini Project Admin<br>";
	
	$it = new RecursiveDirectoryIterator(dirname(__FILE__));
	foreach(new RecursiveIteratorIterator($it) as $phpfile)
	{
		$extension = pathinfo($phpfile, PATHINFO_EXTENSION);
		if ( (($extension=="php") && (stripos($phpfile,"gophermini.php") === false)) ||
		     ($extension=="js") || ($extension=="htm") || ($extension=="html") )
		{
			echo $phpfile."<br>";
		}
	}
	
	
}


if ($_POST["type"]=="body") { 

    $phpgopherstore = $_SESSION["phpgopherstore"];
//	echo "!".json_encode($phpgopherstore);
	
	$data = array('posttype' => 'trackdata', 'RuntimeTimeStamp' => $_POST['RuntimeTimeStamp'], 'data' => $_POST['data'], 'phpdata' => json_encode($phpgopherstore), 'ProjectID' => $ProjectID, 'ParentFileName' => $ParentFileName); 

	$url = 'http://localhost/gopherA/insertGopherMini2db.php';
	
	$ch = curl_init( $url );
	curl_setopt( $ch, CURLOPT_POST, 1);
	curl_setopt( $ch, CURLOPT_POSTFIELDS, preparePostFields($data));
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt( $ch, CURLOPT_HEADER, 0);
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

	$response = curl_exec( $ch );
	
	$phpgopherstore = array();
	$_SESSION["phpgopherstore"] = $phpgopherstore;
	
	$returnJson[] = array("success" => (bool) true );
	echo json_encode($returnJson);
} else


if ($_GET["type"]=="init") { 
	$_SESSION["xRuntimeTimeStamp"] = time();
	

	$it = new RecursiveDirectoryIterator(dirname(__FILE__));
	foreach(new RecursiveIteratorIterator($it) as $phpfile)
	{
		$extension = pathinfo($phpfile, PATHINFO_EXTENSION);
		if (($extension=="php") && (stripos($phpfile,"gophermini.php") === false))
		{
			//get contents of file
			$phpFileContents = file_get_contents($phpfile);

			//post unmodified source to GopherA
			$data = array('posttype' => 'source', 'source' => $phpFileContents, 'RuntimeTimeStamp' => $_SESSION["xRuntimeTimeStamp"], 'ProjectID' => $ProjectID, 'FileName' => $phpfile); 

			$url = 'http://localhost/gopherA/insertGopherMini2db.php';

			$ch = curl_init( $url );
			curl_setopt( $ch, CURLOPT_POST, 1);
			curl_setopt( $ch, CURLOPT_POSTFIELDS, preparePostFields($data));
			curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
			curl_setopt( $ch, CURLOPT_HEADER, 0);
			curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
			$response = curl_exec( $ch );
		//	echo "---".$response."----";
			
//			echo $extension." ".$file . "<br/> \n";
		}
	}
	
	//send helper javascript source

	header('Content-Type: application/javascript');

	echo "

var xRuntimeTimeStamp = ".$_SESSION["xRuntimeTimeStamp"].";

var xProjectID = ".$ProjectID.";
var GopherQueueLimit = 500;
var GMsgArray = [];
var GopherParentFile = \"". $_SERVER['HTTP_REFERER'] ."\";

var MaxMessageLoop = 250;

window.onerror = function(message, url, lineNumber) {
    try {
		if (GMsgArray.length<GopherQueueLimit) {
			var GMsg = new Object();
			GMsg.Type = 'er';
			GMsg.CodeLine = lineNumber;
			GMsg.FileName = url;
			GMsg.Msg = message;
			GMsgArray.push(GMsg);
		}
	
    }
    catch(e) {
        // squelch, because we don’t want to prevent method from returning true
    }
     
    //return true;
};



JSON.stringifyOnce = function(obj, replacer, indent){
    var printedObjects = [];
    var printedObjectKeys = [];

    function printOnceReplacer(key, value){
        if ( printedObjects.length > 100){ // browsers will not print more than 20K, I don't see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
        return 'object too long';
        }
        var printedObjIndex = false;
        printedObjects.forEach(function(obj, index){
            if(obj===value){
                printedObjIndex = index;
            }
        });

        if ( key == ''){ //root element
             printedObjects.push(obj);
            printedObjectKeys.push(\"root\");
             return value;
        }

        else if(printedObjIndex+\"\" != \"false\" && typeof(value)==\"object\"){
            if ( printedObjectKeys[printedObjIndex] == \"root\"){
                return \"(pointer to root)\";
            }else{
                return \"(see \" + ((!!value && !!value.constructor) ? value.constructor.name.toLowerCase()  : typeof(value)) + \" with key \" + printedObjectKeys[printedObjIndex] + \")\";
            }
        }else{

            var qualifiedKey = key || \"(empty key)\";
            printedObjects.push(value);
            printedObjectKeys.push(qualifiedKey);
            if(replacer){
                return replacer(key, value);
            }else{
                return value;
            }
        }
    }
    return JSON.stringify(obj, printOnceReplacer, indent);
};

function param(object) {
    var encodedString = '';
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (encodedString.length > 0) {
                encodedString += '&';
            }
            encodedString += encodeURI(prop + '=' + object[prop]);
        }
    }
    return encodedString;
}

 function GopherSend()
 {
	if ((GMsgArray.length !== 0) && (MaxMessageLoop>1))
	{
		MaxMessageLoop--;
		console.log(GMsgArray.length);
		var strdata = JSON.stringify(GMsgArray);
		var CurrentDataLength = GMsgArray.length;
//		console.log(strdata);


		var xhr = new XMLHttpRequest();
		xhr.open('POST',
		encodeURI('gopherMini.php'));
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		xhr.onload = function() {
			if (xhr.status === 200) {
				for (var i=0; i<CurrentDataLength; i++) {   GMsgArray.shift(); } 
				setTimeout(GopherSend, 1000);
				//var result2 = JSON.parse(xhr.responseText);
			} else
			if (xhr.status !== 200) {
				setTimeout(GopherSend, 1000);
			}
		};
		xhr.send(  param({type:\"body\", ProjectID:xProjectID, RuntimeTimeStamp:xRuntimeTimeStamp, ParentFileName:GopherParentFile, data:JSON.stringify(GMsgArray) }) );
	} else
	{
		setTimeout(GopherSend, 1000);	
	}
	
}

GopherSend();


//------------------------------------------------------------------------------
GopherTell = function (xCodeLine,xFileName,xMessage,xTags) {

	if (GMsgArray.length<GopherQueueLimit) {
		var GMsg = new Object();
		GMsg.Type = 'gt';
		GMsg.CodeLine = xCodeLine;
		GMsg.FileName = xFileName;
		GMsg.Msg = xMessage;
		GMsg.Tags = xTags;
		GMsgArray.push(GMsg);
	}
};

//------------------------------------------------------------------------------
GopherVarTrack = function (xCodeLine,xFileName,xVarName,xVarValue,xTags) {

	if (GMsgArray.length<GopherQueueLimit) {
		var GMsg = new Object();
		GMsg.Type = 'vt';
		GMsg.CodeLine = xCodeLine;
		GMsg.FileName = xFileName;
		GMsg.VarName = xVarName;

		if (typeof(xVarValue)===\"undefined\")
		{
			GMsg.VarValue = \"{UNDEFINED}\";
		} else
		if (Array.isArray(xVarValue))
		{
			GMsg.VarValue = xVarValue.toString();
		} else
		if (typeof(xVarValue)===\"object\")
		{
			GMsg.VarValue = JSON.stringifyOnce(xVarValue);
		} else
		if (isFunction(xVarValue))
		{
			GMsg.VarValue = \"{FUNCTION}\";
		} else
		{
			GMsg.VarValue = xVarValue;
		} 

		GMsg.Tags = xTags;
		GMsgArray.push(GMsg);
	}
};


";


	
	
} else 
if ($_GET["type"]=="track") {

	//********** make the jsFileURL work better than this in the future
	$jsFileURL = str_replace(basename(__FILE__)."?type=track&path=","",$_SERVER['REQUEST_URI']);
	//echo $protocol.$_SERVER['SERVER_NAME'].$jsFileURL;
	
	//get contents of file
	$jsFile = file_get_contents($protocol.$_SERVER['SERVER_NAME'].$jsFileURL);
	
	//post unmodified source to GopherA
	$data = array('posttype' => 'source', 'source' => $jsFile, 'RuntimeTimeStamp' => $_SESSION["xRuntimeTimeStamp"], 'ProjectID' => $ProjectID, 'FileName' => $jsFileURL); 
	
	$url = 'http://localhost/gopherA/insertGopherMini2db.php';
	
	$ch = curl_init( $url );
	curl_setopt( $ch, CURLOPT_POST, 1);
	curl_setopt( $ch, CURLOPT_POSTFIELDS, preparePostFields($data));
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt( $ch, CURLOPT_HEADER, 0);
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
	$response = curl_exec( $ch );
//	echo "---".$response."----";
	
	
	//modify javascript file
	$jsFile = preg_replace("/GopherTell(.*?)\(/s", "$0##gline,'". $jsFileURL ."',", $jsFile);
	
	$jsFile = preg_replace("/GopherVarTrack(.*?)\(/s", "$0##gline,'". $jsFileURL ."',##varname,", $jsFile);

	$jsFile = preg_replace("/##varname,(.*?)(,|\))/s", "'$1',$1,", $jsFile);


	$jsFileLines = explode("\n", str_replace(array("\r\n","\n\r","\r"),"\n",$jsFile) );
	
	$length = count($jsFileLines);
	for ($i=0; $i<$length; $i++)
	{
		$jsFileLines[$i] = str_replace('##gline',$i+1,$jsFileLines[$i]);
	}
	
	
	header('Content-Type: application/javascript');
	echo implode("\n",$jsFileLines);
}

?>