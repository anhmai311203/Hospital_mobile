const sql = require('mssql');

const poolConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'root',
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hospital_app',
  options: {
    encrypt: true, // Bật mã hóa (cần cho Azure hoặc một số cấu hình SQL Server)
    trustServerCertificate: true, // Bỏ qua kiểm tra chứng chỉ (dùng cho phát triển cục bộ)
  },
  pool: {
    max: 10, // Số kết nối tối đa
    min: 0,
    idleTimeoutMillis: 30000, // Thời gian chờ trước khi đóng kết nối không hoạt động
  },
};

const pool = new sql.ConnectionPool(poolConfig);

pool
  .connect()
  .then(() => console.log('Connected to SQL Server'))
  .catch((err) => console.error('SQL Server connection error:', err));

module.exports = pool;