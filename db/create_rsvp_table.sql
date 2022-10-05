CREATE TYPE MEAL_CHOICE AS ENUM ('fish', 'chicken', 'vegetarian');

CREATE TABLE rsvp (
  id                  BIGSERIAL PRIMARY KEY,
  name                TEXT CHECK (name <> ''),
  email               TEXT REFERENCES guest(email) NOT NULL,
  response            BOOLEAN NOT NULL DEFAULT FALSE,
  plus_one            BOOLEAN NOT NULL DEFAULT TRUE,
  rehearsal_dinner    BOOLEAN NOT NULL DEFAULT TRUE,
  meal_choice         MEAL_CHOICE NOT NULL DEFAULT 'fish',
  create_time         TIMESTAMPTZ NOT NULL DEFAULT now(),
  update_time         TIMESTAMPTZ NOT NULL DEFAULT now() CHECK (update_time >= create_time),
  UNIQUE (email)
);
