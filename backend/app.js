const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const usersRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middleware/auth');

const { HttpStatus, HttpResponseMessage } = require('./enums/http');

const allowedCors = [
  'https://cesarcash.chickenkiller.com',
  'http://cesarcash.chickenkiller.com',
  'http://localhost:3000',
];
const DEFAULT_ALLOWED_METHODS = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb')
  .then(() => {
    console.log('Connected to mongoDB');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });

app.use(express.json());
app.use(errors());

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

app.use((req, res, next) => {
  req.user = {
    _id: '6743cb8d08a4cb3a371e4732',
  };
  next();
});

app.use('/users', auth, usersRoute);

app.use('/cards', auth, cardRoute);

app.post('/signin', login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(5),
  }),
}), createUser);

app.use('/', (req, res) => {
  res.status(HttpStatus.NOT_FOUND).send(HttpResponseMessage.NOT_FOUND);
});

// app.use((err, req, res, next) => {

// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
