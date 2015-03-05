<?php
function preparePostFields($array) {
  $params = array();

  foreach ($array as $key => $value) {
    $params[] = $key . '=' . urlencode($value);
  }

  return implode('&', $params);
}

$ProjectID = "101";
$ParentFileName = htmlentities($_SERVER['HTTP_REFERER']);

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$port      = $_SERVER['SERVER_PORT'];
$disp_port = ($protocol == 'http' && $port == 80 || $protocol == 'https' && $port == 443) ? '' : ":$port";
$jsFileURL = str_replace(basename(__FILE__)."?path=","",$_SERVER['REQUEST_URI']);

//get and modify helper
if ($_GET["path"]=="main") {
	$jsFile = file_get_contents($protocol.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF'])."/GopherBInsert.js");
	
	$jsFile = str_replace("/*PLACEHOLDERFORINSERT*/","var GFileMap = [];
var xProjectID = \"".$ProjectID."\"; //**** updated from proxy
var xParentFileName = \"".$ParentFileName."\"; ",$jsFile);

	header('Content-Type: application/javascript');
	echo $jsFile;
} else
//get parse and send javascripts
{
	$jsFile = file_get_contents($protocol.$_SERVER['SERVER_NAME'].$jsFileURL);
	
	$url = 'http://localhost:1337';
	
	$data = array('filename' => $jsFileURL, 'content' => $jsFile); 

	$ch = curl_init( $url );
	curl_setopt( $ch, CURLOPT_POST, 1);
	curl_setopt( $ch, CURLOPT_POSTFIELDS, preparePostFields($data));
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt( $ch, CURLOPT_HEADER, 0);
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

	$response = curl_exec( $ch );

	header('Content-Type: application/javascript');
	echo $response;
}
?>