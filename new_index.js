function onResize() {
  var win = $(window); //this = window
  var cellWidth = win.innerWidth() / gridNum;
  var cellHeight = (win.innerHeight() - 70) / gridNum;
  var min = Math.min(cellWidth, cellHeight);
  min = min - 10;
  var block = $(".square");
  block.css({
    height: min + "px",
    width: min + "px",
  });
  $(".square").css("font-size", "medium");
  var w1 = $(".square").innerWidth() - 10;
  var w2 = $(".square").innerHeight() - 10;
  var wRatio = Math.round((w1 / w2) * 10) / 10;
  wRatio = wRatio < 0.3 ? 0.4 : wRatio;
  wRatio = wRatio * 1.0;
  $(".square").css("font-size", wRatio + "em");
}
$(window).on("resize", onResize);
//check 4 Neighbour and return its indexes as x,y
function check4Neighbour(index) {
  var block = blocks[index];
  var x = block.x;
  var y = block.y;

  var neighbour = blocks.filter(function (b) {
    return (
      (b.x == x - 1 && b.y == y) ||
      (b.x == x && b.y == y - 1) ||
      (b.x == x + 1 && b.y == y) ||
      (b.x == x && b.y == y + 1)
    );
  });

  return neighbour;
}
function check8Neighbour(index) {
  var block = blocks[index];
  var x = block.x;
  var y = block.y;

  var neighbour = blocks.filter(function (b) {
    return (
      (b.x == x && b.y == y) ||
      (b.x == x + 1 && b.y == y) ||
      (b.x == x + 1 && b.y == y - 1) ||
      (b.x == x && b.y == y - 1) ||
      (b.x == x - 1 && b.y == y - 1) ||
      (b.x == x - 1 && b.y == y) ||
      (b.x == x - 1 && b.y == y + 1) ||
      (b.x == x && b.y == y + 1) ||
      (b.x == x + 1 && b.y == y + 1)
    );
  });
  return neighbour;
}

// change color of neighbour blocks who not bomb and recursive open if its not bomb for its neighbour4
function openBlock(index) {
  var block = blocks[index];
  $("[data-index=" + index + "]").addClass("open");
  //$("[data-index=" + index + "]").css("background-color", "white");
  if (block.isBomb) {
    blocks[index].isChecked = false; // to prevent ignorance of current bomb
    alert("Game Over");
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i].isBomb) {
        var bombElement = $("[data-index=" + i + "]");
        if (!blocks[i].isChecked) {
          blockIcon = $("<i class='fas fa-bomb fa-lg'></i>");
          bombElement.append(blockIcon);
        }

        bombElement.css("background-color", "red");
        score = 0;
        scoreElement.text(score);
      }
    }
    //check all blocks
    blocks.forEach(function (e) {
      e.isChecked = true;
    });
    return;
  }
  score += 6;
  scoreElement.text(score);
  // var neighbour4 = check8Neighbour(index);
  var neighbour8 = check8Neighbour(index);
  var neighbour4 = neighbour8;
  // if neighbour8 has bomb then show number of bomb in same block
  var count = 0;
  neighbour8.forEach(function (b) {
    if (b.isBomb) {
      count++;
    }
  });
  if (count > 0 && !block.isChecked) {
    block.isChecked = true;
    $("[data-index=" + index + "]").text(count);
    showWinMessage();
    return;
  }

  for (var i = 0; i < neighbour4.length; i++) {
    var b = neighbour4[i];
    var neighbourBlock = $("[data-index=" + b.index + "]");

    if (!b.isBomb && !b.isChecked) {
      blocks[index].isChecked = true;
      var checkifhasNumber = neighbourBlock.text();

      if (checkifhasNumber == "") {
        b.color = "white";
        openBlock(b.index);
      }
      //TODO:// CHECK IF NOT HAS NUMBER
      // else {
      //   showWinMessage();
      // }
    }
  }
}

function onRightClick(block) {
  var index = block.data("index");
  var singleBlock = blocks[index];
  if (singleBlock.isChecked) {
    return false;
  }
  singleBlock.isChecked = true;
  singleBlock.color = "orange";
  block.css("background-color", "orange");
  // if bomb then show bomb icon
  if (singleBlock.isBomb) {
    blockIcon = $("<i class='fas fa-bomb fa-lg'></i>");
    block.append(blockIcon);
    block.css("background-color", "red");
    score += 50;
    scoreElement.text(score);
  } else {
    if (score - 50 > 0) score -= 50;
    else score = 0;
    scoreElement.text(score);
  }
  showWinMessage();
}
function onLeftClick(block) {
  var index = block.data("index");
  // if checked then return
  if (blocks[index].isChecked) {
    return;
  }

  showWinMessage();
  openBlock(index);
  blocks[index].isChecked = true;
}
function showWinMessage() {
  var allChecked = true;
  for (var i = 0; i < blocks.length; i++) {
    if (!blocks[i].isChecked && !blocks[i].isBomb) {
      allChecked = false;
      break;
    }
  }
  if (allChecked) {
    alert("You Win");
    blocks.forEach(function (b) {
      b.isChecked = true;
    });
    return;
  }
  // if all bombs are checked then show win message
  var allBombsChecked = true;
  for (var i = 0; i < blocks.length; i++) {
    if (!blocks[i].isChecked && blocks[i].isBomb) {
      allBombsChecked = false;
      break;
    }
  }
  if (allBombsChecked) {
    alert("You Win");
    blocks.forEach(function (b) {
      b.isChecked = true;
    });
    return;
  }

  return;
}

var blocks;
var blockIndex;
var score;
var scoreElement;
var gridNum;
var bombNumber;
$(".bomb-number").on("input", function () {
  setup();
});
$(".grid-number").on("input", function () {
  setup();
});
function setup() {
  $(".body-game").empty();
  blocks = [];
  blockIndex = 0;
  score = 0;
  scoreElement = $(".score");
  scoreElement.text(score);
  gridNum = $(".grid-number").val();
  bombNumber = $(".bomb-number").val();

  for (var i = 0; i < gridNum; i++) {
    var row = $(
      '<div class="row justify-content-center align-items-center"></div>'
    );
    for (var j = 0; j < gridNum; j++) {
      blocks.push({
        x: i,
        y: j,
        color: "gray",
        isBomb: false,
        isChecked: false,
      });

      var block = $('<div class="col-auto square rounded"></div>');
      // get available width and height then divide it by gridNum
      // var cellWidth = $(window).width() / gridNum;
      // var cellHeight = $(window).height() / gridNum;
      // var min = Math.min(cellWidth, cellHeight);
      // min = min - 100;
      // block.css({
      //   height: min + "px",
      //   width: min + "px",
      // });
      var data = blockIndex;
      blocks[data].index = data;
      data = blockIndex++;

      block.attr("data-index", data);
      block
        .longpress(
          function () {
            onRightClick($(this));
            return false;
          },
          function () {
            onLeftClick($(this));
          }
        )
       
      //block hover scale
      block.hover(
        function () {
          $(this).css("transform", "scale(1.1)");
        },
        function () {
          $(this).css("transform", "scale(1)");
        }
      );

      // if right click then change color to orange
      block.on("contextmenu", function () {
        onRightClick($(this));
        return false;
      });
      row.prepend(block);
    }
    // bombNumber>0?true:false,
    // bombNumber--;
    // set 10 bombs randomly

    $(".body-game").append(row);
  }
  if (bombNumber > gridNum * gridNum) {
    bombNumber = gridNum * gridNum;
  }
  for (var k = 0; k < bombNumber; k++) {
    var randIndex = Math.floor(Math.random() * blocks.length);
    var block = blocks[randIndex];
    if (block.isBomb == true) {
      k--;
    } else {
      blocks[randIndex].isBomb = true;
    }
  }

  onResize();
}

setup();
