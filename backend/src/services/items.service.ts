import { Item } from '../types/item';

const TOTAL = 1_000_000;

export function getItem(id: number): Item {
  return { id, value: `Item ${id}` };
}

export function getItems({
  offset = 0,
  limit = 20,
  search = '',
  sortBy = 'id',
  sortOrder = 'asc',
}: {
  offset?: number;
  limit?: number;
  search?: string;
  sortBy?: 'id' | 'value';
  sortOrder?: 'asc' | 'desc';
}): { items: Item[]; total: number } {
  let items: Item[] = [];
  search = search.toLowerCase();

  if (search) {
    for (let i = 1; i <= TOTAL; i++) {
      const item = getItem(i);
      if (item.value.toLowerCase().includes(search)) {
        items.push(item);
      }
      if (items.length > offset + limit * 2) break;
    }
  } else {
    for (let i = offset + 1; i <= Math.min(TOTAL, offset + limit); i++) {
      items.push(getItem(i));
    }
  }

  if (sortBy === 'value') {
    items.sort((a, b) => sortOrder === 'asc' ? a.value.localeCompare(b.value) : b.value.localeCompare(a.value));
  } else {
    items.sort((a, b) => sortOrder === 'asc' ? a.id - b.id : b.id - a.id);
  }

  if (search) {
    items = items.slice(offset, offset + limit);
  }

  return {
    items,
    total: search ? items.length : TOTAL,
  };
} 