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
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import CheckoutView from './components/CheckoutView.vue';
import { Egg, Coffee, Sandwich, GlassWater, Utensils, Sun, LayoutGrid } from 'lucide-vue-next';

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
    orderIds = ['cafe', 'desayunos', 'huevos', 'sandwiches', 'menu_dia', 'bebidas'];
  } else if (hour >= 8 && hour < 11) {
    // 08:00 - 11:00
    orderIds = ['desayunos', 'sandwiches', 'huevos', 'cafe', 'menu_dia', 'bebidas'];
  } else if (hour >= 11 && hour < 17) {
    // 11:00 - 17:00
    orderIds = ['menu_dia', 'sandwiches', 'huevos', 'cafe', 'desayunos', 'bebidas'];
  } else {
    // 17:00 onwards (and early morning < 7)
    orderIds = ['sandwiches', 'cafe', 'huevos', 'menu_dia', 'desayunos', 'bebidas'];
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

// Filter Selection State
const selectedFilter = ref('all');

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

const showMinLoader = ref(true);
    
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
    setTimeout(() => {
        showMinLoader.value = false;
    }, 2000); // Enforce 2s minimum animation
  }
};

// Computed property to only show categories with products
const filteredCategories = computed(() => {
  return categoryOrder.value.filter(cat => getProductsByCategory(cat.id).length > 0);
});

// Computed property determines which categories to display based on selection
const displayedCategories = computed(() => {
  if (selectedFilter.value === 'all') {
    return filteredCategories.value;
  }
  return filteredCategories.value.filter(cat => cat.id === selectedFilter.value);
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

// Watch cart changes and persist to localStorage
watch(cartItems, () => {
  const cartState = {
    items: cartItems.value,
    timestamp: Date.now()
  };
  localStorage.setItem('public_menu_cart', JSON.stringify(cartState));
}, { deep: true });


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
  // Clear persisted cart on successful order
  localStorage.removeItem('public_menu_cart');
};

const handleLogoClick = () => {
  isCheckoutOpen.value = false;
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const isScrolledPastHeader = ref(false); // Replaces showFloatingStore for FilterBar
const isMobileFooterVisible = ref(false);
const isHeaderVisible = ref(true); // Control header visibility
const lastScrollY = ref(0);
// const activeCategory = ref('bebidas'); // Removed in favor of selectedFilter
const isManualScrolling = ref(false);

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  isScrolledPastHeader.value = currentScrollY > 100;
  
  // Mobile Footer & Header Logic
  const isAtBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50);

  if (currentScrollY > 60) { // Threshold to start hiding/showing
    const isDesktop = window.innerWidth >= 768;

    if (isAtBottom) {
       isMobileFooterVisible.value = true;
       isHeaderVisible.value = isDesktop; // Keep header visible on desktop
    } else if (currentScrollY > lastScrollY.value) {
      // Scrolling Down
      isMobileFooterVisible.value = true;
      isHeaderVisible.value = isDesktop; // Keep header visible on desktop
    } else {
      // Scrolling Up
      isMobileFooterVisible.value = false;
      isHeaderVisible.value = true;
    }
  } else {
    // Top of page
    isMobileFooterVisible.value = false;
    isHeaderVisible.value = true;
  }
  
  lastScrollY.value = currentScrollY;
  
  // Logic specifically for scroll-spy (auto-selecting category) is disabled
  // as now we use explicit filtering.
};

const handleCategorySelect = (id) => {
  selectedFilter.value = id;
  // Optional: Scroll to top of content if needed, or if "Todos" is selected
  // For now, the filtering behavior effectively "scrolls" by showing only relevant content.
  if (id === 'all') {
     window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
     // If we want to ensure the user sees the start of the category, we can scroll to top too
     window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }
};

onMounted(() => {
  fetchProducts();
  window.addEventListener('scroll', handleScroll);
  
  // Restore cart from localStorage if exists
  try {
    const savedCart = localStorage.getItem('public_menu_cart');
    if (savedCart) {
      const cartState = JSON.parse(savedCart);
      // Only restore if not too old (e.g., within 4 hours)
      const maxAge = 4 * 60 * 60 * 1000; // 4 hours
      if (cartState.timestamp && (Date.now() - cartState.timestamp) < maxAge) {
        cartItems.value = cartState.items || [];
        if (cartItems.value.length > 0) {
          console.log('Carrito restaurado desde sesión anterior');
        }
      } else {
        // Too old, clear it
        localStorage.removeItem('public_menu_cart');
      }
    }
  } catch (e) {
    console.error('Error restoring cart:', e);
    localStorage.removeItem('public_menu_cart');
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <SiteHeader 
    :search-query="searchQuery"
    :cart-count="totalCartCount"
    :is-visible="isHeaderVisible"
    @update:search-query="searchQuery = $event"
    @open-search="isSearchModalOpen = true" 
    @open-message="openDevelopmentModal"
    @open-user="openDevelopmentModal"
    @logo-click="handleLogoClick"
    @open-cart="isCartOpen = true"
  />

  <CategoryFilterBar 
    v-if="!isCheckoutOpen"
    :active-id="selectedFilter"
    :is-scrolled="isScrolledPastHeader"
    :header-visible="isHeaderVisible"
    :search-query="searchQuery"
    :categories="filteredCategories"
    @update:search-query="searchQuery = $event"
    @selected="handleCategorySelect"
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
      <template v-for="(cat, index) in displayedCategories" :key="cat.id">
        <div 
          :id="cat.id"
          class="category-section"
        >
          <SectionTitle :title="cat.title" />
          
          <div class="products-grid">
            <ProductCard 
              v-for="(product, idx) in getProductsByCategory(cat.id)"
              :key="product.id"
              v-bind="product"
              :is-best-seller="idx === 0"
              @add="handleProductClick(product)"
            />
          </div>
        </div>
        <SectionSeparator v-if="index < displayedCategories.length - 1" />
      </template>
      
      <!-- Status Messages -->
      <!-- Custom Bamboo Loader -->
      <transition name="fade">
        <div v-if="isLoading || showMinLoader" class="loader-overlay">
          <div class="loader-content">
            <div class="loader-circle-wrapper">
              <svg class="loader-svg" viewBox="0 0 100 100">
                <circle class="loader-track" cx="50" cy="50" r="45"></circle>
                <circle class="loader-progress" cx="50" cy="50" r="45"></circle>
              </svg>
              <div class="loader-icon">
                <img src="/bambu-icon.png" alt="Loading..." />
              </div>
            </div>
            <p class="loader-text">Cargando menú...</p>
          </div>
        </div>
      </transition>

      <div v-if="fetchError" class="py-12 text-center px-4">
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
  scroll-margin-top: 152px; /* Header (72px) + FilterBar (60px) + Padding (20px) */
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
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .desktop-fab {
    display: flex;
  }
}




/* Loader Styles */
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background-color: #ffffff;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.loader-circle-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
}

.loader-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.loader-track {
  fill: none;
  stroke: #f3f4f6;
  stroke-width: 4;
}

.loader-progress {
  fill: none;
  stroke: var(--color-brand);
  stroke-width: 4;
  stroke-dasharray: 283; /* 2 * PI * 45 */
  stroke-dashoffset: 283;
  stroke-linecap: round;
  animation: loadCircle 2s ease-in-out forwards;
}

.loader-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
}

.loader-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.loader-text {
  font-weight: 600;
  color: #6b7280;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

@keyframes loadCircle {
  0% {
    stroke-dashoffset: 283;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
