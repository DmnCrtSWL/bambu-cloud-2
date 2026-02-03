const db = require('../config/db');

async function checkInventoryLinks() {
    try {
        console.log('=== Checking Menu Item Variants with Inventory Links ===\n');

        const { rows } = await db.query(`
            SELECT 
                miv.id,
                miv.menu_item_id,
                mi.name as menu_item_name,
                miv.group_name,
                miv.name as variant_name,
                miv.inventory_product_name
            FROM menu_item_variants miv
            JOIN menu_items mi ON mi.id = miv.menu_item_id
            WHERE miv.inventory_product_name IS NOT NULL 
              AND miv.inventory_product_name != ''
            ORDER BY miv.menu_item_id, miv.group_name, miv.name
        `);

        if (rows.length === 0) {
            console.log('❌ No variants with inventory links found!');
            console.log('   Make sure you configured the inventory product name in the dish editor.');
        } else {
            console.log(`✅ Found ${rows.length} variant(s) with inventory links:\n`);
            rows.forEach(row => {
                console.log(`Menu Item: ${row.menu_item_name} (ID: ${row.menu_item_id})`);
                console.log(`  Group: ${row.group_name}`);
                console.log(`  Variant: "${row.variant_name}" → Inventory: "${row.inventory_product_name}"`);
                console.log('');
            });
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

checkInventoryLinks();
