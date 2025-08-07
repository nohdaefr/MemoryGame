const symbols = ['🍎','🍌','🍇','🍒','🍉','🥝','🍍','🍋'];
let cards = [...symbols, ...symbols];
cards = cards.sort(() => 0.5 - Math.random());

const gameBoard = document.getElementById('game-board');
let flippedCards = [];
let matched = 0;
let moves = 0;

function createCard(symbol) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.symbol = symbol;
  card.textContent = '?';

  card.addEventListener('click', () => {
    if (card.classList.contains('flipped') || flippedCards.length === 2) return;

    card.classList.add('flipped');
    card.textContent = symbol;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      moves++;
      document.getElementById('moves').textContent = moves;
      const [first, second] = flippedCards;

      if (first.dataset.symbol === second.dataset.symbol) {
        matched += 2;
        flippedCards = [];
        if (matched === cards.length) {
          setTimeout(() => alert('🎉 ניצחת!'), 300);
        }
      } else {
        setTimeout(() => {
          first.classList.remove('flipped');
          second.classList.remove('flipped');
          first.textContent = '?';
          second.textContent = '?';
          flippedCards = [];
        }, 1000);
      }
    }
  });

  return card;
}

cards.forEach(symbol => {
  const card = createCard(symbol);
  gameBoard.appendChild(card);
});
