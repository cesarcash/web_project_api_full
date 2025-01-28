const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const usersRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middleware/auth');
const { validateRegister, validateLogin } = require('./middleware/validations');
const { requestLogger, errorLogger } = require('./middleware/logger');

const { HttpResponseMessage } = require('./enums/http');

const allowedCors = [
  'https://cesarcash.chickenkiller.com',
  'http://cesarcash.chickenkiller.com',
  'http://localhost:3000',
];
const DEFAULT_ALLOWED_METHODS = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];

const { PORT = 3000 } = process.env;
const app = express();

// mongoose.connect('mongodb://127.0.0.1:27017/aroundb')
mongoose.connect('mongodb+srv://cesarcash5:cesarcash123@cluster0.tk29m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to mongoDB');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });

app.use(express.json());
app.use(cors());
app.options('*', cors());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS.join(','));
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  next();
});

app.use(requestLogger);

app.post('/signin', validateLogin, login);

app.post('/signup', validateRegister, createUser);

app.use(auth);

app.use('/users', usersRoute);

app.use('/cards', cardRoute);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? HttpResponseMessage.SERVER_ERROR : message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
