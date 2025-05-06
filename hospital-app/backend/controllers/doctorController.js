// backend/controllers/doctorController.js
const DoctorModel = require('../models/doctorModel');

class DoctorController {
  // Get all doctors
  async getAllDoctors(req, res) {
    try {
      // Gọi đúng hàm findAll từ model
      const doctors = await DoctorModel.findAll();
      res.status(200).json(doctors); // Trả về trực tiếp mảng doctors
    } catch (error) {
      console.error('Get all doctors error:', error);
      res.status(500).json({ message: 'Server error while fetching doctors' });
    }
  }

  // Get doctor by ID
  async getDoctorById(req, res) {
    try {
      const { id } = req.params;
      
      const doctor = await DoctorModel.findById(id);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      
      res.status(200).json({ doctor });
    } catch (error) {
      console.error('Get doctor by ID error:', error);
      res.status(500).json({ message: 'Server error while fetching doctor' });
    }
  }

  // Get doctors by specialty
  async getDoctorsBySpecialty(req, res) {
    try {
      const { specialty } = req.params;
      
      const doctors = await DoctorModel.getDoctorsBySpecialty(specialty);
      res.status(200).json({ doctors });
    } catch (error) {
      console.error('Get doctors by specialty error:', error);
      res.status(500).json({ message: 'Server error while fetching doctors by specialty' });
    }
  }

  // Search doctors
  async searchDoctors(req, res) {
    try {
      const { query } = req.query;
      
      if (!query) {
        // Gọi đúng hàm findAll khi không có query
        const doctors = await DoctorModel.findAll();
        return res.status(200).json({ doctors });
      }
      
      const doctors = await DoctorModel.searchDoctors(query);
      res.status(200).json({ doctors });
    } catch (error) {
      console.error('Search doctors error:', error);
      res.status(500).json({ message: 'Server error while searching doctors' });
    }
  }

  // Rate doctor
  async rateDoctor(req, res) {
    try {
      const { id } = req.params;
      const { rating } = req.body;
      
      // Validate input
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      
      // Check if doctor exists
      const doctor = await DoctorModel.getDoctorById(id);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      
      // Update rating (in a real app, we would store individual ratings and calculate average)
      const success = await DoctorModel.updateRating(id, rating);
      
      if (success) {
        const updatedDoctor = await DoctorModel.getDoctorById(id);
        res.status(200).json({ 
          message: 'Doctor rated successfully',
          doctor: updatedDoctor
        });
      } else {
        res.status(400).json({ message: 'Failed to rate doctor' });
      }
    } catch (error) {
      console.error('Rate doctor error:', error);
      res.status(500).json({ message: 'Server error while rating doctor' });
    }
  }

  // Get available specialties
  async getSpecialties(req, res) {
    try {
      const specialties = await DoctorModel.getSpecialties();
      res.status(200).json({ specialties });
    } catch (error) {
      console.error('Get specialties error:', error);
      res.status(500).json({ message: 'Server error while fetching specialties' });
    }
  }

  // Get detailed doctor information
  async getDoctorDetails(req, res) {
    try {
      const { id } = req.params;
      const doctor = await DoctorModel.findById(id);

      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      // Xử lý dữ liệu dịch vụ nếu được lưu dạng chuỗi JSON
      if (doctor.services && typeof doctor.services === 'string') {
        try {
          doctor.services = JSON.parse(doctor.services);
        } catch (e) {
          console.error('Error parsing services JSON:', e);
          doctor.services = [];
        }
      }

      res.status(200).json({ doctor });
    } catch (error) {
      console.error('Get doctor details error:', error);
      res.status(500).json({ message: 'Server error while fetching doctor details' });
    }
  }
}




module.exports = new DoctorController();