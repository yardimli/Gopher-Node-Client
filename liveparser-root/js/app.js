var str1,str2;

str1,str2 = "hello";

function cool()
{
	var person = {fname:"John", lname:"Doe", age:25}; 

	var text = "";
	var x;
	for (x in person) {
		text += person[x];
	}
	
	return text;
}

function DoubleNumber(a)
{
	return a*2; 
}

function AddNumbers(a,b)
{
	var total = 0;
	for (var i=0; i<3; i++)
	{
		total = total+a+b;
	}
	
	return DoubleNumber(total);
}

str2 = 1;

var initTest = AddNumbers(3,4);

var i=5;
var j;
var i1;

j = 0;
for (i1=0; i1 < 3; i1++)
{
	j = j + i1;
}

for (var i2=10; i2<14; i2++)
{
	j = j + i2;
	i = 5+3+2+AddNumbers(i,j);

}

i = 5+3+2+AddNumbers(i,6);

cool();

$(document).ready(function() {
 str1 = "hello world";
	$("#debug_console").html(str1);
});
