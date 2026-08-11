/*
  PokerHand — takes in a 5-card hand, tells you the hand rank.

  Cards are abbreviations: capital rank then lower case suit. "As", "Kh", "7d", "10s".

  Breaking down the challenge...

  // Define Card Ranks
  // Define Card Suits
  // Define Card Hands
  // Define Hard Size
  // Identify Card
  // Identify Hands
    // Identify Flush aka same suit
      // Royal Flush  => Flush then Straight => then 10-A   (1)
      // Straight Flush => Flush then Straight              (2)
      // Flush                                              (5)
    // Identify Straight aka 5 consecutive card ranks       (6)
    // Identify Pairs aka matching card ranks
      // 4 of a Kind                                        (3)
      // Full House (3 of a kind, pair)                     (4) 
      // 3 of a Kind                                        (7)
      // 2 Pair                                             (8) 
      // Pair                                               (9)
    // else High Card                                       (10)


  Notes: I have auto format turned on in VSCode so '' changes to "".  I chose to keep my settings the same since each project/technical has different formatting.  I wanted to keep my local setup the same, but wanted to note the difference.  
    This handles cards not in sequential order.
    This handles only a string-based hand.
    This handles Ace high and Ace low straights.
    pokerHandText.js has additional tests confirming all hands are identified including Ace high/low straights.
    pokerHandTest.js has 2 additional tests commented out for testing bad data (array and wrong hand size).
*/

/* ============================================================================
   Variable Definitions --- Set the knowns
   ========================================================================= */

// Card Ranks -- rank from worst to best
const RANKS = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

// Card Suits
const SUITS = ["s", "h", "d", "c"];

// Card Hands -- rank 1 is the best hand, rank 10 the worst
const HANDS = {
  ROYAL_FLUSH: { rank: 1, name: "Royal Flush" },
  STRAIGHT_FLUSH: { rank: 2, name: "Straight Flush" },
  FOUR_OF_A_KIND: { rank: 3, name: "Four of a Kind" },
  FULL_HOUSE: { rank: 4, name: "Full House" },
  FLUSH: { rank: 5, name: "Flush" },
  STRAIGHT: { rank: 6, name: "Straight" },
  THREE_OF_A_KIND: { rank: 7, name: "Three of a Kind" },
  TWO_PAIR: { rank: 8, name: "Two Pair" },
  ONE_PAIR: { rank: 9, name: "One Pair" },
  HIGH_CARD: { rank: 10, name: "High Card" },
};

const HAND_SIZE = 5;

/* ============================================================================
   Card Identification Function --- Figure out what the card is
   ========================================================================= */

// Get the suit and card rank out of an abbreviation like "As" or "7d"
function identifyCard(token) {
  if (token.length < 2) {
    throw new Error(
      `Cannot read card "${token}" -- expected a rank and a suit`,
    );
  }

  if (token.length < 2) {
    throw new Error(
      `Cannot read card "${input}" -- expected a rank and a suit`,
    );
  }

  // Suit is always the last character, so whatever is left is the rank, handles 2 character card ranks
  const suit = token.slice(-1).toLowerCase();
  const rank = token.slice(0, -1).toUpperCase();
  const value = RANKS[rank];

  if (!SUITS.includes(suit)) throw new Error(`Unknown suit in card "${input}"`);
  if (typeof value !== "number")
    throw new Error(`Unknown rank in card "${input}"`);

  return { rank, suit, value, label: `${rank}${suit}` };
}

/* ============================================================================
   Hand Rank Functions --- Figure out what the hand is
   ========================================================================= */

/* --- Flush hand types --- */

// Same suit across the whole hand
function isFlush(cards) {
  return cards.every((card) => card.suit === cards[0].suit);
}

// 10-J-Q-K-A: a straight flush that does NOT contain a card lower than a 10
function isRoyal(cards) {
  return cards.every((card) => card.value >= 10);
}

/* --- Straight hand types --- */

// 5 consecutive card ranks. Sorts first, so the dealt order does not matter.
function isStraight(cards) {
  const values = cards.map((card) => card.value).sort((a, b) => a - b);

  // Any repeated rank kills the run
  if (new Set(values).size !== values.length) return false;

  // Straight: top and bottom sit exactly 4 apart, quicker than comparing all cards
  if (values[4] - values[0] === 4) return true;

  // Straight: where Ace plays low instead of high
  return values[0] === 2 && values[3] === 5 && values[4] === 14;
}

/* --- Pair hand types --- */

// Count how many cards share each rank, biggest group first: 4 (4 of a kind), 3+2 (full house), 3 (3 of a kind), 2+2 (2 pair), 2 (1 pair)
function groupSizes(cards) {
  const counts = new Map();
  cards.forEach((card) =>
    counts.set(card.rank, (counts.get(card.rank) || 0) + 1),
  );
  return [...counts.values()].sort((a, b) => b - a);
}

// Returns the matching hand, or null when nothing is paired at all
function identifyPairs(cards) {
  const [largest, second] = groupSizes(cards);

  if (largest === 4) return HANDS.FOUR_OF_A_KIND;
  if (largest === 3 && second === 2) return HANDS.FULL_HOUSE;
  if (largest === 3) return HANDS.THREE_OF_A_KIND;
  if (largest === 2 && second === 2) return HANDS.TWO_PAIR;
  if (largest === 2) return HANDS.ONE_PAIR;

  return null;
}

/* ============================================================================
   PokerHand class
   ========================================================================= */

class PokerHand {
  // Accepts a single space-separated string: "As Ks Qs Js 10s"
  constructor(cards) {
    this.cards = [];
    this.hand = null;

    if (cards !== undefined) this.setHand(cards);
  }

  setHand(cards) {
    this.cards = PokerHand.parse(cards);
    this.hand = this.evaluate();
    return this;
  }

  // Parsing cards to ensure a proper hand
  static parse(cards) {
    if (typeof cards !== "string") {
      throw new TypeError(
        `Hand must be a string of ${HAND_SIZE} cards, got ${typeof cards}`,
      );
    }

    const tokens = cards.trim().split(/\s+/);
    if (tokens.length !== HAND_SIZE) {
      throw new Error(
        `A hand needs exactly ${HAND_SIZE} cards, got ${tokens.length}`,
      );
    }

    const parsed = tokens.map(identifyCard);

    if (new Set(parsed.map((card) => card.label)).size !== parsed.length) {
      throw new Error("Hand contains duplicate cards");
    }

    return parsed;
  }

  /* Identify Hands */
  evaluate() {
    const cards = this.cards;

    // Identify Flush aka same suit
    if (isFlush(cards)) {
      if (isStraight(cards)) {
        return isRoyal(cards) ? HANDS.ROYAL_FLUSH : HANDS.STRAIGHT_FLUSH;
      }
      return HANDS.FLUSH;
    }

    // Identify Straight aka 5 consecutive card ranks
    if (isStraight(cards)) return HANDS.STRAIGHT;

    // Identify Pairs aka matching card ranks
    const paired = identifyPairs(cards);
    if (paired) return paired;

    // else High Card
    return HANDS.HIGH_CARD;
  }

  // Poker hand ranking -- "Royal Flush", "Two Pair", "High Card", ...
  getRank(cards) {
    if (cards !== undefined) this.setHand(cards);

    if (!this.hand) {
      throw new Error(
        "No hand to rank -- pass the cards to the constructor or to getRank()",
      );
    }

    return this.hand.name;
  }
}

module.exports = PokerHand;
