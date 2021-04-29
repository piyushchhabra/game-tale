import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import Ballon from './scenes/Ballon'

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
	backgroundColor: '#245fa3',
	scene: [Preloader, Ballon]
}

export default new Phaser.Game(config)
