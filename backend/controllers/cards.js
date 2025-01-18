const Cards = require('../models/card');
const { HttpStatus, HttpResponseMessage } = require('../enums/http');

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send(cards))
    .catch((error) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    });
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  if (!name || !link) {
    return res.status(HttpStatus.BAD_REQUEST).send({ message: HttpResponseMessage.BAD_REQUEST });
  }

  Cards.create({ name, link, owner })
    .then((card) => res.status(HttpStatus.CREATED).send({ data: card }))
    .catch((error) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Cards.findById(cardId)
    .orFail(() => {
      const error = new Error('No se encontró la trajeta con el ID');
      error.statusCode = HttpStatus.NOT_FOUND;
      throw error;
    })
    .then((card) => card.deleteOne())
    .then(() => res.status(HttpStatus.OK).send(HttpResponseMessage.SUCCESS))
    .catch((err) => {
      if (err.statusCode === HttpStatus.NOT_FOUND) {
        return res.status(err.statusCode).send({ message: HttpResponseMessage.NOT_FOUND });
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Cards.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(() => {
      const error = new Error('La tarjeta con el ID ingresado no existe');
      error.statusCode = HttpStatus.NOT_FOUND;
      throw error;
    })
    .then((card) => res.status(HttpStatus.OK).send({ data: card }))
    .catch((err) => {
      if (err.statusCode === HttpStatus.NOT_FOUND) {
        return res.status(HttpStatus.NOT_FOUND).send({ message: HttpResponseMessage.NOT_FOUND });
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Cards.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      const error = new Error('Error al obtener la tarjeta con el ID ingresado');
      error.statusCode = HttpStatus.NOT_FOUND;
      throw error;
    })
    .then((card) => res.status(HttpStatus.OK).send({ data: card }))
    .catch((err) => {
      if (err.statusCode === HttpStatus.NOT_FOUND) {
        return res.status(HttpStatus.NOT_FOUND).send({ message: HttpResponseMessage.NOT_FOUND });
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};
