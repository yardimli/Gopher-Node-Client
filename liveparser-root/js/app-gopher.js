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


var Temp_1 = GopherHelperF('||',numberC,boolB,'Temp_1','numberC','boolB'),
var Temp_2 = GopherHelperF('!',Temp_1,null,'Temp_2','(numberC || boolB)',''),
var boolD = GopherSetF('boolD','boolD = !(numberC || boolB)',Temp_2,'=',true,'');
var Temp_1 = GopherHelperF('<',numberA,numberB,'Temp_1','numberA','numberB'),
var Temp_2 = GopherHelperF('!',(boolD),null,'Temp_2','(boolD)',''),
var Temp_3 = GopherHelperF('||',Temp_1,Temp_2,'Temp_3','(numberA<numberB)','!(boolD)'),
var Temp_4 = GopherHelperF('!',Temp_3,null,'Temp_4','((numberA<numberB) || !(boolD))',''),
boolD = GopherSetF('boolD','boolD = !((numberA<numberB) || !(boolD))',Temp_4,'=',true,'');
var Temp_1 = GopherHelperF('>',DoubleNumber(numberA),numberB,'Temp_1','DoubleNumber(numberA)','numberB'),
var bool4 = GopherSetF('bool4','bool4 = DoubleNumber(numberA)>numberB',Temp_1,'=',true,'');
var numberA = GopherSetF('numberA','numberA = 5',5,'=',false,'');	
var numberC = GopherSetF('numberC','numberC = numberA',numberA,'=',false,'');
var Temp_1 = GopherHelperF('!',numberA,null,'Temp_1','numberA',''),
var numberC = GopherSetF('numberC','numberC = !numberA',Temp_1,'=',true,'');
var Temp_1 = GopherHelperF('+',5,4,'Temp_1','5','4'),
var numberB = GopherSetF('numberB','numberB = 5+4',Temp_1,'=',true,'');	
var Temp_1 = GopherHelperF('+',5,4,'Temp_1','5','4'),
var Temp_2 = GopherHelperF('+',4,9,'Temp_2','4','9'),
var Temp_3 = GopherHelperF('+',Temp_1,Temp_2,'Temp_3','(5+4)','(4+9)'),
var Temp_4 = GopherHelperF('*',Temp_3,5,'Temp_4','((5+4) + (4+9))','5'),
var Temp_5 = GopherHelperF('/',Temp_4,3,'Temp_5','(((5+4) + (4+9)) * 5)','3'),
numberA = GopherSetF('numberA','numberA = (((5+4) + (4+9)) * 5) / 3',Temp_5,'=',true,'');

var j = GopherSetF('j','j=0',0,'=',false,'');
for (var i2 = GopherSetF('i2','i2=0',0,'=',false,''); i2 < 3; (tempVar = i2, i2= GopherSetF('i2','i2++',null,'++',false,'false'), tempVar),cool())
{
	var Temp_1 = GopherHelperF('+',j,i2,'Temp_1','j','i2'),
j = GopherSetF('j','j = j + i2',Temp_1,'=',true,'');
}

(tempVar = numberA, numberA= GopherSetF('numberA','++numberA',null,'++',false,'true'), tempVar);
var Temp_1 = GopherHelperF('>',numberA,5,'Temp_1','numberA','5'),
BoolX = GopherSetF('BoolX','BoolX = numberA>5',Temp_1,'=',true,'');
(tempVar = numberA, numberA= GopherSetF('numberA','numberA++',null,'++',false,'false'), tempVar),cool();
(tempVar = numberA, numberA= GopherSetF('numberA','++numberA',null,'++',false,'true'), tempVar),cool();
(tempVar = numberA, numberA= GopherSetF('numberA','numberA--',null,'--',false,'false'), tempVar),cool();
(tempVar = numberA, numberA= GopherSetF('numberA','numberA--',null,'--',false,'false'), tempVar),cool(),(tempVar = numberB, numberB= GopherSetF('numberB','numberB--',null,'--',false,'false'), tempVar),cool();
numberA = GopherSetF('numberA','numberA += 1',1,'+=',false,'');
numberA = GopherSetF('numberA','numberA -= 1',1,'-=',false,'');
var numberZ = GopherSetF('numberZ','numberZ = numberA',numberA,'=',false,'');
var numberB = GopherSetF('numberB','numberB = 8',8,'=',false,'');
var strA = GopherSetF('strA','strA = 'Test String'','Test String','=',false,'');
var Temp_1 = GopherHelperF('>',numberA,numberB,'Temp_1','numberA','numberB'),
var boolA = GopherSetF('boolA','boolA = numberA>numberB',Temp_1,'=',true,'');
var Temp_1 = GopherHelperF('>',strA.indexOf("f"),0,'Temp_1','strA.indexOf("f")','0'),
var boolB = GopherSetF('boolB','boolB = strA.indexOf("f")>0',Temp_1,'=',true,'');
var Temp_1 = GopherHelperF('!',boolA,null,'Temp_1','boolA',''),
var boolC = GopherSetF('boolC','boolC = !boolA',Temp_1,'=',true,'');
var boolF = GopherSetF('boolF','boolF = boolC',boolC,'=',false,'');

var Temp_1 = GopherHelperF('||',boolC,! boolB,'Temp_1','boolC','! boolB'),
var Temp_2 = GopherHelperF('!',boolB,null,'Temp_2','boolB',''),
var Temp_3 = GopherHelperF('!',Temp_1,null,'Temp_3','(boolC || ! boolB)',''),
var boolG = GopherSetF('boolG','boolG = !(boolC || ! boolB)',Temp_3,'=',true,'');
var Temp_1 = GopherHelperF('>',DoubleNumber(numberA),numberB,'Temp_1','DoubleNumber(numberA)','numberB'),
var bool4 = GopherSetF('bool4','bool4 = DoubleNumber(numberA)>numberB',Temp_1,'=',true,'');
var xheight = GopherSetF('xheight','xheight = $(window).height()',$(window).height(),'=',false,'');
var initTest = GopherSetF('initTest','initTest = AddNumbers(3,4)',AddNumbers(3,4),'=',false,'');
var person = GopherSetF('person','person = {fname:"John", lname:"Doe", age:25}',{fname:"John", lname:"Doe", age:25},'=',false,''); 
var i = GopherSetF('i','i=5',5,'=',false,'');
var Temp_1 = GopherHelperF('*',i,4,'Temp_1','i','4'),
var j = GopherSetF('j','j=i*4',Temp_1,'=',true,'');
var Temp_1 = GopherHelperF('+',j,i,'Temp_1','j','i'),
var Temp_2 = GopherHelperF('/',Temp_1,3,'Temp_2','(j+i)','3'),
var k = GopherSetF('k','k=(j+i)/3',Temp_2,'=',true,'');
var Temp_1 = GopherHelperF('*',k,AddNumbers(k,4),'Temp_1','k','AddNumbers(k,4)'),
var m = GopherSetF('m','m=k*AddNumbers(k,4)',Temp_1,'=',true,'');
var Temp_1 = GopherHelperF('+',"hi ",cool(),'Temp_1','"hi "','cool()'),
var Temp_2 = GopherHelperF('',cool,null,'Temp_2','cool',''),
var n = GopherSetF('n','n="hi "+cool()',Temp_2,'=',true,'');

var str1 = GopherSetF('str1','str1',null,'=',false,''),str2 = GopherSetF('str2','str2',null,'=',false,''),str3 = GopherSetF('str3','str3 = 'ff'','ff','=',false,'');
str1 = GopherSetF('str1','str1 = "ac"',"ac",'=',false,''),str2 = GopherSetF('str2','str2 = "hello"',"hello",'=',false,''),str3 = GopherSetF('str3','str3= "hi"',"hi",'=',false,'');

var str3 = GopherSetF('str3','str3 = ""',"",'=',false,'');

var Temp_1 = GopherHelperF('+',"a","b",'Temp_1','"a"','"b"'),
str3 = GopherSetF('str3','str3 = "a"+"b"',Temp_1,'=',true,'');

var i = GopherSetF('i','i=5',5,'=',false,'');
var j = GopherSetF('j','j',null,'=',false,'');
var i1 = GopherSetF('i1','i1',null,'=',false,'');

j = GopherSetF('j','j = 0',0,'=',false,'');




function cool()
{
	console.log('cool');
	var text = GopherSetF('text','text = ""',"",'=',false,'');
	var x = GopherSetF('x','x',null,'=',false,'');
	for (x in person) {
		var Temp_1 = GopherHelperF('',person,x,'Temp_1','person','x'),
text = GopherSetF('text','text += person[x]',Temp_1,'+=',true,'');
	}
	
	return text;
}

function DoubleNumber(a)
{
	return a*2; 
}

function AddNumbers(a,b)
{
	var total = GopherSetF('total','total = 0',0,'=',false,'');
	for (var i = GopherSetF('i','i=0',0,'=',false,''); i<3; (tempVar = i, i= GopherSetF('i','i++',null,'++',false,'false'), tempVar))
	{
		var Temp_1 = GopherHelperF('+',total,a,'Temp_1','total','a'),
var Temp_2 = GopherHelperF('+',Temp_1,b,'Temp_2','total+a','b'),
total = GopherSetF('total','total = total+a+b',Temp_2,'=',true,'');
	}
	
	return DoubleNumber(total);
}


for (i1 = GopherSetF('i1','i1=0',0,'=',false,''); i1 < 3; (tempVar = i1, i1= GopherSetF('i1','i1++',null,'++',false,'false'), tempVar))
{
	var Temp_1 = GopherHelperF('+',j,i1,'Temp_1','j','i1'),
j = GopherSetF('j','j = j + i1',Temp_1,'=',true,'');
}

for (var i2 = GopherSetF('i2','i2=10',10,'=',false,''); i2<14; (tempVar = i2, i2= GopherSetF('i2','i2++',null,'++',false,'false'), tempVar))
{
	var Temp_1 = GopherHelperF('+',j,i2,'Temp_1','j','i2'),
j = GopherSetF('j','j = j + i2',Temp_1,'=',true,'');
	var Temp_1 = GopherHelperF('+',5,3,'Temp_1','5','3'),
var Temp_2 = GopherHelperF('+',Temp_1,2,'Temp_2','5+3','2'),
var Temp_3 = GopherHelperF('+',Temp_2,AddNumbers(i,j),'Temp_3','5+3+2','AddNumbers(i,j)'),
i = GopherSetF('i','i = 5+3+2+AddNumbers(i,j)',Temp_3,'=',true,'');

}

var Temp_1 = GopherHelperF('+',5,3,'Temp_1','5','3'),
var Temp_2 = GopherHelperF('+',Temp_1,2,'Temp_2','5+3','2'),
var Temp_3 = GopherHelperF('+',Temp_2,AddNumbers(i,6+5+4+3+2+1),'Temp_3','5+3+2','AddNumbers(i,6+5+4+3+2+1)'),
i = GopherSetF('i','i = 5+3+2+AddNumbers(i,6+5+4+3+2+1)',Temp_3,'=',true,'');

cool();

$(document).ready(function() {
 str1 = GopherSetF('str1','str1 = "hello world"',"hello world",'=',false,'');
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
