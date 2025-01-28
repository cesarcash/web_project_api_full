const Cards = require('../models/card');
const { HttpStatus, HttpResponseMessage } = require('../enums/http');
const AuthError = require('../middleware/errors/AuthError');
const BadRequestError = require('../middleware/errors/BadRequestError');
const NotFoundError = require('../middleware/errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.send(cards))
    .catch((error) => {
      next(error);
    });
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  if (!name || !link) {
    throw new BadRequestError(HttpResponseMessage.BAD_REQUEST);
  }

  Cards.create({ name, link, owner })
    .then((card) => res.status(HttpStatus.CREATED).send({ data: card }))
    .catch((error) => {
      next(error);
    });
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    if (!cardId) {
      throw new BadRequestError(HttpResponseMessage.BAD_REQUEST);
    }
    const card = await Cards.findById(cardId).orFail(() => {
      throw new NotFoundError(HttpResponseMessage.NOT_FOUND);
    });
    if (req.user._id.toString() === card.owner._id.toString()) {
      await card.deleteOne();
      res.status(HttpStatus.OK).send(HttpResponseMessage.SUCCESS);
    } else {
      throw new AuthError(HttpResponseMessage.UNAUTHORIZED);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.likeCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Cards.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(() => {
      throw new NotFoundError(HttpResponseMessage.NOT_FOUND);
    })
    // .then((card) => res.status(HttpStatus.OK).send({ data: card }))
    .then((card) => res.status(HttpStatus.OK).send(card))
    .catch((err) => {
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Cards.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      throw new NotFoundError(HttpResponseMessage.NOT_FOUND);
    })
    .then((card) => res.status(HttpStatus.OK).send(card))
    .catch((err) => {
      next(err);
    });
};
