const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_5dXztfIqPse0@ep-cold-term-ah3h8448-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

async function cleanDatabase() {
    const client = await pool.connect();

    try {
        console.log('🧹 Starting Database Cleanup...');
        console.log('⚠️  WARNING: This will delete ALL transactional data (Orders, Inventory Usage, Shifts, Purchases).');

        await client.query('BEGIN');

        // Helper for safe truncation
        const safeTruncate = async (tableName) => {
            try {
                await client.query(`SAVEPOINT ${tableName}_pt`);
                console.log(`Deleting ${tableName}...`);
                await client.query(`TRUNCATE TABLE ${tableName} CASCADE`);
                await client.query(`RELEASE SAVEPOINT ${tableName}_pt`);
            } catch (e) {
                await client.query(`ROLLBACK TO SAVEPOINT ${tableName}_pt`);
                console.log(`Skipping ${tableName} (table might not exist or error: ${e.message})`);
            }
        };

        // 1. Transactional Data
        await safeTruncate('inventory_usage');
        await safeTruncate('order_items');
        await safeTruncate('orders');
        await safeTruncate('shifts');
        await safeTruncate('cash_cuts');
        await safeTruncate('inventory_transactions');

        // 2. Financial & Input Data
        await safeTruncate('purchase_items');
        await safeTruncate('purchases');
        await safeTruncate('expenses');
        await safeTruncate('accounts_receivable');

        // 3. Reset Sequences
        console.log('Resetting sequences...');
        const sequences = ['orders_id_seq', 'purchases_id_seq', 'shifts_id_seq'];

        for (const seq of sequences) {
            try {
                await client.query(`ALTER SEQUENCE ${seq} RESTART WITH 1`);
                console.log(`  - Reset ${seq}`);
            } catch (e) {
                // Ignore sequence errors
            }
        }

        await client.query('COMMIT');

        console.log('\n✅ Database Cleanup Complete!');
        console.log('   - Users: KEPT');
        console.log('   - Menu/Recipes: KEPT');
        console.log('   - Inventory Definitions: KEPT');
        console.log('   - Orders/Sales: DELETED');
        console.log('   - Inventory Usage: DELETED');
        console.log('   - Purchases/Stocks: DELETED');
        console.log('   - Expenses/Accounts: DELETED');

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error during cleanup:', err);
    } finally {
        client.release();
        await pool.end();
        process.exit();
    }
}

cleanDatabase();
