const jwt = require('jsonwebtoken');

const createToken = async (user) => {
    const token = jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: '7d' })
    return token;
}

module.exports = { createToken };