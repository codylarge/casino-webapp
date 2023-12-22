document.addEventListener("DOMContentLoaded", function () {
  const wheel = document.getElementById("wheel");
  const spinButton = document.getElementById("spin-button");

  spinButton.addEventListener("click", function () {
    const randomDegree = Math.floor(Math.random() * 1080) + 1080;

    // Apply the rotation animation to the wheel
    wheel.style.transform = `rotate(${randomDegree}deg)`;

    // You may want to handle the result based on the final angle
    // For example, determine the segment where the wheel stopped
    // and provide corresponding rewards or outcomes.
  });
});
