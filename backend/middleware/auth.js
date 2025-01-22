const jwt = require('jsonwebtoken');
const { HttpStatus, HttpResponseMessage } = require('../enums/http');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = (res) => {
  res.status(HttpStatus.FORBIDDEN).send({ message: HttpResponseMessage.FORBIDDEN });
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secreto');
  } catch (err) {
    handleAuthError(res);
  }

  req.user = payload;
  next();
};
