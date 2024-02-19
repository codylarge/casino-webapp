document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".main-nav-links");

  let money = sessionStorage.getItem("money");
  document.querySelector("#money").textContent = `$${money}`;

  hamburger.addEventListener(
    "click",
    function () // Display nav links when hamburger is clicked
    {
      if (navLinks.style.display === "block") {
        navLinks.style.display = "none"; // Toggle off
      } else {
        navLinks.style.display = "block"; // Toggle on
      }
    }
  );

  window.addEventListener(
    "resize",
    function () // Resize in case user reverts size of window back to desktop
    {
      if (window.innerWidth > 1200) {
        navLinks.style.display = "flex";
      } else {
        if (navLinks.style.display === "flex") {
          navLinks.style.display = "none";
        }
      }
    }
  );
});
