document.addEventListener("DOMContentLoaded", function () {
  if (!sessionStorage.getItem("money")) {
    console.log("Storage not found setting now");
    sessionStorage.setItem("money", "1000");
    console.log("session storage money: " + sessionStorage.getItem("money"));
  } else {
    console.log("Storage found");
    console.log("session storage money: " + sessionStorage.getItem("money"));
  }
});