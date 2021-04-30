import Phaser, { Physics } from 'phaser'
import WebFontFile from './WebFontFile'

export default class Ballon extends Phaser.Scene {
    constructor() {
        super("ballon")
        this.balloons 
        this.popSound
        this.magicSound
        this.sparkleSound
        this.questions = []
        this.currQuestion
        this.bg1
        this.bg2
        this.bgCount
        this.currBgIndex
        this.blackAndWhiteMode = false
    }

    preload() {
        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
        this.popSound = this.sound.add('pop');
        this.magicSound = this.sound.add('magic');
        this.sparkleSound = this.sound.add('sparkle');

        const {width, height} = this.scale
        let data = this.game.cache.json.get('balloonData');
        console.log("loading bg - " + data.balloonBg)
        this.bgCount = data.balloonBgs.length
        for (let i=1; i<=data.balloonBgs.length; i++) {
            this.load.image('balloonBg-'+i, data.balloonBgs[i-1]) 
        }
        this.currBgIndex = 1
        if (data.blackAndWhiteMode) {
            console.log("Black And White mode is set")
            this.blackAndWhiteMode = true
        }
    }

    create() {
        const {width, height} = this.scale
        console.log("canvas is " + width + ":" + height)
        this.bg1 = this.add.sprite(width*0.5, height*0.5, 'balloonBg-1');
        this.scaleBg(this.bg1)
        this.bg2 = this.add.sprite(width*0.5, height*0.5, 'balloonBg-2');
        this.bg2.setAlpha(0)
        this.scaleBg(this.bg2)
        this.time.addEvent({
            delay: 2000,
            callback: () => this.bgChange(),
            loop: false
        })
        this.balloons = [];
        this.currQText = this.add.text(50,250, '', {
            fontFamily: '"Press Start 2P"',
			fontSize: '40px',
            color:'#ffffff', 
            wordWrap: {
                width: width - 150
                    }
            });
        this.startGame();
    }

    bgChange() {
        if (this.bg1.alpha == 1) {
            this.tweens.add({
                targets: this.bg1,
                alpha: 0,
                yoyo: false,
                repeat: 0,
                duration: 2000,
                ease: 'Cubic.easeOut',
                onComplete: () => this.changeBackground()
            })
            this.tweens.add({
                targets: this.bg2,
                alpha: 1,
                yoyo: false,
                repeat: 0,
                duration: 2000,
                ease: 'Cubic.easeOut'
            })
        } else {
            this.tweens.add({
                targets: this.bg1,
                alpha: 1,
                yoyo: false,
                repeat: 0,
                duration: 2000,
                ease: 'Cubic.easeOut'
            })
            this.tweens.add({
                targets: this.bg2,
                alpha: 0,
                yoyo: false,
                repeat: 0,
                duration: 2000,
                ease: 'Cubic.easeOut',
                onComplete: () => this.changeBackground()
            })
        }
      
    }

    changeBackground() {
        const {width, height} = this.scale
        if (this.bg1.alpha === 0){
            this.bg1.setTexture('balloonBg-' + this.currBgIndex)
            this.scaleBg(this.bg1)
            // this.bg1.loadTexture('balloonBg-' + this.currBgIndex);
        } else{
            // this.bg2 = this.add.sprite(width*0.5, height*0.5, 'balloonBg-' + this.currBgIndex);
            this.bg2.setTexture('balloonBg-' + this.currBgIndex)
            this.scaleBg(this.bg2)
        }

        this.currBgIndex += 1
        if (this.currBgIndex > this.bgCount) {
            this.currBgIndex = 1
        }
        this.time.addEvent({
            delay: 2000,
            callback: () => this.bgChange(),
            loop: false
        })
    }

    scaleBg(bg) {
        const {width, height} = this.scale
        let scaleFactor = 1
        while (bg.height * scaleFactor < height) {
            scaleFactor *= 1.2
        }
        bg.setScale(scaleFactor)
    }

    startGame() {
        const {width, height} = this.scale
        console.log("game width="+ width)
        let data = this.game.cache.json.get('balloonData');
        var allQuestions = data.questions
        for (let i=0; i<allQuestions.length; i++) {
            var curr = allQuestions[i]
            var q = new Question(curr.qText, curr.options)
            this.questions.push(q)
        }

        for (let i=1; i<this.questions.length; i++) {
            this.questions[i-1].setNextQuestion(this.questions[i])
        }

        this.currQuestion = this.questions[0]
        this.currQuestion.show(this)
	}

    addBalloon(msg, correct) {
        const {width, height} = this.scale
        var ran = [2, 3, 4, 5];
        var seed = ran[Math.floor(Math.random()*ran.length)]
        if (seed <= 3) {
            var x = Math.floor(Math.random()*(width-128));
            if (x < width * 0.5) {
                x += 2 * ((width*0.5) - x)
            }
        }
		
		var balloon = new Gubbara(this, x, height+20, this.randomColor(), msg, correct);
		balloon.speed = 0.25 + Math.random() + seed;
		this.balloons.push(balloon);
        return balloon
	}

    killBFinal(balloon) {
        var tween1 = this.tweens.add({
            targets: balloon,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 50
        });
        var tween2 = this.tweens.add({
            targets: balloon,
            scaleX: 0,
            scaleY: 0,
            duration: 50,
            delay: 50,
            onComplete: () => {
                balloon.destroy(); 
            }
        });
    }

	killBalloon(balloon) {
        var sounds = [this.magicSound, this.sparkleSound];
        sounds[Math.floor(Math.random()*sounds.length)].play()
		// this.magicSound.play();
        console.log("killing")
        if (balloon.correct) {
            this.balloons.forEach(b =>this.killBFinal(b))
            this.balloons = []
            this.currQuestion.complete(this)
        } else {
            this.balloons = this.balloons.filter(b => b!==balloon);
            this.killBFinal(balloon)
        }
	}

    gameOver() {
		// this.cameras.main.shake(500);
		// this.balloons.forEach(b => this.killBalloon(b));
		// this.score = 0;
		// this.startGame();
	}

    randomColor() {
        var colors
        if (this.blackAndWhiteMode) {
            colors = ['balloon-grey'];
        } else {
		    colors = ['balloon-red', 'balloon-blue', 
            'balloon-green', 'balloon-yellow', 
            'balloon-purple', 'balloon-grey'];
        }
		var random = Math.floor(Math.random()*colors.length);
		return colors[random];
	}

	update(time,delta) {
		// console.log('update time=%o, delta=%o', time,delta);
		this.balloons.forEach(b => b.update(time,delta, this));
	}

    moveToNext(q) {
        this.currQuestion = q
        this.currQText.setText(q.qText)
        q.show(this)
    }

    updateQtext(qText) {
        this.currQText.setText(qText)
    }
}

class Question {
    qText
    opCount
    allBalloon
    nextQuestion
    options
    constructor(qText, options) {
        this.qText = qText
        this.opCount = options.length
        this.options = options
        this.allBalloon = []
    }

    show(scene) {
        scene.updateQtext(this.qText)
        this.allBalloon = []
        for (let i=0; i<this.opCount; i++) {
            this.allBalloon.push(scene.addBalloon(this.options[i].text, this.options[i].correct))
        }
    }

    setNextQuestion(nq) {
        this.nextQuestion = nq
    }

    complete(scene) {
        if (this.nextQuestion) {
            scene.moveToNext(this.nextQuestion)
        } else {
            let data = scene.game.cache.json.get('balloonData');
            console.log("end=" + data.endTextTitle)
            scene.updateQtext(data.endTextTitle)
        }
    }
}

class Gubbara extends Phaser.GameObjects.Sprite {
    msgObj
    msg
    correct
    constructor(scene, x,y, key, msg, correct) {
		super(scene, x,y, key);
		scene.add.existing(this);
		this.setInteractive();
		this.on('pointerdown', e => this.onPop(e));

		this.angle = -15 + Math.random()*30;				// -15 to 15
		this.angleDir = -1 + Math.round(Math.random())*2;
        this.currScene = scene	// 1 or -1
        this.msg = msg
        this.msgObj = scene.add.text(x,y,  msg, {
            // fontFamily: '"Press Start 2P"',
			fontSize: '40px',
            color:'#d8eb34', 
            });
        this.msgObj.setStroke('#de77ae', 5);
		this.msgObj.setShadow(2, 2, '#333333', 2, true, false);
        this.correct = correct
	}

    onPop(event) {
		// console.log('onPop()\t this=%o, event=%o', this, event);
		this.scene.addBalloon(this.msg, this.correct);
		this.scene.killBalloon(this);
	}

	update(time,delta,scene) {
		if(this.y<0) {
            this.y = scene.scale.height + 100
            this.msgObj.y = this.y
        };

		this.x += this.angle/20;
        this.msgObj.x += this.angle/20;

		if(this.x<64) {this.x = 64, this.msgObj.x = 64};
    
		if(this.x>(scene.scale.width-64)) {this.x = scene.scale.width-64, this.msgObj.x = this.x};

		this.angle += this.angleDir/5;
		if(this.angle>25 || this.angle<-25) this.angleDir *= -1;

		this.y -= this.speed;
        this.msgObj.y -= this.speed;
	}

    outOfScreen() {
        return this.y < 0
    }

    destroy() {
        super.destroy()
        this.msgObj.destroy()
    }

}