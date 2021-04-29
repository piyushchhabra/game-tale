import Phaser, { Physics } from 'phaser'
import WebFontFile from './WebFontFile'

/**
 * 
 * @param {Phaser.Scene} scene 
 * @param {*} count 
 * @param {*} texture 
 * @param {*} scrolfactor 
 */
const createLoop = (scene, count, texture, scrolfactor) => {
    let x = 0
    for (let i=0; i< count; i++) {
        const m  = scene.add.image(x, scene.scale.height, texture)
        .setOrigin(0,0.8)
        .setScrollFactor(scrolfactor)

        x += m.width
    }
  
}

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

    laserGroup

    fireKeys

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

        // this.mountainBack = this.add.tileSprite(0,-294 + 300, 2048, 894,  'mountains-back')
        // this.mountainMid1 = this.add.tileSprite(0,-170 + 300, 2048, 770,  'mountains-mid1')
        // this.mountainMid2 = this.add.tileSprite(0,118 + 300, 2048, 482,  'mountains-mid2')
        this.add.image(width * 0.5, height*0.5, 'sky').setScrollFactor(0)
        
        createLoop(this, 2, 'mountain', 0.25)
        // const m = this.add.image(0, height, 'mountain').setOrigin(0,0.8).setScrollFactor(0.25)
        // this.add.image(m.width, height, 'mountain').setOrigin(0,0.8).setScrollFactor(0.25)

        // this.add.image(0, height, 'plateau').setOrigin(0,0.8).setScrollFactor(0.5)
        createLoop(this, 3, 'plateau', 0.5)


        // this.add.image(0, height, 'ground').setOrigin(0,0.8).setScrollFactor(1)
        createLoop(this, 3, 'ground', 1)
        
        // this.add.image(0, height, 'plant').setOrigin(0,0.8).setScrollFactor(1.25)
        createLoop(this, 3, 'plant', 1.25)
        
        
        this.player = this.physics.add.sprite(width * 0.5 - 350, height * 0.8, 'girl').play('girl-idle')
        this.guy = this.physics.add.sprite(width * 0.5 + 150, height * 0.8, 'boy').play('boy-idle')

        this.label = this.add.text(550, 520, '')
        this.boyLabel = this.add.text(770, 590, '',  {
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1
		})

        this.laserGroup = new LaserGroup(this)
        this.cameras.main.setBounds(0, 0, width*5, height)
        this.addEvents()

    }

    update() {
        const speed = 200
        const {width, height} = this.scale
        const cam =  this.cameras.main
        if (this.cursors.right.isDown ) {
            cam.scrollX +=  3
            this.player.setVelocityX(speed)
            this.player.play('girl-right-walk', true)
    
            // this.moveBg(false)
        } else if (this.cursors.left.isDown && this.player.x > 10) {
            cam.scrollX -=  3
            this.player.setVelocityX(-speed)
            this.player.play('girl-right-walk', true)
            // this.moveBg(true)
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
            this.showText("Hello Bob.\nI am Alice from Tech Team.\nI have some doubts related to a project.\nWill you be able to help out?")
        }

        this.fireKeys.forEach(element => {
            if (Phaser.Input.Keyboard.JustDown(element)) {
                this.shootLaser()
            }
        })
    }

    shootLaser() {
        this.laserGroup.fireLaser(this.player.x+100, this.player.y)
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

    addEvents() {
        this.input.on('pointerdown', pointer => {
            this.shootLaser()
        })

        this.fireKeys = [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)]
    }
}

class Laser extends Phaser.Physics.Arcade.Sprite {

    currScene
    constructor(scene , x, y) {
        super(scene, x, y, 'laser')
        this.currScene = scene
    }

    fire(x,y) {
        this.body.reset(x, y)
        this.setActive(true)
        this.setVisible(true)
        this.setVelocityX(500)
        console.log(this.currScene.cameras.main.width)
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta)

        if(this.x > this.currScene.cameras.main.width) {
            this.setActive(false)
            this.setVisible(false)
        }
    }

}

class LaserGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene)
        this.createMultiple({
            classType: Laser,
            frameQuantity: 10,
            active: false,
            visible: false,
            key: 'laser'
        })
    }

    fireLaser(x, y) {
        console.log("fired in group")
        const laser = this.getFirstDead(false)
        if (laser) {laser.fire(x, y)}
    }
}