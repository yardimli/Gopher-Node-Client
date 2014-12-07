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

function censor(censor) {
    var i = 0;

    return function(key, value) {
        if (i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
            return '[Circular]';

        if (i >= 4) // seems to be a harded maximum of 30 serialized objects?
            return '[Unknown]';

        ++i; // so we know we aren't using the original object anymore

        return value;
    }
}

//------------------------------------------------------------------------------
_$fs = function(xCodeLine, FunctionName, FunctionType, FunctionParams, _$gXLocal) {

    $("#DebugTable").append("\
				<tr style='background-color:#bbb'>\
					<td>" + xCodeLine + "</td>\
					<td>" + _$gXLocal + "</td>\
					<td>" + FunctionName + "</td>\
					<td>" + FunctionType + "</td>\
					<td>" + FunctionParams + "</td>\
					<td></td>\
					<td></td>\
				</tr>");

    //	$("#debug-div").append("<span title='"+ xCodeLine + ": Params: " + FunctionParams + "'>F "+FunctionName+" ("+FunctionType+") start " + _$gXLocal + "</span><br>");
}

//------------------------------------------------------------------------------
_$fe = function(xCodeLine, FunctionName, _$gXLocal) {
    $("#DebugTable").append("\
				<tr style='background-color:#bbb'>\
					<td>" + xCodeLine + "</td>\
					<td>" + _$gXLocal + "</td>\
					<td>" + FunctionName + "</td>\
					<td></td>\
					<td>FUNCTION END</td>\
					<td></td>\
					<td></td>\
				</tr>");

    //	$("#debug-div").append("<span title='"+ xCodeLine + ":'>F "+FunctionName+" end " + _$gXLocal + "</span><br>");
}

//------------------------------------------------------------------------------
_$sb = function(xCodeLine, LeftSideStr, _$gXLocal) {
    $("#DebugTable").append("\
				<tr style='background-color:#ccc'>\
					<td>" + xCodeLine + "</td>\
					<td>" + _$gXLocal + "</td>\
					<td>" + LeftSideStr + "</td>\
					<td></td>\
					<td>BEGIN SET VARIABLE</td>\
					<td></td>\
					<td></td>\
				</tr>");

    //	$("#debug-div").append(xCodeLine + ": begin set variable " + LeftSideStr+ "<br>");
    return 0;
}

//------------------------------------------------------------------------------
_$set = function(xCodeLine, NestedParent, ParentType, LeftSideStr, LeftSideValue, RightSideStr, RightSideValue, Operator, VarDeclerator, _$gXLocal, InnerFunctionCount) {

    if (InnerFunctionCount > 0) {
        for (var i = 0; i < (InnerFunctionCount); i++) {
            var TempVar = arguments[11 + i].split(/=(.+)?/);

            $("#DebugTable").append("\
				<tr style='background-color:#aaa'>\
							<td>" + xCodeLine + "</td>\
							<td>" + _$gXLocal + "</td>\
							<td><span title='" + TempVar[0] + "'>" + TempVar[1] + "</span></td>\
							<td>" + _$v[parseInt(TempVar[0], 10)] + "</td>\
							<td>HELPER</td>\
							<td></td>\
							<td></td>\
						</tr>");


            //			$("#debug-div").append("Helper:"+TempVar[0]+" -- " + TempVar[1] + "=" + _$v[parseInt(TempVar[0],10)] +" - " + _$gXLocal +  "<br>"  );
        }
    }
    var OutPut = null;

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
    var VarDeclerator2 = "";
    if (VarDeclerator == "1") {
        VarDeclerator2 = "var ";
    }

    $("#DebugTable").append("\
				<tr>\
					<td>" + xCodeLine + "</td>\
					<td>" + _$gXLocal + "</td>\
					<td><span title='" + LS + "'>" + VarDeclerator2 + LeftSideStr + "</span></td>\
					<td><span title='" + RightSideStr + "'>" + OutPut + "</span></td>\
					<td></td>\
					<td>" + NestedParent + " - " + ParentType + "</td>\
					<td>" + Operator + "</td>\
				</tr>");

    //	$("#debug-div").append("<span title='"+NestedParent + " - " + ParentType + " - " + RightSideStr + " Op:" + Operator + "'>"+ xCodeLine + ": " + VarDeclerator2+LeftSideStr+"="+JSON.stringify(OutPut)+" - " + _$gXLocal + "</span><br>");

    return OutPut;
}

//------------------------------------------------------------------------------
_$evl = function(xCodeLine, NestedParent, ParentType, StatemetStr, StatemetValue, _$gXLocal, InnerFunctionCount) {
    if (InnerFunctionCount > 0) {
        for (var i = 0; i < (InnerFunctionCount); i++) {
            var TempVar = arguments[7 + i].split(/=(.+)?/);

            $("#DebugTable").append("\
				<tr style='background-color:#aaa'>\
							<td>" + xCodeLine + "</td>\
							<td>" + _$gXLocal + "</td>\
							<td><span title='" + TempVar[0] + "'>" + TempVar[1] + "</span></td>\
							<td>" + _$v[parseInt(TempVar[0], 10)] + "</td>\
							<td>HELPER</td>\
							<td></td>\
							<td></td>\
						</tr>");

            //			$("#debug-div").append("Helper:"+TempVar[0]+" -- " + TempVar[1] + "=" + _$v[parseInt(TempVar[0],10)] +" - " + _$gXLocal + "<br>"  );
        }
    }

    OutPut = StatemetValue;
    //	$("#debug-div").append("<span title='"+ NestedParent + " - " + ParentType + "'>"+xCodeLine + ": "+StatemetStr+" ? "+OutPut+" - " + _$gXLocal + "</span><br>");

    $("#DebugTable").append("\
				<tr>\
					<td>" + xCodeLine + "</td>\
					<td>" + _$gXLocal + "</td>\
					<td>" + StatemetStr + "</td>\
					<td>" + OutPut + "</span></td>\
					<td>EVALUATE</td>\
					<td>" + NestedParent + " - " + ParentType + "</td>\
					<td></td>\
				</tr>");


    return OutPut;
}

//------------------------------------------------------------------------------

$(document).ready(function() {
    _$gX++;
    var _$gXLocal = _$gX;
    _$fs(0, 'ready', 'FunctionExpression', '', _$gXLocal);

    function b5(b) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'b5', 'FunctionDeclaration', 'b', _$gXLocal);
        _$set(0, 'VariableDeclaration', 'Function [b5]', 'b', 0, '', b, '=', '1', _$gXLocal, 0);

        function b55(b) {
            _$gX++;
            var _$gXLocal = _$gX;
            _$fs(0, 'b55', 'FunctionDeclaration', 'b', _$gXLocal);
            _$set(0, 'VariableDeclaration', 'Function [b55]', 'b', 0, '', b, '=', '1', _$gXLocal, 0);
            return b + 2;
            _$fe(0, 'b55', _$gXLocal);
        }

        _$sb(10, 'bb', _$gXLocal);
        var bb = _$set(10, 'VariableDeclaration', '0', 'bb', bb, 'b55(b)*4', (_$v[1] = b55(b)) * 4, '=', '1', _$gXLocal, 1, '1=b55(b)');

        return b;
        _$fe(0, 'b5', _$gXLocal);
    }

    var cc = function() {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'cc', 'FunctionExpression', '', _$gXLocal);
        return 1;
        _$fe(0, 'cc', _$gXLocal);
    };
    var bb = function(a, b, c) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'bb', 'FunctionExpression', 'a,b,c', _$gXLocal);
        _$set(0, 'VariableDeclaration', 'Function [bb]', 'a', 0, '', a, '=', '1', _$gXLocal, 0);
        _$set(0, 'VariableDeclaration', 'Function [bb]', 'b', 0, '', b, '=', '1', _$gXLocal, 0);
        _$set(0, 'VariableDeclaration', 'Function [bb]', 'c', 0, '', c, '=', '1', _$gXLocal, 0);
        return a - b + c;
        _$fe(0, 'bb', _$gXLocal);
    };

    function dd() {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'dd', 'FunctionDeclaration', '', _$gXLocal);
        return 2;
        _$fe(0, 'dd', _$gXLocal);
    }


    function a5(a) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'a5', 'FunctionDeclaration', 'a', _$gXLocal);
        _$set(0, 'VariableDeclaration', 'Function [a5]', 'a', 0, '', a, '=', '1', _$gXLocal, 0);

        function a55(a) {
            _$gX++;
            var _$gXLocal = _$gX;
            _$fs(0, 'a55', 'FunctionDeclaration', 'a', _$gXLocal);
            _$set(0, 'VariableDeclaration', 'Function [a55]', 'a', 0, '', a, '=', '1', _$gXLocal, 0);
            return a + 1;
            _$fe(0, 'a55', _$gXLocal);
        }

        _$sb(31, 'aa', _$gXLocal);
        var aa = _$set(31, 'VariableDeclaration', '0', 'aa', aa, 'a55(a)*2', (_$v[2] = a55(a)) * 2, '=', '1', _$gXLocal, 1, '2=a55(a)');

        if (_$evl(33, 'IfStatement', 'test', 'a<10', a < 10, _$gXLocal, 0)) {
            return aa + 10;
        } else
        if (_$evl(34, 'IfStatement', 'test', 'a>100', a > 100, _$gXLocal, 0)) {
            return a - 100;
        }

        return aa;
        _$fe(0, 'a5', _$gXLocal);
    }

    function a1(a) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'a1', 'FunctionDeclaration', 'a', _$gXLocal);
        _$set(0, 'VariableDeclaration', 'Function [a1]', 'a', 0, '', a, '=', '1', _$gXLocal, 0);
        _$sb(41, 'aaa', _$gXLocal);
        var aaa = _$set(41, 'FunctionDeclaration > BlockStatement > VariableDeclaration', '0', 'aaa', aaa, 'a', a, '=', '1', _$gXLocal, 0);
        return aaa;
        _$fe(0, 'a1', _$gXLocal);
    }

    _$sb(45, 'blockC', _$gXLocal);
    var blockC = _$set(45, 'VariableDeclaration', '0', 'blockC', blockC, '[]', [], '=', '1', _$gXLocal, 0);
    blockC[1] = _$set(46, 'ExpressionStatement', 'expression', 'blockC[1]', blockC[1], '{}', {}, '=', '0', _$gXLocal, 0);
    blockC[1].X = _$set(47, 'ExpressionStatement', 'expression', 'blockC[1].X', blockC[1].X, '5', 5, '=', '0', _$gXLocal, 0);
    blockC[2] = _$set(48, 'ExpressionStatement', 'expression', 'blockC[2]', blockC[2], '5', 5, '=', '0', _$gXLocal, 0);

    _$sb(50, 'j', _$gXLocal);
    var j = _$set(50, 'VariableDeclaration', '0', 'j', j, '1', 1, '=', '1', _$gXLocal, 0);

    _$sb(52, 'i', _$gXLocal);
    var i = _$set(52, 'VariableDeclaration', '0', 'i', i, '$(window).width()+window.innerHeight+5+a5(5)+a5($(window).width())+a5(window.innerWidth)+blockC[2]+blockC[1].X+blockC[a1(2)]', (_$v[8] = $(window).width()) + window.innerHeight + 5 + (_$v[7] = a5(5)) + (_$v[6] = a5((_$v[5] = $(window).width()))) + (_$v[4] = a5(window.innerWidth)) + blockC[2] + blockC[1].X + blockC[(_$v[3] = a1(2))], '=', '1', _$gXLocal, 6, '3=a1(2)', '4=a5(window.innerWidth)', '5=$(window).width()', '6=a5($(window).width())', '7=a5(5)', '8=$(window).width()');
    if (_$evl(53, 'IfStatement', 'test', '(a1(i)>j) && (i>4) && a5(5)>20', ((_$v[10] = a1(i)) > j) && (i > 4) && (_$v[9] = a5(5)) > 20, _$gXLocal, 2, '9=a5(5)', '10=a1(i)')) {
        console.log(_$evl(53, 'BlockStatement > ExpressionStatement', '0', '5>6', 5 > 6, _$gXLocal, 0));
    }

    for (var k = _$set(55, 'ForStatement > VariableDeclaration', '0', 'k', k, '0', 0, '=', '1', _$gXLocal, 0); _$evl(55, 'ForStatement > VariableDeclaration', 'test', 'k<5', k < 5, _$gXLocal, 0); k = _$set(55, 'ForStatement > VariableDeclaration', 'update', 'k', k, 'k+1', k + 1, '=', '0', _$gXLocal, 0)) {
        i = _$set(57, 'BlockStatement > ExpressionStatement', 'expression', 'i', i, 'k+5', k + 5, '=', '0', _$gXLocal, 0);
        console.log(_$evl(58, 'ExpressionStatement', '0', 'k+\' ==== \'+a5(k)+i', k + ' ==== ' + (_$v[11] = a5(k)) + i, _$gXLocal, 1, '11=a5(k)'));
    }

    for (var k = _$set(61, 'ForStatement > VariableDeclaration', '0', 'k', k, '0', 0, '=', '1', _$gXLocal, 0); _$evl(61, 'ForStatement > VariableDeclaration', 'test', 'k<10', k < 10, _$gXLocal, 0);
        (tempVar = k, k = _$set(61, 'ForStatement > VariableDeclaration', 'update', 'k', k, '', 0, '++', 0, _$gXLocal, 0), tempVar)) {
        i = _$set(63, 'BlockStatement > ExpressionStatement', 'expression', 'i', i, 'k+5', k + 5, '=', '0', _$gXLocal, 0);
        console.log(_$evl(64, 'ExpressionStatement', '0', 'k+\' ==== \'+a5(k)-i', k + ' ==== ' + (_$v[12] = a5(k)) - i, _$gXLocal, 1, '12=a5(k)'));
    }

    _$sb(67, 'info', _$gXLocal);
    var info = _$set(67, 'VariableDeclaration', '0', 'info', info, '{}', {}, '=', '1', _$gXLocal, 0);
    info.name = _$set(68, 'ExpressionStatement', 'expression', 'info.name', info.name, '\'hi\'', 'hi', '=', '0', _$gXLocal, 0);


    _$sb(71, 'blockA', _$gXLocal);
    var blockA = _$set(71, 'VariableDeclaration', '0', 'blockA', blockA, '{firstName:\'John\', lastName:\'Doe\', age:50, eyeColor:\'blue\'}', {
        firstName: 'John',
        lastName: 'Doe',
        age: 50,
        eyeColor: 'blue'
    }, '=', '1', _$gXLocal, 0);
    _$sb(72, 'blockB', _$gXLocal);
    var blockB = _$set(72, 'VariableDeclaration', '0', 'blockB', blockB, '[\'hi 2\',\'hello 2\']', ['hi 2', 'hello 2'], '=', '1', _$gXLocal, 0);


    console.log(i);
    (tempVar = i, i = _$set(76, 'ExpressionStatement > ExpressionStatement', 'expression', 'i', i, '', 0, '++', 0, _$gXLocal, 0), tempVar);
    console.log(i);
    i = _$set(78, 'ExpressionStatement > ExpressionStatement', 'expression', 'i', i, '1', 1, '+=', '0', _$gXLocal, 0);
    console.log(i);
    i = _$set(80, 'ExpressionStatement > ExpressionStatement', 'expression', 'i', i, '1', 1, '-=', '0', _$gXLocal, 0);
    console.log(i);

    _$sb(83, 'block1', _$gXLocal);
    var block1 = _$set(83, 'ExpressionStatement > VariableDeclaration', '0', 'block1', block1, '{}', {}, '=', '1', _$gXLocal, 0);
    block1.name = _$set(84, 'ExpressionStatement', 'expression', 'block1.name', block1.name, '\'ONE\'', 'ONE', '=', '0', _$gXLocal, 0);
    block1.lname = _$set(85, 'ExpressionStatement', 'expression', 'block1.lname', block1.lname, '\'TWO\'', 'TWO', '=', '0', _$gXLocal, 0);

    _$sb(87, 'block2', _$gXLocal);
    var block2 = _$set(87, 'VariableDeclaration', '0', 'block2', block2, '[]', [], '=', '1', _$gXLocal, 0);
    block2[1] = _$set(88, 'ExpressionStatement', 'expression', 'block2[1]', block2[1], '\'THREE\'', 'THREE', '=', '0', _$gXLocal, 0);
    block2[2] = _$set(89, 'ExpressionStatement', 'expression', 'block2[2]', block2[2], '\'FOUR\'', 'FOUR', '=', '0', _$gXLocal, 0);
    block2[3] = _$set(90, 'ExpressionStatement', 'expression', 'block2[3]', block2[3], '\'FOUR-2\'', 'FOUR-2', '=', '0', _$gXLocal, 0);

    _$sb(92, 'block3', _$gXLocal);
    var block3 = _$set(92, 'VariableDeclaration', '0', 'block3', block3, '[]', [], '=', '1', _$gXLocal, 0);
    block3[1] = _$set(93, 'ExpressionStatement', 'expression', 'block3[1]', block3[1], '{}', {}, '=', '0', _$gXLocal, 0);
    block3[1].name = _$set(94, 'ExpressionStatement', 'expression', 'block3[1].name', block3[1].name, '\'FIVE\'', 'FIVE', '=', '0', _$gXLocal, 0);
    block3[1].lname = _$set(95, 'ExpressionStatement', 'expression', 'block3[1].lname', block3[1].lname, '\'SIX\'', 'SIX', '=', '0', _$gXLocal, 0);

    _$sb(97, 'f', _$gXLocal);
    var f = _$set(97, 'VariableDeclaration', '0', 'f', f, '(i>j) && (i>4)', (i > j) && (i > 4), '=', '1', _$gXLocal, 0);

    for (; _$evl(99, 'ForStatement', 'test', 'k<20', k < 20, _$gXLocal, 0);
        (tempVar = k, k = _$set(99, 'ForStatement', 'update', 'k', k, '', 0, '++', 0, _$gXLocal, 0), tempVar)) {
        console.log(k);
    }

    for (; _$evl(104, 'BlockStatement > ExpressionStatement > ForStatement', 'test', 'k<25', k < 25, _$gXLocal, 0);) {
        (tempVar = k, k = _$set(106, 'BlockStatement > ExpressionStatement', 'expression', 'k', k, '', 0, '++', 0, _$gXLocal, 0), tempVar);
        console.log(k);
    }

    console.log(_$evl(110, 'ExpressionStatement > ExpressionStatement', '0', 'block1.name+\' \'+block1.lname', block1.name + ' ' + block1.lname, _$gXLocal, 0));
    console.log(_$evl(111, 'ExpressionStatement', '0', 'block2[1]+\' \'+block2[2]+\' \'+block2[3]', block2[1] + ' ' + block2[2] + ' ' + block2[3], _$gXLocal, 0));
    console.log(_$evl(112, 'ExpressionStatement', '0', 'block3[1].name+\' \'+block3[1].lname', block3[1].name + ' ' + block3[1].lname, _$gXLocal, 0));


    // Get all the keys from document
    _$sb(116, 'keys', _$gXLocal);
    var keys = _$set(116, 'VariableDeclaration', '0', 'keys', keys, '$(\'#calculator span\')', (_$v[13] = $('#calculator span')), '=', '1', _$gXLocal, 1, '13=$(\'#calculator span\')');
    _$sb(117, 'operators', _$gXLocal);
    var operators = _$set(117, 'VariableDeclaration', '0', 'operators', operators, '[\'+\', \'-\', \'x\', \'/\']', ['+', '-', 'x', '/'], '=', '1', _$gXLocal, 0);
    _$sb(118, 'decimalAdded', _$gXLocal);
    var decimalAdded = _$set(118, 'VariableDeclaration', '0', 'decimalAdded', decimalAdded, 'false', false, '=', '1', _$gXLocal, 0);
    _$sb(119, 'InputStr', _$gXLocal);
    var InputStr = _$set(119, 'VariableDeclaration', '0', 'InputStr', InputStr, '""', "", '=', '1', _$gXLocal, 0);

    // Add onclick event to all the keys and perform operations
    $("#calculator span").click(function(e) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'click', 'FunctionExpression', 'e', _$gXLocal);
        _$set(0, 'VariableDeclaration', 'Function [click]', 'e', 0, '', e, '=', '1', _$gXLocal, 0);
        // Get the input and button values
        _$sb(124, 'input', _$gXLocal);
        var input = _$set(124, 'ExpressionStatement > BlockStatement > VariableDeclaration', '0', 'input', input, '$(\'.screen\')', (_$v[14] = $('.screen')), '=', '1', _$gXLocal, 1, '14=$(\'.screen\')');
        _$sb(125, 'inputVal', _$gXLocal);
        var inputVal = _$set(125, 'VariableDeclaration', '0', 'inputVal', inputVal, 'input.html()', (_$v[15] = input.html()), '=', '1', _$gXLocal, 1, '15=input.html()');
        _$sb(126, 'btnVal', _$gXLocal);
        var btnVal = _$set(126, 'VariableDeclaration', '0', 'btnVal', btnVal, '$(this).html()', (_$v[16] = $(this).html()), '=', '1', _$gXLocal, 1, '16=$(this).html()');

        // Now, just append the key values (btnValue) to the input string and finally use javascript's eval function to get the result
        // If clear key is pressed, erase everything
        if (_$evl(130, 'IfStatement', 'test', 'btnVal == \'C\'', btnVal == 'C', _$gXLocal, 0)) {
            InputStr = _$set(131, 'BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, '""', "", '=', '0', _$gXLocal, 0);
            input.html(InputStr);
            decimalAdded = _$set(133, 'ExpressionStatement > ExpressionStatement', 'expression', 'decimalAdded', decimalAdded, 'false', false, '=', '0', _$gXLocal, 0);
        }

        // If eval key is pressed, calculate and display the result
        else if (_$evl(137, 'IfStatement', 'test', 'btnVal == \'=\'', btnVal == '=', _$gXLocal, 0)) {
            _$sb(138, 'equation', _$gXLocal);
            var equation = _$set(138, 'BlockStatement > VariableDeclaration', '0', 'equation', equation, 'inputVal', inputVal, '=', '1', _$gXLocal, 0);
            _$sb(139, 'lastChar', _$gXLocal);
            var lastChar = _$set(139, 'VariableDeclaration', '0', 'lastChar', lastChar, 'equation[equation.length - 1]', equation[equation.length - 1], '=', '1', _$gXLocal, 0);

            // Replace all instances of x with *.
            equation = _$set(142, 'ExpressionStatement', 'expression', 'equation', equation, 'equation.replace(/x/g, \'*\')', (_$v[17] = equation.replace(/x/g, '*')), '=', '0', _$gXLocal, 1, '17=equation.replace(/x/g, \'*\')');

            // Final thing left to do is checking the last character of the equation. If it's an operator or a decimal, remove it
            if (_$evl(145, 'IfStatement', 'test', 'operators.indexOf(lastChar) > -1 || lastChar == \'.\'', (_$v[18] = operators.indexOf(lastChar)) > -1 || lastChar == '.', _$gXLocal, 1, '18=operators.indexOf(lastChar)')) {
                equation = _$set(146, 'BlockStatement > ExpressionStatement', 'expression', 'equation', equation, 'equation.replace(/.$/, \'\')', (_$v[19] = equation.replace(/.$/, '')), '=', '0', _$gXLocal, 1, '19=equation.replace(/.$/, \'\')');
            }

            if (equation) {
                input.html(eval(equation));
            }

            decimalAdded = _$set(151, 'IfStatement > BlockStatement > ExpressionStatement > ExpressionStatement', 'expression', 'decimalAdded', decimalAdded, 'false', false, '=', '0', _$gXLocal, 0);
        } else if (_$evl(154, 'IfStatement', 'test', 'operators.indexOf(btnVal) > -1', (_$v[20] = operators.indexOf(btnVal)) > -1, _$gXLocal, 1, '20=operators.indexOf(btnVal)')) {
            // Operator is clicked
            // Get the last character from the equation
            _$sb(157, 'lastChar', _$gXLocal);
            var lastChar = _$set(157, 'BlockStatement > VariableDeclaration', '0', 'lastChar', lastChar, 'inputVal[inputVal.length - 1]', inputVal[inputVal.length - 1], '=', '1', _$gXLocal, 0);

            // Only add operator if input is not empty and there is no operator at the last
            if (_$evl(160, 'IfStatement', 'test', 'inputVal != \'\' && operators.indexOf(lastChar) == -1', inputVal != '' && (_$v[21] = operators.indexOf(lastChar)) == -1, _$gXLocal, 1, '21=operators.indexOf(lastChar)')) {
                InputStr = _$set(162, 'BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, 'btnVal', btnVal, '+=', '0', _$gXLocal, 0);
                input.html(InputStr);
            }

            // Allow minus if the string is empty
            else if (_$evl(167, 'ExpressionStatement > IfStatement', 'test', 'inputVal == \'\' && btnVal == \'-\'', inputVal == '' && btnVal == '-', _$gXLocal, 0)) {
                InputStr = _$set(169, 'BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, 'btnVal', btnVal, '+=', '0', _$gXLocal, 0);
                input.html(InputStr);
            }

            // Replace the last operator (if exists) with the newly pressed operator
            if (_$evl(174, 'ExpressionStatement > IfStatement', 'test', 'operators.indexOf(lastChar) > -1 && inputVal.length > 1', (_$v[22] = operators.indexOf(lastChar)) > -1 && inputVal.length > 1, _$gXLocal, 1, '22=operators.indexOf(lastChar)')) {
                // Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
                InputStr = _$set(176, 'BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, 'inputVal.replace(/.$/, btnVal)', (_$v[23] = inputVal.replace(/.$/, btnVal)), '=', '0', _$gXLocal, 1, '23=inputVal.replace(/.$/, btnVal)');
                input.html(InputStr);
            }

            decimalAdded = _$set(180, 'ExpressionStatement > ExpressionStatement', 'expression', 'decimalAdded', decimalAdded, 'false', false, '=', '0', _$gXLocal, 0);
        }

        // Now only the decimal problem is left. We can solve it easily using a flag 'decimalAdded' which we'll set once the decimal is added and prevent more decimals to be added once it's set. It will be reset when an operator, eval or clear key is pressed.
        else if (_$evl(184, 'IfStatement', 'test', 'btnVal == \'.\'', btnVal == '.', _$gXLocal, 0)) {
            if (!decimalAdded) {
                InputStr = _$set(186, 'BlockStatement > IfStatement > BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, 'btnVal', btnVal, '+=', '0', _$gXLocal, 0);
                input.html(InputStr);
                decimalAdded = _$set(188, 'ExpressionStatement > ExpressionStatement', 'expression', 'decimalAdded', decimalAdded, 'true', true, '=', '0', _$gXLocal, 0);
            }
        }

        // if any other key is pressed, just append it
        else {
            InputStr = _$set(194, 'BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, 'btnVal', btnVal, '+=', '0', _$gXLocal, 0);
            input.html(InputStr);
        }

        // prevent page jumps
        e.preventDefault();
        _$fe(0, 'click', _$gXLocal);
    });

    _$fe(0, 'ready', _$gXLocal);
});