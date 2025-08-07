
import React, { useState } from 'react';
import './MemoryGame.css';

const symbols = ['🍎','🍌','🍇','🍒','🍉','🥝','🍍','🍋'];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createCards() {
  const cards = [...symbols, ...symbols].map((symbol, idx) => ({
    id: idx + 1,
    symbol,
    flipped: false,
    matched: false,
  }));
  return shuffle(cards);
}

function MemoryGame() {
  const [cards, setCards] = useState(createCards());
  const [flipped, setFlipped] = useState([]); // indices
  const [moves, setMoves] = useState(0);
  const [isBusy, setIsBusy] = useState(false);

  const handleCardClick = (idx) => {
    if (isBusy || cards[idx].flipped || cards[idx].matched || flipped.length === 2) return;
    const newFlipped = [...flipped, idx];
    const newCards = cards.map((card, i) =>
      i === idx ? { ...card, flipped: true } : card
    );
    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsBusy(true);
      setMoves((m) => m + 1);
      setTimeout(() => {
        const [i1, i2] = newFlipped;
        if (newCards[i1].symbol === newCards[i2].symbol) {
          setCards((prev) =>
            prev.map((card, i) =>
              i === i1 || i === i2 ? { ...card, matched: true } : card
            )
          );
        } else {
          setCards((prev) =>
            prev.map((card, i) =>
              i === i1 || i === i2 ? { ...card, flipped: false } : card
            )
          );
        }
        setFlipped([]);
        setIsBusy(false);
      }, 1000);
    }
  };

  const handleRestart = () => {
    setCards(createCards());
    setFlipped([]);
    setMoves(0);
    setIsBusy(false);
  };

  const isWin = cards.every((card) => card.matched);

  return (
    <div className="memory-container" dir="rtl">
      <h1>🧠 משחק זיכרון</h1>
      <button onClick={handleRestart}>התחל מחדש</button>
      <p>מהלכים: {moves}</p>
      <div className="game-board">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className={`card${card.flipped || card.matched ? ' flipped' : ''}`}
            onClick={() => handleCardClick(idx)}
          >
            {card.flipped || card.matched ? card.symbol : '❓'}
          </div>
        ))}
      </div>
      {isWin && <div className="win-message">🎉 ניצחת!</div>}
    </div>
  );
}

export default MemoryGame;
