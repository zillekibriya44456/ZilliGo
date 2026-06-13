const express = require('express');
const app = express();
try {
  app.get('/{*path}', (req, res) => res.send('ok'));
  console.log('Success');
} catch (err) {
  console.log('Error:', err.message);
}
