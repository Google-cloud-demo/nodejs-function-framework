import { Router } from "express";
import { checkIfAuthenticated } from "../../middleware";
import { getTenantDetails, getTenant, updateTenant, getPartnerTenant } from './tenants.controller';

const router = Router();

router.get('/:tenantId', checkIfAuthenticated, getTenant);
router.patch('/:tenantId', checkIfAuthenticated, updateTenant);
router.get('/exist/:email', getTenantDetails);
router.get('/partner/:tenantId', checkIfAuthenticated, getPartnerTenant);

export default router;
