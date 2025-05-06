// backend/routes/paymentRoutes.js
const express = require('express');
const PaymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', PaymentController.processPayment);
router.get('/', PaymentController.getUserPaymentHistory);
router.get('/appointment/:appointment_id', PaymentController.getPaymentByAppointmentId);

module.exports = router;