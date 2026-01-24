<script setup>
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-vue-next';
import { computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  cartItems: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'increase', 'decrease', 'remove', 'checkout']);

const subtotal = computed(() => {
  return props.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const total = computed(() => subtotal.value); // Add tax or delivery logic if needed later
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="cart-backdrop" 
        @click="$emit('close')"
      ></div>
    </Transition>

    <!-- Drawer -->
    <Transition name="slide">
      <aside v-if="isOpen" class="cart-drawer">
        <header class="cart-header">
          <div class="header-title">
            <ShoppingBag :size="24" />
            <h2>Tu Pedido</h2>
            <span class="count-badge" v-if="cartItems.length">{{ cartItems.length }}</span>
          </div>
          <button class="close-btn" @click="$emit('close')">
            <X :size="24" />
          </button>
        </header>

        <div class="cart-body">
          <div v-if="cartItems.length === 0" class="empty-cart">
            <img src="/bambu-icon.png" class="empty-icon" alt="Empty" />
            <p>Tu carrito está vacío</p>
            <button class="start-order-btn" @click="$emit('close')">
              Empezar a ordenar
            </button>
          </div>

          <div v-else class="cart-items">
            <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
              <img :src="item.image" :alt="item.title" class="item-image" />
              
              <div class="item-details">
                <div class="item-header">
                  <h3>{{ item.title }}</h3>
                  <p class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
                <p v-if="item.description" class="item-variant">{{ item.description }}</p>
                
                <div class="item-controls">
                  <div class="qty-control">
                    <button class="qty-btn" @click="$emit('decrease', item)" :disabled="item.quantity <= 1">
                      <Minus :size="14" />
                    </button>
                    <span class="qty-num">{{ item.quantity }}</span>
                    <button class="qty-btn" @click="$emit('increase', item)">
                      <Plus :size="14" />
                    </button>
                  </div>
                  
                  <button class="remove-btn" @click="$emit('remove', item)">
                    <Trash2 :size="18" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer class="cart-footer" v-if="cartItems.length > 0">
          <div class="summary-row total">
            <span>Total</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
          
          <button class="checkout-btn" @click="$emit('checkout')">
            Confirmar Pedido
          </button>
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cart-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 3000;
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100dvh;
  width: 100%;
  max-width: 450px; /* Desktop width */
  background-color: white;
  z-index: 3001;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0,0,0,0.1);
}

.cart-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f3f4f6;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-brand);
}

.header-title h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.count-badge {
  background-color: var(--color-brand);
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.5rem;
  border-radius: 50%;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #1f2937;
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  color: #9ca3af;
}

.empty-icon {
  width: 60px;
  height: 60px;
  opacity: 0.4;
  object-fit: contain;
}

.start-order-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--color-brand);
  background: var(--color-brand);
  color: white;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  background-color: #f3f4f6;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.item-header h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
  line-height: 1.2;
}

.item-price {
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.item-variant {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0.25rem 0 0.5rem 0;
}

.item-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #f9fafb;
  padding: 4px;
  border-radius: 30px;
}

.qty-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: white;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #374151;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-num {
  font-weight: 600;
  font-size: 0.9rem;
  min-width: 16px;
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.remove-btn:hover {
  opacity: 1;
}

.cart-footer {
  padding: 1.5rem;
  border-top: 1px solid #f3f4f6;
  background-color: #fff;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.summary-row.total {
  font-weight: 700;
  color: #111827;
  font-size: 1.25rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.checkout-btn {
  width: 100%;
  background-color: var(--color-brand);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.1s;
}

.checkout-btn:active {
  transform: scale(0.98);
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}

/* Response Mobile Full Screen */
@media (max-width: 768px) {
  .cart-drawer {
    max-width: 100%;
    width: 100vw;
  }
  
  .cart-header {
    padding: 1rem 1.5rem;
  }
}
</style>
