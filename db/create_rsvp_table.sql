CREATE TYPE MEAL_CHOICE AS ENUM ('fish', 'meat', 'vegetarian');

CREATE TABLE rsvp (
  id                  BIGSERIAL PRIMARY KEY,
  guest_id            BIGINT REFERENCES guest(id) UNIQUE,
  name                TEXT NOT NULL,
  email               TEXT,
  response            BOOLEAN NOT NULL DEFAULT FALSE,
  rehearsal_dinner    BOOLEAN NOT NULL DEFAULT FALSE,
  meal_choice         MEAL_CHOICE NOT NULL DEFAULT 'fish',
  create_time         TIMESTAMPTZ NOT NULL DEFAULT now(),
  update_time         TIMESTAMPTZ NOT NULL DEFAULT now() CHECK (update_time >= create_time)
);

