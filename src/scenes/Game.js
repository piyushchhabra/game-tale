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

    constructor() {
		super('game')
	}
    preload() {
        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.label = this.add.text(500, 150, '')
        this.boyLabel = this.add.text(700, 250, '',  {
            backgroundColor: '0x45a827',
            color: '#4ad620'
		})
        this.shownMsg = false
        this.shownMsgBoy = false
    }

    create() {
        const {width, height} = this.scale
        this.player = this.physics.add.sprite(width * 0.5 - 250, height * 0.5, 'girl').play('girl-idle')
        this.guy = this.physics.add.sprite(width * 0.5 + 150, height * 0.5, 'boy').play('boy-idle')
    }

    update() {
        const speed = 200
        const {width, height} = this.scale
        if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed)
            this.player.play('girl-right-walk', true)
        } else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed)
            this.player.play('girl-right-walk', true)
        } else {
            this.player.setVelocity(0, 0)
            this.player.play('girl-idle')
        }

        if (this.player.x < width * 0.5 + 80 && this.shownMsg) {
            this.shownMsg = false
            this.label.text = ""
            this.boyLabel.text = ""
            this.guy.play('boy-idle')
        }

        if (this.player.x > width * 0.5 + 80 && !this.shownMsg) {
            this.shownMsg = true
            this.showText("Hello Piyush.\nI am Kundini.\nI have some doubts with USL.\nCan you please help ?")
        }

    }

    showBoyMessage() {

    }

    happyBoy() {
        this.guy.play('boy-jump', true)
        if (!this.shownMsgBoy) {
            this.showtextBoy("Definitly !")
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