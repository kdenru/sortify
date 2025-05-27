import { Router } from 'express';
import { getItemsController, reorderItemsController, selectItemsController } from '../controllers/items.controller';

const router = Router();

router.get('/', getItemsController);
router.post('/reorder', reorderItemsController);
router.post('/select', selectItemsController);

export default router; 