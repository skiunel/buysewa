import express from 'express';
import Store from '../controllers/store/index.js';

const router = express.Router();

// Public: get store by domain
router.get('/domain/:domain', Store.GetStoreByDomain);

// Protected
router.get('/my-store', Store.GetMyStore);
router.get('/', Store.List);
router.post('/', Store.Create);
router.put('/:store_id', Store.Update);
router.delete('/:store_id', Store.Delete);
router.post('/:store_id/assign-admin', Store.AssignAdmin);

export default router;
