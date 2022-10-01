const db = require('../db');

const router = require('express').Router();
module.exports = router;

// GET /api/rsvp
router.get('/rsvp', async (req, res, next) => {
  try {
    db.query('SELECT * from rsvp', (err, res) => {
      console.log('result of db query: ', err, res);
    });
  } catch (err) {
    next(err);
  }
});

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
