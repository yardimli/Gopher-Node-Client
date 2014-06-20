var str1;

function add1(a,b)
{
	total = a+b;
	
	return total;
}

var str2;

str2 = 1;

var i=5;
var j;
var i1;

j = 0;
for (i1=0; i1 < 10; i1++)
{
	j = j + i1;
}

for (var i2=10; i2<20; i2++)
{
	j = j + i2;
}

i = add1(i,6);

$(document).ready(function() {
 str1 = "hello world";
	$("#debug_console").html(str1);
});
