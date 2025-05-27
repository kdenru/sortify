import { Item } from '../types/item';
import { getState } from './state.service';

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

  // Получаем состояние пользователя
  const { sortedIds, selectedIds } = getState();

  // Если есть sortedIds, сортируем items по этому порядку
  if (Array.isArray(sortedIds) && sortedIds.length > 0) {
    const idToItem = Object.fromEntries(items.map(i => [i.id, i]));
    items = sortedIds.map((id: number) => idToItem[id]).filter(Boolean);
  }

  if (sortBy === 'value') {
    items.sort((a, b) => sortOrder === 'asc' ? a.value.localeCompare(b.value) : b.value.localeCompare(a.value));
  } else {
    items.sort((a, b) => sortOrder === 'asc' ? a.id - b.id : b.id - a.id);
  }

  if (search) {
    items = items.slice(offset, offset + limit);
  }

  // Выставляем selected для каждого item
  if (Array.isArray(selectedIds) && selectedIds.length > 0) {
    const selectedSet = new Set(selectedIds);
    items = items.map(item => ({ ...item, selected: selectedSet.has(item.id) }));
  } else {
    items = items.map(item => ({ ...item, selected: false }));
  }

  return {
    items,
    total: search ? items.length : TOTAL,
  };
} 