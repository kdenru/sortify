import { UserState } from '../types/state';

// В памяти, на всю жизнь приложения
let state: UserState = {
  selectedIds: [],
  sortedIds: [],
};

export function getState(): UserState {
  return state;
}

export function setState(newState: UserState): void {
  state = { ...newState };
} 