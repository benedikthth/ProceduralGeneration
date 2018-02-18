(function init(){
  console.log('%cspaceDivision.js loaded', "font-size: 10px; color: #AFAFAF");
})();


function SpaceDivision(width, height, maxRuns, threshold, kiloBlob, root){
  var runs = maxRuns || 40; //Math.floor(height * width * 0.5 * 0.5 * 0.1);
  var thresh = threshold || 70;
  var blobDivider = kiloBlob || 8;
  blobDivider *= 1000;

  var map = [];
  for (var x = 0; x < width; x++) {
    map[x] = [];
  }

  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      map[x][y] = 0;
    }
  }

  function rand(min, max){
    return( Math.floor(Math.random()*(max-min) ) + min)
  }

  function inGrid(i, array2d){
    for (var x = 0; x < array2d.length; x++) {
      for(var y = 0; y < array2d[0].length; y++){
        return true;
      }
    }
    return false;
  }



  var sectors = [];
  var blobNr = Math.floor(height*width / blobDivider);
  console.log("%cUsing sector count " + blobNr, "font-size: 10px; color: #DADADA");

  for (var i = 1; i < blobNr+1; i++) {
    var bx = rand(10, width-10);
    var by = rand(10, height-10);
    while(map[bx][by] !== 0){
      bx = rand(10, width-10)
      by = rand(10, height-10);
    }

    if(root){
      by = height-2;
    }

    var q = thresh/2;
    var individual_Thresh = rand(0, thresh) + q;
    var blob = IrregularRegion( bx, by, i, individual_Thresh);
    map[blob.origin.x][blob.origin.y] = i;
    sectors.push(blob);
  }

  function inRange(n, min, max){
    return (min < n && n < max);
  }

  var inactiveIterations = 0,
      changed = false;
  var startTime = Date.now();
  console.log('%cGenerating sectorMap', "font-size:10px; color: #DADADA");

  var turnTimes = [];

  while(runs--){
    changed = false;
    var startOfTurn = Date.now();
    for (var a = 0; a < sectors.length; a++) {
      var opens = sectors[a].getEdgeTiles();
      for (var i = 0; i < opens.length; i++) {
        if ( rand(1, 100) < 50 ) {
          continue;
        }
      //console.log("("+opens[i].x + ", " + opens[i].y+") - ( " + width + ", " + height + " )");
        if( inRange(opens[i].x, 0, width-1) && inRange(opens[i].y, 0, height-1) && Math.random() < 0.5 ){

          if(map[opens[i].x-1][opens[i].y] == 0 && rand(0, 100) < sectors[a].thresh ){
            map[opens[i].x-1][opens[i].y] = sectors[a].ID;
            sectors[a].addTile( opens[i].x-1 , opens[i].y );
            changed = true;
          }
          if(map[opens[i].x+1][opens[i].y] == 0 && rand(0, 100) < sectors[a].thresh ){
            map[opens[i].x+1][opens[i].y] = sectors[a].ID;
            sectors[a].addTile( opens[i].x+1 , opens[i].y );
            changed = true;
          }
          if(map[opens[i].x][opens[i].y-1] == 0 && rand(0, 100) < sectors[a].thresh ){
            map[opens[i].x][opens[i].y-1] = sectors[a].ID;
            sectors[a].addTile( opens[i].x , opens[i].y-1 );
            changed = true;
          }
          if(map[opens[i].x][opens[i].y+1] == 0 && rand(0, 100) < sectors[a].thresh ){
            map[opens[i].x][opens[i].y+1] = sectors[a].ID;
            sectors[a].addTile( opens[i].x , opens[i].y + 1 );
            changed = true;
          }

        }
      }
    }
    if(!changed){
      console.log('Nothing done this turn');
      inactiveIterations ++;
    }

    turnTimes.push(Date.now() - startOfTurn);
    /*
    if(inactiveIterations > 10){
      break;
    }
    */
  }

  var elapsed = Date.now() - startTime;
  console.log('%cGenerating SectorMap took '+ elapsed / 1000 +' seconds!',  "font-size:10px; color:#125426; background-color: #CCFFCC");

  var sum = turnTimes.reduce(function(a, b) { return a + b; });
  var avg = sum / turnTimes.length;

  avg /= 1000;

  console.log('%cAverage iteration took ' + avg + ' seconds', "font-size:10px; color:#125426; background-color: #CCFFCC");
  var mapObject = {};
  mapObject.sectorMap = map;
  mapObject.sectors = sectors;

  mapObject.mergeSectors = function(){
    var newSector = IrregularRegion(this.sectors[0].origin.x, this.sectors[0].origin.y, -1, 100);
    for (var i = 0; i < this.sectors.length; i++) {
      var i_tileL = this.sectors[i].getAllTiles();
      newSector.addTileList( i_tileL );
    }
    return newSector
  };

  return mapObject;

}
