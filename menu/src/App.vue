<script setup>
import SiteHeader from './components/SiteHeader.vue';
import CategoryFilterBar from './components/CategoryFilterBar.vue';
import SectionTitle from './components/SectionTitle.vue';
import ProductCard from './components/ProductCard.vue';
import SiteFooter from './components/SiteFooter.vue';
import FloatingStoreButton from './components/FloatingStoreButton.vue';
import ProductModal from './components/ProductModal.vue';
import SearchModal from './components/SearchModal.vue';
import SectionSeparator from './components/SectionSeparator.vue';
import CartDrawer from './components/CartDrawer.vue';
import VirtualWaiterModal from './components/VirtualWaiterModal.vue';
import { products } from './data/mockProducts';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import CheckoutView from './components/CheckoutView.vue';
import { Egg, Coffee, Sandwich, GlassWater, Utensils, Sun } from 'lucide-vue-next';

// Determine Category Order based on Time of Day
const getCategoryOrder = () => {
  const hour = new Date().getHours();
  
  let orderIds = [];

  if (hour >= 7 && hour < 8) {
    // 07:00 - 08:00
    orderIds = ['cafe', 'desayunos', 'huevos', 'sandwiches', 'bebidas', 'menu_dia'];
  } else if (hour >= 8 && hour < 11) {
    // 08:00 - 11:00
    orderIds = ['desayunos', 'sandwiches', 'huevos', 'cafe', 'bebidas', 'menu_dia'];
  } else if (hour >= 11 && hour < 17) {
    // 11:00 - 17:00
    orderIds = ['menu_dia', 'sandwiches', 'huevos', 'bebidas', 'cafe', 'desayunos'];
  } else {
    // 17:00 onwards (and early morning < 7)
    orderIds = ['sandwiches', 'cafe', 'bebidas', 'huevos', 'menu_dia', 'desayunos'];
  }

  const allCategories = {
    bebidas: { id: 'bebidas', title: 'Bebidas', icon: GlassWater },
    cafe: { id: 'cafe', title: 'Barra de Café', icon: Coffee },
    sandwiches: { id: 'sandwiches', title: 'Sandwiches', icon: Sandwich },
    desayunos: { id: 'desayunos', title: 'Desayunos', icon: Sun },
    menu_dia: { id: 'menu_dia', title: 'Menú del Día', icon: Utensils },
    huevos: { id: 'huevos', title: 'Huevos', icon: Egg }
  };

  return orderIds.map(id => allCategories[id]);
};

// Define the rendering order of categories
const categoryOrder = ref(getCategoryOrder());

// Search State
const searchQuery = ref('');

// Helper to get products for a specific category ID (with search filtering)
const getProductsByCategory = (catId) => {
  let items = products.filter(p => p.category_id === catId);
  
  if (searchQuery.value.trim()) {
    const lower = searchQuery.value.toLowerCase();
    items = items.filter(p => 
      p.title.toLowerCase().includes(lower) || 
      p.description.toLowerCase().includes(lower)
    );
  }
  
  return items;
};

// Computed property to only show categories with products
const filteredCategories = computed(() => {
  return categoryOrder.value.filter(cat => getProductsByCategory(cat.id).length > 0);
});

// Modal State
const isModalOpen = ref(false);
const isSearchModalOpen = ref(false);
const selectedProduct = ref({});

// Handle opening modal
const handleProductClick = (product) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
};

// Cart State
const cartItems = ref([]);
const isCartOpen = ref(false);
const isWaiterOpen = ref(false);

const totalCartCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

const addToCart = (payload) => {
  const { product, quantity, options, totalPrice } = payload;
  
  // Create variant description
  const description = Object.values(options)
    .map(choice => choice.label)
    .join(', ');

  // Calculate unit price from the total passed (which handles modifiers)
  const unitPrice = totalPrice / quantity;

  const newItem = {
    id: product.id,
    title: product.title,
    image: product.image,
    price: unitPrice,
    quantity: quantity,
    description: description,
    options: options 
  };
  
  // Check for duplicates
  const existingIndex = cartItems.value.findIndex(item => 
    item.id === newItem.id && 
    JSON.stringify(item.options) === JSON.stringify(newItem.options)
  );

  if (existingIndex > -1) {
    cartItems.value[existingIndex].quantity += quantity;
  } else {
    cartItems.value.push(newItem);
  }

  isModalOpen.value = false;
  
  // Only open cart automatically on desktop
  if (window.innerWidth >= 768) {
    isCartOpen.value = true;
  }
};

const handleUpdateQuantity = (item, change) => {
  if (change > 0) {
    item.quantity++;
  } else if (item.quantity > 1) {
    item.quantity--;
  }
};

const handleRemoveItem = (item) => {
  const index = cartItems.value.indexOf(item);
  if (index > -1) {
    cartItems.value.splice(index, 1);
  }
};

const isCheckoutOpen = ref(false);

const handleCheckout = () => {
  isCartOpen.value = false;
  isCheckoutOpen.value = true;
};

const handleOrderSubmit = (orderData) => {
  console.log('Order Data:', orderData);
  alert('¡Pedido Confirmado! (Revisa la consola)');
  // Reset flow for demo
  isCheckoutOpen.value = false;
  cartItems.value = [];
};

// FAB Logic & Scroll State
const showFloatingStore = ref(false);
const activeCategory = ref('bebidas');

const handleScroll = () => {
  showFloatingStore.value = window.scrollY > 100;
  
  // Update active category based on scroll position
  const sections = categoryOrder.value.map(cat => document.getElementById(cat.id));
  const filterBarHeight = 70; // Approximation
  
  const isMobile = window.innerWidth < 768;
  // Threshold must be slightly greater than the scroll offset (150 mobile, 85 desktop)
  // to ensure the section is considered "active" immediately after auto-scrolling to it.
  const activationThreshold = filterBarHeight + (isMobile ? 90 : 30); 
  
  for (const section of sections) {
    if (!section) continue;
    const rect = section.getBoundingClientRect();
    // If section top is within the activation zone
    if (rect.top <= activationThreshold && rect.bottom > filterBarHeight) {
      activeCategory.value = section.id;
    }
  }
};

const scrollToCategory = (id) => {
  const element = document.getElementById(id);
  if (element) {
    activeCategory.value = id; 
    
    const isMobile = window.innerWidth < 768;
    // Mobile needs more offset due to the sticky search bar appearing on scroll
    const totalOffset = isMobile ? 150 : 85; 
    
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - totalOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <SiteHeader 
    :search-query="searchQuery"
    :cart-count="totalCartCount"
    @update:search-query="searchQuery = $event"
    @open-search="isSearchModalOpen = true" 
    @open-cart="isCartOpen = true"
    @open-waiter="isWaiterOpen = true"
  />

  <CategoryFilterBar 
    v-if="!isCheckoutOpen"
    :active-id="activeCategory"
    :is-scrolled="showFloatingStore"
    :search-query="searchQuery"
    :categories="filteredCategories"
    @update:search-query="searchQuery = $event"
    @selected="scrollToCategory"
    @open-search="isSearchModalOpen = true"
  />
  
  <CheckoutView 
    v-if="isCheckoutOpen"
    :cart-items="cartItems"
    :total="totalCartCount > 0 ? cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0"
    @back="isCheckoutOpen = false"
    @submit-order="handleOrderSubmit"
  />

  <main v-if="!isCheckoutOpen" class="main-content">
    <div class="content-container">
      <template v-for="(cat, index) in filteredCategories" :key="cat.id">
        <div 
          :id="cat.id"
          class="category-section"
        >
          <SectionTitle :title="cat.title" />
          
          <div class="products-grid">
            <ProductCard 
              v-for="product in getProductsByCategory(cat.id)"
              :key="product.id"
              v-bind="product"
              @add="handleProductClick(product)"
            />
          </div>
        </div>
        <SectionSeparator v-if="index < filteredCategories.length - 1" />
      </template>
      
      <!-- No Results Message -->
      <div v-if="filteredCategories.length === 0" class="no-results-main">
        <p>No se encontraron productos que coincidan con "{{ searchQuery }}"</p>
      </div>
    </div>
  </main>
  
  <SiteFooter v-if="!isCheckoutOpen" />
  
  <FloatingStoreButton 
    v-if="!isCheckoutOpen"
    :is-visible="showFloatingStore" 
    :count="totalCartCount"
    @click="isCartOpen = true" 
  />

  <ProductModal 
    :is-open="isModalOpen"
    :product="selectedProduct"
    @close="isModalOpen = false"
    @add-to-cart="addToCart"
  />

  <SearchModal 
    :is-open="isSearchModalOpen"
    @close="isSearchModalOpen = false"
    @select-product="handleProductClick"
  />

  <CartDrawer 
    :is-open="isCartOpen"
    :cart-items="cartItems"
    @close="isCartOpen = false"
    @increase="(item) => handleUpdateQuantity(item, 1)"
    @decrease="(item) => handleUpdateQuantity(item, -1)"
    @remove="handleRemoveItem"
    @checkout="handleCheckout"
  />
  
  <VirtualWaiterModal 
    :is-open="isWaiterOpen" 
    @close="isWaiterOpen = false" 
  />
</template>

<style scoped>
.main-content {
  min-height: calc(100vh - 140px);
  background-color: #ffffff;
  padding: 1rem;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.category-section {
  margin-bottom: 5rem;
  scroll-margin-top: 140px; 
}

.products-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.no-results-main {
  text-align: center;
  color: #6b7280;
  margin-top: 4rem;
  font-size: 1.1rem;
}

@media (min-width: 768px) {
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }
  
  .category-section {
    margin-bottom: 2rem;
  }
}
</style>
