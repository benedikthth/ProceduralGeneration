(function init(){
  console.log("%cgameMap.js Loaded", "font-size: 10px; color: #AFAFAF");


  if(!IrregularRegion){
    console.log("irregularRegion.js is not loaded! bad stuff!");
  }

})();

var progressStyle = "color:#06425e; background: #DDD; font-size: 20px";

function GameMap(width, height){

  var air = 0, stone = 1, sIterations = 5;

  cutoff = 100;
  startingBuffer = 100;

  function Region(x1, y1, x2, y2){
    var region = {};
    region.x1 = Math.min(x1, x2);
    region.x2 = Math.max(x1, x2);
    region.y1 = Math.min(y1, y2);
    region.y2 = Math.max(y1, y2);

    region.openTiles = function(){
      var tiles = [];
      for (var x = region.x1; x < region.x2; x++) {
        for (var y = region.y1; y < region.y2; y++) {
          if(map[x][y] != 1){
            tiles.push({x:x, y:y});
          }
        }
      }
      return tiles;
    }

    region.getHeight = function () {
      return this.y2 - this.y1;
    }
    region.getWidth = function () {
      return this.x2 - this.x1;
    }

    return region;
  }

  var map = [];
  for (var i = 0; i < width; i++) {
    map[i] = [];
  }

  /* Functions are enclosed within the GameMap as to not pollute blah blah go fuck yourself.
  on a side note. i hope nobody fucking reads these comments.
  */
  function Smoothe(){
    //borrowing from the cave.js script this is pure laziness on my part, could have made the cave.smoothe function 'public, but fuck it'
    for (var x = 0; x < map.length; x++) {
      for (var y = 0; y < map[0].length ; y++) {

        var surroundingWAllCount = getSurroundingWallCount(x, y), fillCondition = 4;
        if(surroundingWAllCount < fillCondition){ map[x][y] = 0; }
        if(surroundingWAllCount > fillCondition){ map[x][y] = 1; }
      }
    }
  }

  function helperSmoothe(x, y){
    var fillCondition = 4;
    if( x > 0 && x < map.length-1 && y > 0 && y < map[0].length){
      var surroundingWAllCount = getSurroundingWallCount(x, y);
      if(surroundingWAllCount < fillCondition){ map[x][y] = 0; }
      if(surroundingWAllCount > fillCondition){ map[x][y] = 1; }
    } else {
      map[x][y] = 1;
    }
  }

  function getSurroundingWallCount(x, y){
    var wc = 0;

    for (var neighborX = x-1; neighborX <= x+1; neighborX++) {
      for (var neighborY = y-1; neighborY <= y+1; neighborY++) {
        if(neighborX > 0 && neighborX < map.length-1 && neighborY > 0 && neighborY < map[0].length ){
          if(neighborY !== y || neighborX !== x){
            wc += map[neighborX][neighborY];
          }
        }
        else{
          wc++;
          if( ( x >= 0 || x <= width-1 ) && y > height- ((cutoff/2)+startingBuffer)  ){
            wc = 0;
          }
        }
      }
    }
    return wc;
  }

  function addCave(caveMap, upperLeftCorner){
    for (var x = upperLeftCorner.x; x < upperLeftCorner.x+caveMap.length; x++) {
      for (var y = upperLeftCorner.y; y < upperLeftCorner.y+caveMap[0].length; y++) {
        if(caveMap[x - upperLeftCorner.x][y - upperLeftCorner.y] == air){
          map[x][y] = air;
        }
      }
    }
  }

  function setTiles(material, tileList, offsetX, offsetY, materialToReplace){
    for (var i = 0; i < tileList.length; i++) {
      if( map[tileList[i].x + offsetX][tileList[i].y + offsetY] == materialToReplace) {
       map[tileList[i].x + offsetX][tileList[i].y + offsetY] = material;
     }
    }
  }

  // END OF FUNCTIONS.

  //initially populate the entire map, except for the bottom some rows with stone.
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {



      if(y >= height - startingBuffer){
        map[x][y] = air;
      }


      else if(y >= (height - cutoff) - startingBuffer ){
        var dist = ( height -startingBuffer - y ) / ( cutoff + startingBuffer) ;
        map[x][y] = (Math.random() <  dist  )? stone: air;
      }

      else {
        map[x][y] = stone;
      }



    }
  }
  var tunnelStart = height - ( startingBuffer + cutoff  );
  var tunnelLength = ( (startingBuffer + cutoff) * 0.1 );
  var tunnelEnd = tunnelStart - tunnelLength ;

  for (var x = (Math.floor(width/2)-2); x < (Math.floor(width/2)+2) ; x++) {
    for (var y = tunnelEnd ; y < height; y++) {
      map[x][y] = air;
      if(Math.random() < 0.5 ){
        map[x+1][y] = air;
        map[x-1][y] = air;
        map[x+2][y] = air;
        map[x-2][y] = air;
      }
    }
  }


  for (var i = 0; i < sIterations; i++) {
    Smoothe();
  }

  var StartingCaveZone = Region(
                  Math.floor(width / 2) - (cutoff*0.3), //left bound of cave
                  tunnelEnd + 5,                     //lower bound of cave
                  Math.floor(width / 2) + (cutoff*0.3), // right bound of cave.
                  tunnelEnd - 30             // upper bound
                );



  var StartingZoneFillPrcnt = 32;

  var StartingCave = Cave(
                            StartingCaveZone.y2 - StartingCaveZone.y1,
                            StartingCaveZone.x2 - StartingCaveZone.x1,
                            StartingZoneFillPrcnt,
                            4, 4
                          );

  addCave(StartingCave, {x: StartingCaveZone.x1, y:StartingCaveZone.y1}, air);

  var caveContainerRegion = Region(
    Math.floor( (width/2) - ((width/2)*0.95) ), // left bounds of rectangle
    StartingCaveZone.y1 - 30, // lower bound of cave
    Math.floor( (width/2) + ((width/2)*0.95) ), // rigt bounds of rectangle
    30
  );

  console.log('%cGenerating Caves', progressStyle);


  var CaveMapObject = SpaceDivision( caveContainerRegion.getWidth(), caveContainerRegion.getHeight(), 100, 70, 3, false);

  var sectors = [];

  for (var i = 0; i < CaveMapObject.sectors.length; i++) {
    var rect = CaveMapObject.sectors[i].getInboundSectorRectangle();
    if(rect.height * rect.width < 100){ continue; }
    var caveRegion = Region( rect.x1 + caveContainerRegion.x1, rect.y1 + caveContainerRegion.y1,
                             rect.x2 + caveContainerRegion.x1, rect.y2 + caveContainerRegion.y1);
    sectors.push(caveRegion);

    var cv = Cave(
      rect.height,
      rect.width,
      Math.floor( Math.random() * 20) + 45,
      4,
      4
    );


    addCave(cv, {x: caveRegion.x1, y: caveRegion.y1}, air);


  }

  for (var i = 0; i < sectors.length; i++) {
    var opens = sectors[i].openTiles();

    for (var n = 0; n < opens.length; n++) {
      map[opens[n].x][opens[n].y] = 3;
    }
  }

  var opens = StartingCaveZone.openTiles();
  for (var i = 0; i < opens.length; i++) {
    map[opens[i].x][opens[i].y] = 3;
  }

  for (var x = 0; x < width; x++) {
    for (var y = tunnelEnd ; y < tunnelStart; y++) {
      if(map[x][y] == 0){
        map[x][y] = ( Math.random() > ( (y-tunnelEnd)/(tunnelStart-tunnelEnd) ) )?3:0;
      }
    }
  }

  var outDoorsZone = Region(
                            0, //left bound of cave
                            height - (cutoff + startingBuffer),
                            width,
                            height //lower cave bound.
                           );


  console.log('%cCreating Lakes', progressStyle);
  var lake = SpaceDivision(
                           outDoorsZone.getWidth(),
                           outDoorsZone.getHeight(),
                           150,
                           Math.floor(Math.random() * 10) + 60,
                           20,
                           true
                          );
  for (var i = 0; i < lake.sectors.length; i++) {
    setTiles(4, lake.sectors[i].getAllTiles(), outDoorsZone.x1, outDoorsZone.y1, 0);
  }


  console.log('%cGenerating mud patches.', progressStyle);
  var mudPatch = SpaceDivision(
    outDoorsZone.getWidth(),
    outDoorsZone.getHeight(),
    100,
    Math.floor(Math.random() * 10) + 60,
    10,
    false
  );

  for (var i = 0; i < mudPatch.sectors.length; i++) {
    setTiles(2, mudPatch.sectors[i].getAllTiles(), outDoorsZone.x1, outDoorsZone.y1, 0 );
  }

  console.log('%cGenerating ore patches', progressStyle);

  var orePatch = SpaceDivision( caveContainerRegion.getWidth(), caveContainerRegion.getHeight(), 10, 100, 1, false);
  for (var i = 0; i < orePatch.sectors.length; i++) {
    var mat = Math.floor(Math.random() * 3) + 5;
    setTiles(mat, orePatch.sectors[i].getAllTiles(), caveContainerRegion.x1, caveContainerRegion.y1, 1);
  }

  console.log('%cGenerating fb patches', progressStyle);
  var fbPatch = SpaceDivision(caveContainerRegion.getWidth(), caveContainerRegion.getHeight() * 0.1, 30, 10, 1, false);
  for (var i = 0; i < fbPatch.sectors.length; i++) {
    setTiles(8, fbPatch.sectors[i].getAllTiles(), caveContainerRegion.x1, caveContainerRegion.y1, 1);
  }


  var mapObject = {
    cutoff: cutoff,
    startingBuffer: startingBuffer
  }

  mapObject.sectors = sectors;
  mapObject.map = map;
  mapObject.outDoorsZone = outDoorsZone;
  mapObject.tunnelStart = tunnelStart;
  mapObject.tunnelEnd = tunnelEnd;
  mapObject.StartingCaveRegion = StartingCaveZone;
  mapObject.caveRegion = caveContainerRegion;
  mapObject.CaveMapObject = CaveMapObject;
  mapObject.LakeMapObject = lake;
  return mapObject;
}
