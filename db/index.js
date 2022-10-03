const pgp = require('pg-promise')();

const dbURL =
  process.env.NODE_ENV === 'production'
    ? 'postgres://brynn:PC1ytD9OHhFTqC9VBLVi2EmYSdj8ief8@dpg-ccj1u7irrk09pi2jdfig-a/wedding'
    : 'postgres://brynn@localhost:5432/postgres';

const db = pgp(dbURL);
module.exports = db;
