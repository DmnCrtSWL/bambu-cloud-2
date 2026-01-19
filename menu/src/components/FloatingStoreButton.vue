<script setup>
import { ShoppingCart } from 'lucide-vue-next';

defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  count: {
    type: Number,
    default: 0
  }
});

defineEmits(['click']);
</script>

<template>
  <transition name="fade-slide">
    <button 
      v-if="isVisible" 
      class="floating-store-btn" 
      aria-label="Tienda"
      @click="$emit('click')"
    >
      <ShoppingCart :size="32" class="cart-icon" stroke-width="2.5" />
      <span v-if="count > 0" class="fab-badge">{{ count }}</span>
    </button>
  </transition>
</template>

<style scoped>
.floating-store-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 3px solid var(--color-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(55, 97, 103, 0.4);
  cursor: pointer;
  z-index: 1000;
  padding: 0;
  color: var(--color-brand);
  /* Elegant hover effect */
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
}

.cart-icon {
  color: var(--color-brand);
}

.fab-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #dc2626;
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  min-width: 24px;
  height: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.floating-store-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(55, 97, 103, 0.5);
  background-color: #f8fcfc; /* Very light brand tint or white */
}

.floating-store-btn:active {
  transform: scale(0.95);
}

/* Transition animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}
</style>
