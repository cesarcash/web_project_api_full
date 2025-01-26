const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

// router.put('/:cardId/likes', likeCard);
router.put('/likes/:cardId', likeCard);

// router.delete('/:cardId/likes', dislikeCard);
router.delete('/likes/:cardId', dislikeCard);

module.exports = router;
