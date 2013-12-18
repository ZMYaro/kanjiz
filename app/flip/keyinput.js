function keyPressed(e) {
	switch (e.keyCode) {
		case 27: // Esc
			document.getElementById('settingsBg').style.display = 'none';
		break;
		case 70: // F
			flipCard();
		break;
		case 74: // J
			if (current < list.length - 1) {
				nextCard();
			}
		break;
		case 75: // K
			if (current > 0) {
				current -= 2;
				nextCard();
			}
		break;
		case 78: // N
			if (current < list.length - 1) {
				nextCard();
			}
		break;
		case 80: // P
			if (current > 0) {
				current -= 2;
				nextCard();
			}
		break;
		case 82: // R
			restart();
		break;
	}
}
