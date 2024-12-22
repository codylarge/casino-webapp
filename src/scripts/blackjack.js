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

// UNUSD ACES (When ace is converted from 11 -> 1 it is no longer counted here)
let dealerAces = 0 
let playerAces = 0

// Modifiers used to artificially change the dealer and player's hand values (for aces)
let dealerModifier = 0
let playerModifier = 0

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
    reset()
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
    let playerTotal = getHandTotal(playerCards, 1)
    if (playerTotal > 21) {
        if(confirmBust(1)) {
            console.log("Player busts")
            playDealerHand()
            toggleGameButtons()
        }
    }
}

async function stand() {
    console.log("Player stands")

    await playDealerHand();

    let playerTotal = getHandTotal(playerCards, 1)
    let dealerTotal = getHandTotal(dealerCards, 0)

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

async function playDealerHand() {
    // Reveal dealer's face-down card
    let faceDownCard = deck.pop()
    let cardImage = window.cardImages[faceDownCard].cloneNode();
    dealerHandDocument.removeChild(dealerHandDocument.firstChild);
    dealerHandDocument.insertBefore(cardImage, dealerHandDocument.firstChild);
    dealerCards.push(faceDownCard)
    // Calculate dealer's total
    let dealerTotal = getHandTotal(dealerCards, 0);
    updateHandTotal(0)
    // While the dealer's total is less than 17
    while (dealerTotal < 17) {
        // Wait before dealing the next card
        await sleep(1000); // 1000ms = 1 second

        // Deal a new card and update the dealer's total
        dealCard(0, deck.pop());
        dealerTotal = getHandTotal(dealerCards, 0);
        confirmBust(0)
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
    console.log("Dealing card: " + cardTitle)

    let cardImage = window.cardImages[cardTitle].cloneNode();
    let handDocument = undefined
    if (hand === 0) {
        handDocument = dealerHandDocument
        console.log("Dealing to dealer");
        dealerCards.push(cardTitle)
        if(cardTitle.includes("ace")) dealerAces++
    } else {
        handDocument = playerHandDocument
        console.log("Dealing to player 1");
        playerCards.push(cardTitle)
        if(cardTitle.includes("ace")) playerAces++
    }
    // TODO: MAKE SURE IF ITS A COVER DONT ADD IT
    handDocument.appendChild(cardImage);
    updateHandTotal(hand)
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

// retrns the total value of a hand assuming aces are 11
function getHandTotal(cards, player) {
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

    if(player === 0) sum += dealerModifier
    else if(player === 1) sum += playerModifier
    
    return sum
}

// This method is only called AFTER the player specified has OVER 21 (without converting aces)
// player: 0 = dealer, 1 = player 1
function confirmBust(player) {
    let total = getHandTotal(player === 0 ? dealerCards : playerCards)
    let aces = player === 0 ? dealerAces : playerAces

    if (total <= 21) return false // Not a bust
    if(aces === 0) return true // No aces so confirmed bust
    
    if(aces > 0 && total > 21) {
        if(player === 0) {
            dealerModifier -= 10
            dealerAces -= 1
            updateHandTotal(0)
        } else if (player === 1) {
            playerModifier -= 10
            playerAces -= 1
            updateHandTotal(1)
        }
        return false
    }
}

// Updates the total of a hand to be shown on the screen
// Player: 0 = dealer, 1 = player 1...
function updateHandTotal(player) {
    let totalDocument, currentTotal
    if(player === 0) {
        totalDocument = document.getElementById("dealer-total")
        totalDocument.textContent = "Dealer Total:"
        currentTotal = getHandTotal(dealerCards, 0)
    } else if (player === 1) {
        totalDocument = document.getElementById("player-total")
        totalDocument.textContent = "Player Total:"
        currentTotal = getHandTotal(playerCards, 1)    
    }
    totalDocument.textContent += ` ${currentTotal}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function reset(){
    removeAllCards()
    dealerAces = 0
    playerAces = 0
    dealerModifier = 0
    playerModifier = 0
}