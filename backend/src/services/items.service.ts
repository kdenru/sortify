import { Item } from '../types/item';

// Массив айтемов в памяти
let items: Item[] = Array.from({ length: 1000000 }, (_, i) => ({ id: i + 1, value: `Item ${i + 1}`, selected: false }));

/**
 * Получить айтемы с пагинацией и поиском
 */
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

/**
 * Глобальный реордер айтемов (drag&drop)
 */
export function reorderItemGlobally(movedId: number, beforeId: number | null): void {
  const idx = items.findIndex(i => i.id === movedId);
  if (idx === -1) return;
  const [moved] = items.splice(idx, 1);
  let insertIdx: number;
  if (beforeId === null || beforeId === undefined) {
    insertIdx = 0;
  } else {
    insertIdx = items.findIndex(i => i.id === beforeId);
    if (insertIdx === -1) insertIdx = 0;
  }
  items.splice(insertIdx, 0, moved);
}

/**
 * Отметить выбранные айтемы
 */
export function selectItems(selectedIds: number[]): void {
  const selectedSet = new Set(selectedIds);
  items = items.map(item => ({ ...item, selected: selectedSet.has(item.id) }));
} 