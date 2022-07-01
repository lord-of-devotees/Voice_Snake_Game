let points = document.getElementById("points");
let instructions = document.getElementById("instructions");
let snake;
let rez = 20;
let food;
let w;
let h;
let classifier;
let soundModel = "https://teachablemachine.withgoogle.com/models/dE_Y-u4C9/";
let predir = "";

function preload() {
    // Load the model
    let options = {
      probabilityThreshold : 0.7
    };
    classifier = ml5.soundClassifier(soundModel + 'model.json', options);
}
  

function setup() {
    createCanvas(600, 600);
    w = floor(width / rez);
    h = floor(height / rez);
    frameRate(5);
    initSnake();
    instructions.innerHTML = "Wait Setting UP";
    classifier.classify(gotResult);
    // instructions.innerHTML = "Listening";
    console.log(classifier);
}

function initSnake(){
  snake = new Snake();
  foodLocation();
  background(51);
  loop();
  instructions.innerHTML = ""
  points.innerHTML = "Points: "+ snake.len;
}

function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);

}

function keyPressed() {
  if (keyCode === LEFT_ARROW && predir!="right") {
    snake.setDir(-1, 0);
    predir = "left";
  } else if (keyCode === RIGHT_ARROW && predir!="left") {
    snake.setDir(1, 0);
    predir = "right";
  } else if (keyCode === DOWN_ARROW && predir!="up") {
    snake.setDir(0, 1);
    predir = "down";
  } else if (keyCode === UP_ARROW && predir!="down") {
    snake.setDir(0, -1);
    predir = "up";
  } 
//   else if (key == ' ') {
//     snake.grow();
//   }

}

function draw() {
  scale(rez);
  background(51);
  if (snake.eat(food)) {
    points.innerHTML = "Points: "+snake.len;
    foodLocation();
  }
  snake.update();
  snake.show();


  if (snake.endGame()) {
    // print("END GAME");
    background(255, 0, 0);
    noLoop();
    instructions.innerHTML = "Game Over";
    // instructions = null;
  }

  noStroke();
  fill(255, 0, 100);
  rect(food.x, food.y, 1, 1);
}

function gotResult(error, results) {
    if (error) {
      console.error(error);
      return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    label = results[0].label;

    if (label === "left" && predir!="right") {
        snake.setDir(-1, 0);
        predir = "left";
    } else if (label === "right" && predir != "left") {
        snake.setDir(1, 0);
        predir = "right";
    } else if (label === "down" && predir != "up") {
        snake.setDir(0, 1);
        predir = "down";
    } else if (label === "up" && predir !="down") {
        snake.setDir(0, -1);
        predir = "up";
    }

    if(instructions.innerHTML!="Game Over")
      instructions.innerHTML = label;
    // else if (key == ' ') {
    //     snake.grow();
    // }    
}
