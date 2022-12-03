CREATE TABLE guest (
  id                          BIGSERIAL PRIMARY KEY,
  name                        TEXT CHECK (name <> ''),
  email                       TEXT NOT NULL UNIQUE,
  plus_one_allowed            BOOLEAN NOT NULL DEFAULT TRUE,
  rsvp_sent                   BOOLEAN NOT NULL DEFAULT FALSE,
  response                    BOOLEAN NOT NULL DEFAULT FALSE,
  plus_one_name               TEXT CHECK (plus_one_name <> ''),
  plus_one_email              TEXT,
  plus_one_response           BOOLEAN NOT NULL DEFAULT FALSE
);
