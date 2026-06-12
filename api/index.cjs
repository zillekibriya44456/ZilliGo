const app = require('../server/index.js');

module.exports = async function handler(req, res) {
  return app(req, res);
};
