"use strict"

const circle = Math.PI * 2;
const turn = circle / 64;
const canvas = document.createElement("canvas");
let messageBox;
let panic = false;
let cl = console.log;

function createCanvas(){
  document.body.style.backgroundColor = "rgb(81, 81, 81)";
  document.body.style.display = "flex";
  document.body.style.minHeight = "100%";
  document.body.style.alignItems = "center";
  document.body.style.justifyContent = "center";
  document.body.style.margin = "0px";

  let container = document.createElement("div");
  container.id = "cont";
  container.style.display = "grid";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  container.style.width = "fit-content";
  container.style.height = "fit-content";
  container.style.gridTemplateColumns = "auto auto";
  container.style.gridTemplateRows = "auto";
  container.style.fontFamily = "Arial";
  document.body.append(container);

  canvas.width = 700;
  canvas.height = 700;
  canvas.style.backgroundColor = "aquamarine";
  canvas.style.padding = 0;
  canvas.style.borderStyle = "solid";
  canvas.style.borderColor = "black";
  canvas.style.borderWidth = "3px";
  canvas.style.margin = "5px";
  canvas.style.gridColumn = "1";
  canvas.style.gridRow = "1";
  document.getElementById("cont").append(canvas);

  let infoArea = document.createElement("div");
  infoArea.id = "infoArea";
  infoArea.style.display = "flex";
  infoArea.style.height = "100%";
  infoArea.style.width = "fit-content";
  infoArea.style.flexDirection = "column";
  document.getElementById("cont").append(infoArea);

  let stopButton = document.createElement("button");
  stopButton.type = "button";
  stopButton.innerHTML = "Stop";
  stopButton.style.margin = "5px";
  stopButton.style.width = "100px";
  stopButton.style.height = "30px";
  stopButton.style.borderStyle = "solid";
  stopButton.style.borderColor = "black";
  stopButton.style.borderWidth = "3px";
  stopButton.style.fontFamily = "Arial";
  stopButton.style.fontWeight = "bold";
  stopButton.style.backgroundColor = "white";
  stopButton.style.cursor = "pointer";
  document.getElementById("infoArea").append(stopButton);
  stopButton.addEventListener("mousedown", (event) => stopEverything(event));
  stopButton.addEventListener("mouseup", (event) => stopEverything(event));

  let msgBox = document.createElement("div");
  msgBox.style.display = "grid";
  msgBox.style.gridTemplateRows = "repeat(10, 1fr)";
  msgBox.style.gridColumn = "auto";
  msgBox.style.borderStyle = "solid";
  msgBox.style.borderColor = "black";
  msgBox.style.borderWidth = "2px";
  msgBox.style.width = "300px";
  msgBox.style.height = "200px";
  msgBox.style.backgroundColor = "gray";
  msgBox.style.margin = "5px";
  msgBox.style.overflow = "auto";
  msgBox.style.fontSize = "11pt";

  document.getElementById("infoArea").prepend(msgBox);
  messageBox = msgBox;

  return canvas.getContext("2d");
};

const ctx = createCanvas();

let log = {
  content : [],
  newMsg(msg){
    if (this.content.length == 0){
      for(let i = 0; i < 10; i++){
        this.content[i] = "";
      };
    };
    this.content.push(this.newTimestamp() + msg);
    if (this.content.length > 10) this.content.shift();
    messageBox.innerHTML = null;
    for(let i = 0; i < 10; i++) {
      let newMsgElement = document.createElement("div");
      newMsgElement.append(this.content[i]);
      newMsgElement.style.marginLeft = "2px";
      newMsgElement.style.alignSelf = "end";
      messageBox.append(newMsgElement);
    };
  },
  newTimestamp(){
    let curTime = new Date();
    let stamp = "[" + this.oneToDoubleDigit(curTime.getHours()) + ":" + this.oneToDoubleDigit(curTime.getMinutes()) + ":" + this.oneToDoubleDigit(curTime.getSeconds()) + "]:";
    return stamp;
  },
  oneToDoubleDigit(dig){
    if (dig > 9) return dig;
    return "0" + dig;
  }
};

function stopEverything(e){
  if (e.type == "mousedown"){
    e.target.style.backgroundColor = "red";
    if (panic){
      log.newMsg("Already aborted. Please reload.");
      return;
    };
    log.newMsg("Everything has been stopped!");
    panic = true;
  } else if (e.type == "mouseup"){
    e.target.style.backgroundColor = "white";
  };
};

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
};

function clear(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

function run(){
  let updating = setInterval(() => {
    if (panic) clearInterval(updating);
    movement.next(allUnits);
  },1000/60);
};

function updateFrame(){
  clear();

  drawUnits(allUnits);
  if(panic) return;
  requestAnimationFrame(updateFrame);
};

function removeItemClean(arr, item){
  let itemPos = arr.indexOf(item);
  let result = arr.slice(0, itemPos).concat(arr.slice(itemPos + 1));
  return result;
};

function roundTo5(number){
  let step1 = number * 100000;
  let step2 = Math.round(step1);
  let step3 = step2 / 100000;
  return step3
};

class Unit{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.direction = (circle / 64) * randomNumberBetween(1, 64);
  };
  foodchain = 1;
  lastX = null;
  lastY = null;
  radius = 5;
  color = "#c28f04";
  speed = 1;
  acuity = 70;
  collisionToken = false;
  currentGridCell = {
    row : null,
    column : null,
    sayPos(){
      log.newMsg("Row: " + this.row + " / Column: " + this.column);
    }
  };
  generation = 0;
  eats() {
    allUnits.push(new this.constructor(randomNumberBetween(5, canvas.width - 5), randomNumberBetween(5, canvas.height - 5)));
  };
  lifespan = 60*40;
};

class FoodUnit extends Unit{
  constructor(x,y){
    super(x,y);
    this.lastX = x;
    this.lastY = y;
  };
  foodchain = 0;
  radius = 3;
  color = "#eb34de";
  speed = 0;
  acuity = 0;
  lifespan = 60*1000;
};

class PredatorUnit extends Unit{
  constructor(x,y){
    super(x,y);
  };
  foodchain = 2;
  color = "#eb3434";
  lifespan = 60*30;
};

class Grid{
  constructor(reihen, spalten){
    this.rows = reihen;
    this.columns = spalten;
    this.cell = [];
    for(let r = 0; r < this.rows; r++){
      this.cell[r] = [];
      for(let c = 0; c < this.columns; c++){
        this.cell[r][c] = [];
      };
    };
  };
  width = 70;
  height = 70;
  determineCell(unit){
    for(let reihe = 0; reihe < this.rows; reihe++){
      if(unit.x > (reihe + 1) * this.width) continue;
      for(let spalte = 0; spalte < this.columns; spalte++){
        if(unit.y > (spalte + 1) * this.height) continue;
        if(this.cell[reihe][spalte].includes(unit)) return; //continue???
        if(unit.currentGridCell.row != null) removeItemClean(this.cell[unit.currentGridCell.row][unit.currentGridCell.column], unit);
        this.cell[reihe][spalte].push(unit);
        unit.currentGridCell.row = reihe;
        unit.currentGridCell.column = spalte;
        return;
      };
    };
  };
};

let grid = new Grid(10, 10);

function createUnits(basic, food, predator){
  let arr = [];
  for(let i = 0; i < basic; i++){
    arr[i] = new Unit(randomNumberBetween(5, canvas.width - 5), randomNumberBetween(5, canvas.height - 5));
  };
  for(let i = basic; i < basic + food; i++){
    arr[i] = new FoodUnit(randomNumberBetween(5, canvas.width - 5), randomNumberBetween(5, canvas.height - 5));
  };
  for(let i = basic + food; i < basic + food + predator; i++){
    arr[i] = new PredatorUnit(randomNumberBetween(5, canvas.width - 5), randomNumberBetween(5, canvas.height - 5));
  };
  return arr;
};

let allUnits = createUnits(20, 500, 5);

function drawUnits(arrmitunits){
  for(let i of arrmitunits){
    ctx.beginPath();
    ctx.arc(i.x, i.y, i.radius, 0, circle);
    ctx.fillStyle = i.color;
    ctx.fill();
    ctx.closePath();

    movement.drawRay(i);
  };
};

function kill(unitArray, unit){
  let id = unitArray.findIndex((element) => {
    if (element == unit) return true;
  });
  // cl("killed unit:");
  // cl(unit);
  // cl("old array length:");
  // cl(unitArray.length);
  let newArray = unitArray.slice(0, id).concat(unitArray.slice(id+1));
  allUnits = newArray; //funzt nicht mit unitArray / Referenzprobleme?
  // cl("new Array length:");
  // cl(allUnits.length);
  return true;
};

let movement = {
  next(units){
    for(let unit of units){
      if(unit.foodchain == 0) continue;
      this.checkLifespan(unit, units);
      this.turn(unit);
      //this.drawRay(unit);
      this.move(unit);
      this.collision(unit, units);
      grid.determineCell(unit);
      this.eye(unit);
    };
    produce.food(units);
  },
  turn(unit){
    if (unit.collisionToken) return;
    if(Math.random() > 0.5) return;
    if(unit.direction / turn > 63) unit.direction -= circle;
    if(unit.direction / turn < -63) unit.direction += circle;
    unit.direction += turn * randomNumberBetween(-4, 4);
    unit.direction = Math.round(unit.direction / turn) * turn;
  },
  sightEndPoint(unit){
    let pX = unit.x + unit.acuity * Math.cos(unit.direction - (circle / 4));
    let pY = unit.y + unit.acuity * Math.sin(unit.direction + (circle / 4));
    return [pX, pY];
  },
  drawRay(unit){
    let vecs = this.sightEndPoint(unit);
    ctx.beginPath();
    ctx.moveTo(unit.x,unit.y)
    ctx.lineTo(vecs[0], vecs[1])
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
  },
  findFurthestCellByCoord(unit){ //i.O bis hier
    let vector = this.sightEndPoint(unit);
    let cell;
    if((vector[0] < 0 || vector[0] > canvas.width)
    || (vector[1] < 0 || vector[1] > canvas.height)){
      return undefined;
    }
    for(let reihe = 0; reihe < grid.rows; reihe++){
      if(vector[0] > (reihe + 1) * grid.width) continue;
      for(let spalte = 0; spalte < grid.columns; spalte++){
        if(vector[1] > (spalte + 1) * grid.height) continue;
        cell = [reihe, spalte];
        return cell;
      };
    };
  },
  eye(unit){
    let c = this.findFurthestCellByCoord(unit);
    if(c != undefined && c != [unit.currentGridCell.row, unit.currentGridCell.column]) this.loopThroughCell(unit, c);
    this.loopThroughCell(unit, [unit.currentGridCell.row, unit.currentGridCell.column]);
  },
  loopThroughCell(unit, c){
    //console.log(grid.cell[c[0]][c[1]]); //leerer array und Unit Unit passt
    for(let target of grid.cell[c[0]][c[1]]){
      if(unit == target) continue;
      let dist = this.getDistance(unit.x, unit.y, target.x, target.y);
      if(dist > unit.acuity) continue; //dist == 0 ???
      let intersect = this.checkInterference(unit, target);
      if(!intersect) continue;
      return;
    };
  },
  checkInterference(unit1, unit2){
    let punkt2 = this.sightEndPoint(unit1);

    const dx = punkt2[0] - unit1.x;
    const dy = punkt2[1] - unit1.y;
    const len = dx * dx  +dy * dy;
    const proj = (dx * ( unit2.x- unit1.x ) + dy * ( unit2.y - unit1.y ))/len;
    const xS =  unit1.x + dx * proj;
    const yS =  unit1.y + dy * proj;
    let distance = Math.abs(this.getDistance(xS, yS, unit2.x, unit2.y));
    return distance <= unit1.radius;
  },
  move(unit){
    //let oldpos = "Alt: x:" + unit.x.toFixed(3) + " / y:" + unit.y.toFixed(3);
    unit.lastX = unit.x;
    unit.lastY = unit.y;
    unit.x = unit.x + (unit.speed * Math.sin(unit.direction));
    unit.y = unit.y + (unit.speed * Math.cos(unit.direction));
    //console.log(oldpos);
    //console.log("Neu: x:" + unit.x.toFixed(3) + " / y:" + unit.y.toFixed(3));
  },
  collision(unit, units){
    if (this.outsideBox(unit, units)) return;
    this.borderCollision(unit);
    this.unitCollision(unit, units);
  },
  borderCollision(unit){
    if (unit.x + unit.radius > canvas.width) unit.x = canvas.width - unit.radius;
    if (unit.x - unit.radius < 0) unit.x = unit.radius;
    if (unit.y + unit.radius > canvas.height) unit.y = canvas.height - unit.radius;
    if (unit.y - unit.radius < 0) unit.y = unit.radius;
  },
  unitCollision(unit, units){
    for (let i = 0; i < units.length; i++){
      if (unit == units[i]) continue;
      let distance = this.getDistance(unit.x, unit.y, units[i].x, units[i].y) - units[i].radius - unit.radius;
      //console.log("Unit 1: "+ unit.x + "/" + unit.y + "\n" + "Unit 2: " + units[i].x + "/" + units[i].y + "\n" + "Distance: " + distance);
      if (!(distance < 0)) continue;
      //console.log("collided!");
      if (this.resolveCollision(unit, units[i], units)) return;
    };
  },
  resolveCollision(u1, u2, units) {
    if (u1.foodchain == u2.foodchain){
      u1.x = u1.lastX;
      u1.y = u1.lastY;
      u2.x = u2.lastX;
      u2.y = u2.lastY;
      return;
    };
    if (u1.foodchain - 1 == u2.foodchain){
      let killed = kill(units, u2);
      u1.eats();
      return killed;
    };
  },
  getDistance(x1, y1, x2, y2){
    let xDist = x2 - x1;
    let yDist = y2 - y1;
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
  },
  outsideBox(unit, units){
    let killed = false;
    if (unit.x > canvas.width) killed = kill(units, unit);
    if (unit.x < 0) killed = kill(units, unit);
    if (unit.y > canvas.height) killed = kill(units, unit);
    if (unit.y < 0) killed = kill(units, unit);
    return killed;
  },
  checkLifespan(unit, units){
    unit.lifespan -= 1;
    if(unit.lifespan >= 0) return;
    kill(units, unit);
  }
};

let produce = {
  foodTimer : 0,
  food(units){
    this.increaseTimer();
    if (this.foodTimer < this.spawnRate) return;
    units.push(new FoodUnit(randomNumberBetween(5, canvas.width - 5), randomNumberBetween(5, canvas.height - 5)));
    this.foodTimer = 0;
    log.newMsg("food was spawned");
  },
  increaseTimer(){
    this.foodTimer += 1;
  },
  resetTimer(){
    this.foodTimer = 0;
  },
  spawnRate : 60*10
};

updateFrame();
run();

/* todo
-food einheiten erstellen - check
-predator einheiten erstellen - check

-einheitsart bei collision abfragen
bug fixen - check

-entsprechend resolven -check

- lebensspanne -check

- food spawnen -check

nn:
-inputs festlegen
-outputs festlegen
-nn blaupause
-nn bei spawn einfügen
-aktivierung festlegen
-mutationsalgorithmus
*/