// check-db.js
import pg from 'pg';
const client = new pg.Client({
  host: '127.0.0.1',
  port: 5433,
  database: 'iade_yonetim',
  user: 'postgres',
  password: 'iade123',
});
await client.connect();
const res = await client.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
console.table('Database Tables:',res.rows);
await client.end();
