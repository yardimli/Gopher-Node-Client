
$(document).ready( function() {

var cc = function() { return 1; };
var bb = function(a,b,c) { return a-b+c; };

function dd()
{
	return 2;
}


function b5(b)
{
	function b55(b)
	{
		return b+2;
	}
	
	var bb=b55(b)*4;
	
	return b;
}

function a5(a)
{
	function a55(a)
	{
		return a+1;
	}
	
	var aa=a55(a)*2;
	
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

for (var k=0; k<10; k++ )
{
	console.log(k+" "+a5(k));
}

var info = {};
info.name ="hi";


var blockA = {firstName:"John", lastName:"Doe", age:50, eyeColor:"blue"};
var blockB = ["hi 2","hello 2"];


console.log(i);
i++;
console.log(i);
i += 1;
console.log(i);
i -= 1;
console.log(i);

var block1 = {};
block1.name = "ONE";
block1.lname= "TWO";

var block2 = [];
block2[1] = "THREE";
block2[2] = "FOUR";
block2[3] = "FOUR-2";

var block3 = [];
block3[1] = {};
block3[1].name = "FIVE";
block3[1].lname = "SIX";

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

console.log(block1.name+" "+block1.lname);
console.log(block2[1]+" "+block2[2]+" "+block2[3]);
console.log(block3[1].name+" "+block3[1].lname);

});