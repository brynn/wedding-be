const db = require('../db');
const router = require('express').Router();
module.exports = router;

// GET /api/guest
router.get('/', async (req, res, next) => {
  const email = req.query.email;
  if (!email) {
    res.status(403).send('Email is required');
  }
  try {
    const query = {
      text: `
        SELECT * FROM guest
        WHERE email = $1
        `,
      values: [email],
    };
    await db.connect();
    const {rows} = await db.query(query);
    if (rows?.length) {
      res.send(rows[0]);
    }

    // db.query(query, (err, result) => {
    //   if (!result?.rows?.length) {
    //     res.status(403).send();
    //   } else if (err) {
    //     res.status(500).send(err.detail);
    //   } else if (result) {
    //     res.send(result.rows[0]);
    //   }
    //   db.end();
    // });
  } catch (err) {
    console.error(err);
    next(err);
  }
  db.end();
});
