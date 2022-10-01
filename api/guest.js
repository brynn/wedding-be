const db = require('../db');
const router = require('express').Router();
module.exports = router;

// GET /api/guest
router.get('/', async (req, res, next) => {
  const email = req.query.email;
  try {
    const query = {
      text: `
        SELECT * FROM guest
        WHERE email = $1
        `,
      values: [email],
    };
    db.query(query, (err, result) => {
      if (!result?.rows?.length) {
        res.status(403).send();
      } else if (err) {
        res.status(500).send(err.detail);
      }
      res.send(result.rows[0]);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
