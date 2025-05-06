// backend/controllers/userController.js
const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// JWT secret key (use environment variable in production)
const JWT_SECRET = 'hospital_app_secret_key';

class UserController {
  // Register a new user
  async register(req, res) {
    try {
      const { name, email, password, phone, address } = req.body;
      
      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }
      
      // Check if user already exists
      const existingUser = await UserModel.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists with this email' });
      }
      
      // Create user
      const userId = await UserModel.create({
        name,
        email,
        password,
        phone: phone || '',
        address: address || ''
      });
      
      // Generate JWT token
      const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
      
      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: userId,
          name,
          email,
          phone: phone || '',
          address: address || ''
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      // Check if user exists
      const user = await UserModel.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          address: user.address || ''
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  }

  // Get user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.id; // Set by auth middleware
      
      const user = await UserModel.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Server error while fetching profile' });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.id; // Set by auth middleware
      const { name, phone, address } = req.body;
      
      const success = await UserModel.updateUser(userId, {
        name,
        phone,
        address
      });
      
      if (success) {
        const updatedUser = await UserModel.getUserById(userId);
        res.status(200).json({ 
          message: 'Profile updated successfully',
          user: updatedUser
        });
      } else {
        res.status(400).json({ message: 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error while updating profile' });
    }
  }

  // Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone, address } = req.body;
      // Validation
      if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
      }
      
      // Check if user exists
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Verify current user (optional security check)
      if (req.user && req.user.id !== parseInt(id)) {
        return res.status(403).json({ message: 'Not authorized to update this user' });
      }
      
      // Update user
      const updateData = { name, email, phone: phone || '', address: address || '' };
      const success = await UserModel.update(id, updateData);
      
      if (success) {
        // Get updated user data
        const updatedUser = await UserModel.findById(id);
        res.status(200).json(updatedUser);
      } else {
        res.status(400).json({ message: 'Failed to update user' });
      }
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: 'Server error while updating user' });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const userId = req.user.id; // Set by auth middleware
      const { currentPassword, newPassword } = req.body;
      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current and new passwords are required' });
      }
      
      // Get user
      const user = await UserModel.getUserByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      
      // Update password
      const success = await UserModel.updatePassword(userId, newPassword);
      
      if (success) {
        res.status(200).json({ message: 'Password changed successfully' });
      } else {
        res.status(400).json({ message: 'Failed to change password' });
      }
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Server error while changing password' });
    }
  }

  // Submit feedback
  async submitFeedback(req, res) {
    try {
      const userId = req.user.id; // Set by auth middleware
      const { content, rating } = req.body; // Lấy cả content và rating
      // Validate input
      if (!content) {
        return res.status(400).json({ message: 'Feedback content is required' });
      }
      
      // Đảm bảo rating là số và nằm trong khoảng hợp lệ (nếu có)
      let ratingValue = null;
      if (rating !== undefined) {
        ratingValue = Number(rating);
        if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
          return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
        }
      }

      // Cập nhật cả tham số rating khi gọi hàm model
      const feedbackId = await UserModel.submitFeedback(userId, content, ratingValue);
      
      res.status(201).json({
        message: 'Feedback submitted successfully',
        feedbackId
      });
    } catch (error) {
      console.error('Submit feedback error:', error);
      res.status(500).json({ message: 'Server error while submitting feedback' });
    }
  }
}

module.exports = new UserController();