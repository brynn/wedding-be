const {Pool} = require('pg');

const dbURL =
  'postgres://brynn:PC1ytD9OHhFTqC9VBLVi2EmYSdj8ief8@dpg-ccj1u7irrk09pi2jdfig-a/wedding';
const db = new Pool({dbURL});

module.exports = db;
