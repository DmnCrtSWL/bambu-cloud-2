const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query(`
            WITH bought AS (
                SELECT 
                    LOWER(TRIM(pi.product_name)) as join_name,
                    MAX(pi.product_name) as display_name, -- Pick one variation for display
                    LOWER(TRIM(pi.unit)) as join_unit,
                    MAX(pi.unit) as display_unit,
                    SUM(pi.quantity) as total_quantity,
                    SUM(pi.total) as total_spent,
                    MAX(p.purchase_date) as last_purchase_date
                FROM purchase_items pi
                JOIN purchases p ON pi.purchase_id = p.id
                WHERE p.deleted_at IS NULL
                GROUP BY LOWER(TRIM(pi.product_name)), LOWER(TRIM(pi.unit))
            ),
            used AS (
                SELECT 
                    LOWER(TRIM(product_name)) as join_name,
                    LOWER(TRIM(unit)) as join_unit,
                    SUM(quantity) as total_used
                FROM inventory_usage
                GROUP BY LOWER(TRIM(product_name)), LOWER(TRIM(unit))
            )
            SELECT 
                b.display_name as "productName",
                b.display_unit as "unit",
                b.total_quantity as "totalQuantity",
                COALESCE(u.total_used, 0) as "usedQuantity",
                b.total_spent as "totalSpent",
                b.last_purchase_date as "lastPurchaseDate"
            FROM bought b
            LEFT JOIN used u ON b.join_name = u.join_name AND b.join_unit = u.join_unit
            ORDER BY "productName" ASC
        `);

        const inventory = rows.map(row => ({
            productName: row.productName,
            quantity: Number(row.totalQuantity),
            unit: row.unit,
            averageCost: row.totalQuantity > 0 ? (Number(row.totalSpent) / Number(row.totalQuantity)).toFixed(2) : '0.00',
            lastPurchase: row.lastPurchaseDate ? new Date(row.lastPurchaseDate).toISOString().split('T')[0] : 'N/A',
            stock: Number(row.totalQuantity) - Number(row.usedQuantity)
        }));

        res.json(inventory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get list of inventory product names (for dropdown in menu item variant editor)
router.get('/products', async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT DISTINCT TRIM(product_name) as name
            FROM purchase_items
            WHERE deleted_at IS NULL
            ORDER BY name ASC
        `);

        res.json(rows.map(r => r.name));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
