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
var numberC = GopherVarDecl(2,2,'numberC',numberA,'numberA','body',GopherCallerID);
var numberC = GopherVarDecl(3,3,'numberC',!numberA,'!numberA','body',GopherCallerID);
var numberB = GopherVarDecl(4,4,'numberB',5+4,'5+4','body',GopherCallerID);	
numberA = GopherAssignment(5,5,'numberA',(((5+4) + (4+9)) * 5) / 3,'(((5+4) + (4+9)) * 5) / 3','body',GopherCallerID,'=');

++numberA,GopherUpdateExpr(7,'numberA',numberA,'++','body',GopherCallerID);
BoolX = GopherAssignment(8,7,'BoolX',numberA>5,'numberA>5','body',GopherCallerID,'=');
numberA++,GopherUpdateExpr(9,'numberA',numberA,'++','body',GopherCallerID),cool('9:'+(GopherCallerIDCouter++));
numberA--,GopherUpdateExpr(10,'numberA',numberA,'--','body',GopherCallerID),cool('10:'+(GopherCallerIDCouter++));
numberA--,GopherUpdateExpr(11,'numberA',numberA,'--','body',GopherCallerID),cool('11:'+(GopherCallerIDCouter++)),numberB--,GopherUpdateExpr(11,'numberB',numberB,'--','body',GopherCallerID),cool('11:'+(GopherCallerIDCouter++));
numberA += GopherAssignment(12,12,'numberA',1,'1','body',GopherCallerID,'+=');
numberA -= GopherAssignment(13,13,'numberA',1,'1','body',GopherCallerID,'-=');
var numberZ = GopherVarDecl(14,14,'numberZ',numberA,'numberA','body',GopherCallerID);
var numberB = GopherVarDecl(15,15,'numberB',8,'8','body',GopherCallerID);
var strA = GopherVarDecl(16,16,'strA','Test String','\'Test String\'','body',GopherCallerID);
var boolA = GopherVarDecl(17,17,'boolA',numberA>numberB,'numberA>numberB','body',GopherCallerID);
var boolB = GopherVarDecl(18,18,'boolB',strA.indexOf("f")>0,'strA.indexOf("f")>0','body',GopherCallerID);
var boolC = GopherVarDecl(19,19,'boolC',!boolA,'!boolA','body',GopherCallerID);
var boolF = GopherVarDecl(20,20,'boolF',boolC,'boolC','body',GopherCallerID);
var boolD = GopherVarDecl(21,21,'boolD',!(boolC || boolB),'!(boolC || boolB)','body',GopherCallerID);

boolD = GopherAssignment(23,22,'boolD',!((numberA<numberB) || !(boolD)),'!((numberA<numberB) || !(boolD))','body',GopherCallerID,'=');
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

var boolG = GopherVarDecl(38,23,'boolG',!(boolC || ! boolB),'!(boolC || ! boolB)','body',GopherCallerID);
var bool4 = GopherVarDecl(39,24,'bool4',DoubleNumber(numberA,'39:'+(GopherCallerIDCouter++))>numberB,'DoubleNumber(numberA)>numberB','body',GopherCallerID);
var xheight = GopherVarDecl(40,25,'xheight',$(window).height(),'$(window).height()','body',GopherCallerID);
var initTest = GopherVarDecl(41,26,'initTest',AddNumbers(3,4,'41:'+(GopherCallerIDCouter++)),'AddNumbers(3,4)','body',GopherCallerID);
var person = GopherVarDecl(42,27,'person',{fname:"John", lname:"Doe", age:25},'{fname:"John", lname:"Doe", age:25}','body',GopherCallerID); 
var i=GopherVarDecl(43,28,'i',5,'5','body',GopherCallerID);
var j=GopherVarDecl(44,29,'j',i*4,'i*4','body',GopherCallerID);
var k=GopherVarDecl(45,30,'k',(j+i)/3,'(j+i)/3','body',GopherCallerID);
var m=GopherVarDecl(46,31,'m',k*AddNumbers(k,4,'46:'+(GopherCallerIDCouter++)),'k*AddNumbers(k,4)','body',GopherCallerID);
var n=GopherVarDecl(47,32,'n',"hi "+cool('47:'+(GopherCallerIDCouter++)),'"hi "+cool()','body',GopherCallerID);

var str1=GopherVarDecl(49,33,'str1',null,'null','body',GopherCallerID),str2=GopherVarDecl(49,34,'str2',null,'null','body',GopherCallerID),str3 = GopherVarDecl(49,35,'str3','ff','\'ff\'','body',GopherCallerID);
str1 = GopherAssignment(50,36,'str1',"ac",'"ac"','body',GopherCallerID,'='),str2 = GopherAssignment(50,37,'str2',"hello",'"hello"','body',GopherCallerID,'='),str3= GopherAssignment(50,38,'str3',"hi",'"hi"','body',GopherCallerID,'=');

var str3 = GopherVarDecl(52,39,'str3',"",'""','body',GopherCallerID);

str3 = GopherAssignment(54,40,'str3',"a"+"b",'"a"+"b"','body',GopherCallerID,'=');

var i=GopherVarDecl(56,41,'i',5,'5','body',GopherCallerID);
var j=GopherVarDecl(57,42,'j',null,'null','body',GopherCallerID);
var i1=GopherVarDecl(58,43,'i1',null,'null','body',GopherCallerID);

j = GopherAssignment(60,44,'j',0,'0','body',GopherCallerID,'=');

var j=GopherVarDecl(62,45,'j',0,'0','body',GopherCallerID);
GopherTell(63,'<b>For Loop Init</b>','body',GopherCallerID); for (var i2=0; i2 < 3; i2++,cool('63:'+(GopherCallerIDCouter++)))
{
	j = GopherAssignment(65,46,'j',j + i2,'j + i2','body / l1',GopherCallerID,'=');
}



function cool()
{ var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default'; GopherTell(70,'<b>Function Run</b> [cool] parameters: values: ','body',GopherCallerID);
	console.log('cool');
	var text = GopherVarDecl(73,47,'text',"",'""','body / f1(cool)',GopherCallerID);
	var x=GopherVarDecl(74,48,'x',null,'null','body / f1(cool)',GopherCallerID);
	for (x in person) {
		text += GopherAssignment(76,49,'text',person[x],'person[x]','body / f1(cool)',GopherCallerID,'+=');
	}
	
	var returnstr =  text; GopherTell(79,'<b>Return:</b>'+ returnstr + '','body / f1(cool)',GopherCallerID); return returnstr;
}

function DoubleNumber(a)
{ var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default'; GopherTell(82,'<b>Function Run</b> [DoubleNumber] parameters:a,  values: '+a+', ','body',GopherCallerID);
	var returnstr =  a*2; GopherTell(84,'<b>Return:</b>'+ returnstr + '','body / f2(DoubleNumber)',GopherCallerID); return returnstr; 
}

function AddNumbers(a,b)
{ var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default'; GopherTell(87,'<b>Function Run</b> [AddNumbers] parameters:a, b,  values: '+a+', '+b+', ','body',GopherCallerID);
	var total = GopherVarDecl(89,50,'total',0,'0','body / f3(AddNumbers)',GopherCallerID);
	GopherTell(90,'<b>For Loop Init</b>','body / f3(AddNumbers)',GopherCallerID); for (var i=0; i<3; i++)
	{
		total = GopherAssignment(92,51,'total',total+a+b,'total+a+b','body / f3(AddNumbers) / l2',GopherCallerID,'=');
	}
	
	var returnstr =  DoubleNumber(total,'95:'+(GopherCallerIDCouter++)); GopherTell(95,'<b>Return:</b>'+ returnstr + '','body / f3(AddNumbers)',GopherCallerID); return returnstr;
}


GopherTell(99,'<b>For Loop Init</b>','body',GopherCallerID); for (i1=0; i1 < 3; i1++)
{
	j = GopherAssignment(101,52,'j',j + i1,'j + i1','body / l3',GopherCallerID,'=');
}

GopherTell(104,'<b>For Loop Init</b>','body',GopherCallerID); for (var i2=10; i2<14; i2++)
{
	j = GopherAssignment(106,53,'j',j + i2,'j + i2','body / l4',GopherCallerID,'=');
	i = GopherAssignment(107,54,'i',5+3+2+AddNumbers(i,j,'107:'+(GopherCallerIDCouter++)),'5+3+2+AddNumbers(i,j)','body / l4',GopherCallerID,'=');

}

i = GopherAssignment(111,55,'i',5+3+2+AddNumbers(i,6,'111:'+(GopherCallerIDCouter++)),'5+3+2+AddNumbers(i,6)','body',GopherCallerID,'=');

cool('113:'+(GopherCallerIDCouter++));

$(document).ready(function() {
 str1 = GopherAssignment(116,56,'str1',"hello world",'"hello world"','body',GopherCallerID,'=');
	$("#debug_console").html(str1);
});
