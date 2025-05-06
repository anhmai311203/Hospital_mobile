// backend/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to protected routes
router.use(authMiddleware);

// Create a new appointment
router.post('/', AppointmentController.createAppointment);

// Get available time slots
router.get('/timeslots', AppointmentController.getAvailableTimeSlots);

// Get appointment by ID
router.get('/:id', AppointmentController.getAppointmentById);

// Update appointment (for rescheduling)
router.put('/:id', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Update appointment endpoint',
    id: req.params.id,
    data: req.body
  });
});

// Get user's appointments
router.get('/', authMiddleware, (req, res) => {
  // Trả về mảng rỗng hoặc dữ liệu mẫu
  const mockAppointments = [
    {
      id: 1,
      user_id: req.user?.id || 1,
      doctor_id: 1,
      doctor_name: "John Smith",
      specialty: "Cardiology",
      date: "2023-12-01",
      time: "09:00:00",
      notes: "Regular checkup",
      status: "confirmed"
    },
    {
      id: 2,
      user_id: req.user?.id || 1,
      doctor_id: 2,
      doctor_name: "Emily Johnson",
      specialty: "Dermatology",
      date: "2023-12-15",
      time: "14:30:00",
      notes: "",
      status: "pending"
    }
  ];

  res.status(200).json(mockAppointments);
});

// Thêm endpoint này
router.get('/mock', (req, res) => {
  const mockAppointments = [
    {
      id: 1,
      user_id: 1,
      doctor_id: 1,
      doctor_name: "John Smith",
      specialty: "Cardiology",
      date: "2023-12-01",
      time: "09:00:00",
      notes: "Regular checkup",
      status: "confirmed"
    },
    {
      id: 2,
      user_id: 1,
      doctor_id: 2,
      doctor_name: "Emily Johnson",
      specialty: "Dermatology",
      date: "2023-12-15",
      time: "14:30:00",
      notes: "",
      status: "pending"
    }
  ];

  res.status(200).json(mockAppointments);
});

// Cancel appointment
router.patch('/:id/cancel', authMiddleware, AppointmentController.cancelAppointment);

module.exports = router;