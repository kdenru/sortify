import { RequestHandler } from 'express';
import { getItems, selectItems, reorderItemGlobally } from '../services/items.service';

// Получить список айтемов с пагинацией и поиском
export const getItemsController: RequestHandler = (req, res) => {
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 20));
  const offset = Math.max(0, parseInt(req.query.offset as string) || 0);
  const search = (req.query.search as string) || '';
  const { items, total } = getItems({ offset, limit, search });
  res.json({ items, total, offset, limit });
};

// Отметить выбранные айтемы
export const selectItemsController: RequestHandler = (req, res) => {
  const { selectedIds } = req.body;
  if (!Array.isArray(selectedIds)) {
    res.status(400).json({ error: 'selectedIds должен быть массивом' });
    return;
  }
  selectItems(selectedIds);
  res.status(204).send();
};

// Глобальный реордер айтемов (drag&drop)
export const reorderItemGloballyController: RequestHandler = (req, res) => {
  const { movedId, beforeId } = req.body;
  if (typeof movedId !== 'number') {
    res.status(400).json({ error: 'movedId должен быть числом' });
    return;
  }
  reorderItemGlobally(movedId, beforeId ?? null);
  res.status(204).send();
}; 