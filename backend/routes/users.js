const router = require('express').Router();

const {
  getUsers, getUserById, updateProfile, updateAvatar, getUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

router.get('/me', getUser);

router.get('/:userId', getUserById);

module.exports = router;
