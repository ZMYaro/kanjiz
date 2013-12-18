var game; // -- the game div
var w = 640; // the (constant) width of the game canvas
var h = 480; // the (constant) height of the game canvas
var kanjiW = 50; // the (constant) kanji width
var kanjiH = 50; // the (constant) kanji height

var timeout; // the timeout for the main() loop

var translations = [
	"dog",
	"fire",
	"flower",
	"tree",
	"water",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"ten",
	"big",
	"small",
	"village",
	"town"
];

var kanjis = [
	"犬",
	"火",
	"花",
	"木",
	"水",
	"一",
	"二",
	"三",
	"四",
	"五",
	"六",
	"七",
	"八",
	"九",
	"十",
	"大",
	"小",
	"村",
	"町"
];

var dirs = new Array(kanjis.length); // ---- stores the direction of each kanji
var kanjiBtns = new Array(kanjis.length); // stores the kanji "buttons"
var sols = new Array(kanjis.length); // ---- stores the order of the solutions
var sol = 0; // ---------------------------- the current solution 

function init() {
	game = document.getElementById("game");
	w = game.offsetWidth; //  sync the width with the canvas's width
	h = game.offsetHeight; // sync the height with the canvas's height
	
	for (var i = 0; i < kanjis.length; i++) {
		var btn = document.createElement("div"); // ---------- make a div
		btn.className = "kanjiBtn"; // ----------------------- it is a kanji!
		btn.style.left = ((w / 2) - (kanjiW / 2)) + (Math.round(Math.random() * 6) - 3) + "px"; // position it half way across
		btn.style.top = ((h / 2) - (kanjiH / 2)) + (Math.round(Math.random() * 6) - 3) + "px"; //     and down the page
		btn.innerHTML = kanjis[i]; // ------------------------ add its symbol
		btn.setAttribute("onclick", "checkSol(" + i + ");"); // set its number and onclick event
		btn.setAttribute("onmousewheel", "dirs[" + i + "] = [(Math.round(Math.random() * 12) - 6) * 0.5, (Math.round(Math.random() * 12) - 6) * 0.5];"); // set it to change direction onrightclick
		
		kanjiBtns[i] = btn; // ------------------------------ add the new "button" to the list
		game.appendChild(kanjiBtns[i]); // ------------------ and put it on the game canvas
		
		var dir = [(Math.round(Math.random() * 12) - 6) * 0.5, (Math.round(Math.random() * 12) - 6) * 0.5]; // give it a random velocity
		if (dir[0] <= 0) {
			dir[0]--;
		}
		if (dir[1] <= 0) {
			dir[1]--;
		}
		dirs[i] = dir;
		
		sols[i] = i; // set each solution to its index (for now)
	}
	
	sol = 0; // set the solution #
	
	document.getElementById("prompt").innerHTML = translations[sols[sol]];
	
	timeout = setInterval("main();", 50);
}

function main() {
	for (var i = 0; i < kanjiBtns.length; i++) {
		var btnX = parseInt(kanjiBtns[i].style.left);
		var btnY = parseInt(kanjiBtns[i].style.top);
		btnX += dirs[i][0];
		if (btnX < 8) {
//			btnX = 0;
//			dirs[i][0] *= -1;
//			dirs[i][1] = (Math.round(Math.random() * 6) - 3);
			dirs[i][0] += 0.5;
			if (dirs[i][0] == 0) {
				dirs[i][1] = (Math.round(Math.random() * 12) - 6) * 0.5;
			}
		} else if (btnX > (w - kanjiW - 8)) {
//			btnX = (w - kanjiW);
//			dirs[i][0] *= -1;
//			dirs[i][1] = (Math.round(Math.random() * 6) - 3);
			dirs[i][0] -= 0.5;
			if (dirs[i][0] == 0) {
				dirs[i][1] = (Math.round(Math.random() * 12) - 6) * 0.5;
			}
		}
		btnY += dirs[i][1];
		if (btnY < 8) {
//			btnY = 0;
//			dirs[i][1] *= -1;
//			dirs[i][0] = (Math.round(Math.random() * 6) - 3);
			dirs[i][1] += 0.5;
			if (dirs[i][1] == 0) {
				dirs[i][0] = (Math.round(Math.random() * 12) - 6) * 0.5;
			}
		} else if (btnY > (h - kanjiH - 8)) {
//			btnY = (h - kanjiH);
//			dirs[i][1] *= -1;
//			dirs[i][0] = (Math.round(Math.random() * 6) - 3);
			dirs[i][1] -= 0.5;
			if (dirs[i][1] == 0) {
				dirs[i][0] = (Math.round(Math.random() * 6) - 3) * 0.5;
			}
		}
		kanjiBtns[i].style.left = Math.round(btnX) + "px";
		kanjiBtns[i].style.top = Math.round(btnY) + "px";
	}
}

function checkSol(index) {
	if (index == sols[sol]) {
		sol++;
		if (sol >= sols.length) {
			document.getElementById("prompt").innerHTML = "You win!"
			document.getElementById("game").style.backgroundColor = "green";
			clearInterval(timeout);
		} else {
			document.getElementById("prompt").innerHTML = translations[sol];
			document.getElementById("clicks").innerHTML += "&#10004;";
		}
	} else {
		document.getElementById("clicks").innerHTML += "&#10008;";
	}
}
