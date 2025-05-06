const db = require('../config/db');

class Payment {
  static async findAll() {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT p.*, a.date, a.time, d.name as doctor_name, u.name as user_name
        FROM payments p
        JOIN appointments a ON p.appointment_id = a.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u ON a.user_id = u.id
      `, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT p.*, a.date, a.time, d.name as doctor_name, u.name as user_name
        FROM payments p
        JOIN appointments a ON p.appointment_id = a.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u ON a.user_id = u.id
        WHERE p.id = ?
      `, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0]);
      });
    });
  }

  static async findByAppointmentId(appointmentId) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM payments WHERE appointment_id = ?', [appointmentId], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0]);
      });
    });
  }

  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT p.*, a.date, a.time, d.name as doctor_name
        FROM payments p
        JOIN appointments a ON p.appointment_id = a.id
        JOIN doctors d ON a.doctor_id = d.id
        WHERE a.user_id = ?
        ORDER BY a.date DESC, a.time DESC
      `, [userId], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  static async create(paymentData) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO payments SET ?', paymentData, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.insertId);
      });
    });
  }

  static async update(id, paymentData) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE payments SET ? WHERE id = ?', [paymentData, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.affectedRows > 0);
      });
    });
  }

  static async updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE payments SET status = ? WHERE id = ?', [status, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.affectedRows > 0);
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM payments WHERE id = ?', [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.affectedRows > 0);
      });
    });
  }

  static async getTotalByUser(userId) {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT SUM(p.amount) as total
        FROM payments p
        JOIN appointments a ON p.appointment_id = a.id
        WHERE a.user_id = ? AND p.status = 'completed'
      `, [userId], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0]?.total || 0);
      });
    });
  }
}

module.exports = Payment;