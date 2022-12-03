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
