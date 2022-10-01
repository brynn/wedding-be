const db = require('../db');

const router = require('express').Router();
module.exports = router;

// GET /api/rsvp
router.get('/rsvp', async (req, res, next) => {
  try {
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
    console.error(err);
    next(err);
  }
});
