import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {

    constructor() {
		super('preloader')
	}

    preload() {
        this.load.spritesheet('girl', 'textures/girl_sheet.png', {
            frameWidth: 96,
            frameHeight: 128
        })

        this.load.spritesheet('boy', 'textures/boy_sheet.png', {
            frameWidth: 96,
            frameHeight: 128
        })

        this.load.image('mountains-back', 'textures/mountains-back.png');
		this.load.image('mountains-mid1', 'textures/mountains-mid1.png');
		this.load.image('mountains-mid2', 'textures/mountains-mid2.png');

        this.load.image('sky', 'assets/sky.png');
        this.load.image('mountain', 'assets/mountains.png')
        this.load.image('plateau', 'assets/plateau.png')
        this.load.image('ground', 'assets/ground.png')
        this.load.image('plant', 'assets/plant.png')
        this.load.image('laser', 'assets/laser.png')

        this.load.image('balloon-blue', 'assets/balloon-blue.png')
        this.load.image('balloon-red', 'assets/balloon-red.png')
        this.load.image('balloon-green', 'assets/balloon-green.png')
        this.load.image('balloon-green', 'assets/balloon-green.png')
        this.load.image('balloon-yellow', 'assets/balloon-yellow.png')
        this.load.image('balloon-purple', 'assets/balloon-purple.png')
        this.load.audio('pop','assets/pop.mp3');
        if (this.game.balloonDataFile) {
            console.log("loaded data file for ballons - " + this.game.balloonDataFile)
            this.load.json('balloonData', this.game.balloonDataFile)
        }

    }

    create() {
        this.anims.create({
            key: 'girl-idle',
            frames: [{key: 'girl', frame: 23}]
        })

        this.anims.create({
            key: 'girl-right-walk',
            frames: this.anims.generateFrameNumbers('girl', {start: 24, end: 27}),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'boy-idle',
            frames: [{key: 'boy', frame: 23}]
        })

        this.anims.create({
            key: 'boy-jump',
            frames: this.anims.generateFrameNumbers('boy', {start: 7, end: 8}),
            frameRate: 10,
            repeat: -1
        })
        this.scene.start('ballon')
    }
}