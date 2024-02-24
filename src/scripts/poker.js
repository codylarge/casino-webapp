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
const cardsPerHand = 5; // Number of cards per hand
let betAmount = 10; // Default bet amount

let canSelectCards = false; // Whether the user can select cards to keep
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

// Gives each card const its respective image path
function initializeCards(cards, rowNumber, keptCols) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row', `row-${rowNumber}`); // Assign a class for the row number
    rowDiv.id = `row-${rowNumber}` // Assigning a unique ID to each row

    let cardNumber = 1;
    cards.forEach(cardTitle => {
        const img = document.createElement('img')
        if (keptCols.includes(cardNumber.toString())) {
            img.classList.add('kept') // kept class represents a card of keep class AFTER player has redrawn
        }
        img.src = cardImages[cardTitle]
        img.alt = cardTitle
        img.classList.add('card', `row-${rowNumber}`) // Add classes for card and row
        img.id = `card-${rowNumber}-${cardNumber}` // Assign an ID based on row and card number
        rowDiv.appendChild(img)
        cardNumber++
    });
    return rowDiv;
}

const cardsContainer = document.querySelector('.cards');

// Generate and append the Hand
function dealHands(selectedCards, rows) {
    const cardsPerRow = Math.ceil(selectedCards.length / rows)
    let currentRow = 1
    let currentIndex = 0; // current card in row
    const keptCards = document.querySelectorAll('.keep')
    const keptCols = getKeptCols(keptCards)
    cardsContainer.innerHTML = ''

    while (currentRow <= rows && currentIndex < selectedCards.length) {
        const rowCardsCount = Math.min(cardsPerRow, selectedCards.length - currentIndex)
        const rowCards = selectedCards.slice(currentIndex, currentIndex + rowCardsCount)

        let keptIndex = 0;
        for (let i = 0; i < rowCards.length; i++) {
            if (keptCols.includes((i + 1).toString())) {
                rowCards[i] = keptCards[keptIndex].alt // Replace with the corresponding kept card name (alt attribute)
                keptIndex++
            }
        }

        const rowElement = initializeCards(rowCards, currentRow, keptCols);
        cardsContainer.appendChild(rowElement);

        currentIndex += rowCardsCount
        currentRow++
        
        // Add 2 line breaks after each row
        for (let i = 0; i < 2; i++) cardsContainer.appendChild(document.createElement('br'))
    }
}

function getKeptCols(keptCards) {
    const keptCols = [];
    for (const card of keptCards) {
        const cardId = card.id
        const cardCol = cardId.split('-')[2]
        keptCols.push(cardCol)
    }
    console.log(keptCols)
    return keptCols
}

const cardImages = generateCardImagePaths(cards)
const shuffledCards = shuffleArray(cards)
const selectedCards = []

// Start game by clicking draw
document.querySelector('.play').addEventListener('click', startRound)
document.querySelector('.redraw').addEventListener('click', dealRedraw)

function startRound() {
    resetGame()
    const startingCards = []
    const splicedCards = shuffledCards.slice(0, cardsPerHand)
    const hand = shuffledCards.splice(0, cardsPerHand)
    startingCards.push(...hand)
    canSelectCards = true // lazy toggle method CHANGE
    dealHands(startingCards, 1)
    setUserCanSelectCards(true)
    toggleDrawRedraw()

    // End of round replenish & reshuffle cards
    shuffledCards.push(...splicedCards)
    shuffleArray(shuffledCards)
}

function handleClick() {
    this.classList.toggle('keep') // Toggle the "keep" class on the clicked card
}

// Make sure only either draw or redraw is visible
function dealRedraw() {
    const numHands = parseInt(document.querySelector('.num-hands').textContent)
    toggleDrawRedraw()
    setUserCanSelectCards(false)

    // Take exactly as many cards as needed out of shuffled cards
    for (let i = 0; i < numHands; i++) {
        const startIndex = i * cardsPerHand
        const hand = shuffledCards.slice(startIndex, startIndex + cardsPerHand)
        selectedCards.push(...hand)
    }

    dealHands(selectedCards, numHands)
    calculatePayout(selectedCards)
    shuffleArray(shuffledCards)
}

function setUserCanSelectCards(canCurrentlySelect) {
    const firstRowCards = document.querySelectorAll('.row-1 img')
    if (canCurrentlySelect) {
        for (const card of firstRowCards)
            card.addEventListener('click', handleClick)
    } else {
        for (const card of firstRowCards)
            card.removeEventListener('click', handleClick)
    }
}

function resetGame() {
    cardsContainer.innerHTML = ''
    
    selectedCards.length = 0
    
    canSelectCards = false
}

const toggleDrawRedraw = () => {
    const drawButton = document.querySelector('.play')
    const redrawButton = document.querySelector('.redraw')
    drawButton.classList.toggle('hide')
    redrawButton.classList.toggle('hide')
}

// Allow user to change number of hands
document.querySelector('.hands').addEventListener('click', toggleNumHands)
function toggleNumHands() {
    const numHandsElement = document.querySelector('.num-hands')
    let numHands = parseInt(numHandsElement.textContent)
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
            betAmount = betAmount * 5
            break;
        case 50: case 500:
            betAmount = betAmount * 2
            break;
        default: // 1000
            betAmount = 10
    }
    betAmountElement.innerHTML = betAmount;
}

function getCardsFromContainer(verbosity = 1) { 
    const cardsInPlay = cardsContainer.querySelectorAll('img') // The ALT of the image is the card name e.g. "2_of_clubs"
    let cardValues = []
    if(verbosity === 1) { // Return cards as their alt attribute (name and suit)
        for(let card of cardsInPlay) {
            cardValues.push(card.alt)
        }
        return cardValues
    }

    else if(verbosity === 0) { // Return cards as their number value
        for(let card of cardsInPlay) {
            let cardValue = card.alt.split('_')[0] // Get the card name from the alt attribute
            if(cardValue === "jack") cardValue = "11"
            else if (cardValue === "queen") cardValue = "12"
            else if (cardValue === "king") cardValue = "13"
            else if (cardValue === "ace") cardValue = "14"
            cardValues.push(parseInt(cardValue))
        }
        return cardValues
    }
}

function calculatePayout(hands, keptCards) {
    const bet = parseInt(document.querySelector('.bet-amount').textContent)
    const money = sessionStorage.getItem('money')
    const payout = 0
    console.log("money: ", money, "bet: ", bet)
    const cardsInPlay = getCardsFromContainer(1)
    const cardValuesInPlay = getCardsFromContainer(0)
    console.log(cardsInPlay)
    
    evaluateByRow(cardsInPlay, cardValuesInPlay)
    // Calculate the payout based on the hand
    return payout;
}

// checks for pairs, full house and 4 of a kind. 
function evaluateByRow(cardsInPlay, cardValuesInPlay) {
    console.log("Numeric:" + cardValuesInPlay)
    const rows = cardValuesInPlay.length / cardsPerHand;
    for(let i = 0; i < rows; i++) {
        const sortedHand = cardValuesInPlay.slice(i * cardsPerHand, (i + 1) * cardsPerHand).sort((a, b) => a - b); // Get the sorted hand (5 cards)
        const handOccurances = countOccurrences(sortedHand)
        const winnings = evaluateHand(handOccurances, cardsInPlay, sortedHand)
        console.log("row " + parseInt(i+1) + " win: " + winnings)
    }
    return 0
}

// Gets hand in number form
function countOccurrences(hand) {
    const occurrences = {}; // {0 0 0 0 0}
    for (const card of hand) {
        occurrences[card] = (occurrences[card] || 0) + 1; // Fill the occurance array with the number of times each card appears
    }
    return occurrences;
}

// Looks at all the cards in hand returns the most valuable hand (4 of a kind, 3 of a kind, 2 pair, Jacks or better) 
function evaluateHand(handOccurrences, cardsInPlay, sortedHand) {
    // NOT DETECTING STRAIGHT/FLUSH... FIX!
    let quadAces = 0
    let quadLow = 0 // 2's 3's & 4's ONLY
    let quadHigh = 0 // 5's thru Kings
    let threeOfAKind = 0
    let lowPairs = 0
    let jackOrBetterPairs = 0

    let isRoyal = true

    const isFlush = checkFlush(cardsInPlay)
    const isStraight = checkStraight(sortedHand)

    // Check for 4 of a kind, 3 of a kind, 2 pair, and Jacks or better
    for (const card in handOccurrences) 
    {
        // How many times each card appears in the hand
        const occurrences = handOccurrences[card];
        const cardValue = parseInt(card)

        // ROYAL
        if(!cardValue > 10) isRoyal = false;
        // FLUSH

        // 4 OF A KIND
        if (occurrences === 4) {
            if (card === "14") quadAces++;
            else if (card === "2" || card === "3" || card === "4") quadLow++;
            else quadHigh++;
        }
        // 3 OF A KIND
        else if (occurrences === 3) threeOfAKind++;
        // JACKS / 2 PAIR
        else if (occurrences === 2) {
            if (card === "11" || card === "12" || card === "13" || card === "14") jackOrBetterPairs++;
            else lowPairs++;
        } 
    }

    if(isRoyal && isFlush && isStraight) return 10000;
    if(quadAces > 0) return 5000;
    if(isStraight && isFlush) return 1000;
    if(quadLow > 0) return 750;
    if(quadHigh > 0) return 500;
    if(threeOfAKind > 0 && (lowPairs > 0 || jackOrBetterPairs > 0)) return 100; // Full House
    if(isFlush) return 50;
    if(isStraight) return 20;
    if(threeOfAKind > 0) return 10;
    if(lowPairs > 1 || jackOrBetterPairs > 1 || (lowPairs > 0 && jackOrBetterPairs > 0)) return 5; // 2 Pair
    if(jackOrBetterPairs > 0) return 5;

    return 0;
}

function checkFlush(cardsInPlay) {
    const suits = cardsInPlay.map(card => card.split('_')[2]) // Get the suits from the card filenames
    const flush = suits.every(suit => suit === suits[0]) // If all suits are the same, return true, else false
    console.log("flush?" + flush)
    return flush
}

function checkStraight(sortedHand) {
    const isStraight = sortedHand.every((card, index, hand) => {
        if (index === 0) return true
        return card === hand[index - 1] + 1
    })
    console.log("straight?" + isStraight)
    return isStraight
}

function getSuitFromCard(card) {
    return card.split('_')[2]
}