<script setup>
import HeaderActions from './HeaderActions.vue';

defineProps({
  searchQuery: { type: String, default: '' },
  cartCount: { type: Number, default: 0 }
});

defineEmits(['open-search', 'update:searchQuery', 'open-message', 'open-user', 'logo-click', 'open-cart']);
</script>

<template>
  <header class="site-header">
    <div class="logo-container" @click="$emit('logo-click')">
      <img src="/logo-bambu.png" alt="Bambú Lomas" class="logo" />
    </div>
    
    <HeaderActions 
      :search-query="searchQuery"
      :cart-count="cartCount"
      @update:search-query="$emit('update:searchQuery', $event)"
      @open-search="$emit('open-search')" 
      @open-message="$emit('open-message')"
      @open-user="$emit('open-user')"
      @open-cart="$emit('open-cart')"
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
  position: relative; /* Scrolls away on mobile */
  z-index: 100;
}

@media (min-width: 768px) {
  .site-header {
    position: sticky;
    top: 0;
    border-bottom: 1px solid #f3f4f6; /* Optional: adds separation when sticky */
  }
}

.logo-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}
</style>
