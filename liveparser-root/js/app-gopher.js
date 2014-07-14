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
var boolD = GopherVarDecl(17,18,'boolD',((numberA<numberB) || !(boolD)),'((numberA<numberB) || !(boolD))','body',GopherCallerID);
var bool4 = GopherVarDecl(18,19,'bool4',DoubleNumber(numberA,'18:'+(GopherCallerIDCouter++))>numberB,'DoubleNumber(numberA)>numberB','body',GopherCallerID);
var xheight = GopherVarDecl(19,20,'xheight',$(window).height(),'$(window).height()','body',GopherCallerID);
var initTest = GopherVarDecl(20,21,'initTest',AddNumbers(3,4,'20:'+(GopherCallerIDCouter++)),'AddNumbers(3,4)','body',GopherCallerID);
var person = GopherVarDecl(21,22,'person',{fname:"John", lname:"Doe", age:25},'{fname:"John", lname:"Doe", age:25}','body',GopherCallerID); 
var i=GopherVarDecl(22,23,'i',5,'5','body',GopherCallerID);
var j=GopherVarDecl(23,24,'j',i*4,'i*4','body',GopherCallerID);
var k=GopherVarDecl(24,25,'k',(j+i)/3,'(j+i)/3','body',GopherCallerID);
var m=GopherVarDecl(25,26,'m',k*AddNumbers(k,4,'25:'+(GopherCallerIDCouter++)),'k*AddNumbers(k,4)','body',GopherCallerID);
var n=GopherVarDecl(26,27,'n',"hi "+cool('26:'+(GopherCallerIDCouter++)),'"hi "+cool()','body',GopherCallerID);

var str1=GopherVarDecl(28,28,'str1',null,'null','body',GopherCallerID),str2=GopherVarDecl(28,29,'str2',null,'null','body',GopherCallerID),str3 = GopherVarDecl(28,30,'str3','ff','\'ff\'','body',GopherCallerID);
str1 = GopherAssignment(29,31,'str1',"ac",'"ac"','body',GopherCallerID,'='),str2 = GopherAssignment(29,32,'str2',"hello",'"hello"','body',GopherCallerID,'='),str3= GopherAssignment(29,33,'str3',"hi",'"hi"','body',GopherCallerID,'=');

var str3 = GopherVarDecl(31,34,'str3',"",'""','body',GopherCallerID);

str3 = GopherAssignment(33,35,'str3',"a"+"b",'"a"+"b"','body',GopherCallerID,'=');

var i=GopherVarDecl(35,36,'i',5,'5','body',GopherCallerID);
var j=GopherVarDecl(36,37,'j',null,'null','body',GopherCallerID);
var i1=GopherVarDecl(37,38,'i1',null,'null','body',GopherCallerID);

j = GopherAssignment(39,39,'j',0,'0','body',GopherCallerID,'=');

var j=GopherVarDecl(41,40,'j',0,'0','body',GopherCallerID);
GopherTell(42,'<b>For Loop Init</b>','body',GopherCallerID); for (var i2=0; i2 < 3; i2++,cool('42:'+(GopherCallerIDCouter++)))
{
	j = GopherAssignment(44,41,'j',j + i2,'j + i2','body / l1',GopherCallerID,'=');
}



function cool()
{ var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default'; GopherTell(49,'<b>Function Run</b> [cool] parameters: values: ','body',GopherCallerID);
	console.log('cool');
	var text = GopherVarDecl(52,42,'text',"",'""','body / f1(cool)',GopherCallerID);
	var x=GopherVarDecl(53,43,'x',null,'null','body / f1(cool)',GopherCallerID);
	for (x in person) {
		text += GopherAssignment(55,44,'text',person[x],'person[x]','body / f1(cool)',GopherCallerID,'+=');
	}
	
	var returnstr =  text; GopherTell(58,'<b>Return:</b>'+ returnstr + '','body / f1(cool)',GopherCallerID); return returnstr;
}

function DoubleNumber(a)
{ var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default'; GopherTell(61,'<b>Function Run</b> [DoubleNumber] parameters:a,  values: '+a+', ','body',GopherCallerID);
	var returnstr =  a*2; GopherTell(63,'<b>Return:</b>'+ returnstr + '','body / f2(DoubleNumber)',GopherCallerID); return returnstr; 
}

function AddNumbers(a,b)
{ var GopherCallerID = arguments.length ? arguments[arguments.length - 1] : 'default'; GopherTell(66,'<b>Function Run</b> [AddNumbers] parameters:a, b,  values: '+a+', '+b+', ','body',GopherCallerID);
	var total = GopherVarDecl(68,45,'total',0,'0','body / f3(AddNumbers)',GopherCallerID);
	GopherTell(69,'<b>For Loop Init</b>','body / f3(AddNumbers)',GopherCallerID); for (var i=0; i<3; i++)
	{
		total = GopherAssignment(71,46,'total',total+a+b,'total+a+b','body / f3(AddNumbers) / l2',GopherCallerID,'=');
	}
	
	var returnstr =  DoubleNumber(total,'74:'+(GopherCallerIDCouter++)); GopherTell(74,'<b>Return:</b>'+ returnstr + '','body / f3(AddNumbers)',GopherCallerID); return returnstr;
}


GopherTell(78,'<b>For Loop Init</b>','body',GopherCallerID); for (i1=0; i1 < 3; i1++)
{
	j = GopherAssignment(80,47,'j',j + i1,'j + i1','body / l3',GopherCallerID,'=');
}

GopherTell(83,'<b>For Loop Init</b>','body',GopherCallerID); for (var i2=10; i2<14; i2++)
{
	j = GopherAssignment(85,48,'j',j + i2,'j + i2','body / l4',GopherCallerID,'=');
	i = GopherAssignment(86,49,'i',5+3+2+AddNumbers(i,j,'86:'+(GopherCallerIDCouter++)),'5+3+2+AddNumbers(i,j)','body / l4',GopherCallerID,'=');

}

i = GopherAssignment(90,50,'i',5+3+2+AddNumbers(i,6,'90:'+(GopherCallerIDCouter++)),'5+3+2+AddNumbers(i,6)','body',GopherCallerID,'=');

cool('92:'+(GopherCallerIDCouter++));

$(document).ready(function() {
 str1 = GopherAssignment(95,51,'str1',"hello world",'"hello world"','body',GopherCallerID,'=');
	$("#debug_console").html(str1);
});
