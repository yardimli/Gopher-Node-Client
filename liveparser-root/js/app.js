var str1;

function add1(a,b)
{
	return a+b;
}

var str2;

str2 = 1;

var i;
var j;

j = 0;
for (var i1=0; i1<10; i1++)
{
	j = j + i1;
}

j = 4;

i = j;

i = add1(i,6);

$(document).ready(function() {
 str1 = "hello world";
	$("#debug_console").html(str1);
});
