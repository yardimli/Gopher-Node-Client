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
  if (Operator=='*') {  OutPut = LeftVal * RightVal; }
  if (Operator=='-') {  OutPut = LeftVal - RightVal; }
  if (Operator=='==') {  OutPut = LeftVal == RightVal; }
  if (Operator=='>') {  OutPut = LeftVal > RightVal; }
  if (Operator=='<') {  OutPut = LeftVal < RightVal; }
  if (Operator=='>=') {  OutPut = LeftVal >= RightVal; }
  if (Operator=='<=') {  OutPut = LeftVal <= RightVal; }
  if (Operator=='&&') {  OutPut = LeftVal && RightVal; }
  if (Operator=='||') {  OutPut = LeftVal || RightVal; }
	return OutPut;
}

//------------------------------------------------------------------------------
function GopherSetF( VarName, CommandLine, Value, Operator, UseTempVars, Prefix) {
	var OutPut = Value;
  if (Operator=='++') {  OutPut = Value+1; }
	return OutPut;
}

//------------------------------------------------------------------------------

var Temp_2_1, Temp_2_2, Temp_2_3, Temp_4_1, Temp_5_1, Temp_6_1;

//------------------------------------------------------------------------------


var j = GopherSetF('j','j=5',5,'=',false,'');
var i = GopherSetF('i','i=6',6,'=',false,'');

Temp_2_1 = GopherHelperF('>',i,2,'Temp_2_1','i','2');
Temp_2_2 = GopherHelperF('>',j,3,'Temp_2_2','j','3');
Temp_2_3 = GopherHelperF('&&',Temp_2_1,Temp_2_2,'Temp_2_3','i>2','j>3');
TempIfVar_4 = GopherSetF('TempIfVar_4','TempIfVar_4 = (i>2) && (j>3)',Temp_2_3,'=',true,'');
if (TempIfVar_4)
{
	j = GopherSetF('j','j=15',15,'=',false,'');
	console.log("1");
	Temp_4_1 = GopherHelperF('==',3,3,'Temp_4_1','3','3');
TempIfVar_1 = GopherSetF('TempIfVar_1','TempIfVar_1 = 3==3',Temp_4_1,'=',true,'');
Temp_5_1 = GopherHelperF('==',2,2,'Temp_5_1','2','2');
TempIfVar_2 = GopherSetF('TempIfVar_2','TempIfVar_2 = 2==2',Temp_5_1,'=',true,'');
Temp_6_1 = GopherHelperF('>',j,3,'Temp_6_1','j','3');
TempIfVar_3 = GopherSetF('TempIfVar_3','TempIfVar_3 = j>3',Temp_6_1,'=',true,'');
if (TempIfVar_3) {
console.log("11");
}
} else
if (TempIfVar_2) {
	console.log("2");
} else
if (TempIfVar_1)
	{
console.log("3");
}
 else
{
	console.log("4");
}
