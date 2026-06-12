const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign({ id: 1, role: 'traveler' }, process.env.JWT_SECRET, { expiresIn: '1d' });
console.log(token);
