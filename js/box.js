var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

// var img = new Image();
// img.src = 'http://www.wmata.com/img/icon-marble-RED.gif';
// img.width = 30;
// img.height = 30;
// img.onload = function() {
//   var pattern = c.createPattern(img, 'repeat');
// };

// range of notes (y)
var range = 15;
// size of sequence (x)
var size = 16;
// cellSize represents height and/or width of the square cell/tile
var cellSize = 36;

// holds stringified subarrays for rendering (coloring)
var selectedCells = [];
// holds subarrays of positions for playback
var selectedNotes = {
  0: [], 1: [], 2: [], 3: [], 4: [],
  5: [], 6: [], 7: [], 8: [], 9: [],
  10: [], 11: [], 12: [], 13: [], 14: [], 15: []
};

canvas.width = size * cellSize + 1;
// canvas.height = Math.floor(range * cellSize);
canvas.height = cellSize * range + 1;

canvas.addEventListener('click', handleClick);
// canvas.addEventListener('mousemove', handleOver);

function drawGrid() {
  // c.beginPath();
  c.lineWidth = 4;
  c.strokeStyle = "#fff";
  for (var row = 0; row < range; row++) {
      for (var col = 0; col < size; col++) {
          var x = col * cellSize;
          var y = row * cellSize;
          var xyString = JSON.stringify([col, row]);

          if (selectedCells.indexOf(xyString) === -1) {
            c.fillStyle = "#99ffca"; // light blue
            c.fillRect(x, y, cellSize - 4, cellSize - 4);

          } else {
            c.fillStyle = "#A020F0"; // purple
            c.fillRect(x, y, cellSize - 4, cellSize - 4);

            if (hlCol === col){
              c.fillStyle = "#350066"; // dark purple
              c.fillRect(x, y, cellSize - 4, cellSize - 4);
            }
              }
            }
          }

  // c.closePath();
}

function handleClick(e) {
  var xRaw = e.offsetX || e.layerX;
  var yRaw = e.offsetY || e.layerY;

  var x = Math.floor(xRaw / cellSize);
  var y = Math.floor(yRaw / cellSize);

  var xyString = JSON.stringify([x,y]);

  if (selectedCells.indexOf(xyString) === -1) {
    selectedCells.push(xyString);
    selectedNotes[x].push(y);
    paintCell(xRaw, yRaw, "#A020F0");
  } else {
    for (var i = 0; i < selectedCells.length; i++) {
      if (selectedCells[i] === xyString){
        selectedCells.splice(i, 1);
      }
    }

    for (var k = 0; k < selectedNotes[x].length; k++) {
      if (selectedNotes[x][k] === y){
        selectedNotes[x].splice(i, 1);
      }
    }

    paintCell(xRaw, yRaw, "#99ffca");
  }

  console.log(selectedCells);
}

function paintCell(x, y, color) {
  c.globalAlpha = 1;
  c.fillStyle = color;
  c.lineWidth = 4;
  c.strokeStyle = 'black';
  c.fillRect(Math.floor(x / cellSize) * cellSize,
             Math.floor(y / cellSize) * cellSize,
             cellSize - 4,
             cellSize - 4);
}

// function handleOver(e) {
//   var xRaw = e.offsetX || e.layerX;
//   var yRaw = e.offsetY || e.layerY;
//
//   paintCell(xRaw, yRaw, "blue");
//
//   c.globalAlpha = 1;
//
//   setTimeout(handleOver(e), 5000);
//   // requestAnimationFrame(draw);
// }

var clearGrid = function () {
  selectedCells = [];
  selectedNotes = {
    0: [], 1: [], 2: [], 3: [], 4: [],
    5: [], 6: [], 7: [], 8: [], 9: [],
    10: [], 11: [], 12: [], 13: [], 14: [], 15: []
  };
};

var highlightCol = function(x) {
  c.fillStyle = "#9999ff";
  c.globalAlpha = 0.15;
  c.fillRect(x * ((canvas.width) / size) - 4,
             0,
             ((canvas.width) / size),
             canvas.height - 6
            );

  c.globalAlpha = 1;
};

var lastD = 0;
var hlCol = 0;

function draw() {
  // #clearRect clears the drawing such that new renderings can occur
  c.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  if(playback.playing) {
    highlightCol(hlCol);
  }
}

draw();
