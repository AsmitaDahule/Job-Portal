import express from 'express';
import { register, updateProfile, login, logout } from '../controllers/userController.js';
import authenticateToken from '../middleware/isAuthenticated.js';

const router = express.Router();


router.route('/register').post(register);

router.route('/login').post(login);

router.route('/profile/update').post(authenticateToken, updateProfile);

router.route('/logout').post(authenticateToken, logout);

export default router;


