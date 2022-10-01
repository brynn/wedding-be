CREATE TABLE guest (
  id                  BIGSERIAL PRIMARY KEY,
  email               TEXT NOT NULL,
  plus_one_allowed    BOOLEAN NOT NULL DEFAULT FALSE,
  rsvp_sent           BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(email)
);