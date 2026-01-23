<script setup>
import SiteHeader from './components/SiteHeader.vue';
import CategoryFilterBar from './components/CategoryFilterBar.vue';
import SectionTitle from './components/SectionTitle.vue';
import ProductCard from './components/ProductCard.vue';

import FloatingStoreButton from './components/FloatingStoreButton.vue';
import MobileFooterNav from './components/MobileFooterNav.vue';
import DevelopmentModal from './components/DevelopmentModal.vue';
import ProductModal from './components/ProductModal.vue';
import SearchModal from './components/SearchModal.vue';
import SectionSeparator from './components/SectionSeparator.vue';
import CartDrawer from './components/CartDrawer.vue';
import VirtualWaiterModal from './components/VirtualWaiterModal.vue';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import CheckoutView from './components/CheckoutView.vue';
import { Egg, Coffee, Sandwich, GlassWater, Utensils, Sun } from 'lucide-vue-next';

// Dynamic Products State
const products = ref([]);
const isLoading = ref(true);
const fetchError = ref('');

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
  let items = products.value.filter(p => p.category_id === catId);
  
  if (searchQuery.value.trim()) {
    const lower = searchQuery.value.toLowerCase();
    items = items.filter(p => 
      p.title.toLowerCase().includes(lower) || 
      p.description.toLowerCase().includes(lower)
    );
  }
  
  return items;
};

// Fetch Products from Backend
const fetchProducts = async () => {
  isLoading.value = true;
  fetchError.value = '';
  try {
    let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    // Remove trailing slash if present to avoid double slashes (e.g. .app//api) which cause CORS redirects
    apiUrl = apiUrl.replace(/\/$/, '');

    const response = await fetch(`${apiUrl}/api/public/menu`);
    if (response.ok) {
        products.value = await response.json();
    } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch menu:', response.statusText, errorData);
        fetchError.value = errorData.error || `Error del servidor (${response.status}): No se pudo cargar el menú.`;
    }
  } catch (err) {
    console.error('Error connecting to backend:', err);
    fetchError.value = 'Error de conexión con el servidor.';
  } finally {
    isLoading.value = false;
  }
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

// Development Modal State
const isDevelopmentModalOpen = ref(false);
const openDevelopmentModal = () => isDevelopmentModalOpen.value = true;

// Cart State
const cartItems = ref([]);
const isCartOpen = ref(false);
const isWaiterOpen = ref(false); // Kept in code but not triggered by UI currently

const totalCartCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});


const addToCart = (payload) => {
  // console.log('Adding to cart payload:', payload);
  const { product, quantity, options, totalPrice, notes } = payload;
  
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
    options: options,
    notes: notes || ''
  };
  
  // Check for duplicates (same ID, same options, same notes)
  const existingIndex = cartItems.value.findIndex(item => 
    item.id === newItem.id && 
    JSON.stringify(item.options) === JSON.stringify(newItem.options) &&
    (item.notes || '') === (newItem.notes || '')
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
  // console.log('Order Data:', orderData);
  // Reset flow for demo
  isCheckoutOpen.value = false;
  cartItems.value = [];
};

const handleLogoClick = () => {
  isCheckoutOpen.value = false;
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// FAB Logic & Scroll State
const isScrolledPastHeader = ref(false); // Replaces showFloatingStore for FilterBar
const isMobileFooterVisible = ref(false);
const lastScrollY = ref(0);
const activeCategory = ref('bebidas');

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  isScrolledPastHeader.value = currentScrollY > 100;
  
  // Mobile Footer Logic: Show on Scroll Down (> 100px) or at Bottom, Hide on Scroll Up
  // Only apply logic if we have scrolled past header
  const isAtBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50);

  if (currentScrollY > 100) {
    if (isAtBottom) {
       // Keep visible if at bottom (prevents flickering on IOS rubber-band effect)
       isMobileFooterVisible.value = true;
    } else if (currentScrollY > lastScrollY.value) {
      // Scrolling Down
      isMobileFooterVisible.value = true;
    } else {
      // Scrolling Up and NOT at bottom
      isMobileFooterVisible.value = false;
    }
  } else {
    // Top of page
    isMobileFooterVisible.value = false;
  }
  
  lastScrollY.value = currentScrollY;
  
  // Update active category based on scroll position
  const sections = categoryOrder.value.map(cat => document.getElementById(cat.id));
  const filterBarHeight = 70; // Approximation
  
  const isMobile = window.innerWidth < 768;
  const activationThreshold = filterBarHeight + (isMobile ? 90 : 30); 
  
  for (const section of sections) {
    if (!section) continue;
    const rect = section.getBoundingClientRect();
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
  fetchProducts();
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
    @open-message="openDevelopmentModal"
    @open-user="openDevelopmentModal"
    @logo-click="handleLogoClick"
    @open-cart="isCartOpen = true"
  />

  <CategoryFilterBar 
    v-if="!isCheckoutOpen"
    :active-id="activeCategory"
    :is-scrolled="isScrolledPastHeader"
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
      
      <!-- Status Messages -->
      <div v-if="isLoading" class="py-12 text-center">
         <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
         <p class="text-gray-500">Cargando menú...</p>
      </div>

      <div v-else-if="fetchError" class="py-12 text-center px-4">
         <p class="font-bold text-red-500 mb-2">{{ fetchError }}</p>
         <p class="text-sm text-gray-500">Verifique su conexión e intente recargar la página.</p>
      </div>

      <div v-else-if="filteredCategories.length === 0" class="no-results-main py-12 text-center px-4">
         <div v-if="products.length === 0">
            <Utensils class="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 class="font-bold text-lg text-gray-800 mb-2">Menú Vacío</h3>
             <p class="text-gray-600 mb-4">No hay platillos disponibles para mostrar.</p>
             <div class="bg-gray-50 p-4 rounded-lg inline-block text-left text-sm text-gray-500 border border-gray-200">
                <p class="font-semibold text-xs uppercase mb-1">Nota para el Administrador:</p>
                <p>Asegúrese de que los platillos:</p>
                <ul class="list-disc pl-4 mt-1 space-y-1">
                   <li>Estén registrados en el sistema.</li>
                   <li>Tengan el estado <strong>"Publicado"</strong> activado.</li>
                </ul>
             </div>
         </div>
         <div v-else>
            <p class="text-gray-600">No se encontraron productos que coincidan con "{{ searchQuery }}"</p>
         </div>
      </div>
    </div>
  </main>
  

  
  <MobileFooterNav 
    v-if="!isCheckoutOpen"
    :is-visible="isMobileFooterVisible"
    :cart-count="totalCartCount"
    @open-message="openDevelopmentModal"
    @open-search="isSearchModalOpen = true"
    @open-user="openDevelopmentModal"
    @open-map="openDevelopmentModal"
    @open-cart="isCartOpen = true"
  />

  <FloatingStoreButton 
    v-if="!isCheckoutOpen"
    :is-visible="isScrolledPastHeader" 
    :count="totalCartCount"
    class="desktop-fab"
    @click="isCartOpen = true" 
  />

  <ProductModal 
    :is-open="isModalOpen"
    :product="selectedProduct"
    @close="isModalOpen = false"
    @add-to-cart="addToCart"
  />

  <DevelopmentModal 
    :is-open="isDevelopmentModalOpen"
    @close="isDevelopmentModalOpen = false"
  />

  <SearchModal 
    :is-open="isSearchModalOpen"
    :products="products"
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
.desktop-fab {
  display: none;
}

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
  
  .desktop-fab {
    display: flex;
  }
}



</style>
