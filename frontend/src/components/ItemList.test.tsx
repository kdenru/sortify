import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ItemList from './ItemList';
import { useItemsStore } from '../store/itemsStore';

beforeEach(() => {
  (global.fetch as any) = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        items: Array.from({ length: 20 }, (_, i) => ({ id: i + 1, value: `Item ${i + 1}` })),
        total: 1000000,
      }),
      text: () => Promise.resolve(''),
      headers: {
        get: () => 'application/json',
      },
    })
  );
});

afterEach(() => {
  useItemsStore.setState({ items: [], loading: false, selectedIds: [] });
});

describe('ItemList', () => {
  it('рендерит таблицу и 20 строк', async () => {
    render(<ItemList />);
    await waitFor(() => {
      expect(document.querySelectorAll('.ant-table-row')).toHaveLength(20);
    });
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 20')).toBeInTheDocument();
  });

  it('можно выбрать одну строку', async () => {
    render(<ItemList />);
    await waitFor(() => {
      expect(document.querySelectorAll('.ant-table-row')).toHaveLength(20);
    });
    // Находим первый чекбокс (кроме "выбрать все")
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    fireEvent.click(checkboxes[1]);
    expect(useItemsStore.getState().selectedIds).toEqual([1]);
  });

  it('можно выбрать несколько строк', async () => {
    render(<ItemList />);
    await waitFor(() => {
      expect(document.querySelectorAll('.ant-table-row')).toHaveLength(20);
    });
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    fireEvent.click(checkboxes[1]); // id: 1
    fireEvent.click(checkboxes[2]); // id: 2
    expect(useItemsStore.getState().selectedIds).toEqual([1, 2]);
  });
});