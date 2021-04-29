import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'

const config = {
	type: Phaser.AUTO,
	width: 1200,
	height: 800,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	backgroundColor: '#245fa3',
	scene: [Preloader, Game]
}

export default new Phaser.Game(config)
