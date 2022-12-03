const db = require('../db');
const router = require('express').Router();
module.exports = router;

const insertRSVPQuery = `
    INSERT INTO rsvp (guest_id, name, email, response, meal_choice, rehearsal_dinner)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
`;

// POST /api/rsvp
// req.body is of type RSVPs {guest_rsvp, plus_one_rsvp}
// Returns the updated RSVPs
// TODO: use this for updating also, with ON CONFLICT DO UPDATE (on guest ID)
router.post('/', async (req, res, next) => {
  let {guest_rsvp, plus_one_rsvp} = req.body;
  if (!guest_rsvp.response) {
    plus_one_rsvp = null;
  }
  if (plus_one_rsvp && !plus_one_rsvp.name) {
    res.status(403).send('Name is required');
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
      new_plus_one_rsvp = await db.one(insertRSVPQuery, [
        new_plus_one?.id || plus_one_rsvp.guest_id,
        name,
        email,
        response,
        meal_choice,
        rehearsal_dinner,
      ]);
    }

    res.send({
      guest_rsvp: new_guest_rsvp,
      plus_one_rsvp: new_plus_one_rsvp,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// PUT /api/rsvp
// req.body is of type RSVPs {guest_rsvp, plus_one_rsvp}
// Returns the updated RSVPs
router.put('/', async (req, res, next) => {
  const {guest_rsvp, plus_one_rsvp} = req.body;
  const {guest_id, name, email, response, meal_choice, rehearsal_dinner} = guest_rsvp;
  if (!guest_rsvp.response) {
    plus_one_rsvp = null;
  }
  if (plus_one_rsvp && !plus_one_rsvp.name) {
    res.status(403).send('Name is required');
    return;
  }

  let new_guest_rsvp,
    new_plus_one_rsvp = null;

  try {
    const updateRSVPQuery = `
      UPDATE rsvp
      SET
        name = $1,
        email = $2,
        response = $3,
        meal_choice = $4,
        rehearsal_dinner = $5,
        update_time = now()
      WHERE guest_id = $6
      RETURNING *
    `;
    new_guest_rsvp = await db.one(updateRSVPQuery, [
      name,
      email,
      response,
      meal_choice,
      rehearsal_dinner,
      guest_id,
    ]);
    await db.none(`UPDATE guest SET name = $1, email = $2 WHERE id = $3`, [name, email, guest_id]);

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
          new_plus_one_rsvp = await db.one(insertRSVPQuery, [
            new_plus_one.id,
            name,
            email,
            response,
            meal_choice,
            rehearsal_dinner,
          ]);
        }
      } else {
        new_plus_one_rsvp = await db.one(updateRSVPQuery, [
          name,
          email,
          response,
          meal_choice,
          rehearsal_dinner,
          guest_id,
        ]);
        await db.none(`UPDATE guest SET name = $1, email = $2 WHERE id = $3`, [
          name,
          email,
          guest_id,
        ]);
      }
    }

    res.send({
      guest_rsvp: new_guest_rsvp,
      plus_one_rsvp: new_plus_one_rsvp,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
