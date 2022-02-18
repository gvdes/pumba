import { Router } from 'express';
import { PING } from '../controllers/ping';
import { SYNC } from '../controllers/clientsCont';
import { SYNCPRODFAMS } from '../controllers/familiarizationsCont';

const router = Router();

router.get('/ping', PING);
router.post('/sync/clients', SYNC);
router.post('/sync/familiarizations', SYNCPRODFAMS);

export default router;