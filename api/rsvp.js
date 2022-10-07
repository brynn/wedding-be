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
    const {name, email, response, plus_one, rehearsal_dinner, meal_choice, guest_meal_choice} =
      req.body;
    const query = `
      INSERT INTO rsvp (
        name, email, response, plus_one, rehearsal_dinner, meal_choice, guest_meal_choice)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const rsvp = await db.one(query, [
      name,
      email,
      response,
      plus_one,
      rehearsal_dinner,
      meal_choice,
      guest_meal_choice,
    ]);
    if (rsvp) {
      // If our RSVP insert succeeded, update rsvp_sent, response, and name in the guest table
      await db.none(
        `UPDATE guest SET rsvp_sent = TRUE, response = $2, name = $3 WHERE email = $1`,
        [email, !!rsvp.response, rsvp.name],
      );
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
