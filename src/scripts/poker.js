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
let canSelectCards = false; // Whether the user can select cards to keep

// Function to generate image paths for each card
function generateCardImagePaths(cards) {
    const cardImages = {};

    cards.forEach(title => {
        cardImages[title] = `/cards/${title}.svg`;
    });

    return cardImages;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Gives each card const its respective image path
function initializeCards(cards, rowNumber) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row', `row-${rowNumber}`); // Assign a class for the row number
    rowDiv.id = `row-${rowNumber}`; // Assigning a unique ID to each row

    let cardNumber = 1;
    cards.forEach(cardTitle => {
        const img = document.createElement('img');
        img.src = cardImages[cardTitle];
        img.alt = cardTitle;
        img.classList.add('card'); // Add class for row
        img.classList.add(`row-${rowNumber}`); // Add class for row
        img.id = `card-${rowNumber}-${cardNumber}`; // Assign an ID based on row and card number
        rowDiv.appendChild(img);
        cardNumber++;
    });
    return rowDiv;
}

const cardsContainer = document.querySelector('.cards');

// Generate and append the Hand
function dealHands(selectedCards, rows) {
    const cardsPerRow = Math.ceil(selectedCards.length / rows);
    let currentRow = 1;
    let currentIndex = 0; // current card in row
    const keptCards = document.querySelectorAll('.keep');
    const keptCols = getKeptCols(keptCards);
    cardsContainer.innerHTML = '';

    while (currentRow <= rows && currentIndex < selectedCards.length) {
        const rowCardsCount = Math.min(cardsPerRow, selectedCards.length - currentIndex);
        const rowCards = selectedCards.slice(currentIndex, currentIndex + rowCardsCount);

        let keptIndex = 0;
        for (let i = 0; i < rowCards.length; i++) {
            if (keptCols.includes((i + 1).toString())) {
                rowCards[i] = keptCards[keptIndex].alt; // Replace with the corresponding kept card name (alt attribute)
                keptIndex++;
            }
        }
        const rowElement = initializeCards(rowCards, currentRow);
    
        cardsContainer.appendChild(rowElement);

        currentIndex += rowCardsCount;
        currentRow++;
        
        // Add 2 line breaks after each row
        for (let i = 0; i < 2; i++) cardsContainer.appendChild(document.createElement('br'));
    }
}

function getKeptCols(keptCards) {
    const keptCols = [];
    for (const card of keptCards) {
        const cardId = card.id;
        const cardCol = cardId.split('-')[2];
        keptCols.push(cardCol);
    }
    console.log(keptCols)
    return keptCols;
}

const cardImages = generateCardImagePaths(cards);
const shuffledCards = shuffleArray(cards);
const selectedCards = []

// Start game by clicking draw
document.querySelector('.draw').addEventListener('click', startRound);
document.querySelector('.redraw').addEventListener('click', dealRedraw);

function startRound() {
    resetGame();
    const startingCards = []
    const splicedCards = shuffledCards.slice(0, cardsPerHand);
    const hand = shuffledCards.splice(0, cardsPerHand);
    startingCards.push(...hand);
    canSelectCards = true; // lazy toggle method CHANGE
    dealHands(startingCards, 1);
    setUserCanSelectCards(true);
    toggleDrawRedraw();

    // End of round replenish & reshuffle cards
    shuffledCards.push(...splicedCards);
    shuffleArray(shuffledCards);
}

function handleClick() {
    this.classList.toggle('keep'); // Toggle the "keep" class on the clicked card
}

// Make sure only either draw or redraw is visible
function dealRedraw() {
    const numHands = parseInt(document.querySelector('.num-hands').textContent);
    toggleDrawRedraw();
    setUserCanSelectCards(false);

    // Take exactly as many cards as needed out of shuffled cards
    for (let i = 0; i < numHands; i++) {
        const startIndex = i * cardsPerHand;
        const hand = shuffledCards.slice(startIndex, startIndex + cardsPerHand);
        selectedCards.push(...hand);
    }

    dealHands(selectedCards, numHands);
    shuffleArray(shuffledCards);
}

const toggleDrawRedraw = () => {
    const drawButton = document.querySelector('.draw');
    const redrawButton = document.querySelector('.redraw');
    drawButton.classList.toggle('hide');
    redrawButton.classList.toggle('hide');
}

function setUserCanSelectCards(canCurrentlySelect) {
    const firstRowCards = document.querySelectorAll('.row-1 img');
    if (canCurrentlySelect) {
        for (const card of firstRowCards)
            card.addEventListener('click', handleClick);
    } else {
        for (const card of firstRowCards)
            card.removeEventListener('click', handleClick);
    }
}

function resetGame() {
    cardsContainer.innerHTML = '';
    
    selectedCards.length = 0;
    
    canSelectCards = false;

    // Optionally, reset any UI elements or game state as needed
}

// Allow user to change number of hands
document.querySelector('.hands').addEventListener('click', toggleNumHands);
function toggleNumHands() {
    const numHandsElement = document.querySelector('.num-hands');
    let numHands = parseInt(numHandsElement.textContent);
    switch (numHands) {
        case 1:
            numHands = 3;
            break;
        case 3:
            numHands = 5;
            break;
        default: // 5
            numHands = 1;
            break;
    }

    numHandsElement.innerHTML = numHands;
}

// Allow user to change bet amount
document.querySelector('.bet').addEventListener('click', toggleBetAmount);
function toggleBetAmount() {
    const betAmountElement = document.querySelector('.bet-amount');
    let betAmount = parseInt(betAmountElement.textContent);

    switch (betAmount) {
        case 10: case 100:
            betAmount = betAmount * 5;
            break;
        case 50: case 500:
            betAmount = betAmount * 2;
            break;
        default: // 1000
            betAmount = 10;
    }

    betAmountElement.innerHTML = betAmount;
}
