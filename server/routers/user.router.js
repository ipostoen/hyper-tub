const express = require('express');
const user = require('../controllers/user/user');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.route('/me').get(authenticate.authenticate, user.me);
router.route('/:id').get(authenticate.authenticate, user.userById);
router.route('/password/:id').put(authenticate.authenticate, user.updateUserPassword);
router.route('/:id').put(authenticate.authenticate, user.updateUserInfo);

module.exports = router;