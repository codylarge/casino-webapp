// Define your card titles
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

// Function to create img elements and store them in an object
function generateCardImages(cards) {
    const cardImages = {};

    cards.forEach(title => {
        const img = new Image();
        img.src = `/cards/${title}.svg`;
        img.alt = title;
        cardImages[title] = img;
    });

    return cardImages;
}

// Store the card images globally
window.cardImages = generateCardImages(cards);

document.addEventListener('DOMContentLoaded', async () => {
    // Ensure all images are preloaded
    const promises = Object.values(window.cardImages).map(img => {
        return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
    });

    try {
        await Promise.all(promises);
        console.log("All card images preloaded and available globally.");
    } catch (error) {
        console.error("Error preloading some card images:", error);
    }
});
