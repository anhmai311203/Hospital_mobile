const db = require('../config/db'); // Sử dụng db trực tiếp từ config
const bcrypt = require('bcrypt');

class UserModel { // Đổi tên class cho nhất quán với controller
  static async findAll() {
    try {
      const [results] = await db.query('SELECT * FROM users');
      return results;
    } catch (error) {
      console.error('[UserModel.findAll] Error:', error);
      throw error; // Re-throw để controller xử lý
    }
  }

  static async findById(id) {
    try {
      const [results] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      return results[0];
    } catch (error) {
      console.error('[UserModel.findById] Error:', error);
      throw error;
    }
  }

  // Hàm tìm user theo email (HÀM ĐƯỢC THÊM)
  static async getUserByEmail(email) {
    try {
      console.log('[UserModel.getUserByEmail] Querying for email:', email); // Giữ lại log này
      const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      console.log('[UserModel.getUserByEmail] Query result:', results[0]); // Thêm log kết quả
      return results[0];
    } catch (error) {
      console.error('[UserModel.getUserByEmail] Error:', error);
      throw error;
    }
  }

  // Hàm tạo user mới (cần mã hóa mật khẩu)
  static async create(userData) {
    const { name, email, password, phone, address } = userData;
    try {
      console.log('[UserModel.create] Hashing password...'); // Giữ lại log
      const hashedPassword = await bcrypt.hash(password, 10); // Mã hóa mật khẩu
      console.log('[UserModel.create] Inserting user:', { name, email, phone, address }); // Giữ lại log
      const [results] = await db.query(
        'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, phone, address],
      );
      console.log('[UserModel.create] Insert successful, ID:', results.insertId); // Thêm log thành công
      return results.insertId;
    } catch (error) {
      console.error('[UserModel.create] Error:', error);
      throw error;
    }
  }

  // Thêm hoặc cập nhật phương thức update
  static async update(id, userData) {
    try {
      // Xóa password nếu có để tránh cập nhật không kiểm soát
      const { password, ...dataToUpdate } = userData;

      // Tạo câu lệnh SQL động
      const keys = Object.keys(dataToUpdate);
      const values = Object.values(dataToUpdate);

      // Dùng dấu ? để tạo prepared statement, tránh SQL injection
      const placeholders = keys.map(() => '?').join(', ');
      const setClause = keys.map(key => `${key} = ?`).join(', ');

      // Execute query
      const [result] = await db.query(
        `UPDATE users SET ${setClause} WHERE id = ?`,
        [...values, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('[UserModel.update] Error:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [results] = await db.query('DELETE FROM users WHERE id = ?', [id]);
      return results.affectedRows > 0;
    } catch (error) {
      console.error('[UserModel.delete] Error:', error);
      throw error;
    }
  }
}

module.exports = UserModel; // Export với tên class đã đổi