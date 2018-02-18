(function init(){
  console.log("%cCave script loaded.", "font-size: 10px; color: #AFAFAF");
})();


function Cave(height, width, percentage, fillCondition, smootheIterations, seed){
  var cave = [];
  for (var i = 0; i < width; i++) {
    cave[i] = [];
  }


  /* Functions enclosed in the Cave function, so that only the Cave function is visible to the window scope)*/
  function Rand(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
  }

  function Smoothe(){
    for (var x = 0; x < cave.length; x++) {
      for (var y = 0; y < cave[0].length ; y++) {
        helperSmoothe(x, y, fillCondition);
      }
    }
  }

  function helperSmoothe(x, y){
    if( x > 0 && x < cave.length-1 && y > 0 && y < cave[0].length){
      var surroundingWAllCount = getSurroundingWallCount(x, y);
      if(surroundingWAllCount < fillCondition){ cave[x][y] = 0; }
      if(surroundingWAllCount > fillCondition){ cave[x][y] = 1; }
    } else {
      cave[x][y] = 1;
    }
  }

  function getSurroundingWallCount(x, y){
    var wc = 0;

    for (var neighborX = x-1; neighborX <= x+1; neighborX++) {
      for (var neighborY = y-1; neighborY <= y+1; neighborY++) {
        if(neighborX > 0 && neighborX < cave.length-1 && neighborY > 0 && neighborY < cave[0].length){
          if(neighborY !== y || neighborX !== x){
            wc += cave[neighborX][neighborY];
          }
        }
        else{
          wc++;
        }
      }
    }

    return wc;
  }
  /**/
  var middle = {x: Math.floor(width/2), y: Math.floor(height/2)};
  var distToBeat = (height > width)? Math.floor(width/2) : Math.floor(height/2) ;
  function Distance(x, y){
    return Math.sqrt( Math.pow( (middle.x - x) ,2) + Math.pow( (middle.y - y) ,2) );
  }

  if(seed){
    Math.seedrandom(seed);
  }

  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
        if(x == 0 || x == width-1 || y == 0 || y == height-1){
          cave[x][y] = 1;
        } else {

          cave[x][y] = (Rand(1, 100) <  percentage *( Distance(x, y) / distToBeat)  )? 1 : 0;
          cave[x][y] = (Rand(1, 100) <  percentage/2 )? 1 : cave[x][y];

        }
      }
  }



  for (var i = 0; i < smootheIterations; i++) {
    Smoothe();
  }

  return cave;
}
