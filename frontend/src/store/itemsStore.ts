import { create } from 'zustand';

interface Item {
  id: number;
  value: number;
}

interface ItemsState {
  items: Item[];
  loading: boolean;
  fetchItems: () => Promise<void>;
}

export const useItemsStore = create<ItemsState>((set) => ({
  items: [],
  loading: false,
  fetchItems: async () => {
    set({ loading: true });
    const res = await fetch('/items?limit=20&offset=0');
    const data = await res.json();
    set({ items: data.items, loading: false });
  },
})); 