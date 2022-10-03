const db = require('../db');
const router = require('express').Router();
module.exports = router;

// GET /api/rsvp
router.get('/', async (req, res, next) => {
  try {
    const rsvps = await db.any('SELECT * from rsvp');
    if (rsvps) {
      res.send(rsvps);
    }
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
    const query = `
      INSERT INTO rsvp (name, email, response, plus_one)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const rsvp = await db.one(query, [name, email, response, plus_one]);
    if (rsvp) {
      // If our RSVP insert succeeded, update rsvp_sent in the guest table
      await db.none(`UPDATE guest SET rsvp_sent = TRUE WHERE email = $1`, [email]);
      res.send(rsvp);
    }
  } catch (err) {
    console.error(err);
    if (err?.constraint === 'rsvp_name_key') {
      res.status(409).send(`You already RSVP'd, thanks!`);
    } else {
      next(err);
    }
  }
});
