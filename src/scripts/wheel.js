// Beautifully hardcoded color segments
var spinTime = 6; // Time in seconds
const colorSegments = [
  { color: "red", range: [0, 15], mult: 20 },
  { color: "yellow", range: [15, 30], mult: 1 },
  { color: "green", range: [30, 45], mult: 3 },
  { color: "yellow", range: [45, 60], mult: 1 },
  { color: "blue", range: [60, 75], mult: 5 },
  { color: "yellow", range: [75, 90], mult: 1 },
  { color: "green", range: [90, 105], mult: 3 },
  { color: "yellow", range: [105, 120], mult: 1 },
  { color: "hotpink", range: [120, 135], mult: 10 },
  { color: "yellow", range: [135, 150], mult: 1 },
  { color: "green", range: [150, 165], mult: 3 },
  { color: "yellow", range: [165, 180], mult: 1 },
  { color: "blue", range: [180, 195], mult: 5 },
  { color: "yellow", range: [195, 210], mult: 1 },
  { color: "blue", range: [210, 225], mult: 5 },
  { color: "green", range: [225, 240], mult: 3 },
  { color: "yellow", range: [240, 255], mult: 1 },
  { color: "hotpink", range: [255, 270], mult: 10 },
  { color: "yellow", range: [270, 285], mult: 1 },
  { color: "green", range: [285, 300], mult: 3 },
  { color: "yellow", range: [300, 315], mult: 1 },
  { color: "blue", range: [315, 330], mult: 5 },
  { color: "yellow", range: [330, 345], mult: 1 },
  { color: "green", range: [345, 360], mult: 3 },
];

document.addEventListener("DOMContentLoaded", function () {
  const spinButton = document.getElementById("spin-button");

  spinButton.addEventListener("click", function () {
    // Disable spin button during animation
    spinButton.classList.add("unclickable");

    // Wheel Spins in the negative direction so degree is always negative
    const min = 2320;
    let randomDegree;
    do {
      randomDegree = -Math.floor(Math.random() * min * 1.5);
      console.log(randomDegree);
    } while (Math.abs(randomDegree) < min);

    console.log("random degree: " + randomDegree);

    // Apply the rotation animation to the wheel
    spinTo(randomDegree);
  });
});

const spinTo = (angle) => {
  const money = document.getElementById("amount");
  const wheel = document.getElementById("wheel");
  wheel.style.transition =
    "transform " + spinTime + "s cubic-bezier(.5, 1, 0.25, 1)"; // Use a default cubic bezier easing
  wheel.style.transform = `rotate(${angle}deg)`;

  // Calculate the final angle after the animation
  const finalAngle = angle % 360;
  // Spin timeout, ensures spin is complete and results are outputted before resetting
  setTimeout(() => {
    const lastColor = document.getElementById("lastColor");

    const color = getColorByAngle(Math.abs(finalAngle));
    lastColor.innerHTML = "Last spin: " + color;

    let winnings = countWinnings();
    money.innerHTML = parseInt(money.innerHTML) + winnings;

    setTimeout(resetWheel, 1000);
  }, spinTime * 1000); // Adjust to match transition duration
};

function countWinnings() {
  const lastColor = document.getElementById("lastColor");
  const lastColorValue = lastColor.innerHTML.split(" ")[2]; // Get the color from the lastColor element
  var inputs = document.querySelectorAll('input[type="number"]');
  var values = [];

  for (var i = 0; i < inputs.length; i++) {
    var value = parseInt(inputs[i].value);
    values.push(isNaN(value) ? 0 : value); // Enter 0 for no bet
  }

  //console.log("yellow: " + values[0], "green: " + values[1], "blue: " + values[2], "hotpink: " + values[3], "red: " + values[4]);

  let winnings = 0;
  switch (lastColorValue) {
    case "yellow":
      winnings = values[0] * 2;
      break;

    case "green":
      winnings = values[1] * 4;
      break;

    case "blue":
      winnings = values[2] * 6;
      break;

    case "hotpink":
      winnings = values[3] * 12;
      break;

    case "red":
      winnings = values[4] * 25;
      break;
  }

  console.log("Winnings: " + winnings);
  return winnings;
}

const getColorByAngle = (angle) => {
  console.log("angle:" + angle);
  // Find the color segment corresponding to the angle
  for (const segment of colorSegments) {
    if (angle >= segment.range[0] && angle <= segment.range[1]) {
      return segment.color;
    }
  }
};

const resetWheel = () => {
  const wheel = document.getElementById("wheel");
  const spinButton = document.getElementById("spin-button");
  wheel.style.transition = "none"; // Disables transition for instant reset
  wheel.style.transform = "rotate(0deg)";
  spinButton.classList.remove("unclickable");
};
