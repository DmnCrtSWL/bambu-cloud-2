-- Query 1: Verificar órdenes y sus status
SELECT 
    status, 
    COUNT(*) as count,
    SUM(total) as total_amount,
    MIN(created_at) as oldest,
    MAX(created_at) as newest
FROM orders
GROUP BY status;

-- Query 2: Verificar órdenes de hoy (sin conversión de timezone)
SELECT 
    id,
    status,
    payment_method,
    total,
    created_at
FROM orders
WHERE created_at::date = CURRENT_DATE
ORDER BY created_at DESC;

-- Query 3: Verificar órdenes de hoy (con conversión de timezone como en el código)
SELECT 
    id,
    status,
    payment_method,
    total,
    created_at,
    (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') as local_time
FROM orders
WHERE (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City')::date = CURRENT_DATE
ORDER BY created_at DESC;

-- Query 4: Verificar CXC
SELECT 
    status,
    COUNT(*) as count,
    SUM(amount) as total_amount,
    SUM(paid_amount) as total_paid,
    SUM(amount - paid_amount) as total_pending
FROM accounts_receivable
GROUP BY status;

-- Query 5: Verificar gastos
SELECT 
    COUNT(*) as count,
    SUM(amount) as total,
    MIN(date) as oldest,
    MAX(date) as newest
FROM expenses
WHERE deleted_at IS NULL;

-- Query 6: Verificar compras
SELECT 
    COUNT(*) as count,
    SUM(total) as total,
    MIN(purchase_date) as oldest,
    MAX(purchase_date) as newest
FROM purchases
WHERE deleted_at IS NULL;

-- Query 7: Verificar items vendidos
SELECT 
    oi.name,
    COUNT(*) as times_sold,
    SUM(oi.quantity) as total_quantity,
    SUM(oi.quantity * oi.price) as total_revenue
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
GROUP BY oi.name
ORDER BY total_quantity DESC
LIMIT 10;
