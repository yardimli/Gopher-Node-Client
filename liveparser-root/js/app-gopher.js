//GopherB node Socket setup 
var iosocket;
iosocket = io.connect();
iosocket.emit('HiGopherB', '');
iosocket.emit('HiClientServer', '');


var GopherCallerIDCouter = 100;
var GopherCallerID = '0:0';

function GopherTell(xCodeLine, xGopherMsg, xParentID, xGopherCallerID) {
    iosocket.emit('Gopher.Tell', {
        CodeLine: xCodeLine,
        GopherMsg: xGopherMsg,
        ParentID: xParentID,
        GopherCallerID: xGopherCallerID
    });
}

//------------------------------------------------------------------------------
function GopherUnaryExpr(xCodeLine, xVarStr, xVarValue) {
    xVarValue = !xVarValue;
    iosocket.emit('Gopher.GopherUnaryExp', {
        CodeLine: xCodeLine,
        VarStr: xVarStr,
        VarValue: xVarValue,
    });
    return xVarValue;
}

//------------------------------------------------------------------------------
function GopherUpdateExpr(xCodeLine, xVarName, xVarValue, xVarOperator, xParentID, xGopherCallerID) {
    iosocket.emit('Gopher.GopherUpdateExp', {
        CodeLine: xCodeLine,
        VarName: xVarName,
        VarValue: xVarValue,
        VarOperator: xVarOperator,
        ParentID: xParentID,
        GopherCallerID: xGopherCallerID
    });
}

//------------------------------------------------------------------------------
function GopherAssignment(xCodeLine, xVarDeclTrackID, xVarName, xVarValue, xVarStr, xParentID, xGopherCallerID, xVarOperator, VarOperator) {
    iosocket.emit('Gopher.GopherAssignment', {
        CodeLine: xCodeLine,
        VarDeclTrackID: xVarDeclTrackID,
        VarName: xVarName,
        VarValue: xVarValue,
        VarStr: xVarStr,
        ParentID: xParentID,
        GopherCallerID: xGopherCallerID,
        VarOperator: xVarOperator
    });
    return xVarValue;
}

//------------------------------------------------------------------------------
function GopherFunctionCall(xCodeLine, xFuncTrackID, xFuncStr, xFuncValue, xParentID, xGopherCallerID) {
    iosocket.emit('Gopher.FuncCall', {
        CodeLine: xCodeLine,
        FuncTrackID: xFuncTrackID,
        VarStr: xFuncStr,
        FuncValue: xFuncValue,
        ParentID: xParentID,
        GopherCallerID: xGopherCallerID
    });
    return xFuncValue;
}

//------------------------------------------------------------------------------
function GopherHelperF(Operator, LeftVal, RightVal, TempName, LeftValStr, RightVarStr) {
    var OutPut = '';
    if (Operator == '+') {
        OutPut = LeftVal + RightVal;
    }
    if (Operator == '*') {
        OutPut = LeftVal * RightVal;
    }
    if (Operator == '-') {
        OutPut = LeftVal - RightVal;
    }
    if (Operator == '==') {
        OutPut = LeftVal == RightVal;
    }
    if (Operator == '>') {
        OutPut = LeftVal > RightVal;
    }
    if (Operator == '<') {
        OutPut = LeftVal < RightVal;
    }
    if (Operator == '>=') {
        OutPut = LeftVal >= RightVal;
    }
    if (Operator == '<=') {
        OutPut = LeftVal <= RightVal;
    }
    if (Operator == '&&') {
        OutPut = LeftVal && RightVal;
    }
    if (Operator == '||') {
        OutPut = LeftVal || RightVal;
    }
    return OutPut;
}

//------------------------------------------------------------------------------
function GopherSetF(VarName, CommandLine, Value, Operator, UseTempVars, Prefix) {
    var OutPut = Value;
    if (Operator == '++') {
        OutPut = Value + 1;
    }
    return OutPut;
}

//------------------------------------------------------------------------------

var Temp_2_1, Temp_2_2, Temp_3_1, Temp_3_2, Temp_5_1, Temp_5_2;

//------------------------------------------------------------------------------


var j = GopherSetF('j', 'j=5', 5, '=', false, '');
var k3 = GopherSetF('k3', 'k3 = 4', 4, '=', false, '');
var Temp_2_1 = GopherHelperF('+', 10, j, 'Temp_2_1', '10', 'j');
Temp_2_2 = GopherHelperF('<', k, Temp_2_1, 'Temp_2_2', 'k', '10+j');
var k2 = GopherSetF('k2', 'k2 = k<(10+j)', Temp_2_2, '=', true, '');

console.log((Temp_3_1 = GopherHelperF('+', 10, j, 'Temp_3_1', '10', 'j'), Temp_3_2 = GopherHelperF('+', Temp_3_1, k3, 'Temp_3_2', '10+j', 'k3'), GopherHelperF('+', "...", Temp_3_2, '', '"..."', '(10+j)+k3')));
for (var k = GopherSetF('k', 'k=0', 0, '=', false, '');
    (Temp_5_1 = GopherHelperF('+', 10, j, 'Temp_5_1', '10', 'j'), Temp_5_2 = GopherHelperF('+', Temp_5_1, k3, 'Temp_5_2', '10+j', 'k3'), GopherHelperF('<', k, Temp_5_2, '', 'k', '(10+j)+k3'));
    (tempVar = k, k = GopherSetF('k', 'k++', k, '++', false, 'false'), tempVar)) {
    console.log(k);
}