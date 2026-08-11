var assert = require("assert");
var PokerHand = require("../pokerHand.js");

/**
 * test
 */
describe("Rank a Royal Flush", function () {
  it("Return royal flush when hand given", function () {
    var hand = new PokerHand("As Ks Qs Js 10s");
    assert.equal(hand.getRank(), "Royal Flush");
  });
});

/**
 * test
 */
describe("Rank a Pair", function () {
  it("Return one pair when hand given", function () {
    var hand = new PokerHand("Ah As 10c 7d 6s");

    assert.equal(hand.getRank(), "One Pair");
  });
});

/**
 * test
 */
describe("Rank Two Pair", function () {
  it("Return two pair when hand given", function () {
    var hand = new PokerHand("Kh Kc 3s 3h 2d");

    assert.equal(hand.getRank(), "Two Pair");
  });
});

/**
 * test
 */
describe("Rank A Flush", function () {
  var hand = new PokerHand("Kh Qh 6h 2h 9h");

  it("Return flush when hand given", function () {
    assert.equal(hand.getRank(), "Flush");
  });
});

// More tests go here ---------------------------------------------
/**
 * test
 */
describe("Rank A Straight Flush", function () {
  var hand = new PokerHand("Jh Qh 10h 8h 9h");

  it("Return straight flush when hand given", function () {
    assert.equal(hand.getRank(), "Straight Flush");
  });
});

/**
 * test
 */
describe("Rank A Straight", function () {
  var hand = new PokerHand("5s Ah 3h 2c 4h");

  it("Return straight when hand given, Ace low", function () {
    assert.equal(hand.getRank(), "Straight");
  });
});

/**
 * test
 */
describe("Rank A Straight", function () {
  var hand = new PokerHand("Ks Ah Qh 10c Jh");

  it("Return straight when hand given, Ace high", function () {
    assert.equal(hand.getRank(), "Straight");
  });
});

/**
 * test
 */
describe("Rank A Full House", function () {
  var hand = new PokerHand("Kc Kd Kh 4s 4c");

  it("Return full house when hand given", function () {
    assert.equal(hand.getRank(), "Full House");
  });
});

/**
 * test
 */
describe("Rank A Four of a Kind", function () {
  var hand = new PokerHand("Kc Kd Kh Ks 8c");

  it("Return four of a kind when hand given", function () {
    assert.equal(hand.getRank(), "Four of a Kind");
  });
});

/**
 * test
 */
describe("Rank A Three of a Kind", function () {
  var hand = new PokerHand("Kc Kd Kh 2s 8c");

  it("Return three of a kind when hand given", function () {
    assert.equal(hand.getRank(), "Three of a Kind");
  });
});

/**
 * test
 */
describe("Rank A High Card", function () {
  var hand = new PokerHand("Kc Qc 6s 4s 2c");

  it("Return high card when hand given", function () {
    assert.equal(hand.getRank(), "High Card");
  });
});

/**
 * test -- uncomment for error throwing if an array is used instead of string
 */
// describe("Rank A High Card", function () {
//   var hand = new PokerHand(["Kc", "Qc", "6s", "4s", "2c"]);

//   it("Return high card when hand given", function () {
//     assert.equal(hand.getRank(), "High Card");
//   });
// });
/**
 * test -- uncomment for error throwing if hand is not 5 cards
 */
// describe("Rank A High Card", function () {
//   var hand = new PokerHand("Kc Qc 6s 4s");

//   it("Return high card when hand given", function () {
//     assert.equal(hand.getRank(), "High Card");
//   });
// });
