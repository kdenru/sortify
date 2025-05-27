import { getItems } from '../items.service';

describe('items.service', () => {
  it('getItems без параметров возвращает 20 элементов', () => {
    const { items, total } = getItems({});
    expect(items.length).toBe(20);
    expect(items[0].id).toBe(1);
    expect(total).toBe(1000000);
  });

  it('getItems с limit и offset', () => {
    const { items } = getItems({ limit: 5, offset: 10 });
    expect(items.length).toBe(5);
    expect(items[0].id).toBe(11);
  });

  it('getItems с поиском', () => {
    const { items, total } = getItems({ search: 'Item 99', limit: 10 });
    expect(items.some(i => i.value.includes('99'))).toBe(true);
    expect(total).toBeGreaterThan(0);
  });
}); 