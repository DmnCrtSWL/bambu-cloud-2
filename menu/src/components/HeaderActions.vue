<script setup>
import { Search, MessageSquare, ShoppingCart } from 'lucide-vue-next';
import UserMenu from './UserMenu.vue';
import SearchBar from './SearchBar.vue';

defineProps({
  searchQuery: { type: String, default: '' },
  cartCount: { type: Number, default: 0 }
});

defineEmits(['open-search', 'update:searchQuery', 'open-message', 'open-user', 'open-cart']);
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
    
    <!-- Mensaje -->
    <button class="icon-btn" aria-label="Mensajes" @click="$emit('open-message')">
      <MessageSquare :size="24" color="var(--color-brand)" stroke-width="2" />
    </button>

    <!-- Cart -->
    <button class="icon-btn cart-btn-header" aria-label="Carrito" @click="$emit('open-cart')">
      <ShoppingCart :size="24" color="var(--color-brand)" stroke-width="2" />
      <span v-if="cartCount > 0" class="badge-header">{{ cartCount }}</span>
    </button>
    
    <!-- User Menu -->
    <UserMenu @click-user="$emit('open-user')" />
  </nav>
</template>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-btn-header {
  position: relative;
}

.badge-header {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #dc2626;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  transform: translate(25%, -25%);
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.icon-btn:hover {
  background-color: rgba(55, 97, 103, 0.1);
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
