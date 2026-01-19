<script setup>
import HeaderActions from './HeaderActions.vue';

defineProps({
  searchQuery: { type: String, default: '' },
  cartCount: { type: Number, default: 0 }
});

defineEmits(['open-search', 'update:searchQuery', 'open-cart', 'open-waiter']);
</script>

<template>
  <header class="site-header">
    <div class="logo-container">
      <img src="/logo-bambu.png" alt="Bambú Lomas" class="logo" />
    </div>
    
    <HeaderActions 
      :search-query="searchQuery"
      :cart-count="cartCount"
      @update:search-query="$emit('update:searchQuery', $event)"
      @open-search="$emit('open-search')" 
      @open-cart="$emit('open-cart')"
      @open-waiter="$emit('open-waiter')"
    />
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #ffffff;
  /* box-shadow removed as requested */
  position: relative; /* Scrolls away */
  z-index: 100;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}
</style>
