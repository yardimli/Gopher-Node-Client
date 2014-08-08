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
function GopherHelperF( Operator, LeftVal, RightVal, TempName, LeftValStr, RightVarStr) {
	var OutPut = '';
  if (Operator=='+') {  OutPut = LeftVal + RightVal; }
  if (Operator=='==') {  OutPut = LeftVal == RightVal; }
	return OutPut;
}

//------------------------------------------------------------------------------
function GopherSetF( VarName, CommandLine, Value, Operator, UseTempVars, Prefix) {
	var OutPut = Value;
  if (Operator=='++') {  OutPut = Value+1; }
	return OutPut;
}

//------------------------------------------------------------------------------

var Temp_0_1, Temp_0_2, Temp_0_3, Temp_0_4, Temp_0_5, Temp_0_6, Temp_0_7, Temp_0_8, Temp_2_1, Temp_3_1, Temp_3_2, Temp_4_1, Temp_4_2, Temp_4_3, Temp_4_4, Temp_5_1, Temp_8_1, Temp_9_1, Temp_10_1, Temp_10_2, Temp_10_3, Temp_10_4, Temp_10_5, Temp_15_1, Temp_17_1, Temp_28_1, Temp_29_1, Temp_30_1, Temp_32_1, Temp_32_2, Temp_32_3, Temp_33_1, Temp_38_1, Temp_39_1, Temp_39_2, Temp_41_1, Temp_41_2, Temp_49_1, Temp_58_1, Temp_65_1, Temp_65_2, Temp_70_1, Temp_74_1, Temp_75_1;

//------------------------------------------------------------------------------


var Temp_0_1 = GopherHelperF('<',numberA,numberB,'Temp_0_1','numberA','numberB');
Temp_0_2 = GopherHelperF('!',(boolD),null,'Temp_0_2','(boolD)','');
Temp_0_3 = GopherHelperF('>',1,2,'Temp_0_3','1','2');
Temp_0_4 = GopherHelperF('>',2,3,'Temp_0_4','2','3');
Temp_0_5 = GopherHelperF('||',Temp_0_1,Temp_0_2,'Temp_0_5','(numberA<numberB)','!(boolD)');
Temp_0_6 = GopherHelperF('&&',Temp_0_3,Temp_0_4,'Temp_0_6','(1>2)','(2>3)');
Temp_0_7 = GopherHelperF('!',Temp_0_5,null,'Temp_0_7','((numberA<numberB) || !(boolD))','');
Temp_0_8 = GopherHelperF('||',Temp_0_6,Temp_0_7,'Temp_0_8','((1>2) && (2>3))','(!((numberA<numberB) || !(boolD)))');
var test1 = GopherSetF('test1','test1 = ( (((1>2) && (2>3)) || (!((numberA<numberB) || !(boolD)))) )',Temp_0_8,'=',true,''), test2 = GopherSetF('test2','test2 = test1',test1,'=',false,'');
var Temp_2_1 = GopherHelperF('==',test1,1,'Temp_2_1','test1','1');
var test2 = GopherSetF('test2','test2 = test1 == 1',Temp_2_1,'=',true,'');

if ( TempIfVar_4 )
{
	console.log("1");
} else
if (TempIfVar_3)
{
	console.log("2");
} else
if (TempIfVar_2)
{
	console.log("3");
} else
{
	console.log("4");
}

var Temp_3_1 = GopherHelperF('||',numberC,boolB,'Temp_3_1','numberC','boolB');
Temp_3_2 = GopherHelperF('!',Temp_3_1,null,'Temp_3_2','(numberC || boolB)','');
var boolD = GopherSetF('boolD','boolD = !(numberC || boolB)',Temp_3_2,'=',true,'');
Temp_4_1 = GopherHelperF('<',numberA,numberB,'Temp_4_1','numberA','numberB');
Temp_4_2 = GopherHelperF('!',(boolD),null,'Temp_4_2','(boolD)','');
Temp_4_3 = GopherHelperF('||',Temp_4_1,Temp_4_2,'Temp_4_3','(numberA<numberB)','!(boolD)');
Temp_4_4 = GopherHelperF('!',Temp_4_3,null,'Temp_4_4','((numberA<numberB) || !(boolD))','');
boolD = GopherSetF('boolD','boolD = !((numberA<numberB) || !(boolD))',Temp_4_4,'=',true,'');
var Temp_5_1 = GopherHelperF('>',DoubleNumber(numberA),numberB,'Temp_5_1','DoubleNumber(numberA)','numberB');
var bool4 = GopherSetF('bool4','bool4 = DoubleNumber(numberA)>numberB',Temp_5_1,'=',true,'');
var numberA = GopherSetF('numberA','numberA = 5',5,'=',false,'');	
var numberC = GopherSetF('numberC','numberC = numberA',numberA,'=',false,'');
var Temp_8_1 = GopherHelperF('!',numberA,null,'Temp_8_1','numberA','');
var numberC = GopherSetF('numberC','numberC = !numberA',Temp_8_1,'=',true,'');
var Temp_9_1 = GopherHelperF('+',5,4,'Temp_9_1','5','4');
var numberB = GopherSetF('numberB','numberB = 5+4',Temp_9_1,'=',true,'');	
Temp_10_1 = GopherHelperF('+',5,4,'Temp_10_1','5','4');
Temp_10_2 = GopherHelperF('+',4,9,'Temp_10_2','4','9');
Temp_10_3 = GopherHelperF('+',Temp_10_1,Temp_10_2,'Temp_10_3','(5+4)','(4+9)');
Temp_10_4 = GopherHelperF('*',Temp_10_3,5,'Temp_10_4','((5+4) + (4+9))','5');
Temp_10_5 = GopherHelperF('/',Temp_10_4,3,'Temp_10_5','(((5+4) + (4+9)) * 5)','3');
numberA = GopherSetF('numberA','numberA = (((5+4) + (4+9)) * 5) / 3',Temp_10_5,'=',true,'');

var j = GopherSetF('j','j=0',0,'=',false,'');
for (var i2 = GopherSetF('i2','i2=0',0,'=',false,''); i2 < 3; (tempVar = i2, i2= GopherSetF('i2','i2++',i2,'++',false,'false'), tempVar),cool())
{
	Temp_15_1 = GopherHelperF('+',j,i2,'Temp_15_1','j','i2');
j = GopherSetF('j','j = j + i2',Temp_15_1,'=',true,'');
}

(tempVar = numberA, numberA= GopherSetF('numberA','++numberA',numberA,'++',false,'true'), tempVar);
Temp_17_1 = GopherHelperF('>',numberA,5,'Temp_17_1','numberA','5');
BoolX = GopherSetF('BoolX','BoolX = numberA>5',Temp_17_1,'=',true,'');
(tempVar = numberA, numberA= GopherSetF('numberA','numberA++',numberA,'++',false,'false'), tempVar),cool();
(tempVar = numberA, numberA= GopherSetF('numberA','++numberA',numberA,'++',false,'true'), tempVar),cool();
(tempVar = numberA, numberA= GopherSetF('numberA','numberA--',numberA,'--',false,'false'), tempVar),cool();
(tempVar = numberA, numberA= GopherSetF('numberA','numberA--',numberA,'--',false,'false'), tempVar),cool(),(tempVar = numberB, numberB= GopherSetF('numberB','numberB--',numberB,'--',false,'false'), tempVar),cool();
numberA = GopherSetF('numberA','numberA += 1',1,'+=',false,'');
numberA = GopherSetF('numberA','numberA -= 1',1,'-=',false,'');
var numberZ = GopherSetF('numberZ','numberZ = numberA',numberA,'=',false,'');
var numberB = GopherSetF('numberB','numberB = 8',8,'=',false,'');
var strA = GopherSetF('strA','strA = \'Test String\'','Test String','=',false,'');
var Temp_28_1 = GopherHelperF('>',numberA,numberB,'Temp_28_1','numberA','numberB');
var boolA = GopherSetF('boolA','boolA = numberA>numberB',Temp_28_1,'=',true,'');
var Temp_29_1 = GopherHelperF('>',strA.indexOf("f"),0,'Temp_29_1','strA.indexOf("f")','0');
var boolB = GopherSetF('boolB','boolB = strA.indexOf("f")>0',Temp_29_1,'=',true,'');
var Temp_30_1 = GopherHelperF('!',boolA,null,'Temp_30_1','boolA','');
var boolC = GopherSetF('boolC','boolC = !boolA',Temp_30_1,'=',true,'');
var boolF = GopherSetF('boolF','boolF = boolC',boolC,'=',false,'');

var Temp_32_1 = GopherHelperF('!',boolB,null,'Temp_32_1','boolB','');
Temp_32_2 = GopherHelperF('||',boolC,Temp_32_1,'Temp_32_2','boolC','! boolB');
Temp_32_3 = GopherHelperF('!',Temp_32_2,null,'Temp_32_3','(boolC || ! boolB)','');
var boolG = GopherSetF('boolG','boolG = !(boolC || ! boolB)',Temp_32_3,'=',true,'');
var Temp_33_1 = GopherHelperF('>',DoubleNumber(numberA),numberB,'Temp_33_1','DoubleNumber(numberA)','numberB');
var bool4 = GopherSetF('bool4','bool4 = DoubleNumber(numberA)>numberB',Temp_33_1,'=',true,'');
var xheight = GopherSetF('xheight','xheight = $(window).height()',$(window).height(),'=',false,'');
var initTest = GopherSetF('initTest','initTest = AddNumbers(3,4)',AddNumbers(3,4),'=',false,'');
var person = GopherSetF('person','person = {fname:"John", lname:"Doe", age:25}',{fname:"John", lname:"Doe", age:25},'=',false,''); 
var i = GopherSetF('i','i=5',5,'=',false,'');
var Temp_38_1 = GopherHelperF('*',i,4,'Temp_38_1','i','4');
var j = GopherSetF('j','j=i*4',Temp_38_1,'=',true,'');
var Temp_39_1 = GopherHelperF('+',j,i,'Temp_39_1','j','i');
Temp_39_2 = GopherHelperF('/',Temp_39_1,3,'Temp_39_2','(j+i)','3');
var k = GopherSetF('k','k=(j+i)/3',Temp_39_2,'=',true,'');
var m = GopherSetF('m','m=k*AddNumbers(k,4)',k*AddNumbers(k,4),'=',false,'');
var Temp_41_1 = GopherHelperF('',cool,null,'Temp_41_1','cool','');
Temp_41_2 = GopherHelperF('+',"hi ",Temp_41_1,'Temp_41_2','"hi "','cool()');
var n = GopherSetF('n','n="hi "+cool()',Temp_41_2,'=',true,'');

var str1 = GopherSetF('str1','str1',null,'=',false,''),str2 = GopherSetF('str2','str2',null,'=',false,''),str3 = GopherSetF('str3','str3 = \'ff\'','ff','=',false,'');
str1 = GopherSetF('str1','str1 = "ac"',"ac",'=',false,''),str2 = GopherSetF('str2','str2 = "hello"',"hello",'=',false,''),str3 = GopherSetF('str3','str3= "hi"',"hi",'=',false,'');

var str3 = GopherSetF('str3','str3 = ""',"",'=',false,'');

Temp_49_1 = GopherHelperF('+',"a","b",'Temp_49_1','"a"','"b"');
str3 = GopherSetF('str3','str3 = "a"+"b"',Temp_49_1,'=',true,'');

var i = GopherSetF('i','i=5',5,'=',false,'');
var j = GopherSetF('j','j',null,'=',false,'');
var i1 = GopherSetF('i1','i1',null,'=',false,'');

j = GopherSetF('j','j = 0',0,'=',false,'');




function cool()
{
	console.log('cool');
	var text = GopherSetF('text','text = ""',"",'=',false,'');
	var x = GopherSetF('x','x',null,'=',false,'');
	var j = GopherSetF('j','j=0',0,'=',false,'');
	for (x in person) {
		(tempVar = j, j= GopherSetF('j','j++',j,'++',false,'false'), tempVar);
		if (TempIfVar_1) { exit; }
		Temp_58_1 = GopherHelperF('',person,x,'Temp_58_1','person','x');
text = GopherSetF('text','text += person[x]',Temp_58_1,'+=',true,'');
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
	for (var i = GopherSetF('i','i=0',0,'=',false,''); i<3; (tempVar = i, i= GopherSetF('i','i++',i,'++',false,'false'), tempVar))
	{
		Temp_65_1 = GopherHelperF('+',total,a,'Temp_65_1','total','a');
Temp_65_2 = GopherHelperF('+',Temp_65_1,b,'Temp_65_2','total+a','b');
total = GopherSetF('total','total = total+a+b',Temp_65_2,'=',true,'');
	}
	
	return DoubleNumber(total);
}


for (i1 = GopherSetF('i1','i1=0',0,'=',false,''); i1 < 3; (tempVar = i1, i1= GopherSetF('i1','i1++',i1,'++',false,'false'), tempVar))
{
	Temp_70_1 = GopherHelperF('+',j,i1,'Temp_70_1','j','i1');
j = GopherSetF('j','j = j + i1',Temp_70_1,'=',true,'');
}

for (var i2 = GopherSetF('i2','i2=10',10,'=',false,''); i2<14; (tempVar = i2, i2= GopherSetF('i2','i2++',i2,'++',false,'false'), tempVar))
{
	Temp_74_1 = GopherHelperF('+',j,i2,'Temp_74_1','j','i2');
j = GopherSetF('j','j = j + i2',Temp_74_1,'=',true,'');
	Temp_75_1 = GopherHelperF('+',5,3,'Temp_75_1','5','3');
i = GopherSetF('i','i = 5+3+2+AddNumbers(i,j)',Temp_75_1,'=',true,'');

}

i = GopherSetF('i','i = 5+3+2+AddNumbers(i,6+5+4+3+2+1)',5+3+2+AddNumbers(i,6+5+4+3+2+1),'=',false,'');

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
