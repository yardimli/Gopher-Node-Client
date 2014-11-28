//------------------------------------------------------------------------------
//GopherB Helpers
//------------------------------------------------------------------------------

var GopherCallerIDCouter = 100;
var GopherCallerID = '0:0';
var _$v = [];
var _$gX = 1000; //gopher scope tracker
var _$gXLocal = _$gX;

//------------------------------------------------------------------------------
GopherFunctionCall = function(xCodeLine, xFuncTrackID, xFuncStr, xFuncValue, xParentID, xGopherCallerID) {
    return xFuncValue;
}

//------------------------------------------------------------------------------
_$fs = function(xCodeLine, FunctionName, FunctionParams, _$gXLocal) {
    $("#debug-div").append("<span title='" + xCodeLine + ": Params: " + FunctionParams + "'>F " + FunctionName + " start " + _$gXLocal + "</span><br>");
}

//------------------------------------------------------------------------------
_$fe = function(xCodeLine, FunctionName, _$gXLocal) {
    $("#debug-div").append("<span title='" + xCodeLine + ":'>F " + FunctionName + " end " + _$gXLocal + "</span><br>");
}

//------------------------------------------------------------------------------
_$set = function(xCodeLine, NestedParent, ParentType, LeftSideStr, LeftSideValue, RightSideStr, RightSideValue, Operator, _$gXLocal, InnerFunctionCount) {

    if (InnerFunctionCount > 0) {
        for (var i = 0; i < (InnerFunctionCount); i++) {
            //			 console.log("EX "+i+":" + arguments[(i*2)+7+1] + " ... " + arguments[(i*2)+7+2]);
        }
    }
    var OutPut = null;
    //		console.log("eval:"+RightSideStr);

    //	$("#debug-div").append(xCodeLine + ': SET: ' + NestedParent + ' - '+ParentType+"  ---> ");
    if (Operator == '++') {
        OutPut = LeftSideValue + 1;
    } else
    if (Operator == '--') {
        OutPut = LeftSideValue - 1;
    } else
    if (Operator == '+=') {
        OutPut = LeftSideValue + RightSideValue;
    } else
    if (Operator == '-=') {
        OutPut = LeftSideValue - RightSideValue;
    } else {
        OutPut = RightSideValue;
    }
    var LS = "(" + LeftSideValue + ")";
    if (typeof LeftSideValue == "undefined") {
        var LS = "";
    }

    $("#debug-div").append("<span title='" + xCodeLine + ": " + NestedParent + " - " + ParentType + " - " + RightSideStr + " Op:" + Operator + "'>" + LeftSideStr + "=" + JSON.stringify(OutPut) + " - " + _$gXLocal + "</span><br>");

    //	$("#debug-div").append('Left: ' + LeftSideStr + LS +', Op: '+Operator+', Right: '+RightSideStr+' ('+RightSideValue+') New Value:'+OutPut+"<br>");
    return OutPut;
}

//------------------------------------------------------------------------------
_$evl = function(xCodeLine, NestedParent, ParentType, StatemetStr, StatemetValue, _$gXLocal, InnerFunctionCount) {
    if (InnerFunctionCount > 0) {
        for (var i = 0; i < (InnerFunctionCount); i++) {
            //			 console.log("EX "+i+":" + arguments[(i*2)+4+1] + " ... " + arguments[(i*2)+4+2]);
        }
    }
    //	$("#debug-div").append(xCodeLine + ': EVAL: ' + NestedParent + ' - '+ParentType+"  ---> ");

    OutPut = StatemetValue;
    //	$("#debug-div").append('Statement: ' + StatemetStr + ', Value: '+OutPut+"<br>");

    $("#debug-div").append("<span title='" + xCodeLine + ": " + NestedParent + " - " + ParentType + "'>" + StatemetStr + " ? " + OutPut + " - " + _$gXLocal + "</span><br>");

    return OutPut;
}

//------------------------------------------------------------------------------


$(document).ready(function() {
    _$gX++;
    var _$gXLocal = _$gX;
    _$fs(0, 'FunctionExpression:ready', '', _$gXLocal);

    var cc = function() {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'FunctionExpression:cc', '', _$gXLocal);
        return 1;
        _$fe(0, 'FunctionExpression:cc', _$gXLocal);
    };
    var bb = function(a, b, c) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'FunctionExpression:bb', 'a,b,c', _$gXLocal);
        return a - b + c;
        _$fe(0, 'FunctionExpression:bb', _$gXLocal);
    };

    function dd() {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'FunctionDeclaration:dd', '', _$gXLocal);
        return 2;
        _$fe(0, 'FunctionDeclaration:dd', _$gXLocal);
    }


    function b5(b) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'FunctionDeclaration:b5', 'b', _$gXLocal);

        function b55(b) {
            _$gX++;
            var _$gXLocal = _$gX;
            _$fs(0, 'FunctionDeclaration:b55', 'b', _$gXLocal);
            return b + 2;
            _$fe(0, 'FunctionDeclaration:b55', _$gXLocal);
        }

        var bb = _$set(20, 'VariableDeclaration', '0', 'bb', bb, 'b55(b)*4', (_$v[1] = b55(b)) * 4, '=', _$gXLocal, 1, '1=b55(b)');

        return b;
        _$fe(0, 'FunctionDeclaration:b5', _$gXLocal);
    }

    function a5(a) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'FunctionDeclaration:a5', 'a', _$gXLocal);

        function a55(a) {
            _$gX++;
            var _$gXLocal = _$gX;
            _$fs(0, 'FunctionDeclaration:a55', 'a', _$gXLocal);
            return a + 1;
            _$fe(0, 'FunctionDeclaration:a55', _$gXLocal);
        }

        var aa = _$set(32, 'VariableDeclaration', '0', 'aa', aa, 'a55(a)*2', (_$v[2] = a55(a)) * 2, '=', _$gXLocal, 1, '2=a55(a)');

        return aa;
        _$fe(0, 'FunctionDeclaration:a5', _$gXLocal);
    }

    function a1(a) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'FunctionDeclaration:a1', 'a', _$gXLocal);
        var aaa = _$set(39, 'FunctionDeclaration > BlockStatement > VariableDeclaration', '0', 'aaa', aaa, 'a', a, '=', _$gXLocal, 0);
        return aaa;
        _$fe(0, 'FunctionDeclaration:a1', _$gXLocal);
    }

    var blockC = _$set(43, 'VariableDeclaration', '0', 'blockC', blockC, '[]', [], '=', _$gXLocal, 0);
    blockC[1] = _$set(44, 'ExpressionStatement', 'expression', 'blockC[1]', blockC[1], '{}', {}, '=', _$gXLocal, 0);
    blockC[1].X = _$set(45, 'ExpressionStatement', 'expression', 'blockC[1].X', blockC[1].X, '5', 5, '=', _$gXLocal, 0);
    blockC[2] = _$set(46, 'ExpressionStatement', 'expression', 'blockC[2]', blockC[2], '5', 5, '=', _$gXLocal, 0);

    var j = _$set(48, 'VariableDeclaration', '0', 'j', j, '1', 1, '=', _$gXLocal, 0);

    var i = _$set(50, 'VariableDeclaration', '0', 'i', i, '$(window).width()+window.innerHeight+5+a5(5)+a5($(window).width())+a5(window.innerWidth)+blockC[2]+blockC[1].X+blockC[a1(2)]', (_$v[10] = $(window).width()) + (_$v[9] = window.innerHeight) + 5 + (_$v[8] = a5(5)) + (_$v[7] = a5((_$v[6] = $(window).width()))) + (_$v[5] = a5((_$v[4] = window.innerWidth))) + blockC[2] + blockC[1].X + blockC[(_$v[3] = a1(2))], '=', _$gXLocal, 8, '3=a1(2)', '4=window.innerWidth', '5=a5(window.innerWidth)', '6=$(window).width()', '7=a5($(window).width())', '8=a5(5)', '9=window.innerHeight', '10=$(window).width()');
    if (_$evl(51, 'IfStatement', 'test', '(a1(i)>j) && (i>4) && a5(5)>20', ((_$v[12] = a1(i)) > j) && (i > 4) && (_$v[11] = a5(5)) > 20, _$gXLocal, 2, '11=a5(5)', '12=a1(i)')) {
        console.log(_$evl(51, 'BlockStatement > ExpressionStatement', '0', '5>6', 5 > 6, _$gXLocal, 0));
    }

    for (var k = _$set(53, 'ForStatement > VariableDeclaration', '0', 'k', k, '0', 0, '=', _$gXLocal, 0); _$evl(53, 'ForStatement > VariableDeclaration', 'test', 'k<10', k < 10, _$gXLocal, 0);
        (tempVar = k, k = _$set(53, 'ForStatement > VariableDeclaration', 'update', 'k', k, '', 0, '++', _$gXLocal, 0), tempVar)) {
        console.log(_$evl(55, 'BlockStatement > ExpressionStatement', '0', 'k+" "+a5(k)', k + " " + (_$v[13] = a5(k)), _$gXLocal, 1, '13=a5(k)'));
    }

    var info = _$set(58, 'VariableDeclaration', '0', 'info', info, '{}', {}, '=', _$gXLocal, 0);
    info.name = _$set(59, 'ExpressionStatement', 'expression', 'info.name', info.name, '"hi"', "hi", '=', _$gXLocal, 0);


    var blockA = _$set(62, 'VariableDeclaration', '0', 'blockA', blockA, '{firstName:"John", lastName:"Doe", age:50, eyeColor:"blue"}', {
        firstName: "John",
        lastName: "Doe",
        age: 50,
        eyeColor: "blue"
    }, '=', _$gXLocal, 0);
    var blockB = _$set(63, 'VariableDeclaration', '0', 'blockB', blockB, '["hi 2","hello 2"]', ["hi 2", "hello 2"], '=', _$gXLocal, 0);


    console.log(i);
    (tempVar = i, i = _$set(67, 'ExpressionStatement > ExpressionStatement', 'expression', 'i', i, '', 0, '++', _$gXLocal, 0), tempVar);
    console.log(i);
    i = _$set(69, 'ExpressionStatement > ExpressionStatement', 'expression', 'i', i, '1', 1, '+=', _$gXLocal, 0);
    console.log(i);
    i = _$set(71, 'ExpressionStatement > ExpressionStatement', 'expression', 'i', i, '1', 1, '-=', _$gXLocal, 0);
    console.log(i);

    var block1 = _$set(74, 'ExpressionStatement > VariableDeclaration', '0', 'block1', block1, '{}', {}, '=', _$gXLocal, 0);
    block1.name = _$set(75, 'ExpressionStatement', 'expression', 'block1.name', block1.name, '"ONE"', "ONE", '=', _$gXLocal, 0);
    block1.lname = _$set(76, 'ExpressionStatement', 'expression', 'block1.lname', block1.lname, '"TWO"', "TWO", '=', _$gXLocal, 0);

    var block2 = _$set(78, 'VariableDeclaration', '0', 'block2', block2, '[]', [], '=', _$gXLocal, 0);
    block2[1] = _$set(79, 'ExpressionStatement', 'expression', 'block2[1]', block2[1], '"THREE"', "THREE", '=', _$gXLocal, 0);
    block2[2] = _$set(80, 'ExpressionStatement', 'expression', 'block2[2]', block2[2], '"FOUR"', "FOUR", '=', _$gXLocal, 0);
    block2[3] = _$set(81, 'ExpressionStatement', 'expression', 'block2[3]', block2[3], '"FOUR-2"', "FOUR-2", '=', _$gXLocal, 0);

    var block3 = _$set(83, 'VariableDeclaration', '0', 'block3', block3, '[]', [], '=', _$gXLocal, 0);
    block3[1] = _$set(84, 'ExpressionStatement', 'expression', 'block3[1]', block3[1], '{}', {}, '=', _$gXLocal, 0);
    block3[1].name = _$set(85, 'ExpressionStatement', 'expression', 'block3[1].name', block3[1].name, '"FIVE"', "FIVE", '=', _$gXLocal, 0);
    block3[1].lname = _$set(86, 'ExpressionStatement', 'expression', 'block3[1].lname', block3[1].lname, '"SIX"', "SIX", '=', _$gXLocal, 0);

    var f = _$set(88, 'VariableDeclaration', '0', 'f', f, '(i>j) && (i>4)', (i > j) && (i > 4), '=', _$gXLocal, 0);

    for (; _$evl(90, 'ForStatement', 'test', 'k<20', k < 20, _$gXLocal, 0);
        (tempVar = k, k = _$set(90, 'ForStatement', 'update', 'k', k, '', 0, '++', _$gXLocal, 0), tempVar)) {
        console.log(k);
    }

    for (; _$evl(95, 'BlockStatement > ExpressionStatement > ForStatement', 'test', 'k<25', k < 25, _$gXLocal, 0);) {
        (tempVar = k, k = _$set(97, 'BlockStatement > ExpressionStatement', 'expression', 'k', k, '', 0, '++', _$gXLocal, 0), tempVar);
        console.log(k);
    }

    console.log(_$evl(101, 'ExpressionStatement > ExpressionStatement', '0', 'block1.name+" "+block1.lname', block1.name + " " + block1.lname, _$gXLocal, 0));
    console.log(_$evl(102, 'ExpressionStatement', '0', 'block2[1]+" "+block2[2]+" "+block2[3]', block2[1] + " " + block2[2] + " " + block2[3], _$gXLocal, 0));
    console.log(_$evl(103, 'ExpressionStatement', '0', 'block3[1].name+" "+block3[1].lname', block3[1].name + " " + block3[1].lname, _$gXLocal, 0));

    _$fe(0, 'FunctionExpression:ready', _$gXLocal);
});