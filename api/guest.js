const db = require('../db');
const router = require('express').Router();
module.exports = router;

// GET /api/guest?email={email}
router.get('/', async (req, res, next) => {
  const email = req.query.email;
  if (!email) {
    res.status(403).send('Email is required');
  }
  try {
    const guest = await db.one(`SELECT * FROM guest WHERE email = $1`, [email]);
    console.log('guest from DB: ', guest);
    if (guest) {
      const rsvp = await db.one(`SELECT * FROM rsvp where guest_id = $1`, [guest.id]);
      guest.rsvp = rsvp;
      console.log('guest rsvp from DB: ', rsvp);
      const plus_one = await db.one(`
        SELECT *
        FROM guest g
        JOIN plus_ones p ON (g.id = p.guest_id)
        WHERE id = p.id`);
      guest.plus_one = plus_one;
      console.log('guest plus one from DB: ', plus_one);
      res.send(guest);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});
