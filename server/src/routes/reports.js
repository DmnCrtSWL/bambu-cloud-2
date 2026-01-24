const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/reports/daily-sales
router.get('/daily-sales', async (req, res) => {
    try {
        const { date, userId } = req.query;

        // 1. Date Range Setup (Index Friendly)
        // casting ::date prevents index usage. We use >= start AND < end
        const inputDate = date || new Date().toISOString().split('T')[0];
        const startOfDay = inputDate; // Postgres checks: '2023-01-01' -> '2023-01-01 00:00:00'

        // Calculate next day for upper bound
        const endOfDayDate = new Date(inputDate);
        endOfDayDate.setDate(endOfDayDate.getDate() + 1);
        const endOfDay = endOfDayDate.toISOString().split('T')[0];

        const targetUserId = userId || null;
        const params = [startOfDay, endOfDay];
        if (targetUserId) params.push(targetUserId);

        const userFilterOrder = targetUserId ? 'AND o.user_id = $3' : '';
        const userFilterAR = targetUserId ? 'AND ar.user_id = $3' : ''; // user who created debt
        const userFilterColl = targetUserId ? 'AND o.user_id = $3' : ''; // user who collected (via order update)

        const bigQuery = `
            WITH direct_sales AS (
                SELECT o.payment_method, SUM(o.total) as total
                FROM orders o
                LEFT JOIN accounts_receivable ar ON o.id = ar.order_id
                WHERE (o.created_at AT TIME ZONE 'America/Mexico_City') >= $1::timestamp 
                AND (o.created_at AT TIME ZONE 'America/Mexico_City') < $2::timestamp
                AND o.payment_method NOT IN ('CXC', 'Cortesía')
                AND ar.id IS NULL
                ${userFilterOrder}
                GROUP BY o.payment_method
            ),
            collections AS (
                SELECT ar.payment_method, SUM(ar.paid_amount) as total
                FROM accounts_receivable ar
                JOIN orders o ON ar.order_id = o.id
                WHERE ar.status = 'paid'
                AND (ar.updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') >= $1::timestamp 
                AND (ar.updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') < $2::timestamp
                ${userFilterColl}
                GROUP BY ar.payment_method
            ),
            cxc_generated AS (
                SELECT SUM(amount) as total
                FROM accounts_receivable ar
                WHERE (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') >= $1::timestamp 
                AND (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') < $2::timestamp
                AND status = 'active'
                ${userFilterAR}
            ),
            courtesies AS (
                SELECT SUM(total) as total
                FROM orders o
                WHERE (created_at AT TIME ZONE 'America/Mexico_City') >= $1::timestamp 
                AND (created_at AT TIME ZONE 'America/Mexico_City') < $2::timestamp
                AND payment_method = 'Cortesía'
                ${userFilterOrder}
            )
            SELECT 
                (SELECT json_agg(row_to_json(direct_sales)) FROM direct_sales) as direct_sales_data,
                (SELECT json_agg(row_to_json(collections)) FROM collections) as collections_data,
                (SELECT total FROM cxc_generated) as cxc_total,
                (SELECT total FROM courtesies) as courtesy_total
        `;

        const result = await db.query(bigQuery, params);
        const row = result.rows[0];

        // Aggregation
        const incomeByMethod = {
            'Efectivo': 0,
            'Tarjeta': 0,
            'Transferencia': 0,
            'Uber Eats': 0
        };


        const directData = row.direct_sales_data || [];
        const collectionData = row.collections_data || [];

        let courtesyTotal = Number(row.courtesy_total || 0);

        directData.forEach(item => {
            const method = item.payment_method;
            const val = Number(item.total) || 0;
            incomeByMethod[method] = (incomeByMethod[method] || 0) + val;
        });

        collectionData.forEach(item => {
            const method = item.payment_method;
            const val = Number(item.total) || 0;

            if (method === 'CXC') return; // Should not happen in paid status but safety check

            if (method === 'Cortesía') {
                courtesyTotal += val;
            } else {
                incomeByMethod[method] = (incomeByMethod[method] || 0) + val;
            }
        });

        const totalIncome = Object.values(incomeByMethod).reduce((a, b) => a + b, 0);

        res.json({
            date: inputDate,
            incomeByMethod,
            totalIncome,
            cxcGenerated: parseFloat(row.cxc_total || 0),
            courtesyTotal: parseFloat(courtesyTotal)
        });


    } catch (err) {
        console.error('Error in daily sales report:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
