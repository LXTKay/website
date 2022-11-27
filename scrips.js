"use strict"

let gameLoaded = false;

function colorChanger(){
  let rand = Math.floor(Math.random()*16_777_215);
  rand = rand.toString(16);
  document.querySelector(".header").style.backgroundColor = "#"+rand;
}

let disco = {
  switchState : true,
  pogo(){
    this.switchState = true;
    document.querySelector("#pogoSwitch").style.display = "block";
    document.querySelector("#discoPogo").style.display = "none";
    let breaker = setInterval(() => {
      if (this.switchState == false){
        clearInterval(breaker);
        document.querySelector("#pogoSwitch").style.display = "none";
        document.querySelector("#discoPogo").style.display = "block";
      }
      colorChanger();
    },
    30)
  },
  switch(){
    (this.switchState == true)? this.switchState = false : null;
  }
}

let buttonMagic = {
  visibility(){
    if(gameLoaded == true){
      document.getElementById("game").remove();
      gameLoaded = false;
      // document.querySelector("#imgGallery").addEventListener("click", event => imageClick(event));
    };
    for(let butt of document.querySelectorAll("[data-hidBut]")){
      butt.style.display = "block";
    };
    for(let cont of document.querySelectorAll("[data-hidCont]")){
      cont.style.display = "none";
    };
  },
  activate(buttonID, elementID, otherStyle){
    document.querySelector(buttonID).style.display = "none";
    if(otherStyle){
      document.querySelector(elementID).style.display = otherStyle;
      return;
    }
    document.querySelector(elementID).style.display = "block";
  },
  loadCalc(){
    this.visibility();
    this.activate("#calcButton", "#rechner");
  },
  loadDevLog(){
    this.visibility();
    this.activate("#devLogButton","#devLog");
  },
  loadGame(){
    this.visibility();
    if(gameLoaded == false){
      document.getElementById('mainbox').insertAdjacentHTML('beforeend','<iframe id="game" src="Breakout/breakout.html" class="gamebox" data-hidCont="4" scrolling="no"></iframe>');
      //document.getElementById('mainbox').innerHTML += '<iframe id="game" src="Breakout/breakout.html" class="gamebox" data-hidCont="4" scrolling="no"></iframe>';
      gameLoaded = true;
    };
    this.activate("#gameButton","#game");
  },
  loadImageGallery(){
    this.visibility();
    this.activate("#imgGalleryButton","#imgGallery");
  },
  loadEmbeddedContent(){
    this.visibility();
    this.activate("#embeddedButton","#embedded");
  }
};

function imageClick(event){
  if(!event.target.closest("#thumb")) return;
  event.preventDefault();
  let pic;
  if(event.target.tagName == ("IMG")){
    pic = event.target.src;
  } else if(event.target.firstChild.tagName == ("IMG")){
    pic = event.target.firstChild.src;
  } else {
    return;
  };
  document.getElementById("bigImg").src = pic;
  console.log("ok");
};

document.querySelector("#imgGallery").addEventListener("click", event => imageClick(event))