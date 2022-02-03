const { Router } = require('express');
const { ensureUser } = require('../utils/auth');
const route = Router();

route.get('/', ensureUser, async (req, res, next) => {
  try {
    res.status(200).send({ message: `Hello ${req.user.name}!` });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = route;
