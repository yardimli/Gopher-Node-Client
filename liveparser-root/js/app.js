$(document).ready( function() {

	function b5(b)
	{
		function b55(b)
		{
			return b+2;
		}
		
		var bb=b55(b)*4;
		
		return b;
	}

	var cc = function() { return 1; };
	var bb = function(a,b,c) { return a-b+c; };

	function dd()
	{
		return 2;
	}


	function a5(a)
	{
		function a55(a)
		{
			return a+1;
		}
		
		var aa=a55(a)*2;
		
		if (a<10) { return aa+10;} else 
		if (a>100) { return a-100;}
		
		return aa;
	}

	function a1(a)
	{
		var aaa=a;
		return aaa;
	}

	var blockC = [];
	blockC[1] = {};
	blockC[1].X= 5;
	blockC[2] = 5;

	var j = 1;

	var i = $(window).width()+window.innerHeight+5+a5(5)+a5($(window).width())+a5(window.innerWidth)+blockC[2]+blockC[1].X+blockC[a1(2)];
	if ( (a1(i)>j) && (i>4) && a5(5)>20 ) {  console.log(5>6);  }

	for (var k=0; k<5; k=k+1 )
	{
		i=k+5;
		console.log(k+' ==== '+a5(k)+i);
	}

	for (var k=0; k<10; k++ )
	{
		i=k+5;
		console.log(k+' ==== '+a5(k)-i);
	}

	var info = {};
	info.name ='hi';


	var blockA = {firstName:'John', lastName:'Doe', age:50, eyeColor:'blue'};
	var blockB = ['hi 2','hello 2'];


	console.log(i);
	i++;
	console.log(i);
	i += 1;
	console.log(i);
	i -= 1;
	console.log(i);

	var block1 = {};
	block1.name = 'ONE';
	block1.lname= 'TWO';

	var block2 = [];
	block2[1] = 'THREE';
	block2[2] = 'FOUR';
	block2[3] = 'FOUR-2';

	var block3 = [];
	block3[1] = {};
	block3[1].name = 'FIVE';
	block3[1].lname = 'SIX';

	var f= (i>j) && (i>4);

	for (; k<20; k++ )
	{
		console.log(k);
	}

	for (; k<25;  )
	{
		k++;
		console.log(k);
	}

	console.log(block1.name+' '+block1.lname);
	console.log(block2[1]+' '+block2[2]+' '+block2[3]);
	console.log(block3[1].name+' '+block3[1].lname);

	// Get all the keys from document
	var keys = $('#calculator span');
	var operators = ['+', '-', 'x', '/'];
	var decimalAdded = false;
	var InputStr = "";

	// Add onclick event to all the keys and perform operations
	$("#calculator span").click( function(e) {
		// Get the input and button values
		var input = $('.screen');
		var inputVal = input.html();
		var btnVal = $(this).html();
		
		// Now, just append the key values (btnValue) to the input string and finally use javascript's eval function to get the result
		// If clear key is pressed, erase everything
		if(btnVal == 'C') {
			InputStr="";
			input.html(InputStr);
			decimalAdded = false;
		}
		
		// If eval key is pressed, calculate and display the result
		else if(btnVal == '=') {
			var equation = inputVal;
			var lastChar = equation[equation.length - 1];
			
			// Replace all instances of x with *.
			equation = equation.replace(/x/g, '*');
			
			// Final thing left to do is checking the last character of the equation. If it's an operator or a decimal, remove it
			if(operators.indexOf(lastChar) > -1 || lastChar == '.')
				equation = equation.replace(/.$/, '');
			
			if(equation)
				input.html(eval(equation));
				
			decimalAdded = false;
		}
		
		else if(operators.indexOf(btnVal) > -1) {
			// Operator is clicked
			// Get the last character from the equation
			var lastChar = inputVal[inputVal.length - 1];
			
			// Only add operator if input is not empty and there is no operator at the last
			if(inputVal != '' && operators.indexOf(lastChar) == -1) 
			{
				InputStr += btnVal;
				input.html(InputStr);
			}
			
			// Allow minus if the string is empty
			else if(inputVal == '' && btnVal == '-') 
			{
				InputStr += btnVal;
				input.html(InputStr);
			}
			
			// Replace the last operator (if exists) with the newly pressed operator
			if(operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
				// Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
				InputStr = inputVal.replace(/.$/, btnVal);
				input.html(InputStr);
			}
			
			decimalAdded =false;
		}
		
		// Now only the decimal problem is left. We can solve it easily using a flag 'decimalAdded' which we'll set once the decimal is added and prevent more decimals to be added once it's set. It will be reset when an operator, eval or clear key is pressed.
		else if(btnVal == '.') {
			if(!decimalAdded) {
				InputStr += btnVal;
				input.html(InputStr);
				decimalAdded = true;
			}
		}
		
		// if any other key is pressed, just append it
		else {
			InputStr += btnVal;
			input.html(InputStr);
		}
		
		// prevent page jumps
		e.preventDefault();
	}); 
		
		
		
	
	/*
	//snake
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	//Lets save the cell width in a variable for easy control
	var cw = 10;
	var d;
	var food;
	var score;
	
	//Lets create the snake now
	var snake_array; //an array of cells to make up the snake
	
	function init()
	{
		d = "right"; //default direction
		create_snake();
		create_food(); //Now we can see the food particle
		//finally lets display the score
		score = 0;
		
		//Lets move the snake now using a timer which will trigger the paint function
		//every 60ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 500);
	}
	init();
	
	function create_snake()
	{
		var length = 5; //Length of the snake
		snake_array = []; //Empty array to start with
		for(var i = length-1; i>=0; i--)
		{
			//This will create a horizontal snake starting from the top left
			snake_array.push({x: i, y:0});
		}
	}
	
	//Lets create the food now
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw)
		}
		//This will create a cell with x/y between 0-44
		//Because there are 45(450/10) positions accross the rows and columns
	}
	
	//Lets paint the snake now
	function paint()
	{
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		
		//The movement code for the snake to come here.
		//The logic is simple
		//Pop out the tail cell and place it infront of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		//Lets add proper direction based movement now
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
		
		//Lets add the game over clauses now
		//This will restart the game if the snake hits the wall
		//Lets add the code for body collision
		//Now if the head of the snake bumps into its body, the game will restart
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
			//restart game
			init();
			//Lets organize the code a bit now.
			return;
		}
		
		//Lets write the code to make the snake eat the food
		//The logic is simple
		//If the new head position matches with that of the food,
		//Create a new head instead of moving the tail
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score++;
			//Create new food
			create_food();
		}
		else
		{
			var tail = snake_array.pop(); //pops out the last cell
			tail.x = nx; tail.y = ny;
		}
		//The snake can now eat the food.
		
		snake_array.unshift(tail); //puts back the tail as the first cell
		
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			//Lets paint 10px wide cells
			paint_cell(c.x, c.y);
		}
		
		//Lets paint the food
		paint_cell(food.x, food.y);
		//Lets paint the score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
	}
	
	//Lets first create a generic function to paint cells
	function paint_cell(x, y)
	{
		ctx.fillStyle = "blue";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	function check_collision(x, y, array)
	{
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	//Lets add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
		//We will add another clause to prevent reverse gear
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
		//The snake is now keyboard controllable
	})
	*/
	

});