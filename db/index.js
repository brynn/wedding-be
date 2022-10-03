const {Client} = require('pg');

const dbURL =
  'postgres://brynn:PC1ytD9OHhFTqC9VBLVi2EmYSdj8ief8@dpg-ccj1u7irrk09pi2jdfig-a/wedding';

const db =
  process.env.NODE_ENV === 'production'
    ? new Client({dbURL})
    : new Client({
        user: 'brynn',
        host: 'localhost',
        database: 'postgres',
        port: 5432,
      });

const connectDB = async () => {
  await db.connect();
};
connectDB();

module.exports = db;
