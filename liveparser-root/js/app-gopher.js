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
var numberB = GopherVarDecl(2,2,'numberB',5+4,'5+4','body',GopherCallerID);	
numberA = GopherAssignment(3,3,'numberA',(((5+4) + (4+9)) * 5) / 3,'(((5+4) + (4+9)) * 5) / 3','body',GopherCallerID,'=');

++numberA,GopherUpdateExpr(5,'numberA',numberA,'++','body',GopherCallerID);
BoolX = GopherAssignment(6,5,'BoolX',numberA>5,'numberA>5','body',GopherCallerID,'=');
numberA++,GopherUpdateExpr(7,'numberA',numberA,'++','body',GopherCallerID),cool('7:'+(GopherCallerIDCouter++));
numberA--,GopherUpdateExpr(8,'numberA',numberA,'--','body',GopherCallerID),cool('8:'+(GopherCallerIDCouter++));
numberA--,GopherUpdateExpr(9,'numberA',numberA,'--','body',GopherCallerID),cool('9:'+(GopherCallerIDCouter++)),numberB--,GopherUpdateExpr(9,'numberB',numberB,'--','body',GopherCallerID),cool('9:'+(GopherCallerIDCouter++));
numberA += GopherAssignment(10,10,'numberA',1,'1','body',GopherCallerID,'+=');
numberA -= GopherAssignment(11,11,'numberA',1,'1','body',GopherCallerID,'-=');
var numberZ = GopherVarDecl(12,12,'numberZ',numberA,'numberA','body',GopherCallerID);
var numberB = GopherVarDecl(13,13,'numberB',8,'8','body',GopherCallerID);
var strA = GopherVarDecl(14,14,'strA','Test String','\'Test String\'','body',GopherCallerID);
var boolA = GopherVarDecl(15,15,'boolA',numberA>numberB,'numberA>numberB','body',GopherCallerID);
var boolB = GopherVarDecl(16,16,'boolB',strA.indexOf("f")>0,'strA.indexOf("f")>0','body',GopherCallerID);
var boolC = GopherVarDecl(17,17,'boolC',!boolA,'!boolA','body',GopherCallerID);
var boolF = GopherVarDecl(18,18,'boolF',boolC,'boolC','body',GopherCallerID);
var boolD = GopherVarDecl(19,19,'boolD',!(boolC || boolB),'!(boolC || boolB)','body',GopherCallerID);

boolD = GopherAssignment(21,20,'boolD',!((numberA<numberB) || !(boolD)),'!((numberA<numberB) || !(boolD))','body',GopherCallerID,'=');
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

var boolG = GopherVarDecl(36,21,'boolG',!(boolC || ! boolB),'!(boolC || ! boolB)','body',GopherCallerID);
var bool4 = GopherVarDecl(37,22,'bool4',DoubleNumber(numberA,'37:'+(GopherCallerIDCouter++))>numberB,'DoubleNumber(numberA)>numberB','body',GopherCallerID);
var xheight = GopherVarDecl(38,23,'xheight',$(window).height(),'$(window).height()','body',GopherCallerID);
var initTest = GopherVarDecl(39,24,'initTest',AddNumbers(3,4,'39:'+(GopherCallerIDCouter++)),'AddNumbers(3,4)','body',GopherCallerID);
var person = GopherVarDecl(40,25,'person',{fname:"John", lname:"Doe", age:25},'{fname:"John", lname:"Doe", age:25}','body',GopherCallerID); 
var i=GopherVarDecl(41,26,'i',5,'5','body',GopherCallerID);
var j=GopherVarDecl(42,27,'j',i*4,'i*4','body',GopherCallerID);
var k=GopherVarDecl(43,28,'k',(j+i)/3,'(j+i)/3','body',GopherCallerID);
var m=GopherVarDecl(44,29,'m',k*AddNumbers(k,4,'44:'+(GopherCallerIDCouter++)),'k*AddNumbers(k,4)','body',GopherCallerID);
var n=GopherVarDecl(45,30,'n',"hi "+cool('45:'+(GopherCallerIDCouter++)),'"hi "+cool()','body',GopherCallerID);

var str1=GopherVarDecl(47,31,'str1',null,'null','body',GopherCallerID),str2=GopherVarDecl(47,32,'str2',null,'null','body',GopherCallerID),str3 = GopherVarDecl(47,33,'str3','ff','\'ff\'','body',GopherCallerID);
str1 = GopherAssignment(48,34,'str1',"ac",'"ac"','body',GopherCallerID,'='),str2 = GopherAssignment(48,35,'str2',"hello",'"hello"','body',GopherCallerID,'='),str3= GopherAssignment(48,36,'str3',"hi",'"hi"','body',GopherCallerID,'=');

var str3 = GopherVarDecl(50,37,'str3',"",'""','body',GopherCallerID);

str3 = GopherAssignment(52,38,'str3',"a"+"b",'"a"+"b"','body',GopherCallerID,'=');

var i=GopherVarDecl(54,39,'i',5,'5','body',GopherCallerID);
var j=GopherVarDecl(55,40,'j',null,'null','body',GopherCallerID);
var i1=GopherVarDecl(56,41,'i1',null,'null','body',GopherCallerID);

j = GopherAssignment(58,42,'j',0,'0','body',GopherCallerID,'=');

var j=GopherVarDecl(60,43,'j',0,'0','body',GopherCallerID);
GopherTell(61,'<b>For Loop Init</b>','body',GopherCallerID); for (var i2=0; i2 < 3; i2++,cool('61:'+(GopherCallerIDCouter++)))
{
	j = GopherAssignment(63,44,'j',j + i2,'j + i2','body / l1',GopherCallerID,'=');
}



function cool()
{ var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default'; GopherTell(68,'<b>Function Run</b> [cool] parameters: values: ','body',GopherCallerID);
	console.log('cool');
	var text = GopherVarDecl(71,45,'text',"",'""','body / f1(cool)',GopherCallerID);
	var x=GopherVarDecl(72,46,'x',null,'null','body / f1(cool)',GopherCallerID);
	for (x in person) {
		text += GopherAssignment(74,47,'text',person[x],'person[x]','body / f1(cool)',GopherCallerID,'+=');
	}
	
	var returnstr =  text; GopherTell(77,'<b>Return:</b>'+ returnstr + '','body / f1(cool)',GopherCallerID); return returnstr;
}

function DoubleNumber(a)
{ var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default'; GopherTell(80,'<b>Function Run</b> [DoubleNumber] parameters:a,  values: '+a+', ','body',GopherCallerID);
	var returnstr =  a*2; GopherTell(82,'<b>Return:</b>'+ returnstr + '','body / f2(DoubleNumber)',GopherCallerID); return returnstr; 
}

function AddNumbers(a,b)
{ var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default'; GopherTell(85,'<b>Function Run</b> [AddNumbers] parameters:a, b,  values: '+a+', '+b+', ','body',GopherCallerID);
	var total = GopherVarDecl(87,48,'total',0,'0','body / f3(AddNumbers)',GopherCallerID);
	GopherTell(88,'<b>For Loop Init</b>','body / f3(AddNumbers)',GopherCallerID); for (var i=0; i<3; i++)
	{
		total = GopherAssignment(90,49,'total',total+a+b,'total+a+b','body / f3(AddNumbers) / l2',GopherCallerID,'=');
	}
	
	var returnstr =  DoubleNumber(total,'93:'+(GopherCallerIDCouter++)); GopherTell(93,'<b>Return:</b>'+ returnstr + '','body / f3(AddNumbers)',GopherCallerID); return returnstr;
}


GopherTell(97,'<b>For Loop Init</b>','body',GopherCallerID); for (i1=0; i1 < 3; i1++)
{
	j = GopherAssignment(99,50,'j',j + i1,'j + i1','body / l3',GopherCallerID,'=');
}

GopherTell(102,'<b>For Loop Init</b>','body',GopherCallerID); for (var i2=10; i2<14; i2++)
{
	j = GopherAssignment(104,51,'j',j + i2,'j + i2','body / l4',GopherCallerID,'=');
	i = GopherAssignment(105,52,'i',5+3+2+AddNumbers(i,j,'105:'+(GopherCallerIDCouter++)),'5+3+2+AddNumbers(i,j)','body / l4',GopherCallerID,'=');

}

i = GopherAssignment(109,53,'i',5+3+2+AddNumbers(i,6,'109:'+(GopherCallerIDCouter++)),'5+3+2+AddNumbers(i,6)','body',GopherCallerID,'=');

cool('111:'+(GopherCallerIDCouter++));

$(document).ready(function() {
 str1 = GopherAssignment(114,54,'str1',"hello world",'"hello world"','body',GopherCallerID,'=');
	$("#debug_console").html(str1);
});
