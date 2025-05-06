const jwt = require('jsonwebtoken');
const JWT_SECRET = 'hospital_app_secret_key'; // Sử dụng env variable trong production

module.exports = (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Gắn thông tin user vào request
    req.user = { id: decoded.id, email: decoded.email };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

