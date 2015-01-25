$(document).ready(function() {
    _$gX++;
    var _$gXLocal = _$gX;
    _$fs(0, 1, 'ready', 'FunctionExpression', '', _$gXLocal);
    _$sb(0, 2, 'blockC', _$gXLocal);
    var blockC = _$set(0, 2, 'ExpressionStatement > BlockStatement > VariableDeclaration', '0', 'blockC', blockC, '[]', [], '=', '1', _$gXLocal, 0);
    blockC[1] = _$set(0, 3, 'ExpressionStatement', 'expression', 'blockC[1]', blockC[1], '{}', {}, '=', '0', _$gXLocal, 0);
    blockC[1].X = _$set(0, 4, 'ExpressionStatement', 'expression', 'blockC[1].X', blockC[1].X, '5', 5, '=', '0', _$gXLocal, 0);
    blockC[2] = _$set(0, 5, 'ExpressionStatement', 'expression', 'blockC[2]', blockC[2], '5', 5, '=', '0', _$gXLocal, 0);

    _$sb(0, 7, 'j', _$gXLocal);
    var j = _$set(0, 7, 'VariableDeclaration', '0', 'j', j, '1', 1, '=', '1', _$gXLocal, 0);

    _$sb(0, 9, 'i', _$gXLocal);
    var i = _$set(0, 9, 'VariableDeclaration', '0', 'i', i, '$(window).width()+window.innerHeight+5+a5(5)+a5($(window).width())+a5(window.innerWidth)+blockC[2]+blockC[1].X+blockC[a1(2)]', (_$v[6] = $(window).width()) + window.innerHeight + 5 + (_$v[5] = a5(5)) + (_$v[4] = a5((_$v[3] = $(window).width()))) + (_$v[2] = a5(window.innerWidth)) + blockC[2] + blockC[1].X + blockC[(_$v[1] = a1(2))], '=', '1', _$gXLocal, 6, '1=a1(2)', '2=a5(window.innerWidth)', '3=$(window).width()', '4=a5($(window).width())', '5=a5(5)', '6=$(window).width()');
    if (_$evl(0, 10, 'IfStatement', 'test', '(a1(i)>j) && (i>4) && a5(5)>20', ((_$v[8] = a1(i)) > j) && (i > 4) && (_$v[7] = a5(5)) > 20, _$gXLocal, 2, '7=a5(5)', '8=a1(i)')) {
        console.log(_$evl(0, 10, 'BlockStatement > ExpressionStatement', '0', '5>6', 5 > 6, _$gXLocal, 0));
    }

    for (var k = _$set(0, 12, 'ForStatement > VariableDeclaration', '0', 'k', k, '0', 0, '=', '1', _$gXLocal, 0); _$evl(0, 12, 'ForStatement > VariableDeclaration', 'test', 'k<5', k < 5, _$gXLocal, 0); k = _$set(0, 12, 'ForStatement > VariableDeclaration', 'update', 'k', k, 'k+1', k + 1, '=', '0', _$gXLocal, 0)) {
        i = _$set(0, 14, 'BlockStatement > ExpressionStatement', 'expression', 'i', i, 'k+5', k + 5, '=', '0', _$gXLocal, 0);
        console.log(_$evl(0, 15, 'ExpressionStatement', '0', 'k+\' ==== \'+a5(k)+i', k + ' ==== ' + (_$v[9] = a5(k)) + i, _$gXLocal, 1, '9=a5(k)'));
    }

    for (var k = _$set(0, 18, 'ForStatement > VariableDeclaration', '0', 'k', k, '0', 0, '=', '1', _$gXLocal, 0); _$evl(0, 18, 'ForStatement > VariableDeclaration', 'test', 'k<10', k < 10, _$gXLocal, 0);
        (tempVar = k, k = _$set(0, 18, 'ForStatement > VariableDeclaration', 'update', 'k', k, '', 0, '++', 0, _$gXLocal, 0), tempVar)) {
        i = _$set(0, 20, 'BlockStatement > ExpressionStatement', 'expression', 'i', i, 'k+5', k + 5, '=', '0', _$gXLocal, 0);
        console.log(_$evl(0, 21, 'ExpressionStatement', '0', 'k+\' ==== \'+a5(k)-i', k + ' ==== ' + (_$v[10] = a5(k)) - i, _$gXLocal, 1, '10=a5(k)'));
    }

    _$sb(0, 24, 'info', _$gXLocal);
    var info = _$set(0, 24, 'VariableDeclaration', '0', 'info', info, '{}', {}, '=', '1', _$gXLocal, 0);
    info.name = _$set(0, 25, 'ExpressionStatement', 'expression', 'info.name', info.name, '\'hi\'', 'hi', '=', '0', _$gXLocal, 0);


    _$sb(0, 28, 'blockA', _$gXLocal);
    var blockA = _$set(0, 28, 'VariableDeclaration', '0', 'blockA', blockA, '{firstName:\'John\', lastName:\'Doe\', age:50, eyeColor:\'blue\'}', {
        firstName: 'John',
        lastName: 'Doe',
        age: 50,
        eyeColor: 'blue'
    }, '=', '1', _$gXLocal, 0);
    _$sb(0, 29, 'blockB', _$gXLocal);
    var blockB = _$set(0, 29, 'VariableDeclaration', '0', 'blockB', blockB, '[\'hi 2\',\'hello 2\']', ['hi 2', 'hello 2'], '=', '1', _$gXLocal, 0);


    console.log(i);
    (tempVar = i, i = _$set(0, 33, 'ExpressionStatement > ExpressionStatement', 'expression', 'i', i, '', 0, '++', 0, _$gXLocal, 0), tempVar);
    console.log(i);
    i = _$set(0, 35, 'ExpressionStatement > ExpressionStatement', 'expression', 'i', i, '1', 1, '+=', '0', _$gXLocal, 0);
    console.log(i);
    i = _$set(0, 37, 'ExpressionStatement > ExpressionStatement', 'expression', 'i', i, '1', 1, '-=', '0', _$gXLocal, 0);
    console.log(i);

    _$sb(0, 40, 'block1', _$gXLocal);
    var block1 = _$set(0, 40, 'ExpressionStatement > VariableDeclaration', '0', 'block1', block1, '{}', {}, '=', '1', _$gXLocal, 0);
    block1.name = _$set(0, 41, 'ExpressionStatement', 'expression', 'block1.name', block1.name, '\'ONE\'', 'ONE', '=', '0', _$gXLocal, 0);
    block1.lname = _$set(0, 42, 'ExpressionStatement', 'expression', 'block1.lname', block1.lname, '\'TWO\'', 'TWO', '=', '0', _$gXLocal, 0);

    _$sb(0, 44, 'block2', _$gXLocal);
    var block2 = _$set(0, 44, 'VariableDeclaration', '0', 'block2', block2, '[]', [], '=', '1', _$gXLocal, 0);
    block2[1] = _$set(0, 45, 'ExpressionStatement', 'expression', 'block2[1]', block2[1], '\'THREE\'', 'THREE', '=', '0', _$gXLocal, 0);
    block2[2] = _$set(0, 46, 'ExpressionStatement', 'expression', 'block2[2]', block2[2], '\'FOUR\'', 'FOUR', '=', '0', _$gXLocal, 0);
    block2[3] = _$set(0, 47, 'ExpressionStatement', 'expression', 'block2[3]', block2[3], '\'FOUR-2\'', 'FOUR-2', '=', '0', _$gXLocal, 0);

    _$sb(0, 49, 'block3', _$gXLocal);
    var block3 = _$set(0, 49, 'VariableDeclaration', '0', 'block3', block3, '[]', [], '=', '1', _$gXLocal, 0);
    block3[1] = _$set(0, 50, 'ExpressionStatement', 'expression', 'block3[1]', block3[1], '{}', {}, '=', '0', _$gXLocal, 0);
    block3[1].name = _$set(0, 51, 'ExpressionStatement', 'expression', 'block3[1].name', block3[1].name, '\'FIVE\'', 'FIVE', '=', '0', _$gXLocal, 0);
    block3[1].lname = _$set(0, 52, 'ExpressionStatement', 'expression', 'block3[1].lname', block3[1].lname, '\'SIX\'', 'SIX', '=', '0', _$gXLocal, 0);

    _$sb(0, 54, 'f', _$gXLocal);
    var f = _$set(0, 54, 'VariableDeclaration', '0', 'f', f, '(i>j) && (i>4)', (i > j) && (i > 4), '=', '1', _$gXLocal, 0);

    for (; _$evl(0, 56, 'ForStatement', 'test', 'k<20', k < 20, _$gXLocal, 0);
        (tempVar = k, k = _$set(0, 56, 'ForStatement', 'update', 'k', k, '', 0, '++', 0, _$gXLocal, 0), tempVar)) {
        console.log(k);
    }

    for (; _$evl(0, 61, 'BlockStatement > ExpressionStatement > ForStatement', 'test', 'k<25', k < 25, _$gXLocal, 0);) {
        (tempVar = k, k = _$set(0, 63, 'BlockStatement > ExpressionStatement', 'expression', 'k', k, '', 0, '++', 0, _$gXLocal, 0), tempVar);
        console.log(k);
    }

    console.log(_$evl(0, 67, 'ExpressionStatement > ExpressionStatement', '0', 'block1.name+\' \'+block1.lname', block1.name + ' ' + block1.lname, _$gXLocal, 0));
    console.log(_$evl(0, 68, 'ExpressionStatement', '0', 'block2[1]+\' \'+block2[2]+\' \'+block2[3]', block2[1] + ' ' + block2[2] + ' ' + block2[3], _$gXLocal, 0));
    console.log(_$evl(0, 69, 'ExpressionStatement', '0', 'block3[1].name+\' \'+block3[1].lname', block3[1].name + ' ' + block3[1].lname, _$gXLocal, 0));

    console.log(_$evl(0, 71, 'ExpressionStatement', '0', '"cc:"+cc()+" dd:"+dd()', "cc:" + (_$v[12] = cc()) + " dd:" + (_$v[11] = dd()), _$gXLocal, 2, '11=dd()', '12=cc()'));
    _$sb(0, 72, 'bb2', _$gXLocal);
    var bb2 = _$set(0, 72, 'VariableDeclaration', '0', 'bb2', bb2, 'bb', bb, '=', '1', _$gXLocal, 0);
    console.log(_$evl(0, 73, 'ExpressionStatement', '0', '"bb:"+bb2(1,2,3)', "bb:" + (_$v[13] = bb2(1, 2, 3)), _$gXLocal, 1, '13=bb2(1,2,3)'));


    _$fe(0, 76, 'ready', _$gXLocal);
});