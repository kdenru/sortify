import { getItem, getItems } from '../items.service';

describe('items.service', () => {
  it('getItem возвращает правильный объект', () => {
    expect(getItem(42)).toEqual({ id: 42, value: 'Item 42' });
  });

  it('getItems без параметров возвращает 20 элементов', () => {
    const { items, total } = getItems({});
    expect(items.length).toBe(20);
    expect(items[0].id).toBe(1);
    expect(total).toBe(1_000_000);
  });

  it('getItems с limit и offset', () => {
    const { items } = getItems({ limit: 5, offset: 10 });
    expect(items.length).toBe(5);
    expect(items[0].id).toBe(11);
  });

  it('getItems с поиском', () => {
    const { items, total } = getItems({ search: 'Item 9999', limit: 10 });
    expect(items.some(i => i.value.includes('9999'))).toBe(true);
    expect(total).toBeGreaterThan(0);
  });

  it('getItems сортировка по value desc', () => {
    const { items } = getItems({ sortBy: 'value', sortOrder: 'desc', limit: 3 });
    expect(items[0].value > items[1].value).toBe(true);
  });
}); 