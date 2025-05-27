import { RequestHandler } from 'express';
import { getItems, reorderItems, selectItems } from '../services/items.service';

export const getItemsController: RequestHandler = (req, res) => {
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 20));
  const offset = Math.max(0, parseInt(req.query.offset as string) || 0);
  const search = (req.query.search as string) || '';

  const { items, total } = getItems({ offset, limit, search });

  res.json({ items, total, offset, limit });
};

export const reorderItemsController: RequestHandler = (req, res) => {
  const { sortedIds } = req.body;
  if (!Array.isArray(sortedIds)) {
    res.status(400).json({ error: 'sortedIds должен быть массивом' });
    return;
  }
  reorderItems(sortedIds);
  res.status(204).send();
};

export const selectItemsController: RequestHandler = (req, res) => {
  const { selectedIds } = req.body;
  if (!Array.isArray(selectedIds)) {
    res.status(400).json({ error: 'selectedIds должен быть массивом' });
    return;
  }
  selectItems(selectedIds);
  res.status(204).send();
}; 