import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Item {
  id: number;
  value: number;
}

interface ItemsState {
  items: Item[];
  loading: boolean;
  selectedIds: number[];
  search: string;
  setSearch: (search: string) => void;
  setSelectedIds: (ids: number[]) => void;
  fetchItems: (search?: string) => Promise<void>;
}

export const useItemsStore = create<ItemsState>()(
  devtools((set, get) => ({
    items: [],
    loading: false,
    selectedIds: [],
    search: '',
    setSearch: (search) => set({ search }, false, 'items/setSearch'),
    setSelectedIds: (ids) => set({ selectedIds: ids }, false, 'items/setSelectedIds'),
    fetchItems: async (searchParam) => {
      set({ loading: true }, false, 'items/fetchItems');
      const search = searchParam !== undefined ? searchParam : get().search;
      const url = search
        ? `/items?limit=20&offset=0&search=${encodeURIComponent(search)}`
        : '/items?limit=20&offset=0';
      const res = await fetch(url);
      const data = await res.json();
      set({ items: data.items, loading: false }, false, 'items/fetchItems/success');
    },
  }), { name: 'ItemsStore' })
);

// Экспортируем storeApi для сброса в тестах
export const itemsStoreApi = useItemsStore; 