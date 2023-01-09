import { Router } from "express";
import { checkIfAuthenticated } from "../../middleware";
import { sendSupportMail } from './support.controller';

const router = Router();

router.post('/', checkIfAuthenticated, sendSupportMail);

export default router;
