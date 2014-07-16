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


var numberA = GopherVarDecl(1,1,'numberA',5,'5','body',GopherCallerID);	
++numberA,GopherUpdateExpr(2,'numberA',numberA,'++','body',GopherCallerID);
BoolX = GopherAssignment(3,3,'BoolX',numberA>5,'numberA>5','body',GopherCallerID,'=');
numberA++,GopherUpdateExpr(4,'numberA',numberA,'++','body',GopherCallerID),cool('4:'+(GopherCallerIDCouter++));
numberA--,GopherUpdateExpr(5,'numberA',numberA,'--','body',GopherCallerID),cool('5:'+(GopherCallerIDCouter++));
numberA--,GopherUpdateExpr(6,'numberA',numberA,'--','body',GopherCallerID),cool('6:'+(GopherCallerIDCouter++)),numberB--,GopherUpdateExpr(6,'numberB',numberB,'--','body',GopherCallerID),cool('6:'+(GopherCallerIDCouter++));
numberA += GopherAssignment(7,8,'numberA',1,'1','body',GopherCallerID,'+=');
numberA -= GopherAssignment(8,9,'numberA',1,'1','body',GopherCallerID,'-=');
var numberZ = GopherVarDecl(9,10,'numberZ',numberA,'numberA','body',GopherCallerID);
var numberB = GopherVarDecl(10,11,'numberB',8,'8','body',GopherCallerID);
var strA = GopherVarDecl(11,12,'strA','Test String','\'Test String\'','body',GopherCallerID);
var boolA = GopherVarDecl(12,13,'boolA',numberA>numberB,'numberA>numberB','body',GopherCallerID);
var boolB = GopherVarDecl(13,14,'boolB',strA.indexOf("f")>0,'strA.indexOf("f")>0','body',GopherCallerID);
var boolC = GopherVarDecl(14,15,'boolC',!boolA,'!boolA','body',GopherCallerID);
var boolF = GopherVarDecl(15,16,'boolF',boolC,'boolC','body',GopherCallerID);
var boolD = GopherVarDecl(16,17,'boolD',!(boolC || boolB),'!(boolC || boolB)','body',GopherCallerID);
boolD = GopherAssignment(17,18,'boolD',((numberA<numberB) || !(boolD)),'((numberA<numberB) || !(boolD))','body',GopherCallerID,'=');
var boolG = GopherVarDecl(18,19,'boolG',!(boolC || ! boolB),'!(boolC || ! boolB)','body',GopherCallerID);
var bool4 = GopherVarDecl(19,20,'bool4',DoubleNumber(numberA,'19:'+(GopherCallerIDCouter++))>numberB,'DoubleNumber(numberA)>numberB','body',GopherCallerID);
var xheight = GopherVarDecl(20,21,'xheight',$(window).height(),'$(window).height()','body',GopherCallerID);
var initTest = GopherVarDecl(21,22,'initTest',AddNumbers(3,4,'21:'+(GopherCallerIDCouter++)),'AddNumbers(3,4)','body',GopherCallerID);
var person = GopherVarDecl(22,23,'person',{fname:"John", lname:"Doe", age:25},'{fname:"John", lname:"Doe", age:25}','body',GopherCallerID); 
var i=GopherVarDecl(23,24,'i',5,'5','body',GopherCallerID);
var j=GopherVarDecl(24,25,'j',i*4,'i*4','body',GopherCallerID);
var k=GopherVarDecl(25,26,'k',(j+i)/3,'(j+i)/3','body',GopherCallerID);
var m=GopherVarDecl(26,27,'m',k*AddNumbers(k,4,'26:'+(GopherCallerIDCouter++)),'k*AddNumbers(k,4)','body',GopherCallerID);
var n=GopherVarDecl(27,28,'n',"hi "+cool('27:'+(GopherCallerIDCouter++)),'"hi "+cool()','body',GopherCallerID);

var str1=GopherVarDecl(29,29,'str1',null,'null','body',GopherCallerID),str2=GopherVarDecl(29,30,'str2',null,'null','body',GopherCallerID),str3 = GopherVarDecl(29,31,'str3','ff','\'ff\'','body',GopherCallerID);
str1 = GopherAssignment(30,32,'str1',"ac",'"ac"','body',GopherCallerID,'='),str2 = GopherAssignment(30,33,'str2',"hello",'"hello"','body',GopherCallerID,'='),str3= GopherAssignment(30,34,'str3',"hi",'"hi"','body',GopherCallerID,'=');

var str3 = GopherVarDecl(32,35,'str3',"",'""','body',GopherCallerID);

str3 = GopherAssignment(34,36,'str3',"a"+"b",'"a"+"b"','body',GopherCallerID,'=');

var i=GopherVarDecl(36,37,'i',5,'5','body',GopherCallerID);
var j=GopherVarDecl(37,38,'j',null,'null','body',GopherCallerID);
var i1=GopherVarDecl(38,39,'i1',null,'null','body',GopherCallerID);

j = GopherAssignment(40,40,'j',0,'0','body',GopherCallerID,'=');

var j=GopherVarDecl(42,41,'j',0,'0','body',GopherCallerID);
GopherTell(43,'<b>For Loop Init</b>','body',GopherCallerID); for (var i2=0; i2 < 3; i2++,cool('43:'+(GopherCallerIDCouter++)))
{
	j = GopherAssignment(45,42,'j',j + i2,'j + i2','body / l1',GopherCallerID,'=');
}



function cool()
{ var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default'; GopherTell(50,'<b>Function Run</b> [cool] parameters: values: ','body',GopherCallerID);
	console.log('cool');
	var text = GopherVarDecl(53,43,'text',"",'""','body / f1(cool)',GopherCallerID);
	var x=GopherVarDecl(54,44,'x',null,'null','body / f1(cool)',GopherCallerID);
	for (x in person) {
		text += GopherAssignment(56,45,'text',person[x],'person[x]','body / f1(cool)',GopherCallerID,'+=');
	}
	
	var returnstr =  text; GopherTell(59,'<b>Return:</b>'+ returnstr + '','body / f1(cool)',GopherCallerID); return returnstr;
}

function DoubleNumber(a)
{ var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default'; GopherTell(62,'<b>Function Run</b> [DoubleNumber] parameters:a,  values: '+a+', ','body',GopherCallerID);
	var returnstr =  a*2; GopherTell(64,'<b>Return:</b>'+ returnstr + '','body / f2(DoubleNumber)',GopherCallerID); return returnstr; 
}

function AddNumbers(a,b)
{ var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default'; GopherTell(67,'<b>Function Run</b> [AddNumbers] parameters:a, b,  values: '+a+', '+b+', ','body',GopherCallerID);
	var total = GopherVarDecl(69,46,'total',0,'0','body / f3(AddNumbers)',GopherCallerID);
	GopherTell(70,'<b>For Loop Init</b>','body / f3(AddNumbers)',GopherCallerID); for (var i=0; i<3; i++)
	{
		total = GopherAssignment(72,47,'total',total+a+b,'total+a+b','body / f3(AddNumbers) / l2',GopherCallerID,'=');
	}
	
	var returnstr =  DoubleNumber(total,'75:'+(GopherCallerIDCouter++)); GopherTell(75,'<b>Return:</b>'+ returnstr + '','body / f3(AddNumbers)',GopherCallerID); return returnstr;
}


GopherTell(79,'<b>For Loop Init</b>','body',GopherCallerID); for (i1=0; i1 < 3; i1++)
{
	j = GopherAssignment(81,48,'j',j + i1,'j + i1','body / l3',GopherCallerID,'=');
}

GopherTell(84,'<b>For Loop Init</b>','body',GopherCallerID); for (var i2=10; i2<14; i2++)
{
	j = GopherAssignment(86,49,'j',j + i2,'j + i2','body / l4',GopherCallerID,'=');
	i = GopherAssignment(87,50,'i',5+3+2+AddNumbers(i,j,'87:'+(GopherCallerIDCouter++)),'5+3+2+AddNumbers(i,j)','body / l4',GopherCallerID,'=');

}

i = GopherAssignment(91,51,'i',5+3+2+AddNumbers(i,6,'91:'+(GopherCallerIDCouter++)),'5+3+2+AddNumbers(i,6)','body',GopherCallerID,'=');

cool('93:'+(GopherCallerIDCouter++));

$(document).ready(function() {
 str1 = GopherAssignment(96,52,'str1',"hello world",'"hello world"','body',GopherCallerID,'=');
	$("#debug_console").html(str1);
});
