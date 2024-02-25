const bankruptcyButton = document.getElementById('bankruptcy');

// Add a click event listener to the button
bankruptcyButton.addEventListener('click', function() {
    // Your code to execute when the button is clicked goes here
    const currentMoney = parseInt(sessionStorage.getItem("money"));
    const moneyDisplay = document.querySelector("#money");
    if (currentMoney < 1000) {
        sessionStorage.setItem("money", "1000");
        moneyDisplay.textContent = `$${sessionStorage.getItem("money")}`;
    } 

});