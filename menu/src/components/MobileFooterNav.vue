<script setup>
import { MessageSquare, Search, User, MapPin, ShoppingCart } from 'lucide-vue-next';

defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  cartCount: {
    type: Number,
    default: 0
  }
});

defineEmits(['open-search', 'open-message', 'open-user', 'open-map', 'open-cart']);
</script>

<template>
  <transition name="slide-up">
    <nav v-if="isVisible" class="mobile-footer-nav">
      <button class="nav-item" @click="$emit('open-user')">
        <User :size="24" stroke-width="2" />
      </button>
      
      <button class="nav-item" @click="$emit('open-map')">
        <MapPin :size="24" stroke-width="2" />
      </button>

      <!-- Central Cart Action -->
      <button class="nav-item cart-item" @click="$emit('open-cart')">
        <div class="cart-icon-wrapper">
          <ShoppingCart :size="24" stroke-width="2" />
          <span v-if="cartCount > 0" class="nav-badge"></span>
        </div>
      </button>

      <button class="nav-item" @click="$emit('open-message')">
        <MessageSquare :size="24" stroke-width="2" />
      </button>
      
      <button class="nav-item" @click="$emit('open-search')">
        <Search :size="24" stroke-width="2" />
      </button>
    </nav>
  </transition>
</template>

<style scoped>
.mobile-footer-nav {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  width: auto;
  min-width: 250px;
  justify-content: space-between;
  border: 1px solid rgba(0,0,0,0.05);
}

.nav-item {
  background: none;
  border: none;
  padding: 0.5rem;
  color: #4b5563;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.nav-item:hover, .nav-item:active {
  color: var(--color-brand);
  background-color: rgba(55, 97, 103, 0.1);
  transform: scale(1.1);
}

.cart-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: #dc2626;
  border-radius: 50%;
  border: 1px solid white;
}

/* Slide Up Transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 100%);
}

@media (min-width: 768px) {
  .mobile-footer-nav {
    display: none;
  }
}
</style>
