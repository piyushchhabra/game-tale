import Phaser, { Physics } from 'phaser'
import WebFontFile from './WebFontFile'

export default class BalloonTitle extends Phaser.Scene {
    constructor() {
        super("balloonTitle")
        this.buttonText
        this.button
    }

    preload() {
        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    }

    create() {
        const {width, height} = this.scale
        let data = this.game.cache.json.get('balloonData');
        this.heading = this.add.text(100, 200, data.startTextTitle, { fontSize: '60px',color:'#ffffff', })
        this.heading.setStroke('#000000', 3);
		this.heading.setShadow(2, 2, '#333333', 2, true, false);
        this.label = this.add.text(100, 350, '', {
            fontSize: '50px',
            color:'#ffffff', 
        })
		.setWordWrapWidth(width - 200)

	    this.typewriteTextWrapped(data.startTextSubTitle)

        this.button = this.add.rectangle(width * 0.25, height * 0.7 , width * 0.5, 148, 0x97a321);
        this.button.setOrigin(0,0)
        this.button.setStrokeStyle(2, 0xffffff, 1)
        this.tweens.add({
            targets: this.button,
            alpha: 0.4,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.buttonText = this.add.text(width * 0.30 , height * 0.7 + 55, 'Play Now', {
            fontFamily: '"Press Start 2P"',
            fontSize: '50px',
            color:'#ffffff', 
        })
        this.setButtonVisible(false)
        this.button.setInteractive()
        this.button.on('pointerdown', ()=> {
            if(this.input.activePointer.isDown) {
                this.scene.start('ballon')
            }
        });
    }

    typewriteTextWrapped(text) {
        const lines = this.label.getWrappedText(text)
        const wrappedText = lines.join('\n')
        this.typewriteText(wrappedText)
    }

    typewriteText(text) {
        const length = text.length
        let i = 0
        this.time.addEvent({
            callback: () => {
                this.label.text += text[i]
                ++i
                if (i >= length -1) {
                    this.setButtonVisible(true)
                }
            },
            repeat: length - 1,
            delay: 100
        })
    }

    setButtonVisible(flag) {
        this.button.setVisible(flag)
        this.buttonText.setVisible(flag)
    }

}