const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/orders
// Returns orders relevant for the kitchen/cashier board (new, preparing, delivering).
// Optionally ?status=completed to see history, but default is active.
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        let query = `
            SELECT o.*, 
            to_char(o.created_at AT TIME ZONE 'UTC', 'HH12:MI a.m.') as formatted_time,
            (
                SELECT json_agg(
                    json_build_object(
                        'id', oi.id,
                        'menuItemId', oi.menu_item_id,
                        'name', oi.name,
                        'quantity', oi.quantity,
                        'price', oi.price,
                        'variations', oi.variations,
                        'note', oi.note
                    )
                )
                FROM order_items oi
                WHERE oi.order_id = o.id
            ) as items
            FROM orders o
        `;

        const params = [];
        if (req.query.id) {
            query += ` WHERE o.id = $1`;
            params.push(req.query.id);
        } else if (status) {
            query += ` WHERE o.status = $1`;
            params.push(status);
        } else {
            // Default: show active
            query += ` WHERE o.status IN ('new', 'preparing', 'delivering')`;
        }

        query += ` ORDER BY o.created_at ASC`;

        const result = await db.query(query, params);

        // Format items: ensure 'items' property exists even if null
        const orders = result.rows.map(row => ({
            ...row,
            customerName: row.customer_name,
            customerPhone: row.customer_phone,
            paymentMethod: row.payment_method,
            generalNote: row.general_note,
            deliveryTime: row.delivery_time,
            items: row.items || [],
            time: row.formatted_time, // Use the SQL formatted time
            total: parseFloat(row.total)
        }));

        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/orders
// Public endpoint to create a new order
router.post('/', async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        const {
            customerName,
            customerPhone,
            location,
            paymentMethod,
            deliveryTime,
            items,
            generalNote,
            total,
            userId,
            status,
            userName
        } = req.body;



        // Insert Order
        const orderResult = await client.query(`
            INSERT INTO orders (customer_name, customer_phone, location, payment_method, delivery_time, total, general_note, status, user_id, user_name)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, created_at
        `, [customerName, customerPhone, location, paymentMethod || 'Efectivo', deliveryTime, total, generalNote, status || 'new', userId, userName]);

        const orderId = orderResult.rows[0].id;

        // Insert Items (Bulk)
        if (items && items.length > 0) {
            const itemValues = [];
            const itemParams = [];
            let paramCounter = 1;

            items.forEach((item) => {
                // ($1, $2, $3, $4, $5, $6, $7)
                itemValues.push(`($${paramCounter}, $${paramCounter + 1}, $${paramCounter + 2}, $${paramCounter + 3}, $${paramCounter + 4}, $${paramCounter + 5}, $${paramCounter + 6})`);

                itemParams.push(
                    orderId,
                    item.id,
                    item.title || item.name,
                    item.quantity || 1,
                    item.price,
                    JSON.stringify(item.variations || []),
                    item.note
                );
                paramCounter += 7;
            });

            const insertItemsQuery = `
                INSERT INTO order_items (order_id, menu_item_id, name, quantity, price, variations, note)
                VALUES ${itemValues.join(', ')}
            `;

            await client.query(insertItemsQuery, itemParams);
        }

        if (paymentMethod === 'CXC') {
            const { cxcCustomerId, cxcCustomerName, cxcCustomerPhone } = req.body;
            let finalCustomerId = cxcCustomerId;

            // Create customer if needed
            if (!finalCustomerId && cxcCustomerName) {
                const newCustomerRes = await client.query(
                    'INSERT INTO customers (name, phone) VALUES ($1, $2) RETURNING id',
                    [cxcCustomerName, cxcCustomerPhone]
                );
                finalCustomerId = newCustomerRes.rows[0].id;
            }

            if (finalCustomerId) {
                await client.query(`
                    INSERT INTO accounts_receivable (customer_id, order_id, amount, status, user_id)
                    VALUES ($1, $2, $3, 'active', $4)
                `, [finalCustomerId, orderId, total, userId]);
            }
        }

        await client.query('COMMIT');

        // Ideally, emit a socket event here for real-time updates
        // const io = req.app.get('io');
        // if(io) io.emit('new_order', { id: orderId, ... });

        res.status(201).json({
            id: orderId,
            message: 'Order created successfully',
            time: deliveryTime || new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Mexico_City' })
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating order:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// PUT /api/orders/:id
// Update full order details (payment, total, status)
router.put('/:id', async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;
        const { status, paymentMethod, total, userName, userId, cxcCustomerId, cxcCustomerName, cxcCustomerPhone } = req.body;

        const result = await client.query(`
            UPDATE orders 
            SET status = COALESCE($1, status), 
                payment_method = COALESCE($2, payment_method),
                total = COALESCE($3, total),
                user_name = COALESCE($4, user_name),
                user_id = COALESCE($5, user_id),
                updated_at = NOW()
            WHERE id = $6
            RETURNING *
        `, [status, paymentMethod, total, userName, userId, id]);

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Order not found' });
        }

        // Handle CXC logic for existing order updates
        if (paymentMethod === 'CXC') {
            let finalCustomerId = cxcCustomerId;

            // Create customer if needed
            if (!finalCustomerId && cxcCustomerName) {
                const newCustomerRes = await client.query(
                    'INSERT INTO customers (name, phone) VALUES ($1, $2) RETURNING id',
                    [cxcCustomerName, cxcCustomerPhone]
                );
                finalCustomerId = newCustomerRes.rows[0].id;
            }

            if (finalCustomerId) {
                // Check if already exists to avoid duplicate debt for same order?
                // For simplicity, we assume if we are switching to CXC we create the debt.
                // In a robust system we'd check existence.
                const checkCxc = await client.query('SELECT id FROM accounts_receivable WHERE order_id = $1', [id]);
                if (checkCxc.rows.length === 0) {
                    await client.query(`
                        INSERT INTO accounts_receivable (customer_id, order_id, amount, status, user_id)
                        VALUES ($1, $2, $3, 'active', $4)
                    `, [finalCustomerId, id, total, userId]);
                }
            }
        } else {
            // "Liquidar": If payment method is NOT CXC, mark any active AR as paid
            await client.query(`
                UPDATE accounts_receivable 
                SET status = 'paid', paid_amount = $1, payment_method = $3, updated_at = NOW()
                WHERE order_id = $2 AND status = 'active'
            `, [total, id, paymentMethod]);
        }

        await client.query('COMMIT');
        res.json(result.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error updating order:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// PUT /api/orders/:id/status
// Update order status (new -> preparing -> delivering -> completed)
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['new', 'preparing', 'delivering', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await db.query(`
            UPDATE orders 
            SET status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `, [status, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
