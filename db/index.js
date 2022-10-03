const {Pool} = require('pg');

const dbURL =
  'postgres://brynn:PC1ytD9OHhFTqC9VBLVi2EmYSdj8ief8@dpg-ccj1u7irrk09pi2jdfig-a/wedding';

const db =
  process.env.NODE_ENV === 'production'
    ? new Pool({
        user: 'brynn',
        host: 'dpg-ccj1u7irrk09pi2jdfig-a',
        database: 'wedding',
        password: 'PC1ytD9OHhFTqC9VBLVi2EmYSdj8ief8',
        port: 5432,
      })
    : new Pool({
        user: 'brynn',
        host: 'localhost',
        database: 'postgres',
        port: 5432,
      });

module.exports = db;
