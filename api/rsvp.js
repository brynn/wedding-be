const db = require('../db');
const router = require('express').Router();
module.exports = router;

// GET /api/rsvp?email={email}
router.get('/', async (req, res, next) => {
  const email = req.query.email;
  if (!email) {
    res.status(403).send('Email is required');
  }
  try {
    const rsvp = await db.one(`SELECT * FROM rsvp WHERE email = $1`, [email]);
    if (rsvp) {
      res.send(rsvp);
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
        name, email, response, rehearsal_dinner, meal_choice)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const rsvp = await db.one(query, [
      name,
      email,
      response,
      rehearsal_dinner,
      meal_choice,
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
    next(err);
  }
});

// PUT /api/rsvp
router.put('/', async (req, res, next) => {
  try {
    const {name, response, plus_one, rehearsal_dinner, meal_choice, guest_meal_choice, email} =
      req.body;
    const query = `
      UPDATE rsvp
      SET
        name = $1,
        response = $2,
        plus_one = $3,
        rehearsal_dinner = $4,
        meal_choice = $5,
        guest_meal_choice = $6,
        update_time = now()
      WHERE email = $7
      RETURNING *
    `;
    const rsvp = await db.one(query, [
      name,
      response,
      plus_one,
      rehearsal_dinner,
      meal_choice,
      guest_meal_choice,
      email,
    ]);
    if (rsvp) {
      // If our RSVP update succeeded, update rsvp_sent, response, and name in the guest table
      await db.none(
        `UPDATE guest SET rsvp_sent = TRUE, response = $2, name = $3 WHERE email = $1`,
        [email, !!rsvp.response, rsvp.name],
      );
      res.send(rsvp);
    }
  } catch (err) {
    console.error(err);
    if (err?.constraint === 'rsvp_email_key') {
      res.status(409).send(`You already RSVP'd, thanks!`);
    } else {
      next(err);
    }
  }
});
