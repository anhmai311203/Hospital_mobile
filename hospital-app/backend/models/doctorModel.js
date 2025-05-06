const db = require('../config/db');

class Doctor {
  static async findAll() {
    // Sử dụng async/await trực tiếp với pool.query
    // pool.query trả về một mảng [rows, fields]
    const [rows] = await db.query('SELECT * FROM doctors');
    return rows;
  }

  static async findById(id) {
    // Sử dụng prepared statement với execute để an toàn hơn
    const [rows] = await db.execute('SELECT * FROM doctors WHERE id = ?', [id]);
    // Trả về doctor đầu tiên tìm thấy hoặc null/undefined nếu không có
    return rows[0];
  }

  static async findBySpecialty(specialty) {
    const [rows] = await db.execute('SELECT * FROM doctors WHERE specialty = ?', [specialty]);
    return rows;
  }

  static async findByLocation(location) {
    const [rows] = await db.execute('SELECT * FROM doctors WHERE location = ?', [location]);
    return rows;
  }

  static async findTopRated(limit = 5) {
    // Chuyển limit thành số nguyên để tránh lỗi SQL injection tiềm ẩn
    const intLimit = parseInt(limit, 10);
    const [rows] = await db.query('SELECT * FROM doctors ORDER BY rating DESC LIMIT ?', [intLimit]);
    return rows;
  }

  static async create(doctorData) {
    // db.query với object data tự động escape giá trị
    const [result] = await db.query('INSERT INTO doctors SET ?', doctorData);
    // result là một object chứa thông tin như insertId, affectedRows
    return result.insertId;
  }

  static async update(id, doctorData) {
    const [result] = await db.query('UPDATE doctors SET ? WHERE id = ?', [doctorData, id]);
    // Trả về true nếu có hàng bị ảnh hưởng
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM doctors WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async updateRating(id, rating) {
    const [result] = await db.execute('UPDATE doctors SET rating = ? WHERE id = ?', [rating, id]);
    return result.affectedRows > 0;
  }

  // Thêm các hàm còn thiếu mà controller đang gọi
  static async searchDoctors(query) {
    const searchQuery = `%${query}%`;
    const [rows] = await db.execute('SELECT * FROM doctors WHERE name LIKE ? OR specialty LIKE ?', [searchQuery, searchQuery]);
    return rows;
  }

  static async getSpecialties() {
    // Lấy danh sách các chuyên khoa duy nhất từ bảng doctors
    const [rows] = await db.query('SELECT DISTINCT specialty FROM doctors ORDER BY specialty ASC');
    // Trả về mảng các chuỗi chuyên khoa
    return rows.map(row => row.specialty);
  }
}

module.exports = Doctor;