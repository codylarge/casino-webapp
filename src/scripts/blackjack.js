// TODO:
// BUGS:
/*
1. Player can spam hit/stay and break the game'
2. Player gets 2 aces to start will show 22 instead of 12
3. If player busts and dealer busts, player win
3. If player gets blackjack and dealer gets 21 the game goes to dealer win instead of push -ai
*/
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
    "cover_blue", "cover_red", "cover_alt1", "cover_alt2", "cover_alt3", "cover_alt4"
]

const dealerHandDocument = document.querySelector(".dealer-hand .cards-container");
const playerHandDocument = document.querySelector(".player-hand .cards-container");

const playButton = document.getElementById('play-button')
const hitButton = document.getElementById('hit')
const standButton = document.getElementById('stand')

const mainBet = document.getElementById("main-bet")


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
});


async function startGame() {

    let totalBet = parseInt(mainBet.value, 10)

    if (!checkMoney(totalBet)) {
        return
    }
    // REMOVE THE COVERS 
    reset()
    setGameState(1)
    console.log("Starting game")
    deck = shuffleArray(cards)
    let playerStartingCards = deck.splice(0, 2)
    console.log("Player Cards: " + playerStartingCards)
    let dealerStartingCards = deck.splice(0, 2)
    console.log("Dealer Cards: " + dealerStartingCards)


    console.log(`Main Bet: ${mainBet.value}`)
    await dealStartingCards(dealerStartingCards, playerStartingCards, cover)
}

async function hit() {
    dealCard(1, deck.pop());
    if (getHandTotal(playerCards) > 21) {
        console.log("Player busts")
        await endGame(0, parseInt(mainBet.value, 10))
        setGameState(0)
    }
}

async function stand() {
    console.log("Player stands")

    await playDealerHand();
    let result;
    let playerTotal = getHandTotal(playerCards)
    let dealerTotal = getHandTotal(dealerCards)

    if (playerTotal > 21) {
        console.log("Player busts")
        result = 0; // Dealer wins
    } else if (dealerTotal > 21) {
        console.log("Dealer busts")
        result = 1; // Player wins
    } else if (dealerTotal > playerTotal) {
        console.log("Dealer wins")
        result = 0; // Dealer wins
    } else if (dealerTotal < playerTotal) {
        console.log("Player wins")
        result = 1; // Player wins
    } else {
        console.log("Push")
        result = 2; // Push
    }
    await endGame(result, parseInt(mainBet.value, 10));
    console.log("End game complete, resetting")
    setGameState(0)
}

async function playDealerHand() {
    // Reveal dealer's face-down card
    let faceDownCard = deck.pop()
    let cardImage = window.cardImages[faceDownCard].cloneNode();
    dealerHandDocument.removeChild(dealerHandDocument.firstChild);
    dealerHandDocument.insertBefore(cardImage, dealerHandDocument.firstChild);
    dealerCards.push(faceDownCard)
    // Calculate dealer's total
    let dealerTotal = getHandTotal(dealerCards);
    updateHandTotal(0)
    while (dealerTotal < 17) {
        await sleep(1000);
        dealCard(0, deck.pop());
        dealerTotal = getHandTotal(dealerCards);
    }
}


async function dealStartingCards(dCards, pCards, cover) {
    const dealTime = 500;

    dealCard(1, pCards[0])
    await sleep(dealTime)
    dealCard(0, cover)
    await sleep(dealTime)
    dealCard(1, pCards[1])
    await sleep(dealTime)
    dealCard(0, dCards[0])
    await sleep(dealTime)
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
    } else {
        handDocument = playerHandDocument
        console.log("Dealing to player 1");
        playerCards.push(cardTitle)
    }
    // TODO: MAKE SURE IF ITS A COVER DONT ADD IT
    handDocument.appendChild(cardImage);
    updateHandTotal(hand)
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
    let total = 0;
    let aces = 0;

    for (let card of cards) {
        let cardValue = card.split('_')[0]
        if (cardValue === "jack" || cardValue === "queen" || cardValue === "king") total += 10;
        else if (cardValue === "ace") { total += 11; aces++; }
        else if (cardValue === "cover") total += 0;
        else total += parseInt(cardValue, 10);
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}

// 0 = dealer, 1 = player
function confirmBust(player) {
    return getHandTotal(player === 0 ? dealerCards : playerCards) > 21;
}

// Updates the total of a hand to be shown on the screen
// Player: 0 = dealer, 1 = player 1...
function updateHandTotal(player) {
    let totalDocument, currentTotal
    if(player === 0) {
        totalDocument = document.getElementById("dealer-total")
        totalDocument.textContent = "Dealer Total:"
        currentTotal = getHandTotal(dealerCards)
    } else if (player === 1) {
        totalDocument = document.getElementById("player-total")
        totalDocument.textContent = "Player Total:"
        currentTotal = getHandTotal(playerCards)
    }
    totalDocument.textContent += ` ${currentTotal}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 0 = betting stage, 1 = playing stage
function setGameState(state) {
    const bettingMenu = document.getElementById("betting-menu");
    const gameContainer = document.getElementById("game-container");

    if (state === 0) {
        bettingMenu.style.display = "block";
        gameContainer.style.display = "none";
        hitButton.style.display = "none";
        standButton.style.display = "none";
        // RESET BET TO 0
        document.getElementById("clear-bet-button").click();
    } else if (state === 1) {
        bettingMenu.style.display = "none";
        gameContainer.style.display = "block";
        hitButton.style.display = "block";
        standButton.style.display = "block";
    }
}

// 0 = dealer win, 1 = player 1 win, 2 = push
async function endGame(results, win = 0) {
  return new Promise((resolve) => {
    const endGameScreen = document.getElementById("end-screen");
    const continueBtn = document.getElementById("continue-btn");
    const resultMessage = document.getElementById("result-message");
    const mainBet = document.getElementById("main-bet-result");
    // Determine the message based on the result
    switch (results) {
      case 0: // LOSE
        resultMessage.textContent = `You LOSE!`;
        mainBet.style.color = "red";
        mainBet.textContent = `-$${win}`;
        endGameScreen.style.display = "block";
        break;
      case 1: // WIN
        updateMoney(win * 2) // Pay the player double their bet
        resultMessage.textContent = `You WIN!`;
        mainBet.style.color = "green";
        mainBet.textContent = `+$${win*2}`;
        endGameScreen.style.display = "block";
        break;
      case 2: // PUSH
        updateMoney(win) // Return the player's bet
        resultMessage.textContent = `Push!`;
        mainBet.style.color = "white";
        mainBet.textContent = `+$${win}`;
        endGameScreen.style.display = "block";
        break;
      default:
        endGameScreen.style.display = "block";
        break;
    }
    
    continueBtn.style.display = "block";

    // Wait for user to click continue
    continueBtn.onclick = () => {
      endGameScreen.style.display = "none";
      resolve(); // Resume after user continues
    };
  });
}



function reset(){
    removeAllCards()
}

// Duplicate code from poker.js - Checks if the user has enough money for a bet, if they do it deducts the money
// Returns true if the user has enough money, Alerts user and returns false otherwise
function checkMoney(bet) {
    if (isNaN(bet)) {
        alert("Please enter a valid number as a bet")
        return false
    }
    
    let money = parseInt(sessionStorage.getItem('money'), 10)
    if (money < 1 || money < bet) {
        alert("You do not have enough money for this action")
        return false
    }

    updateMoney(-bet)
    return true
}

function updateMoney(increaseAmount) {
    const money = parseInt(sessionStorage.getItem('money'), 10)
    sessionStorage.setItem('money', (money + increaseAmount).toString())
    document.querySelector("#money").textContent = `$${sessionStorage.getItem("money")}`; // Changes #money from Nav component
}