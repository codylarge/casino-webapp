//hand = 0: Dealer
//hand = 1: Player 1

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
const dealerHandDocument = document.querySelector(".dealer-hand .cards-container");
const playerHandDocument = document.querySelector(".player-hand .cards-container");

let playerCards = []
let dealerCards = []
let cover

// CURRENT START GAME
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.play').addEventListener('click', startGame)
    cover = pickRandomCover();
    dealCoverCards(2, cover);
});

function startGame() {
    // REMOVE THE COVERS 
    console.log("Starting game")
    let deck = shuffleArray(cards)
    let playerStartingCards = deck.splice(0, 2)
    console.log("Player Cards" + playerStartingCards)
    let dealerStartingCards = deck.splice(0, 2)
    console.log("Dealer cards" + dealerStartingCards)

    dealStartingCards(dealerStartingCards, playerStartingCards, cover)
}

function pickRandomCover() {
    return covers[Math.floor(Math.random() * covers.length)];
}

function dealCoverCards(numCards, coverTitle) {
    for (let i = 0; i < numCards; i++) {
        dealCard(0, coverTitle);
        dealCard(1, coverTitle);
    }
}


function dealStartingCards(dCards, pCards, cover) {
    console.log("Revealing dealer starting card")
    dealCard(0, cover)
    dealCard(0, dCards[0])
    console.log("Revealing player starting cards")
    dealCard(1, pCards[0])
    dealCard(1, pCards[1])
}

// hand: 0 = dealer, 1 = player 1 | replace: true/false to replace card
function dealCard(hand, cardTitle) {
    console.log(cardTitle)
    let cardImage = window.cardImages[cardTitle].cloneNode();
    let handDocument = undefined
    if (hand === 0) {
        handDocument = dealerHandDocument
        console.log("Dealing to dealer");
        dealerCards += cardTitle
    } else {
        handDocument = playerHandDocument
        console.log("Dealing to player 1");
        playerCards += cardTitle
    }
    // TODO: MAKE SURE IF ITS A COVER DONT ADD IT
    handDocument.appendChild(cardImage);
}



// REUSED CODE:
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}