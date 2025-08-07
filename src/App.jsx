import React, { useState, useEffect } from 'react';
import './App.css';

const symbolSets = {
  קל: ['🍎', '🍌', '🍇', '🍒', '🍉', '🥝'],
  בינוני: ['🍎', '🍌', '🍇', '🍒', '🍉', '🥝', '🍍', '🍋', '🥥', '🍊'],
  קשה: ['🍎', '🍌', '🍇', '🍒', '🍉', '🥝', '🍍', '🍋', '🥥', '🍊', '🍈', '🍏', '🥭', '🍓'],
  מומחה: ['🍎', '🍌', '🍇', '🍒', '🍉', '🥝', '🍍', '🍋', '🥥', '🍊', '🍈', '🍏', '🥭', '🍓', '🍐', '🍅', '🌽', '🥦'],
  אלוף: ['🍎', '🍌', '🍇', '🍒', '🍉', '🥝', '🍍', '🍋', '🥥', '🍊', '🍈', '🍏', '🥭', '🍓', '🍐', '🍅', '🌽', '🥦', '🥬', '🍆']
};

const difficultyLevels = Object.keys(symbolSets);

function App() {
  const [difficulty, setDifficulty] = useState('קל');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    generateCards(difficulty);
    setShowCongrats(false);
  }, [difficulty]);

  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setShowCongrats(true);
      const timer = setTimeout(() => {
        goToNextDifficulty();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [matched, cards]);

  const generateCards = (level) => {
    const symbols = symbolSets[level];
    const shuffled = [...symbols, ...symbols]
      .map((symbol, index) => ({ id: index + '_' + symbol, symbol }))
      .sort(() => 0.5 - Math.random());
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setShowCongrats(false);
  };

  const handleClick = (card) => {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.id)) return;

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard.symbol === secondCard.symbol) {
        setMatched(prev => [...prev, firstId, secondId]);
        setTimeout(() => setFlipped([]), 500);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const goToNextDifficulty = () => {
    const currentIndex = difficultyLevels.indexOf(difficulty);
    if (currentIndex < difficultyLevels.length - 1) {
      setDifficulty(difficultyLevels[currentIndex + 1]);
    } else {
      alert('סיימת את כל הרמות! כל הכבוד!');
      setDifficulty(difficultyLevels[0]);
    }
  };

  return (
    <div className="app">
      <h1>😄 משחק זיכרון</h1>

      <div className="difficulty-select">
        <label>בחר רמת קושי</label>
        <p></p><p></p>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} disabled={showCongrats}>
          {difficultyLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
        <p></p><p></p>
      </div>

      {showCongrats && (
        <div className="popup-congrats">
          <div className="popup-content">
            <span role="img" aria-label="smile" style={{ fontSize: '4rem' }}>😊</span>
            <h2>כל הכבוד! 🎉</h2>
            <p>עברת את השלב בהצלחה!</p>
          </div>
        </div>
      )}

      <div className="container" style={{ filter: showCongrats ? 'blur(3px)' : 'none' }}>
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          return (
            <div
              key={card.id}
              className={`card ${isFlipped ? 'flipped' : ''}`}
              onClick={() => handleClick(card)}
            >
              <div className="card-inner">
                <div className="card-front">{card.symbol}</div>
                <div className="card-back">❓</div>
              </div>
            </div>
          );
        })}
      </div>

      <p>מהלכים: <span>{moves}</span></p>
    </div>
  );
}

export default App;
