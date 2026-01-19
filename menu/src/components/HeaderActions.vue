<script setup>
import { Store, ShoppingCart, Search, ConciergeBell } from 'lucide-vue-next';
import UserMenu from './UserMenu.vue';
import SearchBar from './SearchBar.vue';

defineProps({
  searchQuery: { type: String, default: '' },
  cartCount: { type: Number, default: 0 }
});

defineEmits(['open-search', 'update:searchQuery', 'open-cart', 'open-waiter']);
</script>

<template>
  <nav class="header-actions">
    <!-- Desktop Search Pill -->
    <div class="search-pill-desktop">
      <SearchBar 
        placeholder="Buscar..." 
        icon-position="right" 
        :model-value="searchQuery"
        @update:model-value="$emit('update:searchQuery', $event)"
      />
    </div>

    <!-- Mobile Search Icon -->
    <button class="icon-btn mobile-search-btn" aria-label="Buscar" @click="$emit('open-search')">
      <Search :size="24" color="var(--color-brand)" stroke-width="2" />
    </button>
    
    <button class="icon-btn" aria-label="Tienda">
      <Store :size="24" color="var(--color-brand)" stroke-width="2" />
    </button>

    <button class="icon-btn" aria-label="Mesero Virtual" @click="$emit('open-waiter')">
      <!-- Icono de servicio/mesero -->
      <ConciergeBell :size="24" color="var(--color-brand)" stroke-width="2" />
    </button>
    
    <button class="icon-btn cart-wrapper" aria-label="Carrito" @click="$emit('open-cart')">
      <ShoppingCart :size="24" color="var(--color-brand)" stroke-width="2" />
      <span v-if="cartCount > 0" class="badge-header">{{ cartCount }}</span>
    </button>
    
    <UserMenu />
  </nav>
</template>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:active {
  transform: scale(0.95);
}

.search-pill-desktop {
  display: none;
}

.mobile-search-btn {
  display: block;
}

.cart-wrapper {
  position: relative;
}

.badge-header {
  position: absolute;
  top: -6px;
  right: -8px;
  background-color: #dc2626; /* Strong red */
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid white; /* Outline to separate from icon */
}

@media (min-width: 768px) {
  .search-pill-desktop {
    display: block;
    width: 220px;
    height: 40px;
  }
  
  .mobile-search-btn {
    display: none;
  }
}
</style>
