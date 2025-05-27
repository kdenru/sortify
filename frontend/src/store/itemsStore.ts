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
  setSelectedIds: (ids: number[]) => void;
  fetchItems: () => Promise<void>;
}

export const useItemsStore = create<ItemsState>()(
  devtools((set) => ({
    items: [],
    loading: false,
    selectedIds: [],
    setSelectedIds: (ids) => set({ selectedIds: ids }, false, 'items/setSelectedIds'),
    fetchItems: async () => {
      set({ loading: true }, false, 'items/fetchItems');
      const res = await fetch('/items?limit=20&offset=0');
      const data = await res.json();
      set({ items: data.items, loading: false }, false, 'items/fetchItems/success');
    },
  }), { name: 'ItemsStore' })
);

// Экспортируем storeApi для сброса в тестах
export const itemsStoreApi = useItemsStore; 