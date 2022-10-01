const db = require('../db');
const router = require('express').Router();
module.exports = router;

// GET /api/rsvp
router.get('/', async (req, res, next) => {
  try {
    db.query('SELECT * from rsvp', (err, result) => {
      if (err) {
        res.status(500).send(err.detail);
      }
      res.send(result?.rows);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// POST /api/rsvp
router.post('/', async (req, res, next) => {
  try {
    const {name, response, plus_one, meal_choice} = req.body;
    const query = {
      text: `
      INSERT INTO rsvp (name, response, plus_one, meal_choice)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      values: [name, response, plus_one, meal_choice],
    };
    db.query(query, (err, result) => {
      if (err?.constraint === 'rsvp_name_key') {
        res.status(409).send(`You already RSVP'd, thanks!`);
      } else if (err) {
        res.status(500).send(err.detail);
      }
      if (result?.rows?.length) {
        res.send(result.rows[0]);
      }
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
