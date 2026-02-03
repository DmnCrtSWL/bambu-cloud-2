const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_5dXztfIqPse0@ep-cold-term-ah3h8448-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

async function listTables() {
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        console.log('Tables:', res.rows.map(r => r.table_name));
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

listTables();
