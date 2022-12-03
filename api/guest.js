const db = require('../db');
const router = require('express').Router();
module.exports = router;

// GET /api/guest?email={email}
// Returns the guest along with their existing RSVP if it exists,
// as well as their plus one if one exists
router.get('/', async (req, res, next) => {
  const email = req.query.email;
  if (!email) {
    res.status(403).send('Email is required');
  }
  try {
    const guest = await db.one(`SELECT * FROM guest WHERE email = $1`, [email]);
    if (guest) {
      guest.rsvp = await db.oneOrNone(`SELECT * FROM rsvp where guest_id = $1`, [guest.id]);
      guest.plus_one = await db.oneOrNone(
        `
        SELECT *
        FROM guest g
        JOIN plus_ones p ON (g.id = p.plus_one_id)
        WHERE p.guest_id = $1`,
        [guest.id],
      );
      if (guest.plus_one) {
        guest.plus_one.rsvp = await db.oneOrNone(`SELECT * FROM rsvp where guest_id = $1`, [
          guest.plus_one.id,
        ]);
      }
      res.send(guest);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});
