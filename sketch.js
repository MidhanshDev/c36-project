//Create variables here
var dog,Happydog,database,foodS,foodStock
var dogImage;
var milkBottle,milkImage;
var button1,button2;
var fedTime,lastFed;
var foodObj;
var changeGameState,readGameState;
var bedroom,garden,washroom;
function preload()
{
  //load images here
  dogImage = loadImage("images/Dog.png");
  Happydog = loadImage("images/happy dog.png");
  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");
  //milkImage = loadImage("images/Milk.png");
}

function setup() {
  createCanvas(400, 400);
  database = firebase.database();
  dog = createSprite(400,260);
  dog.scale = 0.3;
  dog.addImage(dogImage);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  //read gameState value from database
  readGameState=database.ref('gameState');
  readGameState.on("value",(data)=>{
    gameState=data.val();
  });

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  
  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}


function draw() {  
  background(46,139,87);
  foodObj.display();

  /*if(keyWentDown(UP_ARROW)){
    writeStock(foods);
    dog.addImage(Happydog)
  }*/
  fedTime = database.ref('FeedTime');
  fedTime.on("value",(data)=>{
    lastFed = data.val();
  });

  
  
  //add styles here

  /*text("food remaining; "+foodS,120,150);
  text("NOTE:Press UP_ARROW key to feed bruno milk!",120,50);*/

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
      text("Last Feed : "+ lastFed%12 + "PM",350,30);
  }else if(lastFed==0){
      text("Last Feed : 12 AM",350,30);
  }else{
      text("Last Feed : "+lastFed + " AM",350,30);
  }

  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.washroom();
  }else{
    update("Bathing");
    foodObj.display();
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  drawSprites();
  
}
function readStock(data){
  foods=data.val();
  foodObj.updateFoodStock(foods);
}

function feedDog(){
  dog.addImage(Happydog);
  


  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}

  function addFoods(){
    foods++;
    database.ref('/').update({
    Food:foods

    })
  }

function writeStock(x){
  if(x>0){
    x = x-1;
  }
  else{
    x = 0;
  }
  database.ref('/').update({
    Food:x
  })
}



