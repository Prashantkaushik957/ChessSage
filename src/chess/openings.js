// Curated ECO Opening Database — FEN prefix → Name mapping
// Covers major openings (A00-E99 subset)
export const OPENINGS = {
    // Starting Position
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR': 'Starting Position',

    // 1.e4 openings
    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR': 'King\'s Pawn (1.e4)',
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR': 'Open Game',
    'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR': 'Sicilian Defense',
    'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR': 'French Defense',
    'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR': 'Caro-Kann Defense',
    'rnbqkbnr/pppppp1p/6p1/8/4P3/8/PPPP1PPP/RNBQKBNR': 'Modern Defense',
    'rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR': 'Alekhine\'s Defense',

    // Ruy Lopez
    'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R': 'Ruy Lopez',
    'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R': 'Ruy Lopez (Morphy Defense)',

    // Italian Game
    'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R': 'Italian Game',
    'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R': 'Giuoco Piano',

    // Sicilian Variations
    'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R': 'Sicilian (2.Nf3)',
    'rnbqkbnr/pp1p1ppp/4p3/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R': 'Sicilian (Kan/Taimanov)',
    'rnbqkb1r/pp1ppppp/5n2/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R': 'Sicilian (Alapin-like)',
    'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R': 'Sicilian (Kan)',

    // 1.d4 openings
    'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR': 'Queen\'s Pawn (1.d4)',
    'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR': 'Closed Game',
    'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR': 'Queen\'s Gambit',
    'rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR': 'Queen\'s Gambit Declined',
    'rnbqkbnr/ppp1pppp/8/3P4/8/8/PPP1PPPP/RNBQKBNR': 'Queen\'s Gambit Accepted',
    'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR': 'Indian Defense (1...Nf6)',
    'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR': 'Indian Defense (2.c4)',
    'rnbqkb1r/pppp1ppp/5n2/4p3/2PP4/8/PP2PPPP/RNBQKBNR': 'Budapest Gambit',
    'rnbqkb1r/p1pppppp/1p3n2/8/2PP4/8/PP2PPPP/RNBQKBNR': 'Bogo-Indian Defense',
    'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR': 'Nimzo-Indian Defense',
    'rnbqkb1r/pp1ppppp/2p2n2/8/2PP4/8/PP2PPPP/RNBQKBNR': 'Slav Defense',

    // 1.c4 English Opening
    'rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR': 'English Opening',

    // King\'s Indian
    'rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR': 'King\'s Indian Defense',

    // Dutch Defense
    'rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR': 'Dutch Defense',

    // Nimzowitsch-Larsen
    'rnbqkbnr/pppppppp/8/8/8/1P6/P1PPPPPP/RNBQKBNR': 'Nimzowitsch-Larsen Attack',

    // Scandinavian
    'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR': 'Scandinavian Defense',

    // Grünfeld
    'rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/8/PP2PPPP/RNBQKBNR': 'Grünfeld Defense',
}
