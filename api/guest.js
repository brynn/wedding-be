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
    if (guest) {
      res.send(guest);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});
