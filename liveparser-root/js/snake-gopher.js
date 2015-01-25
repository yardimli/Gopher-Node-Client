$(document).ready(function() {
    _$gX++;
    var _$gXLocal = _$gX;
    _$fs(3, 1, 'ready', 'FunctionExpression', '', _$gXLocal);
    //snake
    //Canvas stuff
    _$sb(3, 4, 'canvas', _$gXLocal);
    var canvas = _$set(3, 4, 'ExpressionStatement > BlockStatement > VariableDeclaration', '0', 'canvas', canvas, '$("#canvas")[0]', $("#canvas")[0], '=', '1', _$gXLocal, 0);
    _$sb(3, 5, 'ctx', _$gXLocal);
    var ctx = _$set(3, 5, 'VariableDeclaration', '0', 'ctx', ctx, 'canvas.getContext("2d")', (_$v[1] = canvas.getContext("2d")), '=', '1', _$gXLocal, 1, '1=canvas.getContext("2d")');
    _$sb(3, 6, 'w', _$gXLocal);
    var w = _$set(3, 6, 'VariableDeclaration', '0', 'w', w, '$("#canvas").width()', (_$v[2] = $("#canvas").width()), '=', '1', _$gXLocal, 1, '2=$("#canvas").width()');
    _$sb(3, 7, 'h', _$gXLocal);
    var h = _$set(3, 7, 'VariableDeclaration', '0', 'h', h, '$("#canvas").height()', (_$v[3] = $("#canvas").height()), '=', '1', _$gXLocal, 1, '3=$("#canvas").height()');

    //Lets save the cell width in a variable for easy control
    _$sb(3, 10, 'cw', _$gXLocal);
    var cw = _$set(3, 10, 'VariableDeclaration', '0', 'cw', cw, '10', 10, '=', '1', _$gXLocal, 0);
    var d;
    var food;
    var score;

    //Lets create the snake now
    var snake_array; //an array of cells to make up the snake

    function init() {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(3, 19, 'init', 'FunctionDeclaration', '', _$gXLocal);
        d = _$set(3, 20, 'FunctionDeclaration > BlockStatement > ExpressionStatement', 'expression', 'd', d, '"right"', "right", '=', '0', _$gXLocal, 0); //default direction
        create_snake();
        create_food(); //Now we can see the food particle
        //finally lets display the score
        score = _$set(3, 24, 'ExpressionStatement > ExpressionStatement > ExpressionStatement', 'expression', 'score', score, '0', 0, '=', '0', _$gXLocal, 0);

        //Lets move the snake now using a timer which will trigger the paint function
        //every 60ms
        if (_$evl(3, 28, 'IfStatement', 'test', 'typeof game_loop != "undefined"', typeof game_loop != "undefined", _$gXLocal, 0)) {
            clearInterval(game_loop);
        }
        game_loop = _$set(3, 29, 'BlockStatement > ExpressionStatement > ExpressionStatement', 'expression', 'game_loop', game_loop, 'setInterval(paint, 500)', (_$v[4] = setInterval(paint, 500)), '=', '0', _$gXLocal, 1, '4=setInterval(paint, 500)');
        _$fe(3, 30, 'init', _$gXLocal);
    }
    init();

    function create_snake() {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(3, 34, 'create_snake', 'FunctionDeclaration', '', _$gXLocal);
        _$sb(3, 35, 'length', _$gXLocal);
        var length = _$set(3, 35, 'ExpressionStatement > FunctionDeclaration > BlockStatement > VariableDeclaration', '0', 'length', length, '5', 5, '=', '1', _$gXLocal, 0); //Length of the snake
        snake_array = _$set(3, 36, 'ExpressionStatement', 'expression', 'snake_array', snake_array, '[]', [], '=', '0', _$gXLocal, 0); //Empty array to start with
        for (var i = _$set(3, 37, 'ForStatement > VariableDeclaration', '0', 'i', i, 'length-1', length - 1, '=', '1', _$gXLocal, 0); _$evl(3, 37, 'ForStatement > VariableDeclaration', 'test', 'i>=0', i >= 0, _$gXLocal, 0);
            (tempVar = i, i = _$set(3, 37, 'ForStatement > VariableDeclaration', 'update', 'i', i, '', 0, '--', 0, _$gXLocal, 0), tempVar)) {
            //This will create a horizontal snake starting from the top left
            snake_array.push({
                x: i,
                y: 0
            });
        }
        _$fe(3, 42, 'create_snake', _$gXLocal);
    }

    //Lets create the food now
    function create_food() {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(3, 46, 'create_food', 'FunctionDeclaration', '', _$gXLocal);
        food = _$set(3, 47, 'BlockStatement > ExpressionStatement > FunctionDeclaration > BlockStatement > ExpressionStatement', 'expression', 'food', food, '{\n			x: Math.round(Math.random()*(w-cw)/cw),\n			y: Math.round(Math.random()*(h-cw)/cw)\n		}', {
                x: Math.round((_$v[6] = Math.random()) * (w - cw) / cw),
                y: Math.round((_$v[5] = Math.random()) * (h - cw) / cw)
            }, '=', '0', _$gXLocal, 2, '5=Math.random()', '6=Math.random()')
            //This will create a cell with x/y between 0-44
            //Because there are 45(450/10) positions accross the rows and columns
        _$fe(3, 53, 'create_food', _$gXLocal);
    }

    //Lets paint the snake now
    function paint() {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(3, 57, 'paint', 'FunctionDeclaration', '', _$gXLocal);
        //To avoid the snake trail we need to paint the BG on every frame
        //Lets paint the canvas now
        ctx.fillStyle = _$set(3, 60, 'FunctionDeclaration > BlockStatement > ExpressionStatement', 'expression', 'ctx.fillStyle', ctx.fillStyle, '"white"', "white", '=', '0', _$gXLocal, 0);
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = _$set(3, 62, 'ExpressionStatement > ExpressionStatement', 'expression', 'ctx.strokeStyle', ctx.strokeStyle, '"black"', "black", '=', '0', _$gXLocal, 0);
        ctx.strokeRect(0, 0, w, h);

        //The movement code for the snake to come here.
        //The logic is simple
        //Pop out the tail cell and place it infront of the head cell
        _$sb(3, 68, 'nx', _$gXLocal);
        var nx = _$set(3, 68, 'ExpressionStatement > VariableDeclaration', '0', 'nx', nx, 'snake_array[0].x', snake_array[0].x, '=', '1', _$gXLocal, 0);
        _$sb(3, 69, 'ny', _$gXLocal);
        var ny = _$set(3, 69, 'VariableDeclaration', '0', 'ny', ny, 'snake_array[0].y', snake_array[0].y, '=', '1', _$gXLocal, 0);
        //These were the position of the head cell.
        //We will increment it to get the new head position
        //Lets add proper direction based movement now
        if (_$evl(3, 73, 'IfStatement', 'test', 'd == "right"', d == "right", _$gXLocal, 0)) {
            (tempVar = nx, nx = _$set(3, 73, 'BlockStatement > ExpressionStatement', 'expression', 'nx', nx, '', 0, '++', 0, _$gXLocal, 0), tempVar);
        } else if (_$evl(3, 74, 'IfStatement', 'test', 'd == "left"', d == "left", _$gXLocal, 0)) {
            (tempVar = nx, nx = _$set(3, 74, 'BlockStatement > ExpressionStatement', 'expression', 'nx', nx, '', 0, '--', 0, _$gXLocal, 0), tempVar);
        } else if (_$evl(3, 75, 'IfStatement', 'test', 'd == "up"', d == "up", _$gXLocal, 0)) {
            (tempVar = ny, ny = _$set(3, 75, 'BlockStatement > ExpressionStatement', 'expression', 'ny', ny, '', 0, '--', 0, _$gXLocal, 0), tempVar);
        } else if (_$evl(3, 76, 'IfStatement', 'test', 'd == "down"', d == "down", _$gXLocal, 0)) {
            (tempVar = ny, ny = _$set(3, 76, 'BlockStatement > ExpressionStatement', 'expression', 'ny', ny, '', 0, '++', 0, _$gXLocal, 0), tempVar);
        }

        //Lets add the game over clauses now
        //This will restart the game if the snake hits the wall
        //Lets add the code for body collision
        //Now if the head of the snake bumps into its body, the game will restart
        if (_$evl(3, 82, 'IfStatement', 'test', 'nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array)', nx == -1 || nx == w / cw || ny == -1 || ny == h / cw || (_$v[7] = check_collision(nx, ny, snake_array)), _$gXLocal, 1, '7=check_collision(nx, ny, snake_array)')) {
            //restart game
            init();
            //Lets organize the code a bit now.
            _$fe(3, 87, 'paint -RETURN', _$gXLocal);
            return;
        }

        //Lets write the code to make the snake eat the food
        //The logic is simple
        //If the new head position matches with that of the food,
        //Create a new head instead of moving the tail
        if (_$evl(3, 94, 'IfStatement', 'test', 'nx == food.x && ny == food.y', nx == food.x && ny == food.y, _$gXLocal, 0)) {
            _$sb(3, 96, 'tail', _$gXLocal);
            var tail = _$set(3, 96, 'BlockStatement > VariableDeclaration', '0', 'tail', tail, '{x: nx, y: ny}', {
                x: nx,
                y: ny
            }, '=', '1', _$gXLocal, 0);
            (tempVar = score, score = _$set(3, 97, 'ExpressionStatement', 'expression', 'score', score, '', 0, '++', 0, _$gXLocal, 0), tempVar);
            //Create new food
            create_food();
        } else {
            _$sb(3, 103, 'tail', _$gXLocal);
            var tail = _$set(3, 103, 'ExpressionStatement > BlockStatement > VariableDeclaration', '0', 'tail', tail, 'snake_array.pop()', (_$v[8] = snake_array.pop()), '=', '1', _$gXLocal, 1, '8=snake_array.pop()'); //pops out the last cell
            tail.x = _$set(3, 104, 'ExpressionStatement', 'expression', 'tail.x', tail.x, 'nx', nx, '=', '0', _$gXLocal, 0);
            tail.y = _$set(3, 104, 'ExpressionStatement', 'expression', 'tail.y', tail.y, 'ny', ny, '=', '0', _$gXLocal, 0);
        }
        //The snake can now eat the food.

        snake_array.unshift(tail); //puts back the tail as the first cell

        for (var i = _$set(3, 110, 'ExpressionStatement > ForStatement > VariableDeclaration', '0', 'i', i, '0', 0, '=', '1', _$gXLocal, 0); _$evl(3, 110, 'ExpressionStatement > ForStatement > VariableDeclaration', 'test', 'i < snake_array.length', i < snake_array.length, _$gXLocal, 0);
            (tempVar = i, i = _$set(3, 110, 'ExpressionStatement > ForStatement > VariableDeclaration', 'update', 'i', i, '', 0, '++', 0, _$gXLocal, 0), tempVar)) {
            _$sb(3, 112, 'c', _$gXLocal);
            var c = _$set(3, 112, 'BlockStatement > VariableDeclaration', '0', 'c', c, 'snake_array[i]', snake_array[i], '=', '1', _$gXLocal, 0);
            //Lets paint 10px wide cells
            paint_cell(c.x, c.y);
        }

        //Lets paint the food
        paint_cell(food.x, food.y);
        //Lets paint the score
        _$sb(3, 120, 'score_text', _$gXLocal);
        var score_text = _$set(3, 120, 'ExpressionStatement > ExpressionStatement > VariableDeclaration', '0', 'score_text', score_text, '"Score: " + score', "Score: " + score, '=', '1', _$gXLocal, 0);
        ctx.fillText(score_text, 5, _$evl(3, 121, 'ExpressionStatement', '2', 'h-5', h - 5, _$gXLocal, 0));
        _$fe(3, 122, 'paint', _$gXLocal);
    }

    //Lets first create a generic function to paint cells
    function paint_cell(x, y) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(3, 126, 'paint_cell', 'FunctionDeclaration', 'x,y', _$gXLocal);
        _$set(3, 126, 'VariableDeclaration', 'Function [paint_cell]', 'x', null, '', x, '=', '1', _$gXLocal, 0);
        _$set(3, 126, 'VariableDeclaration', 'Function [paint_cell]', 'y', null, '', y, '=', '1', _$gXLocal, 0);
        ctx.fillStyle = _$set(3, 127, 'FunctionDeclaration > BlockStatement > ExpressionStatement', 'expression', 'ctx.fillStyle', ctx.fillStyle, '"blue"', "blue", '=', '0', _$gXLocal, 0);
        ctx.fillRect(_$evl(3, 128, 'ExpressionStatement', '0', 'x*cw', x * cw, _$gXLocal, 0), _$evl(3, 128, 'ExpressionStatement', '1', 'y*cw', y * cw, _$gXLocal, 0), cw, cw);
        ctx.strokeStyle = _$set(3, 129, 'ExpressionStatement', 'expression', 'ctx.strokeStyle', ctx.strokeStyle, '"white"', "white", '=', '0', _$gXLocal, 0);
        ctx.strokeRect(_$evl(3, 130, 'ExpressionStatement', '0', 'x*cw', x * cw, _$gXLocal, 0), _$evl(3, 130, 'ExpressionStatement', '1', 'y*cw', y * cw, _$gXLocal, 0), cw, cw);
        _$fe(3, 131, 'paint_cell', _$gXLocal);
    }

    function check_collision(x, y, array) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(3, 134, 'check_collision', 'FunctionDeclaration', 'x,y,array', _$gXLocal);
        _$set(3, 134, 'VariableDeclaration', 'Function [check_collision]', 'x', null, '', x, '=', '1', _$gXLocal, 0);
        _$set(3, 134, 'VariableDeclaration', 'Function [check_collision]', 'y', null, '', y, '=', '1', _$gXLocal, 0);
        _$set(3, 134, 'VariableDeclaration', 'Function [check_collision]', 'array', null, '', array, '=', '1', _$gXLocal, 0);
        //This function will check if the provided x/y coordinates exist
        //in an array of cells or not
        for (var i = _$set(3, 137, 'FunctionDeclaration > BlockStatement > ForStatement > VariableDeclaration', '0', 'i', i, '0', 0, '=', '1', _$gXLocal, 0); _$evl(3, 137, 'FunctionDeclaration > BlockStatement > ForStatement > VariableDeclaration', 'test', 'i < array.length', i < array.length, _$gXLocal, 0);
            (tempVar = i, i = _$set(3, 137, 'FunctionDeclaration > BlockStatement > ForStatement > VariableDeclaration', 'update', 'i', i, '', 0, '++', 0, _$gXLocal, 0), tempVar)) {
            if (_$evl(3, 139, 'BlockStatement > IfStatement', 'test', 'array[i].x == x && array[i].y == y', array[i].x == x && array[i].y == y, _$gXLocal, 0))
                _$fe(3, 140, 'check_collision -RETURN', _$gXLocal);
            return true;
        }
        _$fe(3, 142, 'check_collision -RETURN', _$gXLocal);
        return false;
        _$fe(3, 143, 'check_collision', _$gXLocal);
    }

    //Lets add the keyboard controls now
    $(document).keydown(function(e) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(3, 146, 'keydown', 'FunctionExpression', 'e', _$gXLocal);
        _$set(3, 146, 'VariableDeclaration', 'Function [keydown]', 'e', null, '', e, '=', '1', _$gXLocal, 0);
        _$sb(3, 147, 'key', _$gXLocal);
        var key = _$set(3, 147, 'ExpressionStatement > BlockStatement > VariableDeclaration', '0', 'key', key, 'e.which', e.which, '=', '1', _$gXLocal, 0);
        //We will add another clause to prevent reverse gear
        if (_$evl(3, 149, 'IfStatement', 'test', 'key == "37" && d != "right"', key == "37" && d != "right", _$gXLocal, 0)) {
            d = _$set(3, 149, 'BlockStatement > ExpressionStatement', 'expression', 'd', d, '"left"', "left", '=', '0', _$gXLocal, 0);
        } else if (_$evl(3, 150, 'IfStatement', 'test', 'key == "38" && d != "down"', key == "38" && d != "down", _$gXLocal, 0)) {
            d = _$set(3, 150, 'BlockStatement > ExpressionStatement', 'expression', 'd', d, '"up"', "up", '=', '0', _$gXLocal, 0);
        } else if (_$evl(3, 151, 'IfStatement', 'test', 'key == "39" && d != "left"', key == "39" && d != "left", _$gXLocal, 0)) {
            d = _$set(3, 151, 'BlockStatement > ExpressionStatement', 'expression', 'd', d, '"right"', "right", '=', '0', _$gXLocal, 0);
        } else if (_$evl(3, 152, 'IfStatement', 'test', 'key == "40" && d != "up"', key == "40" && d != "up", _$gXLocal, 0)) {
            d = _$set(3, 152, 'BlockStatement > ExpressionStatement', 'expression', 'd', d, '"down"', "down", '=', '0', _$gXLocal, 0);
        }
        //The snake is now keyboard controllable
        _$fe(3, 154, 'keydown', _$gXLocal);
    });
    _$fe(3, 155, 'ready', _$gXLocal);
});