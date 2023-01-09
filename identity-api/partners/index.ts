import { Router } from "express";
import { checkIfAuthenticated } from "../../middleware";
import { listPartners, createPartner, deletePartners } from './partner.controller';

const router = Router();

router.get('/subscriptions/:subscriptionId/partner', checkIfAuthenticated, listPartners);
router.post('/subscriptions/:subscriptionId/partner', checkIfAuthenticated, createPartner);
router.delete('/subscriptions/:subscriptionId/partner/:partnerId', checkIfAuthenticated, deletePartners);

export default router;
