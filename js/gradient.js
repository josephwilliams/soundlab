$(function() {
    var keys = Object.keys(bgColors);
    var count = Object.keys(bgColors).length;
    var randNum = Math.floor(Math.random() * count);
    var colorBG1 = keys[randNum];
    var colorBG2 = bgColors[colorBG1];

    $("html").css({"background": "linear-gradient(to bottom, " + colorBG1 + " 0%, " + colorBG2 + " 100%)"
  });
});

var bgColors = {
  "#FFC8C8": "#6B6BCE",
  "#FCBDFF": "#62E2A7",
  "#FF8A8A": "#0ED0D0",
  "#FFBBBB": "#7EFFC4",
  "#FFF795": "#ECB9FF",
  "#FFEFAF": "#E49BFF",
  "#FFF9A7": "#9BFAFF",
  "#FFFAB0": "#FF9BCE",
  "#D7DDFF": "#FFA4D2",
  "#E0CCFF": "#FF825C"
};
