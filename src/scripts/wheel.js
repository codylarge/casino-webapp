/* ------ GLOBALS ------ */

var SPIN_TIME = 6; // Time in seconds

// Beautifully hardcoded color segments
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
const colorOptions = ["yellow", "green", "blue", "hotpink", "red"];

// Site-Wide money variable (Session storage)
const storage = sessionStorage.getItem("money");
let money = parseInt(storage);
document.querySelector("#money").textContent = `$${money}`;

// Users inputs (Referenced in almost every method so I just made it global)
const inputs = document.querySelectorAll('input[type="number"]');

/* ---------------------- */

document.addEventListener("DOMContentLoaded", function () {
  const spinButton = document.getElementById("spin-button");
  spinButton.addEventListener("click", function () {
    // Disable spin button during animation
    spinButton.classList.add("unclickable");

    const min = 2320;
    let randomDegree;
    do {
      randomDegree = -Math.floor(Math.random() * min * 1.5); // Wheel Spins in the negative direction so, negative degree
      console.log(randomDegree);
    } while (Math.abs(randomDegree) < min);

    console.log("random degree: " + randomDegree);

    if (money < 1 || getTotalBet() > money) {
      alert("You do not have enough money to bet");
      spinButton.classList.remove("unclickable");
      return;
    }

    toggleInputs();

    //money -= getTotalBet();
    document.querySelector("#money").textContent = `$${money}`; // Changes #money from Nav component
    spinTo(randomDegree);
  });
});

const spinTo = (angle) => {
  const wheel = document.getElementById("wheel");

  clearInputGlow(); // Clears the last winner indicator

  // Spin Wheel
  wheel.style.transition =
    "transform " + SPIN_TIME + "s cubic-bezier(.5, 1, 0.25, 1)"; // Use a default cubic bezier easing
  wheel.style.transform = `rotate(${angle}deg)`;

  const finalAngle = angle % 360;

  // Makes sure spin is complete before outputting results
  setTimeout(() => {
    let winningInput;
    const color = getColorByAngle(Math.abs(finalAngle));

    // Allows for the creation of different wheel variations
    for (let segmentColor of colorOptions) {
      if (segmentColor == color) {
        winningInput = document.getElementById(`${segmentColor}-bet`);
      }
    }

    winningInput.classList.add("glow");

    let winnings = countWinnings(color);
    console.log(winnings);
    money += winnings;
    console.log("money" + money);

    sessionStorage.setItem("money", money.toString());
    document.querySelector("#money").textContent = `$${money}`; // Changes #money from Nav component
    toggleInputs();
    setTimeout(resetWheel, 1000); // Ensures spin is complete and results are outputted before resetting
  }, SPIN_TIME * 1000);
};

function countWinnings(lastColor) {
  var values = [];

  // A scalable way to count winnings based on the last color & input fields
  for (var i = 0; i < inputs.length; i++) {
    var value = parseInt(inputs[i].value);
    values.push(isNaN(value) ? 0 : value); // Enter 0 for no bet
  }

  //console.log("yellow: " + values[0], "green: " + values[1], "blue: " + values[2], "hotpink: " + values[3], "red: " + values[4]);
  let winnings = 0;
  switch (lastColor) {
    case "yellow":
      winnings += values[0] * 2;
      winnings -= values[1];
      winnings -= values[2];
      winnings -= values[3];
      winnings -= values[4];
      break;

    case "green":
      winnings -= values[0];
      winnings += values[1] * 4;
      winnings -= values[2];
      winnings -= values[3];
      winnings -= values[4];
      break;

    case "blue":
      winnings -= values[0];
      winnings -= values[1];
      winnings += values[2] * 6;
      winnings -= values[3];
      winnings -= values[4];
      break;

    case "hotpink":
      winnings -= values[0];
      winnings -= values[1];
      winnings -= values[2];
      winnings += values[3] * 12;
      winnings -= values[4];
      break;

    case "red":
      winnings -= values[0];
      winnings -= values[1];
      winnings -= values[2];
      winnings -= values[3];
      winnings += values[4] * 25;
      break;
  }

  console.log("Winnings: " + winnings);
  return winnings;
}

const getTotalBet = () => {
  let totalBet = 0;
  for (let i = 0; i < colorOptions.length; i++) {
    let color = colorOptions[i];
    let bet = document.getElementById(`${color}-bet`).value;
    totalBet += bet;
  }
  return totalBet;
};

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

const clearInputGlow = () => {
  for (const color of colorOptions) {
    const elementId = `${color}-bet`;
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove("glow");
    }
  }
};

const toggleInputs = () => {
  for (const input of inputs) {
    if (input.disabled) {
      input.value = "";
    }
    input.disabled = !input.disabled;
  }
};
