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


var boolD = GopherVarDecl(1,1,'boolD',!(numberC || boolB),'!(numberC || boolB)','body',GopherCallerID);
boolD = GopherAssignment(2,2,'boolD',!((numberA<numberB) || !(boolD)),'!((numberA<numberB) || !(boolD))','body',GopherCallerID,'=');
var bool4 = GopherVarDecl(3,3,'bool4',DoubleNumber(numberA,'3:'+(GopherCallerIDCouter++))>numberB,'DoubleNumber(numberA)>numberB','body',GopherCallerID);
var numberA = GopherVarDecl(4,4,'numberA',5,'5','body',GopherCallerID);	
var numberC = GopherVarDecl(5,5,'numberC',numberA,'numberA','body',GopherCallerID);
var numberC = GopherVarDecl(6,6,'numberC',!numberA,'!numberA','body',GopherCallerID);
var numberB = GopherVarDecl(7,7,'numberB',5+4,'5+4','body',GopherCallerID);	
numberA = GopherAssignment(8,8,'numberA',(((5+4) + (4+9)) * 5) / 3,'(((5+4) + (4+9)) * 5) / 3','body',GopherCallerID,'=');

var j=GopherVarDecl(10,9,'j',0,'0','body',GopherCallerID);
GopherTell(11,'<b>For Loop Init</b>','body',GopherCallerID); for (var i2=0; i2 < 3; i2++,cool('11:'+(GopherCallerIDCouter++)))
{
	j = GopherAssignment(13,10,'j',j + i2,'j + i2','body / l1',GopherCallerID,'=');
}

++numberA,GopherUpdateExpr(16,'numberA',numberA,'++','body',GopherCallerID);
BoolX = GopherAssignment(17,12,'BoolX',numberA>5,'numberA>5','body',GopherCallerID,'=');
numberA++,GopherUpdateExpr(18,'numberA',numberA,'++','body',GopherCallerID),cool('18:'+(GopherCallerIDCouter++));
numberA--,GopherUpdateExpr(19,'numberA',numberA,'--','body',GopherCallerID),cool('19:'+(GopherCallerIDCouter++));
numberA--,GopherUpdateExpr(20,'numberA',numberA,'--','body',GopherCallerID),cool('20:'+(GopherCallerIDCouter++)),numberB--,GopherUpdateExpr(20,'numberB',numberB,'--','body',GopherCallerID),cool('20:'+(GopherCallerIDCouter++));
numberA += GopherAssignment(21,17,'numberA',1,'1','body',GopherCallerID,'+=');
numberA -= GopherAssignment(22,18,'numberA',1,'1','body',GopherCallerID,'-=');
var numberZ = GopherVarDecl(23,19,'numberZ',numberA,'numberA','body',GopherCallerID);
var numberB = GopherVarDecl(24,20,'numberB',8,'8','body',GopherCallerID);
var strA = GopherVarDecl(25,21,'strA','Test String','\'Test String\'','body',GopherCallerID);
var boolA = GopherVarDecl(26,22,'boolA',numberA>numberB,'numberA>numberB','body',GopherCallerID);
var boolB = GopherVarDecl(27,23,'boolB',strA.indexOf("f")>0,'strA.indexOf("f")>0','body',GopherCallerID);
var boolC = GopherVarDecl(28,24,'boolC',!boolA,'!boolA','body',GopherCallerID);
var boolF = GopherVarDecl(29,25,'boolF',boolC,'boolC','body',GopherCallerID);

var boolG = GopherVarDecl(31,26,'boolG',!(boolC || ! boolB),'!(boolC || ! boolB)','body',GopherCallerID);
var bool4 = GopherVarDecl(32,27,'bool4',DoubleNumber(numberA,'32:'+(GopherCallerIDCouter++))>numberB,'DoubleNumber(numberA)>numberB','body',GopherCallerID);
var xheight = GopherVarDecl(33,28,'xheight',$(window).height(),'$(window).height()','body',GopherCallerID);
var initTest = GopherVarDecl(34,29,'initTest',AddNumbers(3,4,'34:'+(GopherCallerIDCouter++)),'AddNumbers(3,4)','body',GopherCallerID);
var person = GopherVarDecl(35,30,'person',{fname:"John", lname:"Doe", age:25},'{fname:"John", lname:"Doe", age:25}','body',GopherCallerID); 
var i=GopherVarDecl(36,31,'i',5,'5','body',GopherCallerID);
var j=GopherVarDecl(37,32,'j',i*4,'i*4','body',GopherCallerID);
var k=GopherVarDecl(38,33,'k',(j+i)/3,'(j+i)/3','body',GopherCallerID);
var m=GopherVarDecl(39,34,'m',k*AddNumbers(k,4,'39:'+(GopherCallerIDCouter++)),'k*AddNumbers(k,4)','body',GopherCallerID);
var n=GopherVarDecl(40,35,'n',"hi "+cool('40:'+(GopherCallerIDCouter++)),'"hi "+cool()','body',GopherCallerID);

var str1=GopherVarDecl(42,36,'str1',null,'null','body',GopherCallerID),str2=GopherVarDecl(42,37,'str2',null,'null','body',GopherCallerID),str3 = GopherVarDecl(42,38,'str3','ff','\'ff\'','body',GopherCallerID);
str1 = GopherAssignment(43,39,'str1',"ac",'"ac"','body',GopherCallerID,'='),str2 = GopherAssignment(43,40,'str2',"hello",'"hello"','body',GopherCallerID,'='),str3= GopherAssignment(43,41,'str3',"hi",'"hi"','body',GopherCallerID,'=');

var str3 = GopherVarDecl(45,42,'str3',"",'""','body',GopherCallerID);

str3 = GopherAssignment(47,43,'str3',"a"+"b",'"a"+"b"','body',GopherCallerID,'=');

var i=GopherVarDecl(49,44,'i',5,'5','body',GopherCallerID);
var j=GopherVarDecl(50,45,'j',null,'null','body',GopherCallerID);
var i1=GopherVarDecl(51,46,'i1',null,'null','body',GopherCallerID);

j = GopherAssignment(53,47,'j',0,'0','body',GopherCallerID,'=');




function cool()
{ var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default'; GopherTell(58,'<b>Function Run</b> [cool] parameters: values: ','body',GopherCallerID);
	console.log('cool');
	var text = GopherVarDecl(61,48,'text',"",'""','body / f1(cool)',GopherCallerID);
	var x=GopherVarDecl(62,49,'x',null,'null','body / f1(cool)',GopherCallerID);
	for (x in person) {
		text += GopherAssignment(64,50,'text',person[x],'person[x]','body / f1(cool)',GopherCallerID,'+=');
	}
	
	var returnstr =  text; GopherTell(67,'<b>Return:</b>'+ returnstr + '','body / f1(cool)',GopherCallerID); return returnstr;
}

function DoubleNumber(a)
{ var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default'; GopherTell(70,'<b>Function Run</b> [DoubleNumber] parameters:a,  values: '+a+', ','body',GopherCallerID);
	var returnstr =  a*2; GopherTell(72,'<b>Return:</b>'+ returnstr + '','body / f2(DoubleNumber)',GopherCallerID); return returnstr; 
}

function AddNumbers(a,b)
{ var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default'; GopherTell(75,'<b>Function Run</b> [AddNumbers] parameters:a, b,  values: '+a+', '+b+', ','body',GopherCallerID);
	var total = GopherVarDecl(77,51,'total',0,'0','body / f3(AddNumbers)',GopherCallerID);
	GopherTell(78,'<b>For Loop Init</b>','body / f3(AddNumbers)',GopherCallerID); for (var i=0; i<3; i++)
	{
		total = GopherAssignment(80,52,'total',total+a+b,'total+a+b','body / f3(AddNumbers) / l2',GopherCallerID,'=');
	}
	
	var returnstr =  DoubleNumber(total,'83:'+(GopherCallerIDCouter++)); GopherTell(83,'<b>Return:</b>'+ returnstr + '','body / f3(AddNumbers)',GopherCallerID); return returnstr;
}


GopherTell(87,'<b>For Loop Init</b>','body',GopherCallerID); for (i1=0; i1 < 3; i1++)
{
	j = GopherAssignment(89,53,'j',j + i1,'j + i1','body / l3',GopherCallerID,'=');
}

GopherTell(92,'<b>For Loop Init</b>','body',GopherCallerID); for (var i2=10; i2<14; i2++)
{
	j = GopherAssignment(94,54,'j',j + i2,'j + i2','body / l4',GopherCallerID,'=');
	i = GopherAssignment(95,55,'i',5+3+2+AddNumbers(i,j,'95:'+(GopherCallerIDCouter++)),'5+3+2+AddNumbers(i,j)','body / l4',GopherCallerID,'=');

}

i = GopherAssignment(99,56,'i',5+3+2+AddNumbers(i,6,'99:'+(GopherCallerIDCouter++)),'5+3+2+AddNumbers(i,6)','body',GopherCallerID,'=');

cool('101:'+(GopherCallerIDCouter++));

$(document).ready(function() {
 str1 = GopherAssignment(104,57,'str1',"hello world",'"hello world"','body',GopherCallerID,'=');
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
