function b5(b) {
    _$gX++;
    var _$gXLocal = _$gX;
    _$fs(2, 2, 'b5', 'FunctionDeclaration', 'b', _$gXLocal);
    _$set(2, 2, 'VariableDeclaration', 'Function [b5]', 'b', null, '', b, '=', '1', _$gXLocal, 0);

    function b55(b) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(2, 4, 'b55', 'FunctionDeclaration', 'b', _$gXLocal);
        _$set(2, 4, 'VariableDeclaration', 'Function [b55]', 'b', null, '', b, '=', '1', _$gXLocal, 0);
        _$fe(2, 5, 'b55 -RETURN', _$gXLocal);
        return b + 2;
        _$fe(2, 6, 'b55', _$gXLocal);
    }

    _$sb(2, 8, 'bb', _$gXLocal);
    var bb = _$set(2, 8, 'VariableDeclaration', '0', 'bb', bb, 'b55(b)*4', (_$v[1] = b55(b)) * 4, '=', '1', _$gXLocal, 1, '1=b55(b)');

    _$fe(2, 10, 'b5 -RETURN', _$gXLocal);
    return b;
    _$fe(2, 11, 'b5', _$gXLocal);
}

var cc = function() {
    _$gX++;
    var _$gXLocal = _$gX;
    _$fs(2, 13, 'cc', 'FunctionExpression', '', _$gXLocal);
    _$fe(2, 13, 'cc -RETURN', _$gXLocal);
    return 1;
    _$fe(2, 13, 'cc', _$gXLocal);
};
var bb = function(a, b, c) {
    _$gX++;
    var _$gXLocal = _$gX;
    _$fs(2, 14, 'bb', 'FunctionExpression', 'a,b,c', _$gXLocal);
    _$set(2, 14, 'VariableDeclaration', 'Function [bb]', 'a', null, '', a, '=', '1', _$gXLocal, 0);
    _$set(2, 14, 'VariableDeclaration', 'Function [bb]', 'b', null, '', b, '=', '1', _$gXLocal, 0);
    _$set(2, 14, 'VariableDeclaration', 'Function [bb]', 'c', null, '', c, '=', '1', _$gXLocal, 0);
    _$sb(2, 14, 'd', _$gXLocal);
    var d = _$set(2, 14, 'BlockStatement > VariableDeclaration', '0', 'd', d, '0', 0, '=', '1', _$gXLocal, 0);
    d = _$set(2, 14, 'ExpressionStatement', 'expression', 'd', d, 'b+c', b + c, '=', '0', _$gXLocal, 0);
    _$fe(2, 14, 'bb -RETURN', _$gXLocal);
    return a - d;
    _$fe(2, 14, 'bb', _$gXLocal);
};

function dd() {
    _$gX++;
    var _$gXLocal = _$gX;
    _$fs(2, 17, 'dd', 'FunctionDeclaration', '', _$gXLocal);
    _$fe(2, 18, 'dd -RETURN', _$gXLocal);
    return 2;
    _$fe(2, 19, 'dd', _$gXLocal);
}


function a5(a) {
    _$gX++;
    var _$gXLocal = _$gX;
    _$fs(2, 23, 'a5', 'FunctionDeclaration', 'a', _$gXLocal);
    _$set(2, 23, 'VariableDeclaration', 'Function [a5]', 'a', null, '', a, '=', '1', _$gXLocal, 0);

    function a55(a) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(2, 25, 'a55', 'FunctionDeclaration', 'a', _$gXLocal);
        _$set(2, 25, 'VariableDeclaration', 'Function [a55]', 'a', null, '', a, '=', '1', _$gXLocal, 0);
        _$fe(2, 26, 'a55 -RETURN', _$gXLocal);
        return a + 1;
        _$fe(2, 27, 'a55', _$gXLocal);
    }

    _$sb(2, 29, 'aa', _$gXLocal);
    var aa = _$set(2, 29, 'VariableDeclaration', '0', 'aa', aa, 'a55(a)*2', (_$v[2] = a55(a)) * 2, '=', '1', _$gXLocal, 1, '2=a55(a)');

    if (_$evl(2, 31, 'IfStatement', 'test', 'a<10', a < 10, _$gXLocal, 0)) {
        _$fe(2, 31, 'a5 -RETURN', _$gXLocal);
        return aa + 10;
    } else
    if (_$evl(2, 32, 'IfStatement', 'test', 'a>100', a > 100, _$gXLocal, 0)) {
        _$fe(2, 32, 'a5 -RETURN', _$gXLocal);
        return a - 100;
    }

    _$fe(2, 34, 'a5 -RETURN', _$gXLocal);
    return aa;
    _$fe(2, 35, 'a5', _$gXLocal);
}

function a1(a) {
    _$gX++;
    var _$gXLocal = _$gX;
    _$fs(2, 38, 'a1', 'FunctionDeclaration', 'a', _$gXLocal);
    _$set(2, 38, 'VariableDeclaration', 'Function [a1]', 'a', null, '', a, '=', '1', _$gXLocal, 0);
    _$sb(2, 39, 'aaa', _$gXLocal);
    var aaa = _$set(2, 39, 'FunctionDeclaration > BlockStatement > VariableDeclaration', '0', 'aaa', aaa, 'a', a, '=', '1', _$gXLocal, 0);
    _$fe(2, 40, 'a1 -RETURN', _$gXLocal);
    return aaa;
    _$fe(2, 41, 'a1', _$gXLocal);
}