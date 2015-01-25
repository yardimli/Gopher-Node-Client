$(document).ready(function() {
    _$gX++;
    var _$gXLocal = _$gX;
    _$fs(2, 1, 'ready', 'FunctionExpression', '', _$gXLocal);
    // Get all the keys from document
    _$sb(2, 3, 'keys', _$gXLocal);
    var keys = _$set(2, 3, 'ExpressionStatement > BlockStatement > VariableDeclaration', '0', 'keys', keys, '$(\'#calculator span\')', (_$v[1] = $('#calculator span')), '=', '1', _$gXLocal, 1, '1=$(\'#calculator span\')');
    _$sb(2, 4, 'operators', _$gXLocal);
    var operators = _$set(2, 4, 'VariableDeclaration', '0', 'operators', operators, '[\'+\', \'-\', \'x\', \'/\']', ['+', '-', 'x', '/'], '=', '1', _$gXLocal, 0);
    _$sb(2, 5, 'decimalAdded', _$gXLocal);
    var decimalAdded = _$set(2, 5, 'VariableDeclaration', '0', 'decimalAdded', decimalAdded, 'false', false, '=', '1', _$gXLocal, 0);
    _$sb(2, 6, 'InputStr', _$gXLocal);
    var InputStr = _$set(2, 6, 'VariableDeclaration', '0', 'InputStr', InputStr, '""', "", '=', '1', _$gXLocal, 0);

    // Add onclick event to all the keys and perform operations
    $("#calculator span").click(function(e) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(2, 9, 'click', 'FunctionExpression', 'e', _$gXLocal);
        _$set(2, 9, 'VariableDeclaration', 'Function [click]', 'e', null, '', e, '=', '1', _$gXLocal, 0);
        // Get the input and button values
        _$sb(2, 11, 'input', _$gXLocal);
        var input = _$set(2, 11, 'ExpressionStatement > BlockStatement > VariableDeclaration', '0', 'input', input, '$(\'.screen\')', (_$v[2] = $('.screen')), '=', '1', _$gXLocal, 1, '2=$(\'.screen\')');
        _$sb(2, 12, 'inputVal', _$gXLocal);
        var inputVal = _$set(2, 12, 'VariableDeclaration', '0', 'inputVal', inputVal, 'input.html()', (_$v[3] = input.html()), '=', '1', _$gXLocal, 1, '3=input.html()');
        _$sb(2, 13, 'btnVal', _$gXLocal);
        var btnVal = _$set(2, 13, 'VariableDeclaration', '0', 'btnVal', btnVal, '$(this).html()', (_$v[4] = $(this).html()), '=', '1', _$gXLocal, 1, '4=$(this).html()');

        // Now, just append the key values (btnValue) to the input string and finally use javascript's eval function to get the result
        // If clear key is pressed, erase everything
        if (_$evl(2, 17, 'IfStatement', 'test', 'btnVal == \'C\'', btnVal == 'C', _$gXLocal, 0)) {
            InputStr = _$set(2, 18, 'BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, '""', "", '=', '0', _$gXLocal, 0);
            input.html(InputStr);
            decimalAdded = _$set(2, 20, 'ExpressionStatement > ExpressionStatement', 'expression', 'decimalAdded', decimalAdded, 'false', false, '=', '0', _$gXLocal, 0);
        }

        // If eval key is pressed, calculate and display the result
        else if (_$evl(2, 24, 'IfStatement', 'test', 'btnVal == \'=\'', btnVal == '=', _$gXLocal, 0)) {
            _$sb(2, 25, 'equation', _$gXLocal);
            var equation = _$set(2, 25, 'BlockStatement > VariableDeclaration', '0', 'equation', equation, 'inputVal', inputVal, '=', '1', _$gXLocal, 0);
            _$sb(2, 26, 'lastChar', _$gXLocal);
            var lastChar = _$set(2, 26, 'VariableDeclaration', '0', 'lastChar', lastChar, 'equation[equation.length - 1]', equation[equation.length - 1], '=', '1', _$gXLocal, 0);

            // Replace all instances of x with *.
            equation = _$set(2, 29, 'ExpressionStatement', 'expression', 'equation', equation, 'equation.replace(/x/g, \'*\')', (_$v[5] = equation.replace(/x/g, '*')), '=', '0', _$gXLocal, 1, '5=equation.replace(/x/g, \'*\')');

            // Final thing left to do is checking the last character of the equation. If it's an operator or a decimal, remove it
            if (_$evl(2, 32, 'IfStatement', 'test', 'operators.indexOf(lastChar) > -1 || lastChar == \'.\'', (_$v[6] = operators.indexOf(lastChar)) > -1 || lastChar == '.', _$gXLocal, 1, '6=operators.indexOf(lastChar)')) {
                equation = _$set(2, 33, 'BlockStatement > ExpressionStatement', 'expression', 'equation', equation, 'equation.replace(/.$/, \'\')', (_$v[7] = equation.replace(/.$/, '')), '=', '0', _$gXLocal, 1, '7=equation.replace(/.$/, \'\')');
            }

            if (equation) {
                input.html(eval(equation));
            }

            decimalAdded = _$set(2, 38, 'IfStatement > BlockStatement > ExpressionStatement > ExpressionStatement', 'expression', 'decimalAdded', decimalAdded, 'false', false, '=', '0', _$gXLocal, 0);
        } else if (_$evl(2, 41, 'IfStatement', 'test', 'operators.indexOf(btnVal) > -1', (_$v[8] = operators.indexOf(btnVal)) > -1, _$gXLocal, 1, '8=operators.indexOf(btnVal)')) {
            // Operator is clicked
            // Get the last character from the equation
            _$sb(2, 44, 'lastChar', _$gXLocal);
            var lastChar = _$set(2, 44, 'BlockStatement > VariableDeclaration', '0', 'lastChar', lastChar, 'inputVal[inputVal.length - 1]', inputVal[inputVal.length - 1], '=', '1', _$gXLocal, 0);

            // Only add operator if input is not empty and there is no operator at the last
            if (_$evl(2, 47, 'IfStatement', 'test', 'inputVal != \'\' && operators.indexOf(lastChar) == -1', inputVal != '' && (_$v[9] = operators.indexOf(lastChar)) == -1, _$gXLocal, 1, '9=operators.indexOf(lastChar)')) {
                InputStr = _$set(2, 49, 'BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, 'btnVal', btnVal, '+=', '0', _$gXLocal, 0);
                input.html(InputStr);
            }

            // Allow minus if the string is empty
            else if (_$evl(2, 54, 'ExpressionStatement > IfStatement', 'test', 'inputVal == \'\' && btnVal == \'-\'', inputVal == '' && btnVal == '-', _$gXLocal, 0)) {
                InputStr = _$set(2, 56, 'BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, 'btnVal', btnVal, '+=', '0', _$gXLocal, 0);
                input.html(InputStr);
            }

            // Replace the last operator (if exists) with the newly pressed operator
            if (_$evl(2, 61, 'ExpressionStatement > IfStatement', 'test', 'operators.indexOf(lastChar) > -1 && inputVal.length > 1', (_$v[10] = operators.indexOf(lastChar)) > -1 && inputVal.length > 1, _$gXLocal, 1, '10=operators.indexOf(lastChar)')) {
                // Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
                InputStr = _$set(2, 63, 'BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, 'inputVal.replace(/.$/, btnVal)', (_$v[11] = inputVal.replace(/.$/, btnVal)), '=', '0', _$gXLocal, 1, '11=inputVal.replace(/.$/, btnVal)');
                input.html(InputStr);
            }

            decimalAdded = _$set(2, 67, 'ExpressionStatement > ExpressionStatement', 'expression', 'decimalAdded', decimalAdded, 'false', false, '=', '0', _$gXLocal, 0);
        }

        // Now only the decimal problem is left. We can solve it easily using a flag 'decimalAdded' which we'll set once the decimal is added and prevent more decimals to be added once it's set. It will be reset when an operator, eval or clear key is pressed.
        else if (_$evl(2, 71, 'IfStatement', 'test', 'btnVal == \'.\'', btnVal == '.', _$gXLocal, 0)) {
            if (!decimalAdded) {
                InputStr = _$set(2, 73, 'BlockStatement > IfStatement > BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, 'btnVal', btnVal, '+=', '0', _$gXLocal, 0);
                input.html(InputStr);
                decimalAdded = _$set(2, 75, 'ExpressionStatement > ExpressionStatement', 'expression', 'decimalAdded', decimalAdded, 'true', true, '=', '0', _$gXLocal, 0);
            }
        }

        // if any other key is pressed, just append it
        else {
            InputStr = _$set(2, 81, 'BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, 'btnVal', btnVal, '+=', '0', _$gXLocal, 0);
            input.html(InputStr);
        }

        // prevent page jumps
        e.preventDefault();
        _$fe(2, 87, 'click', _$gXLocal);
    });
    _$fe(2, 88, 'ready', _$gXLocal);
});