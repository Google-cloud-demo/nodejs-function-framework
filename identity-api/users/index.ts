import { Router } from "express";
import { listUser, createUser, deleteUser, updateUser, existUser, resetPassword, setAccessControl } from './user.controller';
import { checkIfAuthenticated } from '../../middleware';

const router = Router();

router.patch('/reset-password/:uid', checkIfAuthenticated, resetPassword);
router.patch('/subscriptions/:subId/set-access-control', checkIfAuthenticated, setAccessControl);
router.get('/subscriptions/:subId/users', checkIfAuthenticated, listUser);
router.post('/subscriptions/:subId/users', checkIfAuthenticated, createUser);
router.get('/subscriptions/:subId/users/exist/:email', checkIfAuthenticated, existUser);
router.patch('/subscriptions/:subId/users/:uid', checkIfAuthenticated, updateUser);
router.delete('/subscriptions/:subId/users/:uid', checkIfAuthenticated, deleteUser);

export default router;
