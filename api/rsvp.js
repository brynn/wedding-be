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
    const {name, email, response, plus_one} = req.body;
    // TODO: add ON CONFLICT (name) for updating RSVPs
    // TODO: add meal_choice to form
    const query = {
      text: `
      INSERT INTO rsvp (name, email, response, plus_one)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      values: [name, email, response, plus_one],
    };
    db.query(query, (err, result) => {
      if (err?.constraint === 'rsvp_name_key') {
        res.status(409).send(`You already RSVP'd, thanks!`);
      } else if (err) {
        res.status(500).send(err.detail);
      }
      if (result?.rows?.length) {
        const newRSVP = result.rows[0];
        // If our RSVP insert succeeded, update rsvp_sent in the guest table
        const guestQuery = {
          text: `
              UPDATE guest
              SET rsvp_sent = TRUE 
              WHERE email = $1
              `,
          values: [newRSVP.email],
        };
        db.query(guestQuery, (err, result) => {
          if (err) {
            res.status(500).send(err.detail);
          }
          res.send(newRSVP);
        });
      }
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
