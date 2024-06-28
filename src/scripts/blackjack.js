
const cards = [
    "2_of_clubs", "2_of_diamonds", "2_of_hearts", "2_of_spades",
    "3_of_clubs", "3_of_diamonds", "3_of_hearts", "3_of_spades",
    "4_of_clubs", "4_of_diamonds", "4_of_hearts", "4_of_spades",
    "5_of_clubs", "5_of_diamonds", "5_of_hearts", "5_of_spades",
    "6_of_clubs", "6_of_diamonds", "6_of_hearts", "6_of_spades",
    "7_of_clubs", "7_of_diamonds", "7_of_hearts", "7_of_spades",
    "8_of_clubs", "8_of_diamonds", "8_of_hearts", "8_of_spades",
    "9_of_clubs", "9_of_diamonds", "9_of_hearts", "9_of_spades",
    "10_of_clubs", "10_of_diamonds", "10_of_hearts", "10_of_spades",
    "jack_of_clubs", "jack_of_diamonds", "jack_of_hearts", "jack_of_spades",
    "queen_of_clubs", "queen_of_diamonds", "queen_of_hearts", "queen_of_spades",
    "king_of_clubs", "king_of_diamonds", "king_of_hearts", "king_of_spades",
    "ace_of_clubs", "ace_of_diamonds", "ace_of_hearts", "ace_of_spades",

];

const covers = [
    "cover_blue", "cover_red", //"cover_alt1", "cover_alt2", "cover_alt3", "cover_alt4"
]

document.addEventListener('DOMContentLoaded', () => {
    let cover = pickRandomCover();
    dealCoverCards(2, cover);
});

function pickRandomCover() {
    return covers[Math.floor(Math.random() * covers.length)];
}

function dealCoverCards(numCards, coverTitle) {
    for (let i = 0; i < numCards; i++) {
        dealCard(0, coverTitle);
        dealCard(1, coverTitle);
    }
}

// hand: 0 = dealer, 1 = player 1
function dealCard(hand, cardTitle) {
    const playerOneHandDocument = document.querySelector(".player-hand .cards-container");
    const dealerHandDocument = document.querySelector(".dealer-hand .cards-container");
    let cardImage = window.cardImages[cardTitle].cloneNode();

    if (hand === 0) {
        console.log("Dealing to dealer");
        dealerHandDocument.appendChild(cardImage);
    } else {
        console.log("Dealing to player 1");
        playerOneHandDocument.appendChild(cardImage);
    }
}

function placeBets() {
    let totalBet = getTotalBet();
    let money = parseInt(sessionStorage.getItem("money"));
    if (totalBet > money) {
        alert("You do not have enough money to place that bet.");
        return;
    }
    sessionStorage.setItem("money", money - totalBet);
    document.getElementById("money").innerText = sessionStorage.getItem("money");
}