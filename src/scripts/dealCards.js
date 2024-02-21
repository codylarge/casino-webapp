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

function initializeCards(cards, rowNumber) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row', `row-${rowNumber}`); // Assign a class for the row number
    rowDiv.id = `row-${rowNumber}`; // Assigning a unique ID to each row

    let cardNumber = 1;
    cards.forEach(cardTitle => {
        const img = document.createElement('img');
        img.src = cardImages[cardTitle];
        img.alt = cardTitle;
        img.classList.add(`row-${rowNumber}`); // Add class for row
        img.id = `card-${rowNumber}-${cardNumber}`; // Assign an ID based on row and card number
        rowDiv.appendChild(img);
        cardNumber++;
    });
    return rowDiv;
}

const cardsContainer = document.querySelector('.cards');

// Generate and append the Hand
function dealHand(selectedCards, rows) {
    const cardsPerRow = Math.ceil(selectedCards.length / rows);
    let currentRow = 1;
    let currentIndex = 0;

    while (currentRow <= rows && currentIndex < selectedCards.length) {
        // Calculate the number of cards for the current row. 
        // This is usually cardsPerRow, except for possibly the last iteration, 
        // where it might be less if the number of cards isn't evenly divisible.
        const rowCardsCount = Math.min(cardsPerRow, selectedCards.length - currentIndex);
        const rowCards = selectedCards.slice(currentIndex, currentIndex + rowCardsCount);
        const rowElement = initializeCards(rowCards, currentRow);
        cardsContainer.appendChild(rowElement);
        currentIndex += rowCardsCount;
        currentRow++;
        
        for (let i = 0; i < 2; i++) {
            cardsContainer.appendChild(document.createElement('br'));
        }
    }
}

const cardImages = generateCardImagePaths(cards);
const shuffledCards = shuffleArray(cards);
const selectedCards = shuffledCards.slice(0, 20); // Number of cards to generate
const rows = 4; // Number of rows to generate

dealHand(selectedCards, rows)
console.log(cardImages);
