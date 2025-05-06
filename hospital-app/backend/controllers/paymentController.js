// backend/controllers/paymentController.js
const PaymentModel = require('../models/paymentModel');
const AppointmentModel = require('../models/appointmentModel');

class PaymentController {
  // Process payment for an appointment
  async processPayment(req, res) {
    try {
      const userId = req.user.id; // Set by auth middleware
      const { appointment_id, card_number, card_holder, amount } = req.body;
      
      // Validate input
      if (!appointment_id || !card_number || !card_holder || !amount) {
        return res.status(400).json({ message: 'All payment details are required' });
      }
      
      // Get appointment
      const appointment = await AppointmentModel.getAppointmentById(appointment_id);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      // Ensure the appointment belongs to the user
      if (appointment.user_id !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Check if appointment is already paid
      const existingPayment = await PaymentModel.getPaymentByAppointmentId(appointment_id);
      if (existingPayment) {
        return res.status(409).json({ message: 'This appointment is already paid' });
      }
      
      // Verify payment method
      const verification = await PaymentModel.verifyPaymentMethod(card_number, card_holder);
      if (!verification.valid) {
        return res.status(400).json({ message: verification.message });
      }
      
      // Process payment
      const paymentId = await PaymentModel.createPayment({
        appointment_id,
        card_number,
        card_holder,
        amount
      });
      
      res.status(201).json({
        message: 'Payment processed successfully',
        paymentId
      });
    } catch (error) {
      console.error('Process payment error:', error);
      res.status(500).json({ message: 'Server error while processing payment' });
    }
  }

  // Get user's payment history
  async getUserPaymentHistory(req, res) {
    try {
      const userId = req.user.id; // Set by auth middleware
      
      const payments = await PaymentModel.getPaymentsByUserId(userId);
      
      // Mask card numbers for security
      const maskedPayments = payments.map(payment => ({
        ...payment,
        card_number: maskCardNumber(payment.card_number)
      }));
      
      res.status(200).json({ payments: maskedPayments });
    } catch (error) {
      console.error('Get payment history error:', error);
      res.status(500).json({ message: 'Server error while fetching payment history' });
    }
  }

  // Get payment details by appointment ID
  async getPaymentByAppointmentId(req, res) {
    try {
      const userId = req.user.id; // Set by auth middleware
      const { appointment_id } = req.params;
      
      // Get appointment
      const appointment = await AppointmentModel.getAppointmentById(appointment_id);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      // Ensure the appointment belongs to the user
      if (appointment.user_id !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      const payment = await PaymentModel.getPaymentByAppointmentId(appointment_id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found for this appointment' });
      }
      
      // Mask card number for security
      payment.card_number = maskCardNumber(payment.card_number);
      
      res.status(200).json({ payment });
    } catch (error) {
      console.error('Get payment by appointment ID error:', error);
      res.status(500).json({ message: 'Server error while fetching payment details' });
    }
  }
}

// Helper function to mask card number (show only last 4 digits)
function maskCardNumber(cardNumber) {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  return '*'.repeat(cleanNumber.length - 4) + cleanNumber.slice(-4);
}

module.exports = new PaymentController();