var str5 = 'ff';
var initTest = AddNumbers(3,4);
var person = {fname:"John", lname:"Doe", age:25}; 
var i=5;
var j=i*4;
var k=(j+i)/3;
var m=k*AddNumbers(k,4);
var n="hi "+cool();

var str1,str2,str3 = 'ff';
str1 = "ac",str2 = "hello",str3= "hi";

var str3 = "";

str3 = "a"+"b";

var i=5;
var j;
var i1;

j = 0;




function cool()
{
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
