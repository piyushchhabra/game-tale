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

        this.scene.start('game')
    }
}