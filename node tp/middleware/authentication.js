const jwt = require('jsonwebtoken');

const authenticated = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(403).json({ message: 'must be an authenticated user' })
    }
    if (!authorization.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'must be an authenticated user' })
    }
    token = authorization.substring(7, authorization.length);
    const isValid = jwt.verify(token, process.env.SECRET_KEY);
    if (!isValid) {
        return res.status(400).json({ message: 'invalid token' })
    }
    next();
}

module.exports = { authenticated }