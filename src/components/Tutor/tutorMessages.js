// Tutor "Sage" commentary messages — triggered by game events

export const TUTOR_MESSAGES = {
    welcome: [
        "Welcome! I'm Sage, your chess guide. Ready to learn?",
        "Greetings, young knight! Let's embark on a chess adventure together!",
        "Hello! I've been waiting for you. Shall we play some chess?",
    ],

    gameStart: [
        "The game begins! Remember: control the center with your pawns!",
        "Let the battle begin! Think before every move.",
        "A new game! White moves first. Choose your opening wisely.",
    ],

    openings: {
        'Italian Game': "The Italian Game! One of the oldest and most classical openings. You're in good company — Morphy played this!",
        'Ruy Lopez': "The Ruy Lopez — the 'Spanish Torture'! This puts immediate pressure on Black's center.",
        'Sicilian Defense': "The Sicilian! The most popular response to 1.e4. Black fights for the center asymmetrically.",
        'French Defense': "The French Defense! Black builds a solid pawn structure, aiming for a counterattack later.",
        'Queen\'s Gambit': "The Queen's Gambit! A refined opening — offering a pawn to gain center control.",
        'King\'s Indian Defense': "The King's Indian! A dynamic, fighting defense favored by world champions.",
        default: "Interesting opening choice! You're developing your pieces nicely.",
    },

    goodMove: [
        "Excellent move! You're thinking like a chess player!",
        "That's brilliant! You found the key idea!",
        "Very well played! You're improving rapidly!",
        "Superb! That move creates real threats!",
        "Outstanding! You're starting to see the board clearly!",
    ],

    greatMove: [
        "WOW! That's a brilliant move! Even Stockfish is impressed!",
        "Magnificent! That's a grandmaster-level idea!",
        "Incredible! You've found the winning combination!",
    ],

    blunder: [
        "Careful! That move loses material. Try to think about what your opponent can do next.",
        "Oops! That might cost you. Always check for opponent's threats first!",
        "A slip! Remember to ask: 'Does my opponent have any captures or checks?'",
    ],

    inaccuracy: [
        "Hmm, there was a stronger move here. Don't worry — keep thinking!",
        "Close, but there was a better option. Chess is a game of finding the best move!",
    ],

    check: [
        "Check! Your King is under attack — you must deal with this!",
        "Check! The King must get to safety!",
    ],

    capturePiece: [
        "Nice capture! Material advantage is important in chess.",
        "You took a piece! Keep building your advantage.",
    ],

    castling: [
        "Excellent! Castling tucks your King away safely and connects your Rooks.",
        "Good castling! King safety is crucial — well done.",
    ],

    promotion: [
        "Promotion! A pawn has become a Queen — what a journey! That pawn worked hard.",
        "Incredible! Your pawn made it all the way to promotion!",
    ],

    thinking: [
        "Hmm, let me ponder your position...",
        "Analyzing all possibilities...",
        "Calculating the best response...",
    ],

    playerWin: [
        "AMAZING! You've won! Your chess skills are blossoming beautifully!",
        "Checkmate! You played brilliantly! I'm so proud of you!",
        "Victory! You've defeated your opponent masterfully!",
    ],

    playerLose: [
        "Don't worry! Every loss is a lesson. Let's review the game together!",
        "That was a tough game. In chess, defeat teaches more than victory!",
        "Good fight! Review the game in Analysis mode to see where to improve.",
    ],

    draw: [
        "A well-fought draw! Both sides played with equal determination.",
        "The game is drawn. You held your ground well!",
    ],

    puzzleSolve: [
        "PERFECT! You solved the puzzle! Your tactical vision is growing!",
        "Brilliant! You found the winning combination!",
        "Excellent! That's exactly what a strong player would play!",
    ],

    puzzleFail: [
        "Not quite! Take a look at the position again. What pieces are undefended?",
        "Almost! Try to find a move that creates multiple threats at once.",
        "Hmm, that's not it. Hint: look for a forcing move like a check or capture.",
    ],

    tips: [
        "💡 Tip: Control the center! The squares e4, d4, e5, d5 are the heart of the board.",
        "💡 Tip: Develop your pieces in the opening. Don't move the same piece twice!",
        "💡 Tip: Castle early to keep your King safe!",
        "💡 Tip: Rooks love open files! Place them where the center is open.",
        "💡 Tip: A Knight on the rim is dim! Keep your Knights toward the center.",
        "💡 Tip: Always ask: 'What does my opponent's last move threaten?'",
        "💡 Tip: Passed pawns are powerful! Support them as they march to promotion.",
        "💡 Tip: In the endgame, activate your King! It becomes a fighting piece.",
    ],

    idle: [
        "Take your time — chess rewards careful thinking!",
        "Every move matters. Think it through!",
        "I'm here whenever you need guidance!",
        "Chess is 99% tactics. Keep your eyes open!",
    ],
}

export function getRandomMessage(category) {
    const messages = TUTOR_MESSAGES[category]
    if (!messages || !Array.isArray(messages)) return ''
    return messages[Math.floor(Math.random() * messages.length)]
}

export function getOpeningMessage(openingName) {
    return TUTOR_MESSAGES.openings[openingName] || TUTOR_MESSAGES.openings.default
}
