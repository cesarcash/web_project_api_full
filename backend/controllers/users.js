const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { HttpStatus, HttpResponseMessage } = require('../enums/http');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((error) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      const error = new Error('No se encontró el usuario con el ID');
      error.statusCode = HttpStatus.NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.status(HttpStatus.OK).send({ data: user });
    })
    .catch((error) => {
      if (error.statusCode === HttpStatus.NOT_FOUND) {
        return res.status(error.statusCode).send({ message: HttpResponseMessage.NOT_FOUND });
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    });
};

module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    if (!name || !about) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: HttpResponseMessage.BAD_REQUEST });
    }

    const user = await User.findById(userId).orFail(() => {
      const error = new Error('No se encontro el usuario');
      error.statusCode = HttpStatus.NOT_FOUND;
      throw error;
    });

    if (user._id.toString() === userId.toString()) {
      const updateUser = await User.findByIdAndUpdate(userId, { name, about }, { new: true });
      res.status(HttpStatus.OK).send({ data: updateUser });
    } else {
      res.status(HttpStatus.UNAUTHORIZED).send({ message: HttpResponseMessage.UNAUTHORIZED });
    }
  } catch (err) {
    if (err.statusCode === HttpStatus.NOT_FOUND) {
      return res.status(err.statusCode).send({ message: HttpResponseMessage.NOT_FOUND });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ message: HttpResponseMessage.UNAUTHORIZED });
    }
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send({ message: HttpResponseMessage.NOT_FOUND });
    }
    res.status(HttpStatus.OK).send({ email: user.email });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpResponseMessage.SERVER_ERROR });
  }
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;

  const { avatar } = req.body;

  if (!avatar) {
    return res.status(HttpStatus.BAD_REQUEST).send({ message: HttpResponseMessage.BAD_REQUEST });
  }

  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .orFail(() => {
      const error = new Error('No se encontró el usuario con el ID ');
      error.statusCode = HttpStatus.NOT_FOUND;
      throw error;
    })
    .then((user) => res.status(HttpStatus.OK).send({ data: user }))
    .catch((err) => {
      if (err.statusCode === HttpStatus.NOT_FOUND) {
        return res.status(err.statusCode).send({ message: HttpResponseMessage.NOT_FOUND });
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Email and password incorrect' });
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Email and password incorrect' });
    }
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secreto', { expiresIn: '7d' });
    res.status(HttpStatus.OK).send({ token });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      message: err.message || HttpResponseMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    if (!name || !about || !avatar || !email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: HttpResponseMessage.BAD_REQUEST });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });

    res.status(HttpStatus.CREATED).send({ data: { _id: user._id, email: user.email } });
  } catch (e) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: e.message });
  }
};
