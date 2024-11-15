const jwt = require('jsonwebtoken');
const jwtpass=require('./jwtPassword');

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: 'Access denied' });

    try {
        const decoded = jwt.verify(token,jwtpass);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        res.status(403).json({ msg: 'Invalid token' });
    }
};
