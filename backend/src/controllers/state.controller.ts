import { RequestHandler } from 'express';
import { getState, setState } from '../services/state.service';

export const getStateController: RequestHandler = (req, res) => {
  res.json(getState());
};

export const setStateController: RequestHandler = (req, res) => {
  const { selectedIds, sortedIds } = req.body;
  if (!Array.isArray(selectedIds) || !Array.isArray(sortedIds)) {
    res.status(400).json({ error: 'selectedIds и sortedIds должны быть массивами' });
    return;
  }
  setState({ selectedIds, sortedIds });
  res.status(204).send();
}; 