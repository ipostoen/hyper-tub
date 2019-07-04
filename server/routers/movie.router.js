const express = require('express');
const movie = require('../controllers/movie/movie');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.route('/').get(authenticate.authenticate, movie.getFilm);
router.route('/stream/:magnet').get(authenticate.authenticate, movie.getStream);

module.exports = router;