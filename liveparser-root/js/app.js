var str1;
var str2;

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

var i=5;
var j;
var i1;

j = 0;
for (i1=0; i1 < 3; i1++)
{
	j = j + i1;
}

for (var i2=10; i2<12; i2++)
{
	j = j + i2;
}

i = AddNumbers(i,6);

$(document).ready(function() {
 str1 = "hello world";
	$("#debug_console").html(str1);
});
