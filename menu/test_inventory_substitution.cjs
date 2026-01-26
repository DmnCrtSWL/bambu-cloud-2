// Using native fetch (Node 18+)

async function testSale() {
    const API_URL = 'http://localhost:3001';

    try {
        console.log('🧪 Testing Latte sale with Leche Deslactosada...\n');

        // Step 1: Get menu items to find Latte
        console.log('1. Fetching menu items...');
        const menuRes = await fetch(`${API_URL}/api/menu-items`);
        const menuItems = await menuRes.json();

        const latte = menuItems.find(item => item.name.toLowerCase().includes('latte'));
        if (!latte) {
            console.log('❌ Latte not found in menu');
            return;
        }

        console.log(`✅ Found: ${latte.name} (ID: ${latte.id})`);
        console.log(`   Variants:`, latte.variantGroups);

        // Step 2: Get a valid user
        console.log('\n2. Fetching users...');
        const usersRes = await fetch(`${API_URL}/api/users`);
        const users = await usersRes.json();

        if (!users || users.length === 0) {
            console.log('❌ No users found');
            return;
        }

        const validUser = users[0];
        console.log(`✅ Using user: ${validUser.name} (ID: ${validUser.id})`);

        // Step 3: Create order with Latte + Leche Deslactosada variation
        console.log('\n3. Creating order...');
        const orderPayload = {
            customerName: 'Test Customer',
            customerPhone: '',
            location: 'Barra',
            paymentMethod: 'Efectivo',
            deliveryTime: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
            items: [{
                id: latte.id,
                title: latte.name,
                price: latte.price,
                quantity: 1,
                variations: [
                    'Tamaño: 12 Oz',  // This maps to recipe variant
                    'Leche: Deslactosada'  // This triggers substitution - MUST MATCH DB NAME
                ],
                note: ''
            }],
            generalNote: 'Test sale - Inventory substitution',
            total: parseFloat(latte.price),
            userId: validUser.id,
            userName: validUser.name,
            status: 'completed' // Direct POS sale
        };

        console.log('Order payload:', JSON.stringify(orderPayload, null, 2));

        const createRes = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        });

        if (!createRes.ok) {
            console.log('❌ Failed to create order:', await createRes.text());
            return;
        }

        const orderResult = await createRes.json();
        console.log(`✅ Order created: ID ${orderResult.id}`);

        console.log('\n4. Check server logs above for inventory deduction messages');
        console.log('   Look for lines starting with 🔥🔥🔥 or [Inventory]');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testSale();
