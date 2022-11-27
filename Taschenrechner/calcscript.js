"use strict"

let currentOperation = "0";
let previousOperation = "";
let operator = "";
let lastValue = null;
let previousScreen = document.querySelector("[data-preOp]");
let currentScreen = document.querySelector("[data-curOp]");
let afterFin = false;

function initalize(){
  let calcBody = document.querySelector("[data-fetchkey]");
  calcBody.addEventListener("click", ausf);
}

function ausf(event){
  const input = event.target.innerHTML;
  if(event.target.closest(".screen")) return;
  if(!(isNaN(+input))) addNumber(input);
  if(input == ".") addNumber(input);
  if(input == "C") clear();
  if(input == "DEL") deleteNum();
  if(input == "=") calculate(input);
  if((input == "+") || (input == "-") || (input == "*") || (input == "/")) setOperator(input);
  updateScreen();
  return;
}

function addNumber(newNumber){
  if(+newNumber == 0 && currentOperation == "0") return;
  if(newNumber == "." && currentOperation.includes(".")) return;
  if(currentOperation == "0" && newNumber != ".") currentOperation = "";
  if(afterFin == true){
    afterFin = false;
    currentOperation = ""
  }

  currentOperation = currentOperation + newNumber;
};

function calculate(input){
  if(input == "=" && previousOperation.includes("=")) return;
  if(previousOperation == "") return;
  if(previousOperation.includes("=")){
    previousOperation = currentOperation;
    return;
  } else {
  previousOperation = previousOperation + " " + currentOperation + " =";
  afterFin = true;
  }
  
  if(operator == "+"){
    currentOperation = lastValue + (+currentOperation);
  } else if(operator == "-"){
    currentOperation = lastValue - (+currentOperation);
  } else if(operator == "*"){
    currentOperation = lastValue * (+currentOperation);
  } else if(operator == "/"){
    currentOperation = lastValue / (+currentOperation);
  }
};

function setOperator(op){
  if(lastValue != null) calculate();
  operator = op;
  lastValue = +currentOperation;
  previousOperation = currentOperation + " " + op;
  currentOperation = "0";
}

function deleteNum(){
  currentOperation = currentOperation.slice(0, -1);
  if(currentOperation == "") currentOperation = "0";
};

function clear(){
  currentOperation = "0";
  previousOperation = "";
  operator = "";
  lastValue = null;
};

function updateScreen(){
  previousScreen.innerHTML = previousOperation;
  currentScreen.innerHTML = currentOperation;
};

initalize();