const db = require('../db');
const router = require('express').Router();
module.exports = router;

const insertRSVPQuery = `
    INSERT INTO rsvp (guest_id, name, email, response, meal_choice, rehearsal_dinner)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (guest_id) DO UPDATE
    SET
      name = $2,
      email = $3,
      response = $4,
      meal_choice = $5,
      rehearsal_dinner = $6
    RETURNING *
`;

// POST /api/rsvp
// req.body is of type RSVPs {guest_rsvp, plus_one_rsvp}
// Returns the updated RSVPs
router.post('/', async (req, res, next) => {
  let {guest_rsvp, plus_one_rsvp} = req.body;
  if (!guest_rsvp.response) {
    plus_one_rsvp = null;
  }
  if (plus_one_rsvp && !plus_one_rsvp.name) {
    console.log('name is required');
    return res.status(403).send('Name is required');
  }

  const {guest_id, name, email, response, meal_choice, rehearsal_dinner} = guest_rsvp;

  let new_guest_rsvp,
    new_plus_one_rsvp = null;

  try {
    new_guest_rsvp = await db.one(insertRSVPQuery, [
      guest_id,
      name,
      email,
      response,
      meal_choice,
      rehearsal_dinner,
    ]);
    await db.none(`UPDATE guest SET name = $1, email = $2 WHERE id = $3`, [name, email, guest_id]);

    let new_plus_one = null;
    if (plus_one_rsvp) {
      const {guest_id, name, email, response, meal_choice, rehearsal_dinner} = plus_one_rsvp;
      if (!guest_id) {
        // We need to add a the new plus one to the guest and plus_ones tables first
        new_plus_one = await db.one(
          `
          INSERT INTO guest (name, email, plus_one_allowed)
          VALUES ($1, $2, $3)
          RETURNING *
          `,
          [name, email, false],
        );
        if (new_plus_one) {
          await db.none(
            `
            INSERT INTO plus_ones (guest_id, plus_one_id)
            VALUES ($1, $2)`,
            [guest_rsvp.guest_id, new_plus_one.id],
          );
        }
      }

      // Now we can add the plus one's RSVP
      const plus_one_id = new_plus_one?.id || plus_one_rsvp.guest_id;
      new_plus_one_rsvp = await db.one(insertRSVPQuery, [
        plus_one_id,
        name,
        email,
        response,
        meal_choice,
        rehearsal_dinner,
      ]);
      await db.none(`UPDATE guest SET name = $1, email = $2 WHERE id = $3`, [
        name,
        email,
        plus_one_id,
      ]);
    } else if (!guest_rsvp.response) {
      // If the guest declines, make sure their plus one also declines
      await db.none(
        `
        UPDATE rsvp 
        SET response = FALSE 
        WHERE guest_id = (
          SELECT plus_one_id 
          FROM plus_ones
          WHERE guest_id = $1)`,
        [guest_id],
      );
    }

    return res.send({
      guest_rsvp: new_guest_rsvp,
      plus_one_rsvp: new_plus_one_rsvp,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
