import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ 
        message: 'no token provided',
        success: false,
      });
    } 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ 
        message: 'invalid token',
        success: false,
      });
    }
    req.id = decoded.userId;
    next();
  } catch(error) {
    res.status(401).json({ 
      message: 'Unauthorized',
      success: false, 
    });
  }
}

export default authenticateToken;