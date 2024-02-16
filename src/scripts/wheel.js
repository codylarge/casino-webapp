// Beautifully hardcoded color segments
const colorSegments = [
  { color: "red", range: [0, 15] },
  { color: "yellow", range: [15, 30] },
  { color: "green", range: [30, 45] },
  { color: "yellow", range: [45, 60] },
  { color: "blue", range: [60, 75] },
  { color: "yellow", range: [75, 90] },
  { color: "green", range: [90, 105] },
  { color: "yellow", range: [105, 120] },
  { color: "hotpink", range: [120, 135] },
  { color: "yellow", range: [135, 150] },
  { color: "green", range: [150, 165] },
  { color: "yellow", range: [165, 180] },
  { color: "blue", range: [180, 195] },
  { color: "yellow", range: [195, 210] },
  { color: "blue", range: [210, 225] },
  { color: "green", range: [225, 240] },
  { color: "yellow", range: [240, 255] },
  { color: "hotpink", range: [255, 270] },
  { color: "yellow", range: [270, 285] },
  { color: "green", range: [285, 300] },
  { color: "yellow", range: [300, 315] },
  { color: "blue", range: [315, 330] },
  { color: "yellow", range: [330, 345] },
  { color: "green", range: [345, 360] },
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
  const wheel = document.getElementById("wheel");
  wheel.style.transition = "transform 6s cubic-bezier(.5, 1, 0.25, 1)"; // Use a default cubic bezier easing
  wheel.style.transform = `rotate(${angle}deg)`;

  // Calculate the final angle after the animation
  const finalAngle = angle % 360;

  setTimeout(() => {
    const spinButton = document.getElementById("spin-button");
    // Determine the color based on the final angle
    const color = getColorByAngle(Math.abs(finalAngle));
    // Output the result
    console.log("Landed on color:", color);
    spinButton.classList.remove("unclickable");
    setTimeout(resetWheel, 3000);
  }, 6000); // Adjust to match transition duration
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
  wheel.style.transition = "none"; // Disables transition for instant reset
  wheel.style.transform = "rotate(0deg)";
};
