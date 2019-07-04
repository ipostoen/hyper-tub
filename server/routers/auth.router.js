const express = require('express');
const auth = require('../controllers/auth/auth');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.route('/login').get(auth.login);
router.route('/register').post(auth.registerUser);
router.route('/logout').delete(authenticate.authenticate, auth.logout);

module.exports = router;