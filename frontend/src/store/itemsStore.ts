import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Item {
  id: number;
  value: number;
  selected?: boolean;
}

interface ItemsState {
  items: Item[];
  loading: boolean;
  search: string;
  total: number;
  offset: number;
  hasMore: boolean;
  setSearch: (search: string) => void;
  setSelectedIds: (ids: number[]) => void;
  fetchItems: (search?: string) => Promise<void>;
  fetchMore: () => Promise<void>;
  setItems: (items: Item[]) => void;
}

const LIMIT = 20;

export const useItemsStore = create<ItemsState>()(
  devtools((set, get) => ({
    items: [],
    loading: false,
    search: '',
    total: 0,
    offset: 0,
    hasMore: true,
    setSearch: (search) => set({ search }, false, 'items/setSearch'),
    setSelectedIds: async (ids) => {
      // Меняем selected у items локально
      const items = get().items.map(item => ({ ...item, selected: ids.includes(item.id) }));
      set({ items }, false, 'items/setSelectedIds');
      // Отправляем на бэк
      await fetch('/items/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedIds: ids }),
      });
    },
    fetchItems: async (searchParam) => {
      set({ loading: true }, false, 'items/fetchItems');
      const search = searchParam !== undefined ? searchParam : get().search;
      const url = search
        ? `/items?limit=${LIMIT}&offset=0&search=${encodeURIComponent(search)}`
        : `/items?limit=${LIMIT}&offset=0`;
      const res = await fetch(url);
      const data = await res.json();
      set({
        items: data.items,
        loading: false,
        total: data.total,
        offset: data.items.length,
        hasMore: data.items.length < data.total,
      }, false, 'items/fetchItems/success');
    },
    fetchMore: async () => {
      const { search, offset, items, loading, hasMore } = get();
      if (loading || !hasMore) return;
      set({ loading: true }, false, 'items/fetchMore');
      const url = search
        ? `/items?limit=${LIMIT}&offset=${offset}&search=${encodeURIComponent(search)}`
        : `/items?limit=${LIMIT}&offset=${offset}`;
      const res = await fetch(url);
      const data = await res.json();
      set({
        items: [...items, ...data.items],
        loading: false,
        offset: offset + data.items.length,
        hasMore: offset + data.items.length < data.total,
        total: data.total,
      }, false, 'items/fetchMore/success');
    },
    setItems: async (items) => {
      set({ items }, false, 'items/setItems');
      // Отправляем новый порядок на бэк
      const sortedIds = items.map(i => i.id);
      await fetch('/items/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortedIds }),
      });
    },
  }), { name: 'ItemsStore' })
);

// Экспортируем storeApi для сброса в тестах
export const itemsStoreApi = useItemsStore; 