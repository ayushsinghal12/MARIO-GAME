var coinscore=0
var gamestate = 'play';

function preload() {
    bgimg = loadImage('images/bgnew.jpg')
    mario_running = loadAnimation('images/mar1.png', 'images/mar2.png', 'images/mar3.png', 'images/mar4.png', 'images/mar5.png', 'images/mar6.png', 'images/mar7.png')
    mario_collided = loadAnimation('images/dead.png')
    brickimg = loadImage('images/brick.png')
    coinsound = loadSound('sounds/coinSound.mp3')
    coinimg = loadAnimation('images/con1.png', 'images/con2.png', 'images/con3.png', 'images/con4.png', 'images/con5.png', 'images/con6.png')
    mushroom = loadAnimation('images/mush1.png', 'images/mush2.png', 'images/mush3.png', 'images/mush4.png', 'images/mush5.png', 'images/mush6.png')
    turtle = loadAnimation('images/tur1.png', 'images/tur2.png', 'images/tur3.png', 'images/tur4.png', 'images/tur5.png')
    diesound = loadSound('sounds/dieSound.mp3')
    jumpsound = loadSound('sounds/jump.mp3')
    restartimg = loadImage('images/restart.png')
}

function setup() {
    createCanvas(1000, 600);

    // create background sprite
    bg = createSprite(800, 300)
    bg.addImage(bgimg)
    bg.scale = 0.5

    // create mario sprite
    mario = createSprite(200, 485, 20, 50)
    mario.addAnimation('running', mario_running)
    mario.addAnimation('collided',mario_collided)
    mario.scale = 0.15

    // create ground sprite
    ground = createSprite(200, 575, 100, 10)
    ground.visible = false

    // create groups
    brickgrp = new Group()
    coingrp = new Group()
    obstaclegrp = new Group()

    // create restart button
    restart = createSprite(500, 300)
    restart.addImage(restartimg)
}

function draw() {
    if (gamestate === 'play') {
        restart.visible = false
        mario.setCollider('rectangle', 0, 0, 200,500)
        mario.scale=0.15

        // scroll background
        bg.velocityX = -6
        if (bg.x < 220) {
            bg.x = 800
        }

        // prevent mario from moving out with the bricks
        if (mario.x != 200) {
            mario.x = 200
        }

        // prevent mario from moving out from the top
        // if (mario.y < 395) {
        //     mario.y = 395
        // }
        // if (mario.isTouching(brickgrp)){
        //     if (mario.y < 250) {
        //         mario.y = 250
        //     }
        // }

        // jump with space
        if (((keyDown('space') || mouseIsPressed)) && (mario.y>530 || mario.isTouching(brickgrp))) {
            mario.velocityY = -12
        }
        console.log(mario.y)
        // gravity
        mario.velocityY = mario.velocityY + 0.5

        // call the function to generate bricks
        generatebricks()

        // make mario collide with bricks
        for (var i = 0; i < (brickgrp).length; i++) {
            var temp = brickgrp.get(i)

            if (temp.isTouching(mario)) {
                mario.collide(temp)
            }
        }

        // call the function to generate coins
        generatecoins()

        // make mario catch the coins
        for (var i = 0; i < coingrp.length; i++) {
            var temp = coingrp.get(i)

            if (temp.isTouching(mario)) {

                // play sound when coin is caught
                coinsound.play()

                // increase score when coin is caught
                coinscore++

                // destroy coin once its caught
                temp.destroy()
                temp = null
            }
        }

        // call the function to generate obstacles
        generateobstacles()

        // prevent mario from falling down due to gravity
        mario.collide(ground)
        
        if (obstaclegrp.isTouching(mario)) {
            diesound.play()
            gamestate = 'end'
        }
    } 
    else if (gamestate === 'end') {  
        bg.velocityX = 0;
        mario.velocityX = 0
        mario.velocityY = 0
        coingrp.setVelocityXEach(0)
        coingrp.setLifetimeEach(-1)
        brickgrp.setVelocityXEach(0)
        brickgrp.setLifetimeEach(-1)
        obstaclegrp.setVelocityXEach(0)
        obstaclegrp.setLifetimeEach(-1)
        mario.changeAnimation('collided', mario_collided)
        mario.scale = 0.15
        mario.setCollider('rectangle', 0, 0, 300, 10)
        mario.y = 570
        restart.visible = true
    }
    if (mousePressedOver(restart)) {
        restartGame()
    }
    // draw sprites on screen
    drawSprites()
    textSize(20)
    fill('brown')

    // display score
    text('Coins Collected: ' + coinscore, 800, 50)
}

function generatebricks() {
    var framecount
    var rando = Math.round(random(1, 3));
    switch (rando) {
        case 1:
            framecount = 90
            break
        case 2:
            framecount = 150
            break
        case 3:
            framecount = 190
            break
        default:
            break
    }
    if (frameCount % framecount == 0) {
        var brick = createSprite(1000, random(450, 480), 40, 10)
        brick.addImage(brickimg)
        brick.scale = 0.35
        brick.velocityX = -3
        brick.lifetime = 1000
        brickgrp.add(brick)
    }
}
function generatecoins() {
    var framecount
    var rando = Math.round(random(1, 3))
    switch (rando) {
        case 1:
            framecount = 90
            break
        case 2:
            framecount = 150
            break
        case 3:
            framecount = 190
            break
        default:
            break
    }
    if (frameCount % framecount == 0) {
        var coin = createSprite(1000, random(460, 530), 40, 10)
        coin.addAnimation('coin', coinimg)
        coin.scale = 0.07
        coin.velocityX = -3
        coin.lifetime = 1000
        coingrp.add(coin)
    }
}

function generateobstacles() {
    var framecount
    var rando = Math.round(random(1, 3))
    switch (rando) {
        case 1:
            framecount = 90
            break
        case 2:
            framecount = 150
            break
        case 3:
            framecount = 190
            break
        default:
            break
    }
    if (frameCount % framecount == 0) {
        var obstacle = createSprite(1000, 555, 10, 40)
        obstacle.velocityX = -5
        var rand = Math.round(random(1, 2))
        switch (rand) {
            case 1:
                obstacle.addAnimation('mushroom', mushroom)
                break
            case 2:
                obstacle.addAnimation('turtle', turtle)

                break
            default:
                break
        }
        obstacle.scale = 0.1
        obstacle.lifetime = 200
        obstaclegrp.add(obstacle)
    }
}
function restartGame() {
    gamestate = 'play'
    obstaclegrp.destroyEach()
    brickgrp.destroyEach()
    coingrp.destroyEach()
    mario.changeAnimation('running', mario_running)
    coinscore = 0
    restart.visible = false
}
