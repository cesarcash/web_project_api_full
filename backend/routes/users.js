const router = require('express').Router();

const {
  getUsers, getUserById, updateProfile, updateAvatar, getUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

router.get('/users/me', getUser);

module.exports = router;
