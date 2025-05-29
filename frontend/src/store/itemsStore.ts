import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Item {
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
  selectedIds: number[];
  setSearch: (search: string) => void;
  setSelectedIds: (ids: number[]) => void;
  fetchItems: (search?: string) => Promise<void>;
  fetchMore: () => Promise<void>;
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
    selectedIds: [],
    setSearch: (search) => set({ search }, false, 'items/setSearch'),
    setSelectedIds: async (ids) => {
      set({ selectedIds: ids }, false, 'items/setSelectedIds');
      const items = get().items.map(item => ({ ...item, selected: ids.includes(item.id) }));
      set({ items }, false, 'items/setSelectedOnItems');
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
      // Собираем id с selected: true
      const backendSelected = (data.items as Item[]).filter(i => i.selected).map(i => i.id);
      // Объединяем с текущими selectedIds
      const prevSelected = get().selectedIds || [];
      const mergedSelected = Array.from(new Set([...prevSelected, ...backendSelected]));
      set({
        items: data.items,
        loading: false,
        total: data.total,
        offset: data.items.length,
        hasMore: data.items.length < data.total,
        selectedIds: mergedSelected,
      }, false, 'items/fetchItems/success');
    },
    fetchMore: async () => {
      const { search, offset, items, loading, hasMore, selectedIds: prevSelected } = get();
      if (loading || !hasMore) return;
      set({ loading: true }, false, 'items/fetchMore');
      const url = search
        ? `/items?limit=${LIMIT}&offset=${offset}&search=${encodeURIComponent(search)}`
        : `/items?limit=${LIMIT}&offset=${offset}`;
      const res = await fetch(url);
      const data = await res.json();
      // Собираем id с selected: true
      const backendSelected = (data.items as Item[]).filter(i => i.selected).map(i => i.id);
      // Объединяем с текущими selectedIds
      const mergedSelected = Array.from(new Set([...(prevSelected || []), ...backendSelected]));
      set({
        items: [...items, ...data.items],
        loading: false,
        offset: offset + data.items.length,
        hasMore: offset + data.items.length < data.total,
        total: data.total,
        selectedIds: mergedSelected,
      }, false, 'items/fetchMore/success');
    },
  }), { name: 'ItemsStore' })
);

// Экспортируем storeApi для сброса в тестах (используется только в тестах)
export const itemsStoreApi = useItemsStore; 