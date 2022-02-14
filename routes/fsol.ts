import { Router } from 'express';
import { PING } from '../controllers/ping';
import { SYNC } from '../controllers/clientsCont';

const router = Router();

router.get('/ping', PING);
router.post('/sync/clients', SYNC);

export default router;