import { Router } from 'express';
import { getItemsController, /*reorderItemsController,*/ selectItemsController, reorderItemGloballyController } from '../controllers/items.controller';

const router = Router();

router.get('/', getItemsController);
router.post('/select', selectItemsController);
router.post('/reorder', reorderItemGloballyController);

export default router; 