const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' });

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_5dXztfIqPse0@ep-cold-term-ah3h8448-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({
    connectionString: connectionString
});

const updates = [
    // Barra de Café
    { id: 1, url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop' }, // Americano
    { id: 2, url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800&auto=format&fit=crop' }, // Capuccino
    { id: 3, url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop' }, // Frappe
    { id: 4, url: 'https://images.unsplash.com/photo-1570968992193-d6ea0648c578?q=80&w=800&auto=format&fit=crop' }, // Latte
    { id: 5, url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop' }, // Moka

    // Bebidas
    { id: 20, url: 'https://images.unsplash.com/photo-1610970881699-44a5587dc5b4?q=80&w=800&auto=format&fit=crop' }, // Jugo Verde
    { id: 19, url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=800&auto=format&fit=crop' }, // Jugo de Naranja

    // Desayunos
    { id: 15, url: 'https://images.unsplash.com/photo-1624323377701-4470d03b0c67?q=80&w=800&auto=format&fit=crop' }, // Chilaquiles (Red/Green generic)
    { id: 14, url: 'https://images.unsplash.com/photo-1640958737521-39a8c0e27142?q=80&w=800&auto=format&fit=crop' }, // Chilaquiles con Pollo
    { id: 16, url: 'https://images.unsplash.com/photo-1605658661601-522da44b6c38?q=80&w=800&auto=format&fit=crop' }, // Enchiladas Verdes
    { id: 17, url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop' }, // Fruta con Yogurt
    { id: 18, url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop' }, // Hot Cakes
    { id: 22, url: 'https://images.unsplash.com/photo-1600431521340-491eca8808dc?q=80&w=800&auto=format&fit=crop' }, // Molletes (Simulated with bruschetta/similar)
    { id: 21, url: 'https://images.unsplash.com/photo-1600431521340-491eca8808dc?q=80&w=800&auto=format&fit=crop' }, // Molletes con Jamón

    // Huevos
    { id: 31, url: 'https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?q=80&w=800&auto=format&fit=crop' }, // Huevos al Gusto
    { id: 29, url: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=800&auto=format&fit=crop' }, // Omelette Vegetariano
    { id: 28, url: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=800&auto=format&fit=crop' }, // Omelette con Jamón
    { id: 30, url: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=800&auto=format&fit=crop' }, // Omelette de Champiñones

    // Menú del Día
    { id: 27, url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800&auto=format&fit=crop' }, // Agua del Día
    { id: 24, url: 'https://images.unsplash.com/photo-1600335286391-5db148101460?q=80&w=800&auto=format&fit=crop' }, // Combo Bambú Infantil
    { id: 23, url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop' }, // Combo Bambú Adulto
    { id: 26, url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop' }, // Plato Fuerte del Día
    { id: 25, url: 'https://images.unsplash.com/photo-1547592166-23acbe3226bf?q=80&w=800&auto=format&fit=crop' }, // Sopa del Día

    // Sandwiches
    { id: 6, url: 'https://images.unsplash.com/photo-1550507992-06374597f22h?q=80&w=800&auto=format&fit=crop' }, // Chapata de Atún (Generic panini)
    { id: 7, url: 'https://images.unsplash.com/photo-1509722747741-090c19a0076e?q=80&w=800&auto=format&fit=crop' }, // Chapata de Pechuga de Pavo
    { id: 8, url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop' }, // Chapata de Pollo
    { id: 9, url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop' }, // Croissant de Jamón y Queso
    { id: 10, url: 'https://images.unsplash.com/photo-1530610476181-d8ce6843f728?q=80&w=800&auto=format&fit=crop' }, // Croissant de Queso con Zarzamora
    { id: 11, url: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?q=80&w=800&auto=format&fit=crop' }, // Sandwich de Atún
    { id: 12, url: 'https://images.unsplash.com/photo-1619860860774-1e2e173b5a63?q=80&w=800&auto=format&fit=crop' }, // Sandwich de Pechuga de Pavo
    { id: 13, url: 'https://images.unsplash.com/photo-1553909489-cd47e332117e?q=80&w=800&auto=format&fit=crop' }  // Sandwich de Pollo
];

async function updateImages() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log(`Updating ${updates.length} products with stock images...`);

        for (const update of updates) {
            await client.query('UPDATE menu_items SET image_url = $1 WHERE id = $2', [update.url, update.id]);
        }

        await client.query('COMMIT');
        console.log('✅ All product images updated successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error updating images:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

updateImages();
