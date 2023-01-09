import { Router } from "express";
import { listProviders, createSAMLProvider, deleteSAMLProvider, getProviderDetails, enableProvider, updateProviderConfig } from './provider.controller';
import { checkIfAuthenticated } from '../../middleware';

const router = Router();

router.get('/', checkIfAuthenticated, listProviders);
router.post('/', checkIfAuthenticated, createSAMLProvider);
router.patch('/:id', checkIfAuthenticated, updateProviderConfig);
router.get('/:id', checkIfAuthenticated, getProviderDetails);
router.delete('/:id', checkIfAuthenticated, deleteSAMLProvider);
router.put('/enable/:id', checkIfAuthenticated, enableProvider);

export default router;
