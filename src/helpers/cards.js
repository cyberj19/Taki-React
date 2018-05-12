// card helper file
// That file define the available cards for each group

const CARDS = {
    STOP: "STOP",
    TAKI: "TAKI",
    PLUS: "+",
    COLOR: "COLOR"
};

const regularCards = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", CARDS.PLUS, CARDS.STOP, CARDS.TAKI
];

const unColoredCards = [
    CARDS.COLOR,
    CARDS.TAKI
];
const cardsColors = [
    "red", "blue", "green", "yellow"
];

const UCOLORED_COLOR = "none";


export default {CARDS, regularCards, unColoredCards, cardsColors, UCOLORED_COLOR};