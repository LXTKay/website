"use strict"

const canvas = document.getElementById("can");
const kx = canvas.getContext("2d");
const circle = Math.PI * 2;
const playerSize = [80, 10];
let canvasPos = canvas.getBoundingClientRect();
let gameStop = false;
let totalBricks = 0;
let ball;
let brickSet;
let bossBrick;
let updateInterval;
let time;

const sound = {
  player : new Audio("sound/player.ogg"),
  wall : new Audio("sound/wall.ogg"),
  brick : new Audio("sound/brick.ogg"),
  boss : new Audio("sound/boss.ogg"),
  bossDeath : new Audio("sound/bossdeath.ogg"),
  win : new Audio("sound/win.ogg"),
  lose : new Audio("sound/lose.ogg")
};

class Ball{
  constructor(){};
  xPos = canvas.width / 2;
  yPos = canvas.height / 6 * 5;
  xSpeed = 0;
  ySpeed = 1.5;
  speed = 2;
  radius = 8;
  fillStyle = "white";
  draw(){
    kx.beginPath();
    kx.fillStyle = this.fillStyle;
    kx.arc(this.xPos, this.yPos, this.radius, 0, circle);
    kx.fill();
  };
  move(){
    this.xPos += this.xSpeed;
    this.yPos += this.ySpeed;
    this.playerCollision();
    this.borderCollision();
  };
  playerCollision(){
    if(this.yPos + this.radius > playerRect.yPos &&
      this.yPos - this.radius < playerRect.yPos + playerRect.height &&
      this.xPos + this.radius> playerRect.xPos &&
      this.xPos - this.radius < playerRect.xPos + playerRect.width){
        let collisionPoint = (this.xPos - (playerRect.xPos + playerRect.width / 2)) / (playerRect.width / 2);
        let angle = collisionPoint * Math.PI/3;
        this.xSpeed = this.speed * Math.sin(angle);
        this.ySpeed = - this.speed * Math.cos(angle);
        this.speed += 0.5;
        sound.player.play();
      };
  };
  borderCollision(){
    if(this.xPos - this.radius <= 0 || this.xPos + this.radius >= canvas.width){
      this.xSpeed *= -1;
      sound.wall.play();
    };
    if(this.yPos - this.radius <= 0){
      this.yPos = 0 + this.radius;
      this.ySpeed *= -1;
      sound.wall.play();
    }
    if(this.yPos + this.radius > canvas.height) setTimeout(()=> lose(), 100);
  }
};

class BrickSet{
  constructor(reihenAnzahl, spaltenAnzahl){
    this.rows = reihenAnzahl;
    this.columns = spaltenAnzahl;
    this.width = (canvas.width - (canvas.width / spaltenAnzahl) ) / spaltenAnzahl;
    this.offsetLeft = canvas.width / spaltenAnzahl / (spaltenAnzahl + 1);
    this.grid = [];
    for(let r = 0; r < this.rows; r++){
      this.grid[r] = [];
      for(let c = 0; c < this.columns; c++){
        this.grid[r][c] = {
          xPos : (c * (this.offsetLeft + this.width)) + this.offsetLeft,
          yPos : this.margin + this.offsetTop + r * (this.offsetTop + this.height),
          visible: true
        };
        totalBricks += 1;
      };
    };
  };
  height = 30;
  offsetTop = 10;
  margin = 40;
  fillColor = "#FFF";
  strokeColor = "rgb(111, 171, 255)";
  draw(){
    for(let r = 0; r < this.rows; r++){
      for(let c = 0; c < this.columns; c++){
        if(this.grid[r][c].visible){
          kx.fillStyle = this.fillColor;
          kx.fillRect(this.grid[r][c].xPos, this.grid[r][c].yPos, this.width, this.height);
          kx.strokeStyle = this.strokeColor;
          kx.lineWidth = 5;
          kx.strokeRect(this.grid[r][c].xPos, this.grid[r][c].yPos, this.width, this.height);
        };
      };
    };
  };
  collision(){
    for(let r = 0; r < this.rows; r++){
      for(let c = 0; c < this.columns; c++){
        let b = this.grid[r][c];
        if (!b.visible) continue;
        if (ball.xPos + ball.radius > b.xPos &&
          ball.xPos - ball.radius < b.xPos + this.width &&
          ball.yPos + ball.radius > b.yPos &&
          ball.yPos - ball.radius < b.yPos + this.height){
            b.visible = false;
            sound.brick.play();
            totalBricks -= 1;
            console.log("code was here")
            if (ball.xPos + ball.radius > b.xPos &&
              ball.xPos - ball.radius < b.xPos + this.width &&
              ((!(ball.yPos > b.yPos) &&
              ball.yPos - ball.radius < b.yPos + this.height) ||
              (ball.yPos + ball.radius > b.yPos &&
              !(ball.yPos < b.yPos + this.height)))){
                ball.ySpeed *= -1;
                return;
            };
            if (((!(ball.xPos > b.xPos) &&
              ball.xPos - ball.radius < b.xPos + this.width) ||
              (ball.xPos + ball.radius > b.xPos &&
              !(ball.xPos < b.xPos + this.width))) &&
              ball.yPos + ball.radius > b.yPos &&
              ball.yPos - ball.radius < b.yPos + this.height){
                ball.xSpeed *= -1;
                return;
            };
        };
      };
    };
  };
};

class Boss extends BrickSet{
  constructor(bs){
    super();
    this.xPos = canvas.width / 2 - (bs.width / 2);
    this.width = bs.width
    this.offsetLeft = bs.offsetLeft
  };
  yPos = this.offsetTop;
  strokeColor = "rgb(255, 34, 34)";
  visible = true;
  lifes = 3;
  xSpeed = null;
  timeUntilDirectionDetermination = null;
  draw(){
    if (!this.visible) return;
    kx.fillStyle = this.fillColor;
    kx.fillRect(this.xPos, this.yPos, this.width, this.height);
    kx.strokeStyle = this.strokeColor;
    kx.lineWidth = 5;
    kx.strokeRect(this.xPos, this.yPos, this.width, this.height);
  };
  collision(){
    if (!this.visible) return;
    let b = this;
    if (ball.xPos + ball.radius > b.xPos &&
      ball.xPos - ball.radius < b.xPos + this.width &&
      ball.yPos + ball.radius > b.yPos &&
      ball.yPos - ball.radius < b.yPos + this.height){
        this.hit();
        if (ball.xPos + ball.radius > b.xPos &&
          ball.xPos - ball.radius < b.xPos + this.width &&
          ((!(ball.yPos > b.yPos) &&
          ball.yPos - ball.radius < b.yPos + this.height) ||
          (ball.yPos + ball.radius > b.yPos &&
          !(ball.yPos < b.yPos + this.height)))){
            ball.ySpeed *= -1;
            return;
        };
        if (((!(ball.xPos > b.xPos) &&
          ball.xPos - ball.radius < b.xPos + this.width) ||
          (ball.xPos + ball.radius > b.xPos &&
          !(ball.xPos < b.xPos + this.width))) &&
          ball.yPos + ball.radius > b.yPos &&
          ball.yPos - ball.radius < b.yPos + this.height){
            ball.xSpeed *= -1;
            this.xSpeed *= -1;
            return;
        };
    };
  };
  hit(){
    sound.boss.play();
    this.lifes--;
    ball.ySpeed *= 2;
    if (this.lifes == 0){
      sound.bossDeath.play();
      this.visible = false;
      totalBricks -= 1;
      return;
    };
    let prevCol = this.fillColor;
    this.fillColor = this.strokeColor;
    setTimeout(()=> {this.fillColor = prevCol}, 1000);
  };
  move(){
    if ((this.timeUntilDirectionDetermination == null ||
      this.timeUntilDirectionDetermination <= 0)){
      this.timeUntilDirectionDetermination = Math.random() * 70;
      this.direction();
    };
    this.timeUntilDirectionDetermination--;
    this.xPos += this.xSpeed;
    this.borderCollision();
  };
  direction(){
    let rand = Math.random() * 2;
    (rand < 1) ? this.xSpeed = 3 : this.xSpeed = -3;
  };
  borderCollision(){
    if (this.xPos + this.width + this.offsetLeft > canvas.width){
      this.xSpeed *= -1
      this.xPos = canvas.width - this.width - this.offsetLeft;
    };
    if(this.xPos -  this.offsetLeft < 0){
      this.xSpeed *= -1;
      this.xPos = this.offsetLeft;
    };
  };
};

let playerRect = {
  xPos : (canvas.width / 2) - (playerSize[0] / 2),
  yPos : canvas.height - playerSize[1] - 10,
  width : playerSize[0],
  height : playerSize[1],
  fillStyle : "white",
  draw(){
    kx.beginPath();
    kx.fillStyle = this.fillStyle;
    kx.fillRect(this.xPos, this.yPos, this.width, this.height);
    kx.closePath();
  },
  move(event){
    this.xPos = event.offsetX - this.width / 2;
    this.borderCollision();
  },
  borderCollision(){
    if (this.xPos + this.width > canvas.width) this.xPos = canvas.width - this.width;
    if (this.xPos < 0) this.xPos = 0;
  }
};

canvas.addEventListener("mousemove", (event) => playerRect.move(event));

function mute() {
  for (const soundObj of Object.values(sound)) {
    soundObj.muted = !soundObj.muted;
  }
}

document.getElementById("mutebutton").addEventListener("click", (event) => mute(event));

function clear(){
  kx.clearRect(0,0,canvas.width,canvas.height);
};

function drawAll(){
  brickSet.draw()
  playerRect.draw();
  bossBrick.draw();
  ball.draw();
};

function update(){
  updateInterval = setInterval(()=> {
    if (gameStop) {
      clearInterval(updateInterval);
      return;
    };
    ball.move();
    brickSet.collision();
    bossBrick.collision();
    bossBrick.move();
    if(totalBricks < 0) win();
  },1000/60);
};

function refresh(){
  if (gameStop) return;
  clear();
  drawAll();
  requestAnimationFrame(refresh);
};

function lose(){
  gameStop = true;
  clear();
  sound.lose.play();
  kx.fillStyle = "white";
  kx.font ="60px Arial";
  kx.fillText("Game Over", 38, canvas.height/2);
  kx.font ="35px Arial";
  kx.fillText("Click to try again", 65, canvas.height/10*6)
};

function win(){
  gameStop = true;
  clear();
  time = Math.round(((Date.now()) - time) / 10) / 100;
  sound.win.play();
  let interval;
  let token = 0;
  setTimeout(()=> {clearInterval(interval)},500);
  interval = setInterval(()=>{
    if (token == 0){
      let rand = "#" + (Math.floor(Math.random()*167_772_15)).toString(16);
      kx.fillStyle = rand;
      kx.fillRect(0,0,canvas.width,canvas.height);
      token = 1;
    } else {
      clear()
      token = 0;
    };
    kx.fillStyle = "white";
    kx.font ="70px Arial";
    kx.fillText("You Win!", 50, canvas.height/2);
    kx.font ="35px Arial";
    kx.fillText("Click to try again", 65, canvas.height/10*6);
    kx.fillText("Your Time: " + time + "s", 65, canvas.height/10*8);
  },
  1000/21);
};

function restart(){
  ball = null;
  brickSet = null;
  bossBrick = null;
  gameStop = false;
  totalBricks = 0;
  ball = new Ball();
  brickSet = new BrickSet(4,5);
  bossBrick = new Boss(brickSet);
  playerRect.xPos = (canvas.width / 2) - (playerSize[0] / 2);
  time = Date.now();
  clear();
  refresh();
  update();
};

function handleClick(){
  if(gameStop) restart();
};

canvas.addEventListener("click", (event) => handleClick(event));

restart();