var aoeu = 5;

var c; // the drawing context
var w = 640; //  the (constant) width of the game canvas
var h = 480; // the (constant) height of the game canvas

var timeout; // the timeout for the main() loop

var pairs = [
	["dog","犬"],
	["fire","火"],
	["flower","花"],
	["tree","木"],
	["water","水"]
];

var kanjis = new Array(pairs.length);

function Kanji(kanji, translation) {
	this.kanji = kanji;
	this.translation = translation;
	this.x = (w / 2);
	this.y = (w / 2);
	
	this.setPos = function(newX, newY) { // newX and newY are numbers
		this.x = newX; // set new x
		this.y = newY; // and y values
	}
	
	this.draw = function(cxt) { // cxt is a canvas 2D context
		cxt.fillText(this.kanji, this.x, this.y);
	}
}


function init() {
	w = document.getElementById("canvas").offsetWidth; //  sync the width with the canvas's width
	h = document.getElementById("canvas").offsetHeight; // sync the height with the canvas's height
	
	c = document.getElementById("canvas").getContext("2d"); // get the context
	
	console.log(kanjis); // for debugging
	
	for (var i = 0; i < pairs.length; i++) {
		kanjis.push(new Kanji(pairs[i][0], pairs[i][1]));
	}
	kanjis = kanjis.slice(5); // not sure why, but 5 "undefined"s get added to the front of the list
	
	console.log(kanjis); // for debugging
	
	//timeout = setInterval("main();", 200);
	
	c.fillStyle = "white";
	kanjis[0].draw(c);
}

function main() {
	// background
	c.fillStyle = "black";
	c.fillRect(0, 0, w, h);
	
	c.fillStyle = "white";
	for (var i = 0; i < kanjis.length; i++) {
		kanjis[i].draw(c);
	}
	c.fillText("aoeu", aoeu++, 20);
}

function checkSol(index) {

}
