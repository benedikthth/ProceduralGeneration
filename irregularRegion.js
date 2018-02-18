(function init(){
  console.log("%cirregularRegion.js loaded", "font-size: 10px; color: #AFAFAF");
})();

function IrregularRegion(xx, yy, regionID, thresh){
  var stuff = {};

  stuff.tiles = {};
  stuff.ID = regionID;
  stuff.thresh = thresh;
  stuff.toString = function(x, y){
    return x+","+y ;
  }

  stuff.containsTile = function(aX, aY){
    /*
    for (var i = 0; i < this.tiles.length; i++) {
      if( this.tiles[i].x == pt.x && this.tiles[i].y == pt.y ){
        return true;
      }
    }
    return false;
    */
    var p = this.toString(aX, aY);
    return this.tiles[p] !== undefined;
  }

  stuff.getAllTiles = function (){
    var keys = Object.keys(this.tiles);
    var list = [];
    for (var i = 0; i < keys.length; i++) {
      list.push(this.tiles[keys[i]])
    }
    return list;
  }

  stuff.addTileList = function(tileList){
    for (var i = 0; i < tileList.length; i++) {
      this.addTile(tileList[i].x, tileList[i].y);
    }
  }

  stuff.addTile = function(aX, aY){
    //var p = {x:aX, y:aY};
    var p = this.toString(aX, aY);
    if(!this.containsTile(aX, aY)){
      this.tiles[p] = {x:aX, y:aY};
    }

  }

  stuff.getEdgeTiles = function(map){
    var edgeTiles = [];
    var currentTiles = this.getAllTiles();
    for (var i = 0; i < currentTiles.length; i++){
      var pt = {x: currentTiles[i].x, y: currentTiles[i].y };

      if( !this.containsTile( pt.x-1, pt.y ) )        {edgeTiles.push(pt); }
      else if( !this.containsTile( pt.x+1, pt.y ) )   {edgeTiles.push(pt); }
      else if( !this.containsTile( pt.x, pt.y-1 ) )   {edgeTiles.push(pt); }
      else if( !this.containsTile( pt.x, pt.y+1 ) )   {edgeTiles.push(pt); }
    }
    return edgeTiles;
  }

  stuff.origin = {x:xx, y:yy};
  stuff.addTile(xx, yy);

  stuff.getSectorRectangle = function(){
    var edge = this.getEdgeTiles();
    var mxX = Number.MIN_SAFE_INTEGER,
        mxY = Number.MIN_SAFE_INTEGER,
        mnX = Number.MAX_SAFE_INTEGER,
        mnY = Number.MAX_SAFE_INTEGER;

    //
    for (var i = 0; i < edge.length; i++) {
      mxX = (edge[i].x > mxX) ? edge[i].x : mxX,
      mxY = (edge[i].y > mxY) ? edge[i].y : mxY,

      mnX = (edge[i].x < mnX) ? edge[i].x : mnX,

      mnY = (edge[i].y < mnY) ? edge[i].y : mnY;
    }

    var h = mxY - mnY;
    var w = mxX - mnX;

    var rect = {
      x1 : mnX,
      y1 : mnY,
      x2 : mxX,
      y2 : mxY,
      height : h,
      width : w
    };

    return rect;

  }

  stuff.getInboundSectorRectangle = function(){
    var edge = this.getEdgeTiles();

    //
    var _x = this.origin.x, _y = this.origin.y;

    var temp = {x: _x, y: _y};
    var next = 0;
    while( this.containsTile(temp.x, temp.y) ){
      temp.x++;
      temp.y++;
    }
    var lowerRightCorner = temp;
    temp = {x: _x, y: _y};
    while( this.containsTile(temp.x, temp.y) ){
      temp.x--;
      temp.y--;
    }
    var upperLeftCorner = temp;

    var h = lowerRightCorner.y - upperLeftCorner.y;
    var w = lowerRightCorner.x - upperLeftCorner.x;

    var rect = {
      x1 : upperLeftCorner.x,
      y1 : upperLeftCorner.y,
      x2 : lowerRightCorner.x,
      y2 : lowerRightCorner.y,
      height : h,
      width : w
    };

    return rect;

  }


  return stuff;
}
