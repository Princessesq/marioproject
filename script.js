//intro canvas

/*const canvas = document.getElementById('board')
const context = board.getContext('2d')

console.log(context)


const myImage = new Image()
myImage.src = "luigi.png"
myImage.onload = function() {
    context.drawImage(myImage, 50 , 10, 120, 120)
}
*/

//เริ่มสร้างเกม

//ตั้งค่าหน้าจอ

let board
let boardWidth = 800
let boardHeight = 300  
let context
let lives = 2
let restarting = false
 

let playerWidth = 85
let playerHeight = 85
let playerX = 100
let playerY = boardHeight - playerHeight
let playerImg
let player = {
    x:playerX,
    y:playerY,
    width:playerWidth,
    height:playerHeight
}

let gameOver = false
let score = 0
let time = 0

let boxImg
let boxWidth = 40
let boxHeight = 80
let boxX = 700
let boxY = boardHeight - boxHeight

let boxesArray = []
let boxSpeed = -3

let velocityY = 0
let gravity = 0.25

window.onload = function() {
    board = this.document.getElementById('board')
    const ratio = window.devicePixelRatio || 1;
    board.style.width = boardWidth + 'px';
    board.style.height = boardHeight + 'px';
    board.width = Math.floor(boardWidth * ratio);
    board.height = Math.floor(boardHeight * ratio);
    context = board.getContext('2d');

    context.setTransform(ratio, 0, 0, ratio, 0, 0);


    playerImg = new Image()
    playerImg.src = "luigi.png"
    playerImg.onload = function() {
        context.drawImage(playerImg , player.x, player.y, player.width , player.height)
    }


    requestAnimationFrame(update)

    document.addEventListener("keydown", movePlayer)

    boxImg = new Image()
    boxImg.src = "plant.png"
    setTimeout(createBox)
}

function update() {
    requestAnimationFrame(update)

    if(gameOver) { 
        return
    }

    context.clearRect(0,0,board.width,board.height)
    let g = context.createLinearGradient(0,0,0,boardHeight);
    g.addColorStop(0, '#bfe9ff'); 
    g.addColorStop(0.6, '#eaffd8'); 
    context.fillStyle = g;
    context.fillRect(0,0,board.width/ (window.devicePixelRatio||1), board.height/ (window.devicePixelRatio||1));
    context.fillStyle = '#9ee89e';
    context.fillRect(0, (boardHeight - 48), board.width/ (window.devicePixelRatio||1), 48);

    velocityY += gravity

    player.y = Math.min(player.y + velocityY, playerY)
    context.drawImage(playerImg,player.x,player.y,player.width,player.height)

    score++
    context.save();
    context.font = "18px 'Press Start 2P', monospace";
    context.textAlign = "left";
    context.fillStyle = '#ff3b8a';
    context.fillText("Score : " + score, 600, 30);

    
    context.font = "18px 'Press Start 2P', monospace";
    context.fillStyle = '#e02828';
    context.fillText(renderLivesDisplay(), 340, 30)

    let maxTime = 59.9
    
    time += 0.01;
    context.font = "18px 'Press Start 2P', monospace";
    context.fillStyle = '#1aa7ff';
    context.fillText("Time : " + time.toFixed(2), 8 , 30)
    context.restore();

    for(let i = 0 ; i < boxesArray.length ; i++) {
        let box = boxesArray[i]
        box.x += boxSpeed
        context.drawImage(boxImg , box.x , box.y , box.width , box.height)
        boxSpeed -= 0.00025

        if(onCollision(player,box) && time <= maxTime && lives > 0) {
            gameOver = true
            


            const cx = board.width / 2;
            const cy = board.height / 2;
            let grad = context.createLinearGradient(cx - 80, cy - 20, cx + 80, cy + 20);
            grad.addColorStop(0, '#ff7b7b');
            grad.addColorStop(0.5, '#ffd36b');
            grad.addColorStop(1, '#7be0ff');
            context.save();
            context.textAlign = "center";
            context.font = "32px 'Press Start 2P', monospace";
            context.fillStyle = grad;
            context.fillText("Game Over", cx, cy);
            context.font = "18px 'Press Start 2P', monospace";
            context.fillStyle = '#6b2b7b';
            context.fillText("Score : "+ (score), cx, cy + 50);
            context.restore();
        }
        else if (time == maxTime && lives >= 0) {
            gameOver = true
            const cx2 = board.width / 2;
            const cy2 = board.height / 2;
            let g2 = context.createLinearGradient(cx2 - 80, cy2 - 20, cx2 + 80, cy2 + 20);
            g2.addColorStop(0, '#7be0ff');
            g2.addColorStop(0.5, '#8bff7b');
            g2.addColorStop(1, '#ffd36b');
            context.save();
            context.textAlign = "center";
            context.font = "32px 'Press Start 2P', monospace";
            context.fillStyle = g2;
            context.fillText("Congratulation!!", cx2, cy2);
            context.font = "18px 'Press Start 2P', monospace";
            context.fillStyle = '#2b6b3b';
            context.fillText("Score : "+ (score), cx2, cy2 + 50);
            context.restore();
        }
        else if (onCollision(player,box) && time <= maxTime && lives == 0) {
            gameOver = true

            const cx3 = board.width / 2;
            const cy3 = board.height / 2;
            let gf = context.createLinearGradient(cx3 - 100, cy3 - 20, cx3 + 100, cy3 + 20);
            gf.addColorStop(0, '#ff6b6b');
            gf.addColorStop(1, '#ffb46b');
            context.save();
            context.textAlign = "center";
            context.font = "48px 'Press Start 2P', monospace";
            context.fillStyle = gf;
            context.fillText("You fail", cx3, cy3);
            context.font = "18px 'Press Start 2P', monospace";
            context.fillStyle = '#7b3b3b';
            context.fillText("Score : "+ (score), cx3, cy3 + 60);
            context.restore();
        }
    }
}



function movePlayer(e) {
    if(gameOver) {
        return
    }
    if (e.code === "Space") {
        e.preventDefault();
        if (player.y == playerY) {
            velocityY = -10
        }
    }
}

function createBox() {
    if(gameOver) {
        return
    }

    let box = {
        img:boxImg,
        x:boxX,
        y:boxY,
        width:boxWidth,
        height:boxHeight
    }

    boxesArray.push(box)

    if(boxesArray.length > 5) {
        boxesArray.shift()
    }

    let randomTime = (Math.random() * 1000) + 1300
    setTimeout(createBox, randomTime)
}

function onCollision(obj1 , obj2) {
    return obj1.x < (obj2.x + obj2.width) &&
            (obj1.x + obj1.width) > obj2.x 
            &&
            obj1.y < (obj2.y + obj2.width) &&
            (obj1.y + obj1.width) > obj2.y
}

function restartGame() {

    if (restarting) return
    restarting = true

    if (lives <= 0) {
        gameOver = true
        context.save();
        context.fillStyle = '#000';
        context.textAlign = "center";
        context.font = "48px 'Press Start 2P', monospace";
        context.fillText("You fail", board.width / 2 , board.height / 2);
        context.restore();
        return
    }
    
    const domGet = (typeof window.getCurrentLives === 'function') ? window.getCurrentLives() : null;

    if (domGet !== null && domGet === lives - 1) {
        lives = domGet;
    } else {
        lives = Math.max(0, lives - 1);
        if (typeof window.setLives === 'function') {
            window.setLives(lives);
        }
    }

    gameOver = false
    score = 0
    time = 0
    velocityY = 0
    boxesArray = []
    player.y = playerY
    boxSpeed = -3

    setTimeout(() => {
        restarting = false
    }, 200)
}

function renderLivesDisplay() {
    let livesHTML = '';
    const maxLives = 3;
    const currentLives = (typeof window.getCurrentLives === 'function') ? window.getCurrentLives() : lives;
    for (let i = 0; i < maxLives; i++) {
        livesHTML += i < currentLives ? '❤️ ' : '🤍 ';
    }
    return livesHTML.trim();
}




