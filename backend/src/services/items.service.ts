import { Item } from '../types/item';

// Массив айтемов в памяти
let items: Item[] = Array.from({ length: 1000000 }, (_, i) => ({ id: i + 1, value: `Item ${i + 1}`, selected: false }));

export function getItems({
  offset = 0,
  limit = 20,
  search = '',
}: {
  offset?: number;
  limit?: number;
  search?: string;
}): { items: Item[]; total: number } {
  let filtered = items;
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(item => item.value.toLowerCase().includes(s));
  }
  const total = filtered.length;
  const paged = filtered.slice(offset, offset + limit);
  return { items: paged, total };
}

export function reorderItems(newOrder: number[]): void {
  const idToItem = Object.fromEntries(items.map(i => [i.id, i]));
  // Переставляем только те, что есть в newOrder, остальные добавляем в конец в старом порядке
  const reordered = newOrder.map(id => idToItem[id]).filter(Boolean);
  const rest = items.filter(i => !newOrder.includes(i.id));
  items = [...reordered, ...rest];
}

export function selectItems(selectedIds: number[]): void {
  const selectedSet = new Set(selectedIds);
  items = items.map(item => ({ ...item, selected: selectedSet.has(item.id) }));
} 