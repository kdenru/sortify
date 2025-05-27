import { Router } from 'express';
import { getStateController, setStateController } from '../controllers/state.controller';

const router = Router();

router.get('/', getStateController);
router.post('/', setStateController);

export default router; 