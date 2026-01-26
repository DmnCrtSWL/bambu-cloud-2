const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_5dXztfIqPse0@ep-cold-term-ah3h8448-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

async function forceDeleteRecipes() {
    const client = await pool.connect();

    try {
        console.log('🧨 Force Deleting Recipes...');

        // El CASCADE borrará automáticamente:
        // 1. recipe_items (Ingredientes de las recetas)
        // 2. recipe_variants (Variantes de las recetas)
        // 3. menu_items (Platillos que usan estas recetas - si la FK tiene ON DELETE CASCADE)
        //    Si no tiene ON DELETE CASCADE, esto podría fallar y requerir borrar menu_items primero.

        // Vamos a ser agresivos para asegurar que se borre si es lo que quieres:

        console.log('1. Cleaning Menu Items links...');
        // Opcional: Desvincular recetas en lugar de borrar platillos, o borrar platillos.
        // Si quieres borrar TODO, mejor truncamos menu_items también.

        await client.query('TRUNCATE TABLE menu_items CASCADE');
        console.log('   - Menu Items deleted (blocked recipes)');

        console.log('2. Deleting Recipes...');
        await client.query('TRUNCATE TABLE recipes CASCADE');
        console.log('   - Recipes deleted');

        console.log('\n✅ Recipes and Menu cleared successfully.');

    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.message.includes('foreign key constraint')) {
            console.log('💡 Hint: Other tables still reference recipes.');
        }
    } finally {
        client.release();
        await pool.end();
    }
}

forceDeleteRecipes();
