const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_5dXztfIqPse0@ep-frosty-king-ah5pr6o6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false } // Required for Neon usually
});

async function run() {
    try {
        await client.connect();
        console.log('Connected successfully!');

        // Check for users table to see if data exists
        const res = await client.query('SELECT count(*) FROM users');
        console.log('User count:', res.rows[0].count);

        // Check for active orders
        const resOrders = await client.query('SELECT count(*) FROM orders');
        console.log('Orders count:', resOrders.rows[0].count);

    } catch (err) {
        console.error('Connection error:', err);
    } finally {
        await client.end();
    }
}

run();
