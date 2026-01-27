const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('./config');

async function hashPassword(password) {
  // salt este un text random generat special pentru hashing 
  // 10 = salt rounds => cu cat este numarul mai mare, cu atat hashingul este mai lent 
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

function generateToken(user) { // generarea tokenului JWT
  const userData = {
    userId: user.id,
    email: user.email
  };

  return jwt.sign(userData, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = { hashPassword, comparePassword, generateToken, verifyToken };