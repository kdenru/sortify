import { getState, setState } from '../state.service';

describe('state.service', () => {
  afterEach(() => {
    setState({ selectedIds: [], sortedIds: [] });
  });

  it('getState возвращает дефолтное состояние', () => {
    expect(getState()).toEqual({ selectedIds: [], sortedIds: [] });
  });

  it('setState меняет состояние', () => {
    setState({ selectedIds: [1, 2], sortedIds: [2, 1] });
    expect(getState()).toEqual({ selectedIds: [1, 2], sortedIds: [2, 1] });
  });
}); 