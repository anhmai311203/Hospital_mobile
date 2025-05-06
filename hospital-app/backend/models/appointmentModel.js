const db = require('../config/db');

class AppointmentModel {
  static async findAll() {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT a.*, d.name as doctor_name, d.specialty, u.name as user_name
        FROM appointments a
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
        SELECT a.*, d.name as doctor_name, d.specialty, u.name as user_name
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u ON a.user_id = u.id
        WHERE a.id = ?
      `, [id], (err, results) => {
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
        SELECT a.*, d.name as doctor_name, d.specialty
        FROM appointments a
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

  static async findByDoctorId(doctorId) {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT a.*, u.name as user_name
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        WHERE a.doctor_id = ?
        ORDER BY a.date ASC, a.time ASC
      `, [doctorId], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  static async findByDate(date) {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT a.*, d.name as doctor_name, d.specialty, u.name as user_name
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u ON a.user_id = u.id
        WHERE a.date = ?
        ORDER BY a.time ASC
      `, [date], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  static async create(appointmentData) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO appointments SET ?', appointmentData, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.insertId);
      });
    });
  }

  static async update(id, appointmentData) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE appointments SET ? WHERE id = ?', [appointmentData, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.affectedRows > 0);
      });
    });
  }

  static async updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.affectedRows > 0);
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM appointments WHERE id = ?', [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.affectedRows > 0);
      });
    });
  }

  static async checkAvailability(doctorId, date, time) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM appointments WHERE doctor_id = ? AND date = ? AND time = ?',
        [doctorId, date, time],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results.length === 0);
        }
      );
    });
  }

  static async getUpcomingByUser(userId, limit = 5) {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT a.*, d.name as doctor_name, d.specialty
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        WHERE a.user_id = ? AND a.date >= CURDATE()
        ORDER BY a.date ASC, a.time ASC
        LIMIT ?
      `, [userId, limit], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  static async getUserAppointments(userId) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM appointments WHERE user_id = ? ORDER BY date DESC, time DESC`,
        [userId]
      );

      return rows;
    } catch (error) {
      console.error('[AppointmentModel.getUserAppointments] Error:', error);
      throw error;
    }
  }

  static async getAppointmentsByUserId(userId) {
    return this.getUserAppointments(userId);
  }
}
module.exports = AppointmentModel;

