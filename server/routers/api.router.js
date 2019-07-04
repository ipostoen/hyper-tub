const express = require('express');
const auth = require('./auth.router');
const user = require('./user.router');
const movie = require('./movie.router');

const router = express.Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/movie', movie);

module.exports = router;