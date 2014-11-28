var j=5;
var i=4;

var obj = {a:1, b:2, c:3};
    
for (var prop in obj) {
  console.log("o." + prop + " = " + obj[prop]);
}

//---------------------------------------------------

var triangle = {a:1, b:2, c:3};

function ColoredTriangle() {
  this.color = "red";
}

ColoredTriangle.prototype = triangle;

var obj = new ColoredTriangle();

for (var prop in obj) {
  if( obj.hasOwnProperty( prop ) ) {
    console.log("o." + prop + " = " + obj[prop]);
  } 
}

//---------------------------------------------------

var i = 0;
do {
   i += 1;
   console.log(i);
} while (i < 5);



////-------------------

var k3 = 4;
var k2 = k<(10+j);
console.log("..."+((10+j)+k3));

for (var k=0; k<(10+j)+k3; k++)
{
	console.log(k);
}


if (j>i)
{
console.log("------------1-------------");
}

if ((i>2) && (j>3))
{
	j=15;
	console.log("------------2-------------");
	if (j>3) console.log("------------3-------------");

	if (i>6) console.log("------------4-------------")
	else console.log("------------5-------------");
	
	if (i>6) console.log("------------6-------------");	else console.log("------------7-------------");

	if (i>8) console.log("------------8-------------")
	else 
	if (i>9) console.log("------------9-------------");
	
} else
if (2==2) {
	console.log("------------10-------------");
} else
if (3==3)
	console.log("------------11-------------")
 else
{
	console.log("------------12-------------");
	var x=0;
	var y = x > 0 ? 1 : -1;
	
}


