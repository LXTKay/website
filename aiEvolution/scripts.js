"use strict"

const initUnits = [10, 10, 10] //Prey, Food, Predators

const circle = Math.PI * 2;
const turn = circle / 64;
const canvas = document.createElement("canvas");
let messageBox;
let panic = false;
let cl = console.log;
let curSel = "prey";

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
  canvas.addEventListener("click", event => spawnSelectedUnit(event));

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

  let buttonarea = document.createElement("div");
  buttonarea.id = "buttonArea";
  buttonarea.style.display = "flex";
  buttonarea.style.height = "fit-content";
  buttonarea.style.width = "fit-content";
  buttonarea.style.flexDirection = "row";
  document.getElementById("infoArea").append(buttonarea);

  let spawnSelection = document.createElement("select");
  document.getElementById("buttonArea").append(spawnSelection);
  let optPrey = document.createElement("option");
  optPrey.value = "prey";
  optPrey.innerHTML = "Prey";
  spawnSelection.appendChild(optPrey);
  let optPredator = document.createElement("option");
  optPredator.value = "predator";
  optPredator.innerHTML = "Predator";
  spawnSelection.appendChild(optPredator);
  let optFood = document.createElement("option");
  optFood.value = "food";
  optFood.innerHTML = "Food";
  spawnSelection.appendChild(optFood);
  spawnSelection.addEventListener("change", (event) => spawnSelectionEvent(event));
  spawnSelection.style.margin = "5px";
  spawnSelection.style.width = "100px";
  spawnSelection.style.height = "30px";
  spawnSelection.style.borderStyle = "solid";
  spawnSelection.style.borderColor = "black";
  spawnSelection.style.borderWidth = "3px";
  spawnSelection.style.fontFamily = "Arial";
  spawnSelection.style.fontWeight = "bold";
  spawnSelection.style.backgroundColor = "white";
  spawnSelection.style.cursor = "pointer";

  let clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.innerHTML = "Genocide";
  clearButton.style.margin = "5px";
  clearButton.style.width = "100px";
  clearButton.style.height = "30px";
  clearButton.style.borderStyle = "solid";
  clearButton.style.borderColor = "black";
  clearButton.style.borderWidth = "3px";
  clearButton.style.fontFamily = "Arial";
  clearButton.style.fontWeight = "bold";
  clearButton.style.backgroundColor = "green";
  clearButton.style.cursor = "pointer";
  document.getElementById("buttonArea").append(clearButton);
  clearButton.addEventListener("mousedown", (event) => clearFunction(event));
  clearButton.addEventListener("mouseup", (event) => clearFunction(event));
  
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

function spawnSelectedUnit(e){
  let rect = e.currentTarget.getBoundingClientRect();
  let x = Math.floor(e.clientX - rect.left);
  let y = Math.floor(e.clientY - rect.top);
  spawnSingleUnit(curSel, x, y);
  log.newMsg(curSel[0].toUpperCase() + curSel.slice(1) + " was spawned");
}

function spawnSelectionEvent(e){
  curSel = e.currentTarget.value;
};

function clearFunction(e, unitType){
  if(e.type == "mouseup"){
    e.target.style.backgroundColor = "green";
    return;
  }
  if(e.type == "mousedown"){
    e.target.style.backgroundColor = "yellow";
    setTimeout(() => e.target.style.backgroundColor = "green", 1000);
    allUnits = [];
    log.newMsg("All life erased.");
    return;
  };
};

function stopEverything(e){
  if (e.type == "mousedown"){
    e.target.style.backgroundColor = "red";
    setTimeout(() => e.target.style.backgroundColor = "white", 1000);
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

function randomFloat(min, max) {
  return (Math.random() * (max - min + 1) + min)
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

function transpose(matrix){
  let rows = matrix.length, cols = matrix[0].length;
  let grid = [];
  for (let j = 0; j < cols; j++){
    grid[j] = Array(rows);
  };
  for (let i = 0; i < rows; i++){
    for (let j = 0; j < cols; j++){
      grid[j][i] = matrix[i][j];
    };
  };
  return grid;
};

class Brain{
  constructor(inputAmount, outputAmount, hiddenLayerAmount, hiddenNeuronsAmount){
    this.info = {
      inputs : inputAmount,
      outputs : outputAmount,
      hiddenLayers : hiddenLayerAmount,
      neuronsPerHiddenLayer : hiddenNeuronsAmount
    };
    this.inputLayerWeights = [];
    for(let i = 0; i < inputAmount; i++){
      this.inputLayerWeights[i] = [];
      for(let j = 0; j < hiddenNeuronsAmount; j++){
        this.inputLayerWeights[i][j] = randomFloat(-100, 100);
      };
    };
    this.hiddenLayer = [];
    for(let i = 0; i < hiddenLayerAmount; i++){
      this.hiddenLayer[i] = []
      for(let j = 0; j < hiddenNeuronsAmount; j++){
        this.hiddenLayer[i][j] = {};
        this.hiddenLayer[i][j].bias = randomFloat(-100, 100);
        this.hiddenLayer[i][j].weights = [];
        for(let k = 0; k < hiddenNeuronsAmount; k++){
          if(i == hiddenLayerAmount - 1 && k >= outputAmount) break;
          this.hiddenLayer[i][j].weights[k] = randomFloat(-100, 100);
        };
      };
    };
    //cl(this.hiddenLayer);
    this.outputBias = [];
    for(let i = 0; i < outputAmount; i++){
      this.outputBias[i] = randomFloat(-100, 100);
    };
    this.formattedWeights = []; //relevant
    this.weightcollection = [];
    for(let i = 0; i < this.hiddenLayer.length; i++){
      this.weightcollection[i] = [];
      for(let j = 0; j < this.hiddenLayer[i].length; j++){
        this.weightcollection[i][j] = [];
        for(let k = 0; k < this.hiddenLayer[i][j].weights.length; k++){
          this.weightcollection[i][j][k] = this.hiddenLayer[i][j].weights[k];
        };
      };
    };
    for(let i = 0; i < this.weightcollection.length; i++){
      this.formattedWeights[i] = transpose(this.weightcollection[i]);
    };
    this.biasCollection = [];
    for(let i = 0; i < hiddenLayerAmount; i++){
      this.biasCollection[i] = [];
      for(let j = 0; j < this.hiddenLayer[i].length; j++){
        //cl(this.hiddenLayer[i][j].bias);
        this.biasCollection[i][j] = this.hiddenLayer[i][j].bias;
      };
    };
    //cl(this.biasCollection);
    this.formattedInputLayerWeights = transpose(this.inputLayerWeights);
  };
};

const deepClone = (obj) => {
  if(!obj || typeof obj !== 'object') return obj;
  let newObj = {};
  if(Array.isArray(obj)) {
    newObj = obj.map(item => deepClone(item));
  } else {
    Object.keys(obj).forEach((key) => {
      return newObj[key] = deepClone(obj[key]);
    })
  };
  return newObj;
};

function mutation(arr){
  for(let i = 0; i < arr.length; i++){
    if (Array.isArray(arr[i])) {
      mutation(arr[i]);
    } else {
      if(randomNumberBetween(0, 10) > 7) arr[i] += randomFloat(-10, 10);
    };
  };
  return arr;
};

function newBrainLite(unit){
  let newBrain = {};
  newBrain.info = deepClone(unit.brain.info);
  newBrain.formattedInputLayerWeights = deepClone(unit.brain.formattedInputLayerWeights);
  newBrain.formattedInputLayerWeights = mutation(newBrain.formattedInputLayerWeights);
  newBrain.biasCollection = deepClone(unit.brain.biasCollection);
  newBrain.biasCollection = mutation(newBrain.biasCollection);
  newBrain.formattedWeights = deepClone(unit.brain.formattedWeights);
  newBrain.formattedWeights = mutation(newBrain.formattedWeights);
  newBrain.outputBias = deepClone(unit.brain.outputBias);
  newBrain.outputBias = mutation(newBrain.outputBias);
  return newBrain;
};

function reLu(value){
  if(value < 0) return 0;
  return value;
}

function layerActivation(input, weight, bias, isLast){
  //Bias, array mit bias füt jedes outputneuron
  //input, array mit input wertern,
  //weight, array mit arrays pro input neuron, mit weights für jedes outputneuron???
  let inputQuantity = input.length;
  //cl(bias); //undefined, gleih am anfang
  let outputQuantity = bias.length;
  //cl("output Check XXXXXXX")
  //debugger;
  let output = [];
  //debugger;
  //cl("sollte leerer arr sein:")
  //cl(output)
  //debugger;
  // output[0] = input[0]*weight[0][0] + input[1]*weight[0][1] + input[2]*weight[0][2] + bias[0];
  // output[1] = input[0]*weight[1][0] + input[1]*weight[1][1] + input[2]*weight[1][2] + bias[1];
  // output[2] = input[0]*weight[2][0] + input[1]*weight[2][1] + input[2]*weight[2][2] + bias[2];
  for(let i = 0; i < outputQuantity; i++){ //Viele Probleme
    output[i] = 0;
    // cl("Im Loop, i = " + i)
    // cl("sollte 0 beinhalten:")
    // cl(output)
    for(let j = 0; j < inputQuantity; j++){
      // cl("   nested loop, j = " + j)
      output[i] += input[j]*weight[i][j];
    //   cl("input[j]*weight[i][j]")
    //   cl(input[i]);
    //   cl(weight[i][j]);
    //   cl(output)
    };
    if(isLast) {
      output[i] += bias[i];
    } else {
      output[i] = reLu(output[i] + bias[i]);
    };
  };
  // cl(output)
  // cl("utput Check End YYYYYYYYYYYYYYY")
  return output;
};

function getInputs(unit){
  let inputs = [];
  inputs[0] = unit.unitOnTouch * 10;
  inputs[1] = unit.unitInSight * 10;
  inputs[2] = unit.speed;
  inputs[3] = unit.direction;
  inputs[4] = unit.x / 100;
  inputs[5] = unit.y / 100;
  inputs[6] = unit.memory1;
  inputs[7] = unit.memory2;
  return inputs;
};

function collectBiases(unit){
  let collection = [];
  for (let i; i < unit.brain.info.hiddenLayers; i++){
    collection[i] = [];
    for(let j; j < unit.brain.hiddenLayer[i].length; j++){
      collection[i][j] = unit.brain.hiddenLayer[i][j].bias;
    };
  };
  return collection;
};

function activationChain(unit){
  //Part 1 Input Layer
  let inputs = getInputs(unit); //OG Inputs
  let weights = unit.brain.formattedInputLayerWeights;
  let bias = unit.brain.biasCollection[0];
  // cl("Input Layer [inputs, weights, bias]");
  // cl(inputs)
  // cl(weights)
  // cl(bias)
  inputs = layerActivation(inputs, weights, bias, false);//Erster Calc mit Input Layern
  //Part 2 Hidden Layers
  for(let i = 0; i < unit.brain.info.hiddenLayers - 1; i++){
    weights = unit.brain.formattedWeights[i];
    bias = unit.brain.biasCollection[i + 1];
    // cl("Mittlerer Layer [inputs, weights, bias]");
    // cl(inputs)
    // cl(weights)
    // cl(bias)
    inputs = layerActivation(inputs, weights, bias, false);
  };
  //Part 3 Output
  weights = unit.brain.formattedWeights[unit.brain.formattedWeights.length - 1];
  bias = unit.brain.outputBias;
  // cl("Output Layer [inputs, weights, bias]");
  // cl(inputs)
  // cl(weights)
  // cl(bias)
  let finalOutput = layerActivation(inputs, weights, bias, true);
  return finalOutput;
};

class Unit{
  constructor(x,y,laterCall){
    this.x = x;
    this.y = y;
    this.direction = (circle / 64) * randomNumberBetween(1, 64);
    if(laterCall){
      this.brain = null;
    } else {
      this.brain = new Brain(8,4,2,4);
    };
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
  eats(oldUnit) {
    let newUnit = new this.constructor(randomNumberBetween(5, canvas.width - 5), randomNumberBetween(5, canvas.height - 5), true);
    newUnit.brain = newBrainLite(oldUnit);
    //cl(newUnit);
    allUnits.push(newUnit);
    this.lifespan += 60;
  };
  lifespan = 60*40;
  unitInSight = 0;
  unitOnTouch = 0;
  memory1 = 1;
  memory2 = 1;
};

class FoodUnit extends Unit{
  constructor(x,y){
    super(x,y);
    this.lastX = x;
    this.lastY = y;
    this.brain = null;
  };
  foodchain = 0;
  radius = 3;
  color = "#eb34de";
  speed = 0;
  acuity = 0;
  lifespan = 60*1000;
};

class PredatorUnit extends Unit{
  constructor(x,y,laterCall){
    super(x,y,laterCall);
  };
  foodchain = 2;
  color = "#eb3434";
  lifespan = 60*20;
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
    arr[i] = new Unit(randomNumberBetween(5, canvas.width - 5), randomNumberBetween(5, canvas.height - 5), false);
  };
  for(let i = basic; i < basic + food; i++){
    arr[i] = new FoodUnit(randomNumberBetween(5, canvas.width - 5), randomNumberBetween(5, canvas.height - 5));
  };
  for(let i = basic + food; i < basic + food + predator; i++){
    arr[i] = new PredatorUnit(randomNumberBetween(5, canvas.width - 5), randomNumberBetween(5, canvas.height - 5), false);
  };
  //cl(arr[0].brain);
  return arr;
};

let allUnits = createUnits(...initUnits);

function spawnSingleUnit(unitType, x, y){
  if(!x){
    x = randomNumberBetween(5, canvas.width - 5)
    y = randomNumberBetween(5, canvas.height - 5)
  };
  if(unitType == "prey") allUnits.push(new Unit(x, y, false));
  if(unitType == "predator") allUnits.push(new PredatorUnit(x, y, false));
  if(unitType == "food") allUnits.push(new FoodUnit(x, y, false))
}

function drawUnits(arrmitunits){
  for(let i of arrmitunits){
    ctx.beginPath();
    ctx.arc(i.x, i.y, i.radius, 0, circle);
    ctx.fillStyle = i.color;
    ctx.fill();
    ctx.closePath();

    //movement.drawRay(i);
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
  if(unit.foodchain > 1) newArray.push(new FoodUnit(randomNumberBetween(5, canvas.width - 5), randomNumberBetween(5, canvas.height - 5)));
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
      //this.turn(unit);
      //this.drawRay(unit);
      this.think(unit);
      this.move(unit);
      this.collision(unit, units);
      grid.determineCell(unit);
      this.eye(unit);
    };
    //produce.food(units);
  },
  think(unit){
    let outputResult = activationChain(unit); // length 2 Erwartet
    if(outputResult[2] > 100000 || outputResult[2] < -100000){
      unit.memory1 = 0;
    } else {
      unit.memory1 = outputResult[2];
    };
    if(outputResult[3] > 100000 || outputResult[3] < -100000 ){
      unit.memory2 = 0;
    } else {
      unit.memory2 = outputResult[3];
    };
    if(outputResult[0] > 3 && unit.speed <= 3) unit.speed += 0.1;
    if(outputResult[0] < -3 && unit.speed >= -3) unit.speed -= 0.1;
    if(outputResult[1] > -1 && outputResult[1] < 1) return;
    if(outputResult[1] > -1) this.turnReasonable(unit, -1);
    if(outputResult[1] < 1) this.turnReasonable(unit, 1);
  },
  turnReasonable(unit, lr){
    unit.direction += turn * lr;
    if(unit.direction / turn > 63) unit.direction -= circle;
    if(unit.direction / turn < -63) unit.direction += circle;
    unit.direction = Math.round(unit.direction / turn) * turn;
  },
  turn(unit){
    if(unit.collisionToken) return;
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
    //cl(grid.cell[c[0]][c[1]]); //leerer array und Unit Unit passt
    for(let target of grid.cell[c[0]][c[1]]){
      unit.unitInSight = 0;
      if(unit == target) continue;
      let dist = this.getDistance(unit.x, unit.y, target.x, target.y);
      if(dist > unit.acuity) continue; //dist == 0 ???
      let intersect = this.checkInterference(unit, target);
      if(!intersect) continue;
      unit.unitInSight = target.foodchain + 1;
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
      if (this.resolveCollision(unit, units[i], units)){
        unit.unitOnTouch = units[i].foodchain + 1;
        return;
      };
      unit.unitOnTouch = 0;
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
      u1.eats(u1);
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
  spawnRate : 60*7
};

updateFrame();
run();


