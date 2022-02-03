const userService = require('../services/users');

exports.authByToken = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    next();
  }
  try {
    const user = await userService.getUserByToken(token);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

exports.ensureUser = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
};
