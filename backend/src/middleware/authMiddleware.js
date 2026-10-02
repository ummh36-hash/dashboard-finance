import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kimi_finance_ultra_secure_secret_key_2026';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  // If mock/demo token
  if (token === 'demo-token-12345') {
    req.user = { id: 1, email: 'alex.kimi@finance.io' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
