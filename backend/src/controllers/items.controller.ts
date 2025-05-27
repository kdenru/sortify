import { Request, Response } from 'express';
import { getItems } from '../services/items.service';

export function getItemsController(req: Request, res: Response) {
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 20));
  const offset = Math.max(0, parseInt(req.query.offset as string) || 0);
  const search = (req.query.search as string) || '';
  const sortBy = (req.query.sortBy as string) === 'value' ? 'value' : 'id';
  const sortOrder = (req.query.sortOrder as string) === 'desc' ? 'desc' : 'asc';

  const { items, total } = getItems({ offset, limit, search, sortBy, sortOrder });

  res.json({ items, total, offset, limit });
} 