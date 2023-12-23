const colorSegments = [
  { color: "red", range: [0, 15] },
  { color: "yellow", range: [15, 30] },
  { color: "green", range: [30, 45] },
  { color: "blue", range: [45, 60] },
  { color: "hotpink", range: [60, 75] },
  { color: "yellow", range: [75, 90] },
  { color: "green", range: [90, 105] },
  { color: "yellow", range: [105, 120] },
  { color: "hotpink", range: [120, 135] },
  { color: "yellow", range: [135, 150] },
  { color: "green", range: [150, 165] },
  { color: "blue", range: [165, 180] },
  { color: "yellow", range: [180, 195] },
  { color: "hotpink", range: [195, 210] },
  { color: "blue", range: [210, 225] },
  { color: "green", range: [225, 240] },
  { color: "yellow", range: [240, 255] },
  { color: "hotpink", range: [255, 270] },
  { color: "yellow", range: [270, 285] },
  { color: "green", range: [285, 300] },
  { color: "blue", range: [300, 315] },
  { color: "yellow", range: [315, 330] },
  { color: "green", range: [330, 345] },
  { color: "blue", range: [345, 360] },
];

document.addEventListener("DOMContentLoaded", function () {
  const wheel = document.getElementById("wheel");
  const spinButton = document.getElementById("spin-button");

  spinButton.addEventListener("click", function () {
    const randomDegree = Math.floor(Math.random() * 1080) + 1080;

    // Apply the rotation animation to the wheel
    wheel.style.transform = `rotate(${randomDegree}deg)`;

    // Determine the color based on the final angle
    const finalAngle = ((randomDegree % 1080) + 1080) % 1080; // Ensure positive angle
    const color = getColorByAngle(finalAngle);

    // Log or handle the color as needed
    console.log("Landed on color:", color);
  });

  function getColorByAngle(angle) {
    // Find the color segment that matches the angle
    const segment = colorSegments.find(
      (segment) => angle >= segment.range[0] && angle < segment.range[1]
    );

    // Return the color of the matched segment
    return segment ? segment.color : null;
  }
});
