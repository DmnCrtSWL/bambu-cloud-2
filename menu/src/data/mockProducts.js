export const products = [
    // COFFEE BAR (Barra de Café)
    {
        id: 'c1',
        title: 'Espresso Doble',
        description: 'Concentrado de café intenso con notas de chocolate y nueces.',
        price: 45,
        category: 'Barra de Café',
        category_id: 'cafe',
        image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'c2',
        title: 'Cappuccino Italiano',
        description: 'Espresso con leche texturizada y espuma cremosa, espolvoreado con cacao.',
        price: 55,
        category: 'Barra de Café',
        category_id: 'cafe',
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e569?auto=format&fit=crop&w=600&q=80',
        hasVariations: true
    },
    {
        id: 'c3',
        title: 'Latte Art',
        description: 'Suave mezcla de espresso y leche vaporizada con arte latte.',
        price: 58, // Base price, but size might override if selected? 
        // Per user, 12 Oz is 49. Base was 58. 
        // Let's set base to 49 to match 12oz or keep as display. 
        // If I set 49 here, and 12oz is default, it works.
        category: 'Barra de Café',
        category_id: 'cafe',
        image: 'https://images.unsplash.com/photo-1551806235-a79acbf88915?auto=format&fit=crop&w=600&q=80',
        hasVariations: true,
        options: [
            {
                name: 'Tamaño',
                choices: [
                    { label: '12 Oz', price: 49 },
                    { label: '16 Oz', price: 59 }
                ]
            },
            {
                name: 'Leche',
                choices: [
                    { label: 'Entera', extraPrice: 0 },
                    { label: 'Light', extraPrice: 5 },
                    { label: 'Deslactosada', extraPrice: 5 },
                    { label: 'Almendras', extraPrice: 5 },
                    { label: 'Soya', extraPrice: 5 }
                ]
            },
            {
                name: 'Endulzante',
                choices: [
                    { label: 'Sin Endulzante', extraPrice: 0 },
                    { label: 'Azúcar', extraPrice: 0 }
                ]
            }
        ]
    },
    {
        id: 'c4',
        title: 'Mocha Blanco',
        description: 'Espresso con salsa de chocolate blanco y leche cremosa.',
        price: 65,
        category: 'Barra de Café',
        category_id: 'cafe',
        image: 'https://images.unsplash.com/photo-1578839212571-7f8ca9401777?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'c5',
        title: 'Cold Brew Vainilla',
        description: 'Café infusionado en frío durante 18 horas con un toque de vainilla.',
        price: 60,
        category: 'Barra de Café',
        category_id: 'cafe',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b5c7fa51?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'c6',
        title: 'Flat White',
        description: 'Dos shots de ristretto con una fina capa de leche micro-espumada.',
        price: 55,
        category: 'Barra de Café',
        category_id: 'cafe',
        image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'c7',
        title: 'Americano Especial',
        description: 'Espresso diluido en agua caliente, conservando la crema del café.',
        price: 40,
        category: 'Barra de Café',
        category_id: 'cafe',
        image: 'https://images.unsplash.com/photo-1551030173-122aace44834?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'c8',
        title: 'Frappé Clásico',
        description: 'Bebida helada de café mezclada con hielo y leche, decorada con crema batida.',
        price: 68,
        category: 'Barra de Café',
        category_id: 'cafe',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
        hasVariations: true
    },
    {
        id: 'c9',
        title: 'Macchiato Caramelo',
        description: 'Leche manchada con espresso y jarabe de caramelo artesanal.',
        price: 62,
        category: 'Barra de Café',
        category_id: 'cafe',
        image: 'https://images.unsplash.com/photo-1485808191679-5f8c7c41f6acd?auto=format&fit=crop&w=600&q=80',
        hasVariations: true
    },
    {
        id: 'c10',
        title: 'Chai Latte Sucio',
        description: 'Té chai especiado con leche y un shot de espresso.',
        price: 70,
        category: 'Barra de Café',
        category_id: 'cafe',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },

    // DRINKS (Bebidas)
    {
        id: 'b1',
        title: 'Limonada de Frutos Rojos',
        description: 'Refrescante limonada natural con mix de berries machacados.',
        price: 45,
        category: 'Bebidas',
        category_id: 'bebidas',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'b2',
        title: 'Jugo Verde Detox',
        description: 'Espinaca, piña, apio, nopal y jugo de naranja recién exprimido.',
        price: 55,
        category: 'Bebidas',
        category_id: 'bebidas',
        image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'b3',
        title: 'Smoothie Tropical',
        description: 'Mango, piña y leche de coco, una explosión de sabor tropical.',
        price: 65,
        category: 'Bebidas',
        category_id: 'bebidas',
        image: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'b4',
        title: 'Té Helado de Durazno',
        description: 'Té negro infusionado con duraznos naturales y menta fresca.',
        price: 40,
        category: 'Bebidas',
        category_id: 'bebidas',
        image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'b5',
        title: 'Agua de Horchata Artesanal',
        description: 'Tradicional horchata de arroz con canela y vainilla.',
        price: 35,
        category: 'Bebidas',
        category_id: 'bebidas',
        image: 'https://images.unsplash.com/photo-1542849187-5ec6ea5e6a27?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'b6',
        title: 'Refresco Italiano',
        description: 'Soda italiana burbujeante con jarabe de frambuesa o manzana verde.',
        price: 48,
        category: 'Bebidas',
        category_id: 'bebidas',
        image: 'https://images.unsplash.com/photo-1536935338788-843bb63036fe?auto=format&fit=crop&w=600&q=80',
        hasVariations: true
    },
    {
        id: 'b7',
        title: 'Jugo de Naranja',
        description: '100% natural, recién exprimido al momento.',
        price: 40,
        category: 'Bebidas',
        category_id: 'bebidas',
        image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'b8',
        title: 'Malteada de Chocolate',
        description: 'Helado de chocolate belga batido con leche entera y crema.',
        price: 75,
        category: 'Bebidas',
        category_id: 'bebidas',
        image: 'https://images.unsplash.com/photo-1579954115545-a95591f28dfa?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'b9',
        title: 'Matcha Latte Frío',
        description: 'Té matcha grado ceremonial con leche de almendras y hielo.',
        price: 70,
        category: 'Bebidas',
        category_id: 'bebidas',
        image: 'https://images.unsplash.com/photo-1515823150537-2816505a6df9?auto=format&fit=crop&w=600&q=80',
        hasVariations: true
    },
    {
        id: 'b10',
        title: 'Agua Mineral Preparada',
        description: 'Topo chico con limón, sal y un toque de tajín.',
        price: 45,
        category: 'Bebidas',
        category_id: 'bebidas',
        image: 'https://images.unsplash.com/photo-1437750769465-301382cdf094?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },

    // SANDWICHES
    {
        id: 's1',
        title: 'Club Sandwich Clásico',
        description: 'Tres pisos de sabor con pollo, tocino, jamón, queso y vegetales.',
        price: 120,
        category: 'Sandwiches',
        category_id: 'sandwiches',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 's2',
        title: 'Panini Caprese',
        description: 'Mozzarella fresca, tomate, pesto de albahaca y reducción de balsámico.',
        price: 95,
        category: 'Sandwiches',
        category_id: 'sandwiches',
        image: 'https://images.unsplash.com/photo-1539255097905-98767dff5b35?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 's3',
        title: 'Bagel de Salmón',
        description: 'Queso crema, salmón ahumado, alcaparras y cebolla morada en bagel tostado.',
        price: 145,
        category: 'Sandwiches',
        category_id: 'sandwiches',
        image: 'https://images.unsplash.com/photo-1480392022765-968b20173693?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 's4',
        title: 'Sandwich de Roast Beef',
        description: 'Fina carne de res, cebolla caramelizada, mostaza dijon y arúgula.',
        price: 130,
        category: 'Sandwiches',
        category_id: 'sandwiches',
        image: 'https://images.unsplash.com/photo-1619860860774-1e7e1732d463?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 's5',
        title: 'Croissant de Jamón Serrano',
        description: 'Croissant de mantequilla relleno de jamón serrano y queso brie.',
        price: 110,
        category: 'Sandwiches',
        category_id: 'sandwiches',
        image: 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 's6',
        title: 'Baguette de Pollo Pesto',
        description: 'Pechuga de pollo a la parrilla con pesto cremoso y tomates deshidratados.',
        price: 105,
        category: 'Sandwiches',
        category_id: 'sandwiches',
        image: 'https://images.unsplash.com/photo-1553909489-cdb355bd6c04?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 's7',
        title: 'Melt de Atún',
        description: 'Ensalada de atún de la casa con queso gratinado en pan de centeno.',
        price: 98,
        category: 'Sandwiches',
        category_id: 'sandwiches',
        image: 'https://images.unsplash.com/photo-1550507992-eb63ffe08472?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 's8',
        title: 'Veggie Sandwich',
        description: 'Hummus, aguacate, pepino, zanahoria y germinado en pan integral.',
        price: 90,
        category: 'Sandwiches',
        category_id: 'sandwiches',
        image: 'https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 's9',
        title: 'Grilled Cheese Gourmet',
        description: 'Mezcla de quesos cheddar, gruyere y manchego en pan de masa madre.',
        price: 85,
        category: 'Sandwiches',
        category_id: 'sandwiches',
        image: 'https://images.unsplash.com/photo-1528736235302-52922df3c122?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 's10',
        title: 'Torta de Pierna',
        description: 'Pierna de cerdo adobada, aguacate, frijoles y crema.',
        price: 95,
        category: 'Sandwiches',
        category_id: 'sandwiches',
        image: 'https://images.unsplash.com/photo-1629828556608-f46327b8bf4e?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },

    // BREAKFAST (Desayunos)
    {
        id: 'd1',
        title: 'Chilaquiles Verdes',
        description: 'Totopos crujientes bañados en salsa verde, crema, queso y cebolla.',
        price: 95,
        category: 'Desayunos',
        category_id: 'desayunos',
        image: 'https://images.unsplash.com/photo-1627376326164-944fa31bc876?auto=format&fit=crop&w=600&q=80',
        hasVariations: true
    },
    {
        id: 'd2',
        title: 'Hot Cakes con Berries',
        description: 'Torre de hot cakes esponjosos con miel de maple y frutos rojos.',
        price: 110,
        category: 'Desayunos',
        category_id: 'desayunos',
        image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'd3',
        title: 'Bowl de Avena',
        description: 'Avena cocida con leche de almendras, plátano, nueces y canela.',
        price: 80,
        category: 'Desayunos',
        category_id: 'desayunos',
        image: 'https://images.unsplash.com/photo-1541781286675-7b70223358d1?auto=format&fit=crop&w=600&q=80',
        hasVariations: true
    },
    {
        id: 'd4',
        title: 'Tostada de Aguacate',
        description: 'Pan de masa madre tostado con aguacate machacado, huevo pochado y semillas.',
        price: 115,
        category: 'Desayunos',
        image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'd5',
        title: 'Waffles Belgas',
        description: 'Waffles crujientes por fuera y suaves por dentro con crema batida.',
        price: 105,
        category: 'Desayunos',
        category_id: 'desayunos',
        image: 'https://images.unsplash.com/photo-1562376552-3d865f8c614b?auto=format&fit=crop&w=600&q=80',
        hasVariations: true
    },
    {
        id: 'd6',
        title: 'Molletes Clásicos',
        description: 'Bolillo tostado con frijoles refritos y queso gratinado, con pico de gallo.',
        price: 75,
        category: 'Desayunos',
        category_id: 'desayunos',
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
        hasVariations: true
    },
    {
        id: 'd7',
        title: 'Bowl de Frutas',
        description: 'Selección de frutas de temporada con yogurt y granola.',
        price: 85,
        category: 'Desayunos',
        category_id: 'desayunos',
        image: 'https://images.unsplash.com/photo-1511690656952-34342d5c71df?auto=format&fit=crop&w=600&q=80',
        hasVariations: true
    },
    {
        id: 'd8',
        title: 'Pan Francés',
        description: 'Brioche rebozado con canela y azúcar, servido con fruta fresca.',
        price: 110,
        category: 'Desayunos',
        category_id: 'desayunos',
        image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'd9',
        title: 'Enfrijoladas',
        description: 'Tortillas rellenas de pollo bañadas en salsa de frijol con chorizo y crema.',
        price: 95,
        category: 'Desayunos',
        category_id: 'desayunos',
        image: 'https://images.unsplash.com/photo-1625296831038-16cb76e28c46?auto=format&fit=crop&w=600&q=80',
        hasVariations: true
    },
    {
        id: 'd10',
        title: 'Burrito Matutino',
        description: 'Tortilla de harina gigante con huevo revuelto, jamón y queso.',
        price: 85,
        category: 'Desayunos',
        category_id: 'desayunos',
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },

    // MENU DEL DIA
    {
        id: 'm1',
        title: 'Pechuga Cordon Bleu',
        description: 'Pechuga empanizada rellena de jamón y queso, con ensalada y puré.',
        price: 145,
        category: 'Menú del Día',
        category_id: 'menu_dia',
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'm2',
        title: 'Ensalada César con Pollo',
        description: 'Lechuga romana, aderezo césar casero, crutones y parmesano.',
        price: 125,
        category: 'Menú del Día',
        category_id: 'menu_dia',
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'm3',
        title: 'Pasta Alfredo',
        description: 'Fettuccine en salsa cremosa de queso parmesano.',
        price: 135,
        category: 'Menú del Día',
        category_id: 'menu_dia',
        image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80',
        hasVariations: true
    },
    {
        id: 'm4',
        title: 'Milanesa de Res',
        description: 'Acompañada de papas fritas y ensalada fresca.',
        price: 140,
        category: 'Menú del Día',
        category_id: 'menu_dia',
        image: 'https://images.unsplash.com/photo-1599921841143-819065f5a2cd?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'm5',
        title: 'Tacos de Pescado',
        description: 'Tres tacos estilo baja con col y aderezo chipotle.',
        price: 130,
        category: 'Menú del Día',
        category_id: 'menu_dia',
        image: 'https://images.unsplash.com/photo-1512838487238-a2bfe79203dd?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'm6',
        title: 'Sopa de Tortilla',
        description: 'Tradicional sopa azteca con aguacate, queso y chicharrón.',
        price: 85,
        category: 'Menú del Día',
        category_id: 'menu_dia',
        image: 'https://images.unsplash.com/photo-1577908902500-1c312788e5d6?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'm7',
        title: 'Hamburguesa Bambú',
        description: 'Carne sirloin, queso gouda, aros de cebolla y bbq.',
        price: 155,
        category: 'Menú del Día',
        category_id: 'menu_dia',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        hasVariations: true
    },
    {
        id: 'm8',
        title: 'Bowl Teriyaki',
        description: 'Arroz al vapor, vegetales salteados y pollo en salsa teriyaki.',
        price: 135,
        category: 'Menú del Día',
        category_id: 'menu_dia',
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'm9',
        title: 'Crema de Tomate',
        description: 'Crema de tomate rostizado servida con mini grilled cheese.',
        price: 90,
        category: 'Menú del Día',
        category_id: 'menu_dia',
        image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'm10',
        title: 'Lasaña de Carne',
        description: 'Capas de pasta, salsa boloñesa y bechamel gratinada.',
        price: 145,
        category: 'Menú del Día',
        category_id: 'menu_dia',
        image: 'https://images.unsplash.com/photo-1574868235805-c32054a7d1dd?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },

    // EGGS (Huevos)
    {
        id: 'h1',
        title: 'Huevos Benedictinos',
        description: 'Huevos pochados sobre muffin inglés y lomo canadiense, bañados en salsa holandesa.',
        price: 125,
        category: 'Huevos',
        category_id: 'huevos',
        image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'h2',
        title: 'Omelette de Espinaca',
        description: 'Relleno de queso de cabra, espinaca y champiñones.',
        price: 110,
        category: 'Huevos',
        category_id: 'huevos',
        image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=600&q=80',
        hasVariations: true
    },
    {
        id: 'h3',
        title: 'Huevos Rancheros',
        description: 'Dos huevos estrellados sobre tortilla fritas y salsa ranchera.',
        price: 95,
        category: 'Huevos',
        category_id: 'huevos',
        image: 'https://images.unsplash.com/photo-1627376326164-944fa31bc876?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'h4',
        title: 'Huevos Motuleños',
        description: 'Clásico yucateco con salsa, chícharos, jamón y plátano macho.',
        price: 105,
        category: 'Huevos',
        category_id: 'huevos',
        image: 'https://images.unsplash.com/photo-1594977465360-5f21226162eb?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'h5',
        title: 'Huevos Divorciados',
        description: 'Dos huevos estrellados, uno bañado en salsa verde y otro en roja.',
        price: 95,
        category: 'Huevos',
        category_id: 'huevos',
        image: 'https://images.unsplash.com/photo-1627376326164-944fa31bc876?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'h6',
        title: 'Huevos a la Mexicana',
        description: 'Revueltos con jitomate, cebolla y chile serrano.',
        price: 85,
        category: 'Huevos',
        image: 'https://images.unsplash.com/photo-1624806992090-95e45d1666ce?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'h7',
        title: 'Machaca con Huevo',
        description: 'Carne seca norteña revuelta con huevo, acompañada de tortillas de harina.',
        price: 115,
        category: 'Huevos',
        image: 'https://images.unsplash.com/photo-1565553597870-1793086eb36b?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'h8',
        title: 'Shakshuka',
        description: 'Huevos pochados en una salsa de tomate especiada con pimientos.',
        price: 120,
        category: 'Huevos',
        category_id: 'huevos',
        image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'h9',
        title: 'Sándwich de Huevo',
        description: 'Pan brioche, huevo revuelto cremoso, queso cheddar y cebollín.',
        price: 90,
        category: 'Huevos',
        category_id: 'huevos',
        image: 'https://images.unsplash.com/photo-1598516029587-f8cc0483833b?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
    {
        id: 'h10',
        title: 'Huevos con Tocino',
        description: 'El clásico desayuno americano con tocino crujiente y papas hash brown.',
        price: 98,
        category: 'Huevos',
        category_id: 'huevos',
        image: 'https://images.unsplash.com/photo-1533089862017-a0d477eb215a?auto=format&fit=crop&w=600&q=80',
        hasVariations: false
    },
];
