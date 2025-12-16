import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

/**
 * Style constants for Ocean Professional theme
 */
const OCEAN_THEME = {
  blue: '#2563EB',           // Primary
  amber: '#F59E0B',          // Secondary/Highlight/Success
  error: '#EF4444',          // Error
  background: '#f9fafb',     // App background
  surface: '#ffffff',        // Card/Board background
  text: '#111827',           // Primary text
  gradient: 'linear-gradient(135deg, #2563EB0d 0%, #F9FAFB 100%)'
};

// PUBLIC_INTERFACE
function App() {
  // 0: empty, 1: X, 2: O
  const initialBoard = Array(9).fill(0);
  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState(1); // 1: X, 2: O
  const [winner, setWinner] = useState(0); // 0: none, 1: X, 2: O, 3: draw
  const [theme, setTheme] = useState('light');
  const boardRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const res = calculateWinner(board);
    if (res === 0 && board.every((c) => c !== 0)) {
      setWinner(3); // Draw
    } else if (res !== 0) {
      setWinner(res);
    }
  }, [board]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // PUBLIC_INTERFACE
  function handleCellKeyDown(idx, e) {
    // Keyboard navigation: arrow keys, enter/space to play
    if (winner > 0) return; // Disable moves on game over
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    let nextIdx = null;
    if (e.key === 'ArrowRight') nextIdx = col < 2 ? idx + 1 : idx - 2;
    else if (e.key === 'ArrowLeft') nextIdx = col > 0 ? idx - 1 : idx + 2;
    else if (e.key === 'ArrowUp') nextIdx = row > 0 ? idx - 3 : idx + 6;
    else if (e.key === 'ArrowDown') nextIdx = row < 2 ? idx + 3 : idx - 6;
    else if (e.key === ' ' || e.key === 'Enter') {
      handleCellClick(idx);
      return;
    }
    if (nextIdx !== null) {
      const nextButton = boardRef.current.querySelector(`[data-idx="${nextIdx}"]`);
      if (nextButton) nextButton.focus();
      e.preventDefault();
    }
  }

  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    if (board[idx] !== 0 || winner > 0) return;
    const newBoard = board.slice();
    newBoard[idx] = turn;
    setBoard(newBoard);
    setTurn(turn === 1 ? 2 : 1);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(initialBoard);
    setWinner(0);
    setTurn(1);
  }

  const renderStatus = () => {
    let status = '';
    if (winner === 0) status = `Turn: ${turn === 1 ? 'X' : 'O'}`;
    else if (winner === 1) status = 'Winner: X 🎉';
    else if (winner === 2) status = 'Winner: O 🎉';
    else if (winner === 3) status = "It's a draw!";
    return (
      <div
        className="ttt-status"
        aria-live="polite"
        tabIndex={-1}
        style={{
          fontWeight: 600,
          fontSize: "calc(1.2rem + 1vw)",
          color:
            winner === 1
              ? OCEAN_THEME.blue
              : winner === 2
              ? OCEAN_THEME.amber
              : winner === 3
              ? OCEAN_THEME.text
              : OCEAN_THEME.text,
          marginBottom: 24,
          letterSpacing: 0.03 + "em",
          textShadow:
            winner === 1 || winner === 2
              ? "0 1px 4px rgba(37,99,235,.07)"
              : "none"
        }}
      >
        {status}
      </div>
    );
  };

  return (
    <div
      className="ttt-app-root"
      style={{
        background: OCEAN_THEME.background,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        transition: 'background 0.3s'
      }}
    >
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        style={{
          position: 'absolute',
          top: 32,
          right: 40,
          background: OCEAN_THEME.blue,
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: 16,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.25s',
          boxShadow: '0 2px 8px 0 rgba(37,99,235,0.08)'
        }}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>

      <main
        className="ttt-main"
        style={{
          minWidth: 320,
          maxWidth: 440,
          width: '90vw',
          margin: '0 auto',
          backdropFilter: 'blur(0.5px)',
          borderRadius: 24,
          boxShadow: '0 2px 20px 0 rgba(37,99,235,.07),0 1.5px 9px #2563EB09',
          background: OCEAN_THEME.surface,
          padding: '50px 24px 38px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Game title */}
        <div
          style={{
            fontSize: "2.3rem",
            fontWeight: 700,
            marginBottom: 6,
            letterSpacing: "0.02em",
            color: OCEAN_THEME.blue,
            background: `linear-gradient(90deg, ${OCEAN_THEME.blue} 50%, ${OCEAN_THEME.amber} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
          aria-label="Tic Tac Toe game title"
        >
          Tic Tac Toe
        </div>
        <div
          style={{
            color: OCEAN_THEME.text,
            fontSize: "1rem",
            marginBottom: 36,
            opacity: 0.85,
            letterSpacing: "0.03em"
          }}
        >
          Play classic Tic Tac Toe in your browser
        </div>
        {/* Game status */}
        {renderStatus()}

        {/* Game board */}
        <section
          className="ttt-board-section"
          aria-label="Game board"
          style={{
            background: OCEAN_THEME.gradient,
            borderRadius: 20,
            boxShadow: '0 1.5px 9px #2563EB05',
            padding: 10,
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Board
            board={board}
            winner={winner}
            highlight={winnerLines(board)}
            handleCellClick={handleCellClick}
            handleCellKeyDown={handleCellKeyDown}
            ref={boardRef}
          />
        </section>

        {/* Reset button */}
        <button
          className="ttt-reset-btn"
          onClick={handleReset}
          aria-label="Restart game"
          style={{
            padding: "10px 24px",
            fontSize: "1.08rem",
            fontWeight: 600,
            color: '#fff',
            background: OCEAN_THEME.amber,
            border: 'none',
            borderRadius: 6,
            margin: '0 auto',
            boxShadow:
              '0 4px 14px -5px #F59E0B33, 0 2px 4px #0001',
            cursor: "pointer",
            transition: "background 0.2s, box-shadow 0.2s, opacity 0.2s",
            opacity: winner > 0 ? 1 : 0.72,
          }}
          tabIndex={0}
          autoFocus={winner > 0}
        >
          Reset
        </button>
      </main>

      <footer
        style={{
          marginTop: 36,
          color: '#a1a1aa',
          fontSize: 14,
          textAlign: 'center',
          opacity: 0.85
        }}
      >
        Ocean Professional theme &bull; Made with React
      </footer>
    </div>
  );
}

/**
 * Board component: renders 3x3 grid, provides accessibility and highlight.
 * Ref is passed for managing keyboard navigation.
 */
const Board = React.forwardRef(function Board(
  { board, winner, highlight, handleCellClick, handleCellKeyDown },
  ref
) {
  const renderCell = (idx) => {
    const value = board[idx] === 1 ? 'X' : board[idx] === 2 ? 'O' : '';
    const isWinningCell = highlight && highlight.includes(idx);
    return (
      <button
        key={idx}
        data-idx={idx}
        className="ttt-cell"
        style={{
          width: 74,
          height: 74,
          fontSize: "2.15rem",
          background: "#ffffff77",
          color:
            board[idx] === 1 ? OCEAN_THEME.blue :
            board[idx] === 2 ? OCEAN_THEME.amber :
            OCEAN_THEME.text,
          border: isWinningCell
            ? `2.5px solid ${OCEAN_THEME.amber}`
            : '1.5px solid #2563EB29',
          borderRadius: 13,
          margin: 6,
          boxShadow: isWinningCell
            ? `0 2px 10px 0 #f59e0b33`
            : '0 0.5px 3px 0 #2563EB0a',
          outline: isWinningCell
            ? `2px solid ${OCEAN_THEME.amber}`
            : undefined,
          transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
          cursor: value || winner > 0 ? "not-allowed" : "pointer"
        }}
        role="button"
        aria-label={`Cell ${idx + 1} (${value || 'empty'})`}
        tabIndex={0}
        disabled={!!value || winner > 0}
        aria-disabled={!!value || winner > 0}
        onClick={() => handleCellClick(idx)}
        onKeyDown={(e) => handleCellKeyDown(idx, e)}
        aria-pressed={!!value}
        ref={idx === 0 ? ref : undefined}
      >
        {value}
      </button>
    );
  };

  // Render the board as 3 rows of 3
  return (
    <div
      className="ttt-board"
      role="grid"
      aria-label="Tic Tac Toe board"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 74px)',
        gap: '0px',
        background: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      ref={ref}
    >
      {Array(9)
        .fill(0)
        .map((_, i) => renderCell(i))}
    </div>
  );
});

// PUBLIC_INTERFACE
/**
 * Calculate the winner: 0 = none, 1 = X, 2 = O. Returns the winner.
 */
function calculateWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return 0;
}

/**
 * Returns indexes of a winning line if any, else empty array.
 */
function winnerLines(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return [];
}

export default App;
