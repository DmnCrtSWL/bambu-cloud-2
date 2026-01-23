const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT 
                TRIM(pi.product_name) as "productName",
                pi.unit,
                SUM(pi.quantity) as "totalQuantity",
                SUM(pi.total) as "totalSpent",
                MAX(p.purchase_date) as "lastPurchaseDate"
            FROM purchase_items pi
            JOIN purchases p ON pi.purchase_id = p.id
            WHERE p.deleted_at IS NULL
            GROUP BY TRIM(pi.product_name), pi.unit
            ORDER BY "productName" ASC
        `);

        const inventory = rows.map(row => ({
            productName: row.productName,
            quantity: Number(row.totalQuantity),
            unit: row.unit,
            averageCost: (Number(row.totalSpent) / Number(row.totalQuantity)).toFixed(2),
            lastPurchase: row.lastPurchaseDate ? new Date(row.lastPurchaseDate).toISOString().split('T')[0] : 'N/A',
            stock: Number(row.totalQuantity) // Currently stock same as total qty in
        }));

        res.json(inventory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
