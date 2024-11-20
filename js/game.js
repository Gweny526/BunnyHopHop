let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 320,
    physics: {
        default: 'arcade'
    },
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update
    },
    audio: {
        disableWebAudio: true
    },
    autoCenter: true
};
 
// Déclaration de nos variables globales
//images
let game = new Phaser.Game(config);
let bunnyImage;
let deadBunnyImage;
let celeryImage;
let heart;
let car = [];
 
let carNumInARow, rowNumber;
 
//titlescreen
let titleScreenImage;
 
 
let countDownTimer;
//text
let scoreText, countText;
 
//variable
let score;
let countDown, STARTCOUNTDOWN;
 
//touches
let downArrow;
let upArrow;
let leftArrow;
let rightArrow;
 
//sounds
let jumpSound;
let smashed;
let heartSound;
let traficSound;
 
//tween
let heartTween;
 
//3 best score
let bestScore = [];
 
 
//playing
let playing;
 
//
function init() {
    carNumInARow = 7;
    rowNumber = 7;
    score= 0;
    bestScore = [0, 0, 0]
    STARTCOUNTDOWN = 60;
    playing = false;
 
 
}
 
function preload() {
    //images
    this.load.image('bgImage', './assets/images/bg.png');
    this.load.image('bunny', './assets/images/bunny.png')
    this.load.image('celery', './assets/images/celery.png')
    this.load.image('heart', './assets/images/heart.png')
    this.load.image('deadBunnyImage', './assets/images/deadFrog.png');
 
    //cars
    this.load.image('car1', './assets/images/F1-1.png');
    this.load.image('car2', './assets/images/car.png');
    this.load.image('car3', './assets/images/snowCar.png');
 
    //starting screen
    this.load.image('titleScreen', './assets/images/TitleScreenB.png')
    //play button
    this.load.image('playButtonIcon', './assets/images/playButton.webp')
    // sounds
    this.load.audio('croac', './assets/audio/coaac.wav')
    this.load.audio('smashed', './assets/audio/smashed.wav');
    this.load.audio('heartSound', './assets/audio/heartSound.wav');
    this.load.audio('traficSound', './assets/audio/trafic2.wav');
}
 
function create() {
   
   
    //images
    let backImage = this.add.image(0,0, 'bgImage');
    backImage.setOrigin(0,0);
    
    bunnyImage = this.add.image(8+Phaser.Math.Between(0,29)*16,312, 'bunny'); //8+ c'est parce qu'on veut que le milieu de la grenouille soit au milieu de la case (16*16)
   
    //deadfrog
    deadBunnyImage = this.add.image(-1000, -1000, 'deadBunnyImage')
 
    celeryImage = this.add.image(Phaser.Math.Between(1,25)* 16-8,8, 'celery');
    heart= this.add.image(240,160, 'heart');
    heart.setScale(0);
    heartTween = this.tweens.add({
        targets: heart,
        scaleY: 4,
        scaleX: 4,
        duration: 500,
        ease: 'linear',
        yoyo : true,
        loop: 0,
        paused: true
        });
 
    countDownTimer = this.time.addEvent({
        delay: 1000,
        callback: countingDown,
        callbackScope: this,
        repeat: -1,
        paused: true
    });
 
    //cars
   
    space = config.width / carNumInARow; //permet de determiner l'espace entre les voiture par le nombre de voiture et de la taille de l'écran
    for(let j= 0; j < rowNumber; j++){
        for(let i = 0; i < carNumInARow; i++){
            //voie 1
            car[i+j*carNumInARow]= this.physics.add.image(i*space + Phaser.Math.Between(-10, 10), 264-32*j, 'car' + Phaser.Math.Between(1,3)); //
            car[i + j * carNumInARow].setVelocity(100,0);
           
        }
    }
    
   
   
 
    //touches
    downArrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    upArrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    leftArrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    rightArrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
 
    //sounds
    jumpSound = this.sound.add('croac');
    smashed = this.sound.add('smashed');
    heartSound = this.sound.add('heartSound');
    traficSound = this.sound.add('traficSound');
   
    //text
    scoreText = this.add.text(410, 0, 'score : ' + score, { fontFamily: 'Arial', fontSize: 14, color: '#00ff00' });
    countText = this.add.text(440, 16, STARTCOUNTDOWN + 's', { fontFamily: 'Arial', fontSize: 14, color: '#00ff00' });
 
 
    titleScreenImage = this.add.image(0,0, 'titleScreen');
    titleScreenImage.setOrigin(0,0)
    titleScreenImage.setScale(0.68);
    // titleScreenImage.setVisible(true);
 
    //scores
    bestScoreText1 = this.add.text(220, 180, 'Premier : ' + bestScore[0], { fontFamily: 'Arial', fontSize: 14, color: '#FF0000' });
    bestScoreText2 = this.add.text(220, 200, 'Deuxième : ' + bestScore[1], { fontFamily: 'Arial', fontSize: 14, color: '#FF0000' });
    bestScoreText3 = this.add.text(220, 220, 'Troisième : ' + bestScore[2], { fontFamily: 'Arial', fontSize: 14, color: '#FF0000' });
 
    //playbutton
    playButton = this.add.image(240,270, 'playButtonIcon').setInteractive();
    playButton.setScale(0.05)
    playButton.on('pointerdown', startGame)
 
 
}
 
function update() {
    
   
    //verifier si voiture sort à droite
   
    for(i = 0; i < carNumInARow * rowNumber; i++){
        if(car[i].x > 480) car[i].x=0;
    }
    
 
    //justDown = enfoncer
    //up
    if (Phaser.Input.Keyboard.JustDown(upArrow) && bunnyImage.y > 8 && playing){
        bunnyImage.y -= 16;
        bunnyImage.angle = 0;
        jumpSound.play();
    }
    // down
    if (Phaser.Input.Keyboard.JustDown(downArrow) && bunnyImage.y < 312 && playing){
        bunnyImage.y += 16;
        bunnyImage.angle = 180;
        jumpSound.play();
    }
    // left
    if (Phaser.Input.Keyboard.JustDown(leftArrow) && bunnyImage.x > 8 && playing){
        bunnyImage.x -= 16;
        bunnyImage.flipX = false;
        jumpSound.play();
    }
    // right
    if (Phaser.Input.Keyboard.JustDown(rightArrow) && bunnyImage.x < 472 && playing){
        bunnyImage.x += 16;
        bunnyImage.flipX = true;
        jumpSound.play();
    }
 
    //check collision
    //between froggy and all cars
    for(i = 0; i < carNumInARow*rowNumber; i++){
        if(Phaser.Geom.Intersects.RectangleToRectangle(bunnyImage.getBounds(), car[i].getBounds())) {
            deadBunnyImage.setPosition(bunnyImage.x, bunnyImage.y)
            // deadFrogImage.x = frogImage.x;
            // deadFrogImage.y = frogImage.y
            bunnyImage.x = -1000; //permet de faire apparaitre la grenouille en dehors de l'écran
            smashed.play()
            this.time.addEvent({
                delay: 1000, // ms
                callback: resetFrogPosition,
                callbackScope: this,
                repeat: 0
               });
        }
    }
   
    //between froggy and Celeri
    if(Phaser.Geom.Intersects.RectangleToRectangle(bunnyImage.getBounds(), celeryImage.getBounds())) {
        heartSound.play();
        score += 1;
        scoreText.text = 'Score : ' + score;
        heartTween.play()
        bunnyImage.x = -1000;
        this.time.addEvent({
            delay: 2000, // ms
            callback: resetFrogPosition,
            callbackScope: this,
            repeat: 0
           });
    }
}
 
function resetFrogPosition(){
    deadBunnyImage.x = -1000;
    bunnyImage.setPosition(8+Phaser.Math.Between(0,29)*16,312);
   
}
 
function countingDown(){
 
    countDown -= 1;
    countText.text = countDown + "s";
    if(countDown == 0){
        insertNewScoreInBestScores(score)
        titleScreenImage.setVisible(true)
        bestScoreText1.setVisible(true)
        bestScoreText1.text = 'Premier :' + bestScore[0];
        bestScoreText2.setVisible(true)
        bestScoreText2.text = 'Deuxième :' + bestScore[1];
        bestScoreText3.setVisible(true)
        bestScoreText3.text = 'Troisième :' + bestScore[2];
        playButton.setVisible(true)
        countDownTimer.paused = false;
        playing = false;
 
    }
 
}
 
function startGame(){
    titleScreenImage.setVisible(false)
    bestScoreText1.setVisible(false)
    bestScoreText2.setVisible(false)
    bestScoreText3.setVisible(false)
    playButton.setVisible(false)
    countDownTimer.paused = false;
    score = 0;
    scoreText.text = 'Score : ' + score;
    countDown = STARTCOUNTDOWN;
    countText.text = countDown + "s";
    bunnyImage.setPosition(Phaser.Math.Between(1,30)*16-8,312);
    bunnyImage.angle = 0;
    celeryImage.setPosition(Phaser.Math.Between(1,25)* 16-8,8, 'mum');
    playing = true;
    traficSound.play();
    traficSound.volume = 0.5;


}
 
function insertNewScoreInBestScores(newScore){
    bestScore.push(newScore);
    bestScore = bestScore.sort(function(a,b){return a-b}).reverse().slice(0,3);
}