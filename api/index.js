const db = require('../db');
const router = require('express').Router();
module.exports = router;

router.use('/rsvp', require('./rsvp'));

// Default 404
router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
