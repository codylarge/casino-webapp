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
const pokerHands = [
    { hand: "Royal flush", points: 10000 },
    { hand: "4 aces", points: 5000 },
    { hand: "Straight flush", points: 1000 },
    { hand: "4 2s,3s,4s", points: 750 },
    { hand: "4 5s thru Ks", points: 500 },
    { hand: "Full house", points: 100 },
    { hand: "Flush", points: 50 },
    { hand: "Straight", points: 20 },
    { hand: "3 of a kind", points: 10 },
    { hand: "2 pairs", points: 5 },
    { hand: "Jacks or better", points: 5 }
];

const cardsPerHand = 5; // Number of cards per hand
let bet = parseInt(document.querySelector('.bet-amount').textContent); // Default bet amount
let canSelectCards = false; // Whether the user can select cards to keep
let numHands = parseInt(document.querySelector('.num-hands').textContent) // Number of hands
let cardsInPlay = []
let keptCards = [] // tuple containing kept row and the card of that row

// Start game by clicking draw
document.querySelector('.play').addEventListener('click', play)
document.querySelector('.redraw').addEventListener('click', dealRedraw)

function play() {
    resetGame()

    if(!checkMoney(bet * numHands)) {
        play()
        return
    }
    
    let deck = shuffleArray(cards)
    cardsInPlay = deck.slice(0, cardsPerHand * (numHands+1))
    let startingCards = cardsInPlay.splice(0, cardsPerHand)
    
    canSelectCards = true // lazy toggle me sutothod CHANGE

    dealHand(startingCards, 1, true)

    setGameState("start")
}

// Make sure only either draw or redraw is visible
function dealRedraw() {
    setKeptCards()
    // Take exactly as many cards as needed out of shuffled cards
    for (let i = 0; i < numHands; i++) {
        let hand = cardsInPlay.splice(i * cardsPerHand, cardsPerHand)
        console.log("Hand: " + hand)
        let payout = calculatePayout(hand)
        console.log("payout:" + payout)

        dealHand(hand, i + 1)
    }
    setGameState("end")
}

// Returns if the given column is in the current keet list
function keptColumn(column) {
    let cardInColumn
    if(typeof column === "string") 
        cardInColumn = keptCards[parseInt(column)]
    else 
        cardInColumn = keptCards[column]
    if (cardInColumn) 
        return cardInColumn
    return null
}

const cardsContainer = document.querySelector('.cards');
// Generate and append the Hand
function dealHand(hand, currentRow, start = false) {
    let currentIndex = 0; // current card in row
    cardsContainer.innerHTML = ''
    
    //console.log("Hand: " + hand)
    if(!start) {
        for (let i = 0; i < cardsPerHand; i++) {
            if(keptColumn((i))) {
                hand[i] = keptCards[i]
            }
        }
    }

    initializeCards(hand, currentRow);

    // Add 2 line break after each row
    for (let i = 0; i < 2; i++) cardsContainer.appendChild(document.createElement('br'))
}

// Gives each card const its respective image path
function initializeCards(cards, rowNumber) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row', `row-${rowNumber}`); // Assign a class for the row number
    rowDiv.id = `row-${rowNumber}` // Assigning a unique ID to each row

    let cardNumber = 1;
    cards.forEach(cardTitle => {
        const img = document.createElement('img')
        if (keptColumn(cardNumber - 1)) {
            img.classList.add('kept') // kept class represents a card of keep class AFTER player has redrawn
        }

        img.src = cardImages[cardTitle]
        img.alt = cardTitle
        img.classList.add('card', `row-${rowNumber}`) // Add classes for card and row
        img.id = `card-${rowNumber}-${cardNumber}` // Assign an ID based on row and card number
        rowDiv.appendChild(img)
        cardNumber++
    });

    cardsContainer.appendChild(rowDiv);
}

function clickCard() {
    this.classList.toggle('keep') // Toggle the "keep" class on the clicked card
}

// Set game buttons between start and end states
function setGameState(state) {
    const betButton = document.querySelector('.bet')
    const handsButton = document.querySelector('.hands')
    const drawButton = document.querySelector('.play')
    const redrawButton = document.querySelector('.redraw')
    const cards = document.querySelectorAll('.card img')
    const firstRowCards = document.querySelectorAll('.row-1 img');

    drawButton.classList.toggle('hide')
    redrawButton.classList.toggle('hide')
    switch (state) {
        case "start": // 
            console.log("GameStarted")
            betButton.disabled = true;
            handsButton.disabled = true;
            for (const card of firstRowCards){
                card.addEventListener('click', clickCard)
            }
            break;

        case "end":
            console.log("GameEnded")
            betButton.disabled = false;
            handsButton.disabled = false;
            for (const card of firstRowCards)
                card.removeEventListener('click', clickCard)
            keptCards = []
            break;
    }
}

// Function to generate image paths for each card
function generateCardImagePaths(cards) {
    const cardImages = {}

    cards.forEach(title => {
        cardImages[title] = `/cards/${title}.svg`
    });

    return cardImages
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function setKeptCards() {
    const keep = document.querySelectorAll('.keep')
    for (const card of keep) {
        const cardName = card.alt
        const cardCol = card.id.split('-')[2]
        keptCards[cardCol - 1] = cardName;
    }
}

const cardImages = generateCardImagePaths(cards)
const shuffledCards = shuffleArray(cards)
const selectedCards = []

function calculatePayout(hand) {
    const winDisplay = document.querySelector('.win-counter')

    const HandWin = evaluateHand(hand)
    return HandWin;

    winDisplay.textContent = `$${HandWin * bet / 10}`
    updateMoney(HandWin * bet / 10)
    // Calculate the payout based on the hand
}

// checks for pairs, full house and 4 of a kind. 
function evaluateByRow(hand) {
    const cardValuesInPlay = getCards(0, hand) // Card values in hand
    const handCards = hand
    const betAmount = bet
    let totalWin = 0;

    //const currentRow = document.getElementById(`row-${i + 1}`)
    //const sortedHand = cardValuesInPlay.slice(i * cardsPerHand, (i + 1) * cardsPerHand).sort((a, b) => a - b); // Get the sorted hand (5 cards)
    //const handCards = cardsInPlay.slice(i * cardsPerHand, (i + 1) * cardsPerHand) // Cards in form of jack_of_diamonds etc
    const winnings = evaluateHand(handCards, sortedHand)

    if (winnings != null) {
        let winningHand = winnings[0]
        let winAmount = winnings[1]
        totalWin += winAmount
        const winDisplay = document.createElement('div')
        //winDisplay.textContent = `${winningHand}: ${winAmount * betAmount / 10}`; // Display the ROWS winnings
        //winDisplay.classList.add('win-display');
        currentRow.parentNode.insertBefore(winDisplay, currentRow.nextSibling); // remove .nextSibling to display below row
    }
    return totalWin
}

function checkMoney(bet) {
    let money = parseInt(sessionStorage.getItem('money'))
    if (money < 1 || money < bet) {
        alert("You do not have enough to place this bet")
        return false
    }
    return true
}

// Checks occurances of every card in the hand returns in form: {2: 1, 3: 2, 4: 1, K: 1}
function countOccurrences(hand) {
    const occurrences = {};
    for (const card of hand) {
        occurrences[card] = (occurrences[card] || 0) + 1; // Fill the occurance array with the number of times each card appears
    }
    return occurrences;
}

// Looks at all the cards in hand returns the most valuable hand. If no special hand, returns null
function evaluateHand(hand) {
    const sortedHand = getCards(0, hand)
    const handOccurrences = countOccurrences(sortedHand)
    let threeOfAKind = 0
    let lowPairs = 0
    let jackOrBetterPairs = 0
    let isRoyal = true

    // Check Straight/Flush
    const isFlush = checkFlush(hand)
    const isStraight = checkStraight(sortedHand)

    // Check for 4 of a kind, 3 of a kind, 2 pair, and Jacks or better
    for (const card in handOccurrences) {
        // How many times each card appears in the hand
        const occurrences = handOccurrences[card];
        const cardValue = parseInt(card)

        // Can return these immediately to save time
        if (occurrences === 4) {
            if (card === "14") return getHandTuple("4 aces")
            else if (card === "2" || card === "3" || card === "4") return getHandTuple("4 2s,3s,4s")
            else return getHandTuple("4 5s thru Ks")
        }

        // ROYAL
        if (!cardValue > 10) isRoyal = false;

        // 3 OF A KIND
        else if (occurrences === 3) threeOfAKind++;

        // PAIRS
        else if (occurrences === 2) {
            if (card === "11" || card === "12" || card === "13" || card === "14") jackOrBetterPairs++;
            else lowPairs++;
        }
    }

    if (isRoyal && isFlush && isStraight) return getHandTuple("royal");
    if (isStraight && isFlush) return getHandTuple("straight flush");
    if (threeOfAKind > 0 && (lowPairs > 0 || jackOrBetterPairs > 0)) return getHandTuple("full house");
    if (isFlush) return getHandTuple("flush");
    if (isStraight) return getHandTuple("straight");
    if (threeOfAKind > 0) return getHandTuple("3 of a kind");
    if (lowPairs > 1 || jackOrBetterPairs > 1 || (lowPairs > 0 && jackOrBetterPairs > 0)) return getHandTuple("2 pairs");
    if (jackOrBetterPairs > 0) return getHandTuple("Jacks or better");

    return null;
}

// Update money and money display to go up by increaseAmount
function updateMoney(increaseAmount) {
    const money = parseInt(sessionStorage.getItem('money'))
    sessionStorage.setItem('money', (money + increaseAmount).toString())
    document.querySelector("#money").textContent = `$${sessionStorage.getItem("money")}`; // Changes #money from Nav component
}

function checkFlush(cardsInPlay) {
    const suits = cardsInPlay.map(card => card.split('_')[2]) // Get the suits from the card filenames
    const flush = suits.every(suit => suit === suits[0]) // If all suits are the same, return true, else false
    return flush
}

function checkStraight(sortedHand) {
    let lastCardNum = 0
    for (let cardNum of sortedHand) {
        if (lastCardNum === 0) lastCardNum = cardNum
        else if (cardNum !== lastCardNum + 1) return false
        lastCardNum = cardNum
    }
    return true
}

function resetGame() {
    cardsContainer.innerHTML = ''
    canSelectCards = false
}

// Allow user to change number of hands
document.querySelector('.hands').addEventListener('click', toggleNumHands)
function toggleNumHands() {
    const numHandsElement = document.querySelector('.num-hands')
    switch (numHands) {
        case 1:
            numHands = 3
            break
        case 3:
            numHands = 5
            break
        default: // 5
            numHands = 1
            break
    }

    numHandsElement.innerHTML = numHands;
}

// Allow user to change bet amount
document.querySelector('.bet').addEventListener('click', toggleBetAmount)
function toggleBetAmount() {
    const betAmountElement = document.querySelector('.bet-amount')
    let desiredBetAmount = parseInt(betAmountElement.textContent)

    switch (desiredBetAmount) {
        case 10: case 100:
            bet = bet * 5
            break;
        case 50: case 500:
            bet = bet * 2
            break;
        default: // 1000
            bet = 10
    }
    betAmountElement.innerHTML = bet;
}

// Given a card img, return the card's alt attribute (full name) or numeric value (11,12,13,14 -> J,Q,K,A)
function getCards(verbosity = 1, cards = cardsContainer.querySelectorAll('img')) {
    let cardValues = []
    if (verbosity === 1) { // Return cards as their alt attribute (name and suit)
        for (let card of cards) {
            cardValues.push(card.alt)
        }
        return cardValues
    }

    else if (verbosity === 0) { // Return cards as their number value
        for (let card of cards) {
            let cardValue = card.split('_')[0]
            if (cardValue === "jack") cardValue = "11"
            else if (cardValue === "queen") cardValue = "12"
            else if (cardValue === "king") cardValue = "13"
            else if (cardValue === "ace") cardValue = "14"
            cardValues.push(parseInt(cardValue))
        }
        cardValues.sort((a, b) => a - b);
        return cardValues
    }
}

function getSuitFromCard(card) {
    return card.split('_')[2]
}

function getHandTuple(handName) {
    const hand = pokerHands.find(handObj => handObj.hand.toLowerCase() == handName.toLowerCase());
    if (hand) {
        return [hand.hand, hand.points];
    } else {
        return null; // Should never happen but just in case
    }
}