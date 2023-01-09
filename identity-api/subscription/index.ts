import { Router } from "express";
import { checkIfAuthenticated } from '../../middleware';
import { listSubscriptions } from "./subscription.controller";

const router = Router();

router.get('/', checkIfAuthenticated, listSubscriptions);

export default router;
