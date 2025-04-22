const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const router = express.Router();

// 1. Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const request = pool.request();
      request.input('email', sql.NVarChar, email); // Parameterized query
      const result = await request.query('SELECT * FROM users WHERE email = @email');
      const rows = result.recordset; // SQL Server trả về recordset
      if (rows.length === 0) return res.status(400).json({ message: 'User not found' });
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '1h',
      });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

// 2. Sign Up
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword,
    ]);
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. Search Doctors
router.get('/doctors', async (req, res) => {
  const { specialty, location, rating } = req.query;
  try {
    let query = 'SELECT * FROM doctors WHERE 1=1';
    const params = [];
    if (specialty) {
      query += ' AND specialty = ?';
      params.push(specialty);
    }
    if (location) {
      query += ' AND location = ?';
      params.push(location);
    }
    if (rating) {
      query += ' AND rating >= ?';
      params.push(parseFloat(rating));
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. Book Appointment
router.post('/appointments', async (req, res) => {
  const { user_id, doctor_id, date, time, notes } = req.body;
  try {
    await pool.query(
      'INSERT INTO appointments (user_id, doctor_id, date, time, notes) VALUES (?, ?, ?, ?, ?)',
      [user_id, doctor_id, date, time, notes]
    );
    res.status(201).json({ message: 'Appointment booked' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 5. Update Profile
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;
  try {
    await pool.query(
      'UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [name, email, phone, address, id]
    );
    res.json({ message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 6. Submit Feedback
router.post('/feedback', async (req, res) => {
  const { user_id, content } = req.body;
  try {
    await pool.query('INSERT INTO feedback (user_id, content) VALUES (?, ?)', [user_id, content]);
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 7. Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ message: 'User not found' });

    // TODO: Gửi email khôi phục mật khẩu (dùng nodemailer)
    res.json({ message: 'Password reset link sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 8. Doctor Filter
router.get('/doctors/filter', async (req, res) => {
  const { specialty, location, rating } = req.query;
  try {
    let query = 'SELECT * FROM doctors WHERE 1=1';
    const params = [];
    if (specialty) {
      query += ' AND specialty = ?';
      params.push(specialty);
    }
    if (location) {
      query += ' AND location = ?';
      params.push(location);
    }
    if (rating) {
      query += ' AND rating >= ?';
      params.push(parseFloat(rating));
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 9. Confirm Appointment
router.put('/appointments/:id/confirm', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE appointments SET status = ? WHERE id = ?', ['confirmed', id]);
    res.json({ message: 'Appointment confirmed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 10. Process Payment
router.post('/payments', async (req, res) => {
  const { appointment_id, card_number, card_holder, amount } = req.body;
  try {
    await pool.query(
      'INSERT INTO payments (appointment_id, card_number, card_holder, amount, status) VALUES (?, ?, ?, ?, ?)',
      [appointment_id, card_number, card_holder, amount, 'completed']
    );
    res.status(201).json({ message: 'Payment processed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;