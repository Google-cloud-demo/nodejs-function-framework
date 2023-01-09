import { Router } from "express";
import { checkIfAuthenticated } from '../../middleware';
import { listRoles, getRole, populateRole } from "./roles.controller";

const router = Router();

router.get('/', checkIfAuthenticated, listRoles);
router.get('/populate', populateRole);
router.get('/:roleId', checkIfAuthenticated, getRole);


export default router;