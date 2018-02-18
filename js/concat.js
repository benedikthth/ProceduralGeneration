function Cave(t,r,o,e,n,a){function i(t,r){return Math.floor(Math.random()*(r-t))+t}function f(){for(var t=0;t<g.length;t++)for(var r=0;r<g[0].length;r++)s(t,r,e)}function s(t,r){if(t>0&&t<g.length-1&&r>0&&r<g[0].length){var o=l(t,r);o<e&&(g[t][r]=0),o>e&&(g[t][r]=1)}else g[t][r]=1}function l(t,r){for(var o=0,e=t-1;e<=t+1;e++)for(var n=r-1;n<=r+1;n++)e>0&&e<g.length-1&&n>0&&n<g[0].length?n===r&&e===t||(o+=g[e][n]):o++;return o}function h(t,r){return Math.sqrt(Math.pow(c.x-t,2)+Math.pow(c.y-r,2))}for(var g=[],u=0;u<r;u++)g[u]=[];var c={x:Math.floor(r/2),y:Math.floor(t/2)},v=t>r?Math.floor(r/2):Math.floor(t/2);a||(a=Date.now().toString()),Math.seedrandom(a);for(var x=0;x<r;x++)for(var y=0;y<t;y++)0==x||x==r-1||0==y||y==t-1?g[x][y]=1:(g[x][y]=i(1,100)<o*(h(x,y)/v)?1:0,g[x][y]=i(1,100)<o/2?1:g[x][y]);for(var u=0;u<n;u++)f();return g}function IrregularRegion(t,r,o,e){var n={};return n.tiles={},n.ID=o,n.thresh=e,n.toString=function(t,r){return t+","+r},n.containsTile=function(t,r){var o=this.toString(t,r);return void 0!==this.tiles[o]},n.getAllTiles=function(){for(var t=Object.keys(this.tiles),r=[],o=0;o<t.length;o++)r.push(this.tiles[t[o]]);return r},n.addTileList=function(t){for(var r=0;r<t.length;r++)this.addTile(t[r].x,t[r].y)},n.addTile=function(t,r){var o=this.toString(t,r);this.containsTile(t,r)||(this.tiles[o]={x:t,y:r})},n.getEdgeTiles=function(t){for(var r=[],o=this.getAllTiles(),e=0;e<o.length;e++){var n={x:o[e].x,y:o[e].y};this.containsTile(n.x-1,n.y)&&this.containsTile(n.x+1,n.y)&&this.containsTile(n.x,n.y-1)?this.containsTile(n.x,n.y+1)||r.push(n):r.push(n)}return r},n.origin={x:t,y:r},n.addTile(t,r),n.getSectorRectangle=function(){for(var t=this.getEdgeTiles(),r=Number.MIN_SAFE_INTEGER,o=Number.MIN_SAFE_INTEGER,e=Number.MAX_SAFE_INTEGER,n=Number.MAX_SAFE_INTEGER,a=0;a<t.length;a++)r=t[a].x>r?t[a].x:r,o=t[a].y>o?t[a].y:o,e=t[a].x<e?t[a].x:e,n=t[a].y<n?t[a].y:n;var i=o-n,f=r-e,s={x1:e,y1:n,x2:r,y2:n,height:i,width:f};return s},n.getInboundSectorRectangle=function(){for(var t=(this.getEdgeTiles(),this.origin.x),r=this.origin.y,o={x:t,y:r};this.containsTile(o.x,o.y);)o.x++,o.y++;var e=o;for(o={x:t,y:r};this.containsTile(o.x,o.y);)o.x--,o.y--;var n=o,a=e.y-n.y,i=e.x-n.x,f={x1:n.x,y1:n.y,x2:e.x,y2:e.y,height:a,width:i};return f},n}function SpaceDivision(t,r,o,e,n,a){function i(t,r){return Math.floor(Math.random()*(r-t))+t}function f(t,r,o){return r<t&&t<o}var s=o||40,l=e||70,h=n||8;h*=1e3;for(var g=[],u=0;u<t;u++)g[u]=[];for(var u=0;u<t;u++)for(var c=0;c<r;c++)g[u][c]=0;var v=[],x=Math.floor(r*t/h);console.log("Using sector count "+x);for(var y=1;y<x+1;y++){for(var d=i(10,t-10),M=i(10,r-10);0!==g[d][M];)d=i(10,t-10),M=i(10,r-10);a&&(M=r-2);var T=l/2,p=i(0,l)+T,m=IrregularRegion(d,M,y,p);g[m.origin.x][m.origin.y]=y,v.push(m)}var E=0,S=!1,I=Date.now();console.log("Generating sectorMap");for(var D=[];s--;){S=!1;for(var R=Date.now(),w=0;w<v.length;w++)for(var B=v[w].getEdgeTiles(),y=0;y<B.length;y++)i(1,100)<50||f(B[y].x,0,t-1)&&f(B[y].y,0,r-1)&&Math.random()<.5&&(0==g[B[y].x-1][B[y].y]&&i(0,100)<v[w].thresh&&(g[B[y].x-1][B[y].y]=v[w].ID,v[w].addTile(B[y].x-1,B[y].y),S=!0),0==g[B[y].x+1][B[y].y]&&i(0,100)<v[w].thresh&&(g[B[y].x+1][B[y].y]=v[w].ID,v[w].addTile(B[y].x+1,B[y].y),S=!0),0==g[B[y].x][B[y].y-1]&&i(0,100)<v[w].thresh&&(g[B[y].x][B[y].y-1]=v[w].ID,v[w].addTile(B[y].x,B[y].y-1),S=!0),0==g[B[y].x][B[y].y+1]&&i(0,100)<v[w].thresh&&(g[B[y].x][B[y].y+1]=v[w].ID,v[w].addTile(B[y].x,B[y].y+1),S=!0));S||(console.log("Nothing done this turn"),E++),D.push(Date.now()-R)}var N=Date.now()-I;console.log("Generating SectorMap took "+N/1e3+" seconds!");var A=D.reduce(function(t,r){return t+r}),b=A/D.length;b/=1e3,console.log("Average iteration took "+b+" seconds");var G={};return G.sectorMap=g,G.sectors=v,G}function GameMap(t,r){function o(t,r,o,e){var n={};return n.x1=Math.min(t,o),n.x2=Math.max(t,o),n.y1=Math.min(r,e),n.y2=Math.max(r,e),n.openTiles=function(){for(var t=[],r=n.x1;r<n.x2;r++)for(var o=n.y1;o<n.y2;o++)1!=h[r][o]&&t.push({x:r,y:o});return t},n.getHeight=function(){return this.y2-this.y1},n.getWidth=function(){return this.x2-this.x1},n}function e(){for(var t=0;t<h.length;t++)for(var r=0;r<h[0].length;r++){var o=n(t,r),e=4;o<e&&(h[t][r]=0),o>e&&(h[t][r]=1)}}function n(o,e){for(var n=0,a=o-1;a<=o+1;a++)for(var i=e-1;i<=e+1;i++)a>0&&a<h.length-1&&i>0&&i<h[0].length?i===e&&a===o||(n+=h[a][i]):(n++,(o>=0||o<=t-1)&&e>r-(cutoff/2+startingBuffer)&&(n=0));return n}function a(t,r){for(var o=r.x;o<r.x+t.length;o++)for(var e=r.y;e<r.y+t[0].length;e++)t[o-r.x][e-r.y]==f&&(h[o][e]=f)}function i(t,r,o,e){for(var n=0;n<r.length;n++)0==h[r[n].x+o][r[n].y+e]&&(h[r[n].x+o][r[n].y+e]=t)}var f=0,s=1,l=5;cutoff=100,startingBuffer=100;for(var h=[],g=0;g<t;g++)h[g]=[];for(var u=0;u<t;u++)for(var c=0;c<r;c++)if(c>=r-startingBuffer)h[u][c]=f;else if(c>=r-cutoff-startingBuffer){var v=(r-startingBuffer-c)/(cutoff+startingBuffer);h[u][c]=Math.random()<v?s:f}else h[u][c]=s;for(var x=r-(startingBuffer+cutoff),y=.1*(startingBuffer+cutoff),d=x-y,u=Math.floor(t/2)-2;u<Math.floor(t/2)+2;u++)for(var c=d;c<r;c++)h[u][c]=f,Math.random()<.5&&(h[u+1][c]=f,h[u-1][c]=f,h[u+2][c]=f,h[u-2][c]=f);for(var g=0;g<l;g++)e();var M=o(Math.floor(t/2)-.3*cutoff,d+5,Math.floor(t/2)+.3*cutoff,d-30),T=32,p=Cave(M.y2-M.y1,M.x2-M.x1,T,4,4);a(p,{x:M.x1,y:M.y1},f);var m=o(Math.floor(t/2-t/2*.95),M.y1-30,Math.floor(t/2+t/2*.95),30);console.log("Generating Caves");for(var E=SpaceDivision(m.getWidth(),m.getHeight(),100,70,3,!1),S=[],g=0;g<E.sectors.length;g++){var I=E.sectors[g].getInboundSectorRectangle();if(!(I.height*I.width<100)){var D=o(I.x1+m.x1,I.y1+m.y1,I.x2+m.x1,I.y2+m.y1);S.push(D);var R=Cave(I.height,I.width,Math.floor(20*Math.random())+45,4,4);a(R,{x:D.x1,y:D.y1},f)}}for(var g=0;g<S.length;g++)for(var w=S[g].openTiles(),B=0;B<w.length;B++)h[w[B].x][w[B].y]=3;for(var w=M.openTiles(),g=0;g<w.length;g++)h[w[g].x][w[g].y]=3;for(var u=0;u<t;u++)for(var c=d;c<x;c++)0==h[u][c]&&(h[u][c]=Math.random()>(c-d)/(x-d)?3:0);var N=o(0,r-(cutoff+startingBuffer),t,r);console.log("Creating Lakes");var A=(Math.random()<.49?1e3:2e3,SpaceDivision(N.getWidth(),N.getHeight(),Math.floor(50*Math.random())+200,Math.floor(10*Math.random())+60,5,!0));console.log(A);for(var g=0;g<A.sectors.length;g++)i(4,A.sectors[g].getAllTiles(),N.x1,N.y1);var b={cutoff:cutoff,startingBuffer:startingBuffer};return b.sectors=S,b.map=h,b.outDoorsZone=N,b.tunnelStart=x,b.tunnelEnd=d,b.StartingCaveRegion=M,b}!function(){console.log("Cave script initialized.")}(),function(){console.log("irregularRegion.js loaded")}(),function(){console.log("spaceDivision.js initialized")}(),function(){console.log("gameMap.js Loaded"),IrregularRegion||console.log("irregularRegion.js is not loaded! bad stuff!")}();