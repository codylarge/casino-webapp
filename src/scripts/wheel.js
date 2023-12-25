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
  const wheel = document.getElementById("wheel");
  const wheelContainer = document.querySelector(".wheel-container");
  const spinButton = document.getElementById("spin-button");

  spinButton.addEventListener("click", function () {
    const randomSeed = Math.floor(Math.random() * 360);
    const spins = Math.floor(Math.random() * 10) + 2; // Adjust the number of spins
    const randomDegree = spins * 360 + randomSeed;

    console.log("RandomDegree: " + randomDegree);
    // Apply the rotation animation to the wheel container
    wheel.style.transition = "transform 3s ease-out"; // Adjust the transition duration
    wheel.style.transform = `rotate(${randomDegree}deg) rotateX(0) rotateY(0)`;

    // Determine the color based on the final angle
    const finalAngle = ((randomDegree % 360) + 360) % 360; // Ensure positive angle
    console.log("Final Angle: " + finalAngle);
    const color = getColorByAngle(finalAngle);

    // Log or handle the color as needed
    console.log("Landed on color:", color);
  });

  function getColorByAngle(angle) {
    // Find the color segment that matches the angle
    const segment = colorSegments.find(
      (segment) => angle >= segment.range[0] && angle < segment.range[1]
    );
    console.log("segment range: " + segment.range[0] + " " + segment.range[1]);
    // Return the color of the matched segment
    return segment ? segment.color : null;
  }
});
