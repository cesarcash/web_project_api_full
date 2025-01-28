const router = require('express').Router();

const {
  getUsers, getUserById, updateProfile, updateAvatar, getUser,
} = require('../controllers/users');

const {
  validateUpdateProfile, validateUpdateAvatar, validateIdUser,
} = require('../middleware/validations');

router.get('/', getUsers);

router.patch('/me', validateUpdateProfile, updateProfile);

router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

router.get('/me', getUser);

router.get('/:userId', validateIdUser, getUserById);

module.exports = router;
