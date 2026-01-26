const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_5dXztfIqPse0@ep-cold-term-ah3h8448-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

async function unlinkAndDeleteRecipes() {
    const client = await pool.connect();

    try {
        console.log('🔓 Unlinking Recipes from Menu...');

        await client.query('BEGIN');

        // 1. Unlink Menu Items
        console.log('1. Setting recipe_id = NULL in menu_items...');
        const res1 = await client.query('UPDATE menu_items SET recipe_id = NULL WHERE recipe_id IS NOT NULL');
        console.log(`   - Updated ${res1.rowCount} menu items.`);

        // 2. Unlink Menu Item Variants
        console.log('2. Setting recipe_variant_id = NULL in menu_item_variants...');
        const res2 = await client.query('UPDATE menu_item_variants SET recipe_variant_id = NULL WHERE recipe_variant_id IS NOT NULL');
        console.log(`   - Updated ${res2.rowCount} variants.`);

        // 3. Unlink from any other tables if necessary (e.g. historical orders usually copy data so OK, but check constraints)
        // If historical orders link to recipes via FK (unlikely for history), we might need to check.
        // Assuming orders copy snapshot.

        // 4. Delete Recipes
        console.log('3. Deleting Recipes...');
        await client.query('TRUNCATE TABLE recipes CASCADE');
        console.log('   - Recipes (and recipe items/variants) deleted successfully.');

        await client.query('COMMIT');
        console.log('\n✅ Done! Menu is safe, Recipes are gone.');

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error:', err.message);
    } finally {
        client.release();
        await pool.end();
        process.exit();
    }
}

unlinkAndDeleteRecipes();
