CREATE TYPE RESPONSE AS ENUM ('yes', 'no');
CREATE TYPE MEAL_CHOICE AS ENUM ('fish', 'chicken', 'vegetarian');

CREATE TABLE rsvp (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT CHECK (name <> ''),
  plus_one      BOOLEAN NOT NULL DEFAULT FALSE,
  response      RESPONSE NOT NULL,
  meal_choice   MEAL_CHOICE NOT NULL,
  create_time   TIMESTAMPTZ NOT NULL DEFAULT now(),
  update_time   TIMESTAMPTZ NOT NULL DEFAULT now() CHECK (update_time >= create_time)
);
