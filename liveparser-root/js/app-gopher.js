//GopherB node Socket setup 
var iosocket;
iosocket = io.connect();
iosocket.emit('HiGopherB','');
iosocket.emit('HiClientServer','');


var GopherCallerIDCouter = 100;
var GopherCallerID = '0:0';
function GopherTell(xCodeLine, xGopherMsg, xParentID, xGopherCallerID) {
 iosocket.emit( 'Gopher.Tell', {CodeLine:xCodeLine, GopherMsg:xGopherMsg, ParentID:xParentID, GopherCallerID:xGopherCallerID } );
}

//------------------------------------------------------------------------------
function GopherUnaryExpr(xCodeLine, xVarStr, xVarValue) {
 xVarValue = !xVarValue;
 iosocket.emit( 'Gopher.GopherUnaryExp', {CodeLine:xCodeLine, VarStr:xVarStr, VarValue:xVarValue, } );
 return xVarValue;
}

//------------------------------------------------------------------------------
function GopherUpdateExpr(xCodeLine, xVarName, xVarValue, xVarOperator, xParentID, xGopherCallerID ) {
 iosocket.emit( 'Gopher.GopherUpdateExp', {CodeLine:xCodeLine, VarName:xVarName, VarValue:xVarValue, VarOperator:xVarOperator,  ParentID:xParentID, GopherCallerID:xGopherCallerID } );
}

//------------------------------------------------------------------------------
function GopherVarDecl(xCodeLine, xVarDeclTrackID, xVarName, xVarValue, xVarStr, xParentID, xGopherCallerID ) {
 iosocket.emit( 'Gopher.VarDecl', {CodeLine:xCodeLine, VarDeclTrackID:xVarDeclTrackID, VarName:xVarName, VarValue:xVarValue, VarStr:xVarStr, ParentID:xParentID, GopherCallerID:xGopherCallerID } );
return xVarValue;
}

//------------------------------------------------------------------------------
function GopherAssignment(xCodeLine, xVarDeclTrackID, xVarName, xVarValue, xVarStr, xParentID, xGopherCallerID, xVarOperator, VarOperator ) {
 iosocket.emit( 'Gopher.GopherAssignment', {CodeLine:xCodeLine, VarDeclTrackID:xVarDeclTrackID, VarName:xVarName, VarValue:xVarValue, VarStr:xVarStr, ParentID:xParentID, GopherCallerID:xGopherCallerID, VarOperator:xVarOperator } );
return xVarValue;
}

//------------------------------------------------------------------------------
function GopherFunctionCall(xCodeLine, xFuncTrackID, xFuncStr, xFuncValue, xParentID, xGopherCallerID) {
 iosocket.emit( 'Gopher.FuncCall', {CodeLine:xCodeLine, FuncTrackID:xFuncTrackID, VarStr:xFuncStr, FuncValue:xFuncValue, ParentID:xParentID, GopherCallerID:xGopherCallerID } );
return xFuncValue;
}

//------------------------------------------------------------------------------


var boolD = !(numberC || boolB);
boolD = !((numberA<numberB) || !(boolD));
var bool4 = DoubleNumber(numberA)>numberB;
var numberA = 5;	
var numberC = numberA;
var numberC = !numberA;
var numberB = 5+4;	
numberA = (((5+4) + (4+9)) * 5) / 3;

var j=0;
for (var i2=0; i2 < 3; i2++,cool())
{
	j = j + i2;
}

++numberA;
BoolX = numberA>5;
numberA++,cool();
numberA--,cool();
numberA--,cool(),numberB--,cool();
numberA += 1;
numberA -= 1;
var numberZ = numberA;
var numberB = 8;
var strA = 'Test String';
var boolA = numberA>numberB;
var boolB = strA.indexOf("f")>0;
var boolC = !boolA;
var boolF = boolC;

var boolG = !(boolC || ! boolB);
var bool4 = DoubleNumber(numberA)>numberB;
var xheight = $(window).height();
var initTest = AddNumbers(3,4);
var person = {fname:"John", lname:"Doe", age:25}; 
var i=5;
var j=i*4;
var k=(j+i)/3;
var m=k*AddNumbers(k,4);
var n="hi "+cool();

var str1,str2,str3 = 'ff';
str1 = "ac",str2 = "hello",str3= "hi";

var str3 = "";

str3 = "a"+"b";

var i=5;
var j;
var i1;

j = 0;




function cool()
{
	console.log('cool');
	var text = "";
	var x;
	for (x in person) {
		text += person[x];
	}
	
	return text;
}

function DoubleNumber(a)
{
	return a*2; 
}

function AddNumbers(a,b)
{
	var total = 0;
	for (var i=0; i<3; i++)
	{
		total = total+a+b;
	}
	
	return DoubleNumber(total);
}


for (i1=0; i1 < 3; i1++)
{
	j = j + i1;
}

for (var i2=10; i2<14; i2++)
{
	j = j + i2;
	i = 5+3+2+AddNumbers(i,j);

}

i = 5+3+2+AddNumbers(i,6+5+4+3+2+1);

cool();

$(document).ready(function() {
 str1 = "hello world";
	$("#debug_console").html(str1);
});


/*
Temp1 = numberA<numberB;
Temp2 = !(boolD);
Temp3 = (Temp1 || Temp2);
Temp4 = !Temp3;
boolD = Temp4;

Temp_BoolD_1 = Helper("BoolD","Temp_BoolD_1",1,19,"numberA","numberB","<",numberA,numberB);
Temp_BoolD_2 = HelperNot("BoolD","Temp_BoolD_2",2,19,"boolD",boolD);
Temp_BoolD_3 = Helper("BoolD","Temp_BoolD_3",3,19,"Temp_BoolD_1","Temp_BoolD_2","||",Temp_BoolD_1,Temp_BoolD_2);
Temp_BoolD_4 = HelperNot("BoolD","Temp_BoolD_4",2,19,"Temp_BoolD_3",Temp_BoolD_3);
boolD = HelperSet(19,"boolD",Temp_BoolD_4,"boolD = !((numberA<numberB) || !(boolD));");
*/
