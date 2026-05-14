import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('renders URL checker heading and input', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /url checker/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/enter url/i)).toBeInTheDocument();
});

test('clears old result when user types again', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  render(<App />);
  const input = screen.getByPlaceholderText(/enter url/i);

  await user.type(input, 'www.example.com');
  await act(async () => { jest.advanceTimersByTime(1000); });
  expect(screen.getByRole('status')).toBeInTheDocument();

  await user.type(input, '/x');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('stale response does not overwrite current result', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  render(<App />);
  const input = screen.getByPlaceholderText(/enter url/i);

  await user.type(input, 'www.example.com');
  await act(async () => { jest.advanceTimersByTime(500); }); // request fires, not resolved
  await user.clear(input);
  await user.type(input, 'news.ycombinator.com');
  await act(async () => { jest.advanceTimersByTime(2000); });

  expect(screen.getByRole('status')).toHaveTextContent(/exists/i);
});