const db = require('../db');
const router = require('express').Router();
module.exports = router;

// GET /api/rsvp
router.get('/rsvp', async (req, res, next) => {
  try {
    console.log('REQUEST: ', req);
    db.query('SELECT * from rsvp', (err, res) => {
      console.log('result of db query: ', err, res);
    });
    const fakeRSVP = {
      name: 'Testy McTest',
      response: 'yes',
      plus_one: false,
    };
    res.send(fakeRSVP);
  } catch (err) {
    next(err);
  }
});

// Default 404
router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
