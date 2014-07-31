function addx(i)
{
return i+1;
}

function checkx(i,j)
{
return i<j;
}

function assignx(i)
{
return i;
}

for (var i=assignx(0); checkx(i,5); i = addx(i) )
{
console.log(i);
}

var j = 0;
var arr = [];

    var j=0;
    function addx2(i)
    {
       j = i+1;
       return j-1;
    }
	
    arr[addx2(j)] = "a1";
    arr[addx2(j)] = "a2";



console.log(arr[0]);
console.log(arr[1]);