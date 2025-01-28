const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateCreateCard, validateIdCard } = require('../middleware/validations');

router.get('/', getCards);

router.post('/', validateCreateCard, createCard);

router.delete('/:cardId', validateIdCard, deleteCard);

router.put('/likes/:cardId', validateIdCard, likeCard);

router.delete('/likes/:cardId', validateIdCard, dislikeCard);

module.exports = router;
