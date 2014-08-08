
var test1=(1==1);
var test2=(1==1);
if (test1)
{ console.log("1"); }
 else
if (test2)
{ console.log("2"); }
 else
{ console.log("3"); }

var i=0;

if (j=0, k=1, k>j) {
console.log("!");
}

console.log("----" + (tempvar = i, i++, tempvar));
console.log("----" + (tempvar = i, i++, tempvar));
console.log("----" + (tempvar = i, i++, tempvar));



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
//console.log(i);
}

/*
function addx3(j)
{
  global['j']++;
  return j;
}

var j = 0;
var arr = [];
arr[addx3(j)] = "a1";
arr[addx3(j)] = "a2";
arr[addx3(j)] = "a3";

console.log(arr[0]);
console.log(arr[1]);
console.log(arr[2]);
console.log("-----------");


var j = 0;
var arr = [];
arr[j = (addx(j))] = "a1";
arr[j = (addx(j))] = "a2";
arr[j = (addx(j))] = "a3";


console.log(arr[0]);
console.log(arr[1]);
console.log(arr[2]);
console.log("-----------");



function addx2(i)
{
   return i.val++;
}

var arr2 = [];
var j={val:0};
arr2[addx2(j)] = "a1";
arr2[addx2(j)] = "a2";

console.log(arr2[0]);
console.log(arr2[1]);
console.log("-----------");

*/

function stupido(i,name)
{
   console.log(i+" "+name);
}

var j=0;
stupido( j++, "hi " );
stupido( j++, "hi " );
stupido( j++, "hi " );


var j=0;
stupido( (oldj = j, j = addx(j), oldj), "hi " );
stupido( (oldj = j, j = addx(j), oldj), "hi " );
stupido( (oldj = j, j = addx(j), oldj), "hi " );

console.log("-----------");
console.log("-----------");
console.log("-----------");



var j = 0;
var arr = [];
arr[oldj = j, j = addx(j), oldj] = "a11";
arr[oldj = j, j = addx(j), oldj] = "a22";
arr[oldj = j, j = addx(j), oldj] = "a33";


console.log(arr[0]);
console.log(arr[1]);
console.log(arr[2]);
console.log("-----------");
