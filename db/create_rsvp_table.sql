CREATE TYPE MEAL_CHOICE AS ENUM ('fish', 'meat', 'vegetarian');

CREATE TABLE rsvp (
  id                  BIGSERIAL PRIMARY KEY,
  name                TEXT CHECK (name <> ''),
  email               TEXT REFERENCES guest(email) NOT NULL,
  response            BOOLEAN NOT NULL DEFAULT FALSE,
  plus_one            BOOLEAN NOT NULL DEFAULT FALSE,
  rehearsal_dinner    BOOLEAN NOT NULL DEFAULT FALSE,
  meal_choice         MEAL_CHOICE NOT NULL DEFAULT 'fish',
  -- ensure that if they're not bringing a plus one, guest_meal_choice is null
  guest_meal_choice   MEAL_CHOICE CHECK (
    (guest_meal_choice IS NULL AND plus_one = FALSE) OR
    (guest_meal_choice IS NOT NULL AND plus_one = TRUE)),
  create_time         TIMESTAMPTZ NOT NULL DEFAULT now(),
  update_time         TIMESTAMPTZ NOT NULL DEFAULT now() CHECK (update_time >= create_time),
  UNIQUE (email)
);
