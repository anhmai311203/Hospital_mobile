// backend/routes/userRoutes.js
const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, UserController.updateProfile);
router.put('/change-password', authMiddleware, UserController.changePassword);
router.post('/feedback', authMiddleware, UserController.submitFeedback);

module.exports = router;