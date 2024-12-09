import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './Home';

const queryClient = new QueryClient();

describe('Home', () => {
  it('renders the main heading', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );
    
    expect(screen.getByText('AI Blueboard Education')).toBeInTheDocument();
  });

  it('renders the canvas and controls', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );
    
    expect(screen.getByRole('button', { name: /help/i })).toBeInTheDocument();
  });
});
