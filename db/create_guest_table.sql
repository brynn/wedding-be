CREATE TABLE guest (
  id                          BIGSERIAL PRIMARY KEY,
  name                        TEXT NOT NULL,
  email                       TEXT,
  plus_one_allowed            BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE plus_ones (
  guest_id                    BIGINT,
  plus_one_id                 BIGINT
)

-- COPY guest (name, email, plus_one_allowed) FROM '/Users/brynn/wedding-be/db/seed_guest.csv' DELIMITER ',' CSV HEADER;
-- COPY plus_ones (guest_id, plus_one_id) FROM '/Users/brynn/wedding-be/db/seed_plus_ones.csv' DELIMITER ',' CSV HEADER;
-- UPDATE guest SET email = LOWER(TRIM(email));