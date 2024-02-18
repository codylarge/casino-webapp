if (!sessionStorage.getItem("money")) {
  console.log("Storage not found setting now");
  sessionStorage.setItem("money", "1000");
}

console.log(sessionStorage.getItem("money"));
