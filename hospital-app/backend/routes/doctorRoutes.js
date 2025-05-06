// backend/routes/doctorRoutes.js
const express = require('express');
const DoctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', DoctorController.getAllDoctors);
router.get('/search', DoctorController.searchDoctors);
router.get('/specialties', DoctorController.getSpecialties);
router.get('/:id', DoctorController.getDoctorById);
router.get('/specialty/:specialty', DoctorController.getDoctorsBySpecialty);

// Protected routes
router.post('/:id/rate', authMiddleware, DoctorController.rateDoctor);

module.exports = router;