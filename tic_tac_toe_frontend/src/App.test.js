import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders game title and board', () => {
  render(<App />);
  expect(screen.getByLabelText(/tic tac toe game title/i)).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /cell/i }).length).toBe(9);
});

test('X plays and then O plays', () => {
  render(<App />);
  const cells = screen.getAllByRole('button', { name: /cell/i });
  expect(cells[0]).toHaveTextContent('');
  fireEvent.click(cells[0]);
  expect(cells[0]).toHaveTextContent('X');
  fireEvent.click(cells[1]);
  expect(cells[1]).toHaveTextContent('O');
});

test('can reset the game', () => {
  render(<App />);
  const cells = screen.getAllByRole('button', { name: /cell/i });
  fireEvent.click(cells[0]);
  expect(cells[0]).toHaveTextContent('X');
  const resetBtn = screen.getByRole('button', { name: /reset/i });
  fireEvent.click(resetBtn);
  cells.forEach((cell) => {
    expect(cell).toHaveTextContent('');
  });
});
