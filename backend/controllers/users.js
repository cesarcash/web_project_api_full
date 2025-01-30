const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { HttpStatus, HttpResponseMessage } = require('../enums/http');
const AuthError = require('../middleware/errors/AuthError');
const BadRequestError = require('../middleware/errors/BadRequestError');
const NotFoundError = require('../middleware/errors/NotFoundError');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        throw new NotFoundError(HttpResponseMessage.NOT_FOUND);
      }
      res.send({ data: users });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError(HttpResponseMessage.NOT_FOUND);
    })
    .then((user) => {
      res.status(HttpStatus.OK).send({ data: user });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    if (!name || !about) {
      throw new BadRequestError(HttpResponseMessage.BAD_REQUEST);
    }

    const updateUser = await User.findByIdAndUpdate(userId, { name, about }, { new: true }).orFail(() => {
      throw new NotFoundError(HttpResponseMessage.NOT_FOUND);
    });
    res.status(HttpStatus.OK).send({ data: updateUser });
  } catch (err) {
    next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthError(HttpResponseMessage.UNAUTHORIZED);
    }
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError(HttpResponseMessage.NOT_FOUND);
    }
    res.status(HttpStatus.OK).send({
      email: user.email, name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;

  const { avatar } = req.body;

  if (!avatar) {
    throw new BadRequestError(HttpResponseMessage.BAD_REQUEST);
  }

  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .orFail(() => {
      throw new NotFoundError(HttpResponseMessage.NOT_FOUND);
    })
    .then((user) => res.status(HttpStatus.OK).send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError(HttpResponseMessage.BAD_REQUEST);
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthError(HttpResponseMessage.UNAUTHORIZED);
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new AuthError(HttpResponseMessage.UNAUTHORIZED);
    }
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secreto', { expiresIn: '7d' });
    res.status(HttpStatus.OK).send({ token });
  } catch (err) {
    next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AuthError(HttpResponseMessage.BAD_REQUEST);
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });

    res.status(HttpStatus.CREATED).send({ data: { _id: user._id, email: user.email } });
  } catch (e) {
    next(e);
  }
};
