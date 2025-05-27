import { Router } from 'express';
import { getItemsController } from '../controllers/items.controller';

const router = Router();

router.get('/', getItemsController);

export default router; 