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

});