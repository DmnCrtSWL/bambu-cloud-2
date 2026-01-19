const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Bearer <token>
    const bearer = token.split(' ');
    const bearerToken = bearer[1];

    if (!bearerToken) {
        return res.status(403).json({ message: 'Malformed token' });
    }

    jwt.verify(bearerToken, process.env.JWT_SECRET || 'secret_key_placeholder', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;
