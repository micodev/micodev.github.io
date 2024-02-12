

$(window).on("resize", function () {
  var win = $(this); //this = window
  var cellWidth = win.width() / gridNum;
  var cellHeight = (win.height() - 70) / gridNum;
  var min = Math.min(cellWidth, cellHeight);
  min = min - 5
  var block = $(".square")
  block.css({
    height: min + "px",
    width: min + "px"
  })
  console.log(cellHeight,cellWidth,min)
});

var blocks = [];
var blockIndex = 0;
var score = 0;
var scoreElement = $(".score");
scoreElement.text(score);
var gridNum = 8;
// make 10x10 grid

function onRightClick(block){
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
  }
  return;
}
for (var i = 0; i < gridNum; i++) {
  var row = $(
    '<div class="row justify-content-center align-items-center"></div>'
  );
  for (var j = 0; j < gridNum; j++) {
    blocks.push({
      x: i,
      y: j,
      color: "gray",
      isBomb: Math.random() > 0.75 ? true : false,
      isChecked: false,
    });
    var block = $('<div class="col-auto square rounded"></div>');
    // get available width and height then divide it by gridNum
    var cellWidth = $(window).width() / gridNum;
    var cellHeight = ($(window).height() - 70) / gridNum;
    var min = Math.min(cellWidth, cellHeight);
    min = min - 5
    block.css({
      height: min + "px",
      width: min + "px"
    })
    var data = blockIndex;
    blocks[data].index = data;
    data = blockIndex++;

    block.attr("data-index", data);

    block.click(function () {
      var index = $(this).data("index");
      // if checked then return
      if (blocks[index].isChecked) {
        return;
      }
      blocks[index].isChecked = true;
      showWinMessage();
      openBlock(index);
      // if all blocks are checked and not bombs then show win message
    });
    // if right click then change color to orange
    block.on("contextmenu", function () {
      onRightClick($(this))
      return false;
    });
    row.prepend(block);
  }
  $(".body-game").append(row);

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
      alert("Game Over");
      for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].isBomb) {
          blocks[i].isChecked = true;
          blockIcon = $("<i class='fas fa-bomb fa-lg'></i>");
          var bombElement = $("[data-index=" + i + "]");
          bombElement.append(blockIcon);
          bombElement.css("background-color", "red");
          score = 0;
          scoreElement.text(score);
        }
      }
      return;
    }
    score += 6;
    scoreElement.text(score);
    var neighbour4 = check4Neighbour(index);
    var neighbour8 = check8Neighbour(index);
    // if neighbour8 has bomb then show number of bomb in same block
    var count = 0;
    neighbour8.forEach(function (b) {
      if (b.isBomb) {
        count++;
      }
    });
    if (count > 0 && !block.isChecked) {
      block.isChecked = true;
      showWinMessage();
      $("[data-index=" + index + "]").text(count);
      return;
    }

    for (var i = 0; i < neighbour4.length; i++) {
      var b = neighbour4[i];
      var neighbourBlock = $("[data-index=" + b.index + "]");
      blocks[index].isChecked = true;
      if (!b.isBomb && !b.isChecked) {
        var checkifhasNumber = $("[data-index=" + b.index + "]").text();

        if (checkifhasNumber == "") {
          b.color = "white";
          openBlock(b.index);
        } else {
          showWinMessage();
        }
      }
    }
  }
}
