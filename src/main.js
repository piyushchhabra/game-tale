import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import Ballon from './scenes/Ballon'
import BalloonTitle from './scenes/BalloonTitle'

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const config = {
	type: Phaser.AUTO,
	// width: 1200,
	// height: 800,
	width: window.innerWidth-10, 
	height: window.innerHeight,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: { y: 0 }
		}
	},
	backgroundColor: '#000000', //#245fa3
	scene: [Preloader, Game, Ballon, BalloonTitle]
}

let game = new Phaser.Game(config);
var code = getParameterByName('code')
if (!code) code = 'default'
game.balloonDataFile = "balloon/" + code + "_data.json" 
export default game
