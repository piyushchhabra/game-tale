import Phaser from 'phaser'
import WebFontFile from './WebFontFile'

export default class Game extends Phaser.Scene {
    /**@type {Phaser.Physics.Arcade.Sprite} */
    player

    guy

        /**@type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    shownMsg

    shownMsgBoy

    mountainBack

    mountainMid1

    mountainMid2

    constructor() {
		super('game')
	}



    preload() {
        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.shownMsg = false
        this.shownMsgBoy = false
    }

    create() {
        const {width, height} = this.scale
        this.mountainBack = this.add.tileSprite(0,-294 + 300, 2048, 894,  'mountains-back')
        this.mountainMid1 = this.add.tileSprite(0,-170 + 300, 2048, 770,  'mountains-mid1')
        this.mountainMid2 = this.add.tileSprite(0,118 + 300, 2048, 482,  'mountains-mid2')
        this.player = this.physics.add.sprite(width * 0.5 - 250, height * 0.5, 'girl').play('girl-idle')
        this.guy = this.physics.add.sprite(width * 0.5 + 150, height * 0.5, 'boy').play('boy-idle')

        this.label = this.add.text(500, 120, '')
        this.boyLabel = this.add.text(700, 250, '',  {
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1
		})
    }

    update() {
        const speed = 200
        const {width, height} = this.scale
    
        if (this.cursors.right.isDown && this.player.x < width - 20) {
            this.player.setVelocityX(speed)
            this.player.play('girl-right-walk', true)
            this.moveBg(false)
        } else if (this.cursors.left.isDown && this.player.x > 10) {
            this.player.setVelocityX(-speed)
            this.player.play('girl-right-walk', true)
            this.moveBg(true)
        } else {
            this.player.setVelocity(0, 0)
            this.player.play('girl-idle')
        }
    
        if (this.shownMsg && this.player.x < width * 0.5 + 80 ) {
            this.shownMsg = false
            this.label.text = ""
            this.boyLabel.text = ""
            this.guy.play('boy-idle')
        }

        if (this.player.x > width * 0.5 + 80 && !this.shownMsg) {
            this.shownMsg = true

        this.showText("Hello Udayan.\nI am Radhika.\nI am new in Bangalore.\nWill you please help me exploring the city?")


    }

    moveBg(right) {
        if (right) {
            this.mountainBack.tilePositionX -= 0.05;
            this.mountainMid1.tilePositionX -= 0.3;
            this.mountainMid2.tilePositionX -= 0.75;  
        } else {
            this.mountainBack.tilePositionX += 0.05;
            this.mountainMid1.tilePositionX += 0.3;
            this.mountainMid2.tilePositionX += 0.75;  
        }
    }

    happyBoy() {
        this.guy.play('boy-jump', true)
        if (!this.shownMsgBoy) {
            this.showtextBoy("Definitly 😃")
        }
    }

    showText(text) {
        const words = text.split(" ")
        const length = words.length
        let i = 0
        this.time.addEvent({
            callback: () => {
                this.label.text += words[i] + " " 
                ++i
                if (i >= length -1) {
                   this.happyBoy()
                }
            },
            repeat: length - 1,
            delay: 100
        })
    }

    showtextBoy(text) {
        const words = text.split(" ")
        const length = words.length
        let i = 0
        this.time.addEvent({
            callback: () => {
                this.boyLabel.text += words[i] + " " 
                ++i
            },
            repeat: length - 1,
            delay: 100
        })
    }

}
