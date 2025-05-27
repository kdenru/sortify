import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home', () => {
  it('рендерит заголовок и заглушку', () => {
    render(<Home />);
    expect(screen.getByText('Sortify')).toBeInTheDocument();
    expect(screen.getByText(/таблица/)).toBeInTheDocument();
  });
});
