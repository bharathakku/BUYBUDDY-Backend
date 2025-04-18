const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Received token:', token); 

      console.log('JWT_SECRET being used:', process.env.JWT_SECRET); 

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded JWT:', decoded);

      req.user = await User.findById(decoded.id).select('-password');
      console.log('Authenticated user:', req.user);

      next();
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('Authorization header missing or malformed:', req.headers.authorization);
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
const isAdmin = (req, res, next) => {
  console.log('Inside isAdmin middleware');
  console.log('User in request:', req.user);

  if (req.user && req.user.role === 'admin') {
    console.log('Access granted to admin');
    next();
  } else {
    console.log('Access denied. User is not admin or user missing');
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};



module.exports = { protect, isAdmin };
