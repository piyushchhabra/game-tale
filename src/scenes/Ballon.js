import Phaser, { Physics } from 'phaser'
import WebFontFile from './WebFontFile'

export default class Ballon extends Phaser.Scene {
    constructor() {
        super("ballon")
        this.balloons 
        this.score
        this.popSound
    }

    preload() {
        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
        this.popSound = this.sound.add('pop');
    }

    create() {
        const {width, height} = this.scale
        this.balloons = [];this.score = 0;
        this.scoreText = this.add.text(50,50, '', {fontFamily:'Arial Black', fontSize:74, color:'#c51b7d'});
        this.scoreText.setStroke('#de77ae', 5);
        this.scoreText.setShadow(2, 2, '#333333', 2, true, false);
        this.startGame();
    }

    startGame() {
        const {width, height} = this.scale
        console.log("width="+ width)
		var sx = (width)/3;
		for(var i=0;i<3;i++) {
			this.addBalloon(sx*i + sx*0.5);
		}
		this.score = 0;
	}

    addBalloon(x) {
        console.log("added ballon - " + x)
        const {width, height} = this.scale
		if(!x) x = Math.floor(Math.random()*(width-128)) + 64;
		var balloon = new Gubbara(this, x, height+20, this.randomColor());
		balloon.speed = 0.25 + Math.random() + (this.score/10);
		this.balloons.push(balloon);
		this.score++;
	}

	killBalloon(balloon) {
		this.popSound.play();
		this.balloons = this.balloons.filter(b => b!==balloon);
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
			onComplete: () => balloon.destroy()
		});
	}

    gameOver() {
		// this.cameras.main.shake(500);
		// this.balloons.forEach(b => this.killBalloon(b));
		// this.score = 0;
		// this.startGame();
	}

    randomColor() {
		var colors = ['balloon-red', 'balloon-blue', 'balloon-green'];
		var random = Math.floor(Math.random()*colors.length);
		return colors[random];
	}

	update(time,delta) {
		// console.log('update time=%o, delta=%o', time,delta);
		this.balloons.forEach(b => b.update(time,delta));
		this.scoreText.setText('Score: '+this.score);
	}
}

class Gubbara extends Phaser.GameObjects.Sprite {
    constructor(scene, x,y, key) {
		super(scene, x,y, key);
		scene.add.existing(this);
		this.setInteractive();
		this.on('pointerdown', e => this.onPop(e));

		this.angle = -15 + Math.random()*30;				// -15 to 15
		this.angleDir = -1 + Math.round(Math.random())*2;
        this.currScene = scene	// 1 or -1
	}

    onPop(event) {
		// console.log('onPop()\t this=%o, event=%o', this, event);
		this.scene.addBalloon();
		this.scene.killBalloon(this);
	}

	update(time,delta) {
		if(this.y<-1000) {
            console.log('over and out')
            return this.scene.gameOver()
        };

		this.x += this.angle/20;
		if(this.x<64) this.x = 64;
		if(this.x>(this.scene.sys.game.config.width-64)) this.x = this.scene.sys.game.config.width-64;

		this.angle += this.angleDir/5;
		if(this.angle>25 || this.angle<-25) this.angleDir *= -1;

		this.y -= this.speed;
	}

}