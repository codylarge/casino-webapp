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

const playButton = document.getElementById('play')
const hitButton = document.getElementById('hit')
const standButton = document.getElementById('stand')

let playerCards = []
let dealerCards = []

let deck = []

let cover // The back of the card design that will be used for the game

let firstDeal = true;

// CURRENT START GAME
document.addEventListener('DOMContentLoaded', () => {
    playButton.addEventListener('click', startGame)
    hitButton.addEventListener('click', hit)
    standButton.addEventListener('click', stand)
    cover = pickRandomCover();
    dealCoverCards(2, cover);
});

function startGame() {
    // REMOVE THE COVERS 
    removeAllCards()
    toggleGameButtons()
    console.log("Starting game")
    deck = shuffleArray(cards)
    let playerStartingCards = deck.splice(0, 2)
    console.log("Player Cards: " + playerStartingCards)
    let dealerStartingCards = deck.splice(0, 2)
    console.log("Dealer Cards: " + dealerStartingCards)
    
    dealStartingCards(dealerStartingCards, playerStartingCards, cover)
}

function hit() {
    dealCard(1, deck.pop());
    let playerTotal = getHandTotal(playerCards)
    if (playerTotal > 21) {
        console.log("Player busts")
        playDealerHand()
        toggleGameButtons()
    }
}

function stand() {
    console.log("Player stands")
    let playerTotal = getHandTotal(playerCards)
    let dealerTotal = getHandTotal(dealerCards)
    console.log("Player total: " + playerTotal)
    console.log("Dealer total: " + dealerTotal)

    playDealerHand()

    if (dealerTotal > 21) {
        console.log("Dealer busts")
    } else if (dealerTotal > playerTotal) {
        console.log("Dealer wins")
    } else if (dealerTotal < playerTotal) {
        console.log("Player wins")
    } else {
        console.log("Push")
    }

    toggleGameButtons()
}

function playDealerHand() {
    // Reveal dealers face down card
    let faceDownCard = dealerCards[0]
    console.log("Revealing dealer's face down card: " + faceDownCard)
    let cardImage = window.cardImages[faceDownCard].cloneNode();

    dealerHandDocument.removeChild(dealerHandDocument.firstChild)
    dealerHandDocument.insertBefore(cardImage, dealerHandDocument.firstChild);

    //dealCard(0, faceDownCard)
    let dealerTotal = getHandTotal(dealerCards)
    while (dealerTotal < 17) {
        dealerHandDocument
        dealCard(0, deck.pop());
        dealerTotal = getHandTotal(dealerCards)
        console.log("Dealer total: " + dealerTotal)
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
    console.log(cardTitle)

    let cardImage = window.cardImages[cardTitle].cloneNode();
    let handDocument = undefined
    if (hand === 0) {
        handDocument = dealerHandDocument
        console.log("Dealing to dealer");
        dealerCards.push(cardTitle)
    } else {
        handDocument = playerHandDocument
        console.log("Dealing to player 1");
        playerCards.push(cardTitle)
    }
    // TODO: MAKE SURE IF ITS A COVER DONT ADD IT
    handDocument.appendChild(cardImage);
}

function toggleGameButtons() {  
    if(playButton.style.display === "none") {
        playButton.style.display = "block";
        hitButton.style.display = "none";
        standButton.style.display = "none";
    } else {
        playButton.style.display = "none";
        hitButton.style.display = "block";
        standButton.style.display = "block";
    }
}

function removeAllCards() {
    dealerHandDocument.innerHTML = ""
    playerHandDocument.innerHTML = ""
    playerCards = []
    dealerCards = []
}

// REUSED CODE:
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function getHandTotal(cards) {
    let cardValues = []

    for (let card of cards) {
        let cardValue = card.split('_')[0]
        if (cardValue === "jack" || cardValue === "queen" || cardValue === "king") cardValue = 10
        else if (cardValue === "ace") cardValue = 11
        else if(cardValue === "cover") cardValue = 0
        else cardValue = parseInt(cardValue)
        cardValues.push(cardValue)
    }

    cardValues.sort((a, b) => a - b); // sort the array in ascending order
    let sum = cardValues.reduce((a, b) => a + b, 0) // sum all the values in the array
    return sum
}