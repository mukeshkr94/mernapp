const jwt = require('jsonwebtoken');
const Candidate = require('../models/candidateModel')
const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    const token = req.cookies.token;
    console.log(token)
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
      const candidate = jwt.verify(token, process.env.JWT_SECRET);
      console.log('user',candidate);
      const c = await Candidate.findById(candidate.id);
      console.log(c);
      if (roles.length && !roles.includes(c.role)) {
        return res.status(403).json({ message: 'You are not authorized' });
      }
      
      req.candidate = candidate;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid Token' });
    }
  };
};

module.exports = authMiddleware;