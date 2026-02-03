<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  product: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'add-to-cart']);

const quantity = ref(1);
const selectedOptions = ref({});
const notes = ref('');
const isScrolledToBottom = ref(false); // Track if user has seen all content

// Reset state when product changes or modal opens
const init = () => {
  quantity.value = 1;
  selectedOptions.value = {};
  notes.value = '';
  isScrolledToBottom.value = false; // Reset scroll tracking
  
  if (props.product.options) {
    props.product.options.forEach(opt => {
      // Select the first option by default
      if (opt.choices && opt.choices.length > 0) {
        selectedOptions.value[opt.name] = opt.choices[0];
      }
    });
  }
};

// Calculate total price
const totalPrice = computed(() => {
  let base = props.product.price || 0;
  
  // If size overrides base price (like in the example 12oz $49, 16oz $59), handle that.
  // The user example implies the size *is* the price in some cases, or modifiers add to it.
  // Let's assume strict addition UNLESS the option is "Size" type where it might replace.
  // However, simpler logic: Base price + Sum of modifiers.
  // If the user says "12 Oz $49", and base is $X, maybe we treat size as base price replacement?
  // For this specific request, the user's example: 
  // "El latte va a tener: Tamaño: 12 Oz $49, 16 Oz $59".
  // This implies the base price in the card might be a starting price, but selecting size sets the price.
  // Let's implement a logic where if an option choice has a price, we add it. 
  // If the 'base' price is just a placeholder, maybe we should be careful.
  
  // Refined Logic based on user example:
  // "Light: +$5" -> Addition.
  // "12 Oz $49" -> Absolute price?
  
  // Let's assume standard addition unless the option key is specific, 
  // BUT the user example looks like Size options have absolute prices while Milk has relative (+$5).
  // I will support both 'price' (absolute) and 'extraPrice' (relative) in the data structure to distinguish.
  // If a choice has 'price', it overrides the product base price (useful for sizes).
  // If a choice has 'extraPrice', it adds to the running total.
  
  let currentTotal = base;
  let hasBaseOverride = false;

  Object.values(selectedOptions.value).forEach(choice => {
    if (choice.price !== undefined) {
      if (!hasBaseOverride) {
        currentTotal = choice.price; // First absolute price wins as base (e.g. Size)
        hasBaseOverride = true;
      } else {
        // If we already have a base override, does another one replace it? 
        // Probably rare to have two "Size" type options. 
        // Let's assume additions for subsequent absolute prices or just take the max?
        // Simpler: Just allow one override or assume well-formed data.
        currentTotal = choice.price; 
      }
    }
    if (choice.extraPrice !== undefined) {
      currentTotal += choice.extraPrice;
    }
  });

  return currentTotal * quantity.value;
});

const increment = () => quantity.value++;
const decrement = () => {
  if (quantity.value > 1) quantity.value--;
};

const close = () => {
  emit('close');
};

const addToCart = () => {
  emit('add-to-cart', {
    product: props.product,
    quantity: quantity.value,
    options: selectedOptions.value,
    notes: notes.value,
    totalPrice: totalPrice.value
  });
  close();
};

// Watch for product changes to re-init might be needed if modal stays open
import { watch, onUnmounted } from 'vue';

const toggleBodyScroll = (lock) => {
  if (lock) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const checkScroll = (e) => {
  const el = e.target;
  // Use a small threshold (e.g. 20px) to make it feel responsive
  if (el.scrollHeight - el.scrollTop - el.clientHeight < 50) {
    isScrolledToBottom.value = true;
  }
};

import { nextTick } from 'vue';

const checkInitialScroll = () => {
    nextTick(() => {
        const el = document.querySelector('.scroll-container');
        if (el) {
            // If content is smaller than container, show button immediately
            if (el.scrollHeight <= el.clientHeight) {
                isScrolledToBottom.value = true;
            } else {
                // Manually trigger check in case it starts at bottom? Unlikely.
                isScrolledToBottom.value = false;
            }
        }
    });
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    init();
    toggleBodyScroll(true);
    checkInitialScroll();
  } else {
    toggleBodyScroll(false);
  }
});

onUnmounted(() => {
  toggleBodyScroll(false);
});
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-backdrop" @click="close">
      <div class="modal-content" @click.stop>
        
        <!-- Close Button -->
        <button class="close-btn" @click="close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>

        <div class="scroll-container" @scroll="checkScroll">
          <!-- Product Image -->
          <div class="image-container">
            <img :src="product.image" :alt="product.title" class="product-image">
          </div>

          <div class="modal-body">
            <!-- Header Info -->
            <div class="product-header">
              <span class="category-pill">{{ product.category }}</span>
              <h2 class="product-title">{{ product.title }}</h2>
              <p class="product-description">{{ product.description }}</p>
              
              <!-- Quantity Control moved here -->
              <div class="header-quantity-row">
                <span class="qty-label">Cantidad:</span>
                <div class="quantity-control">
                  <button @click="decrement" class="qty-btn" :disabled="quantity <= 1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <span class="qty-value">{{ quantity }}</span>
                  <button @click="increment" class="qty-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <hr class="separator" />

            <!-- Options List -->
            <div v-if="product.options && product.options.length" class="options-container">
              <div v-for="option in product.options" :key="option.name" class="option-group">
                <h3 class="option-title">{{ option.name }}</h3>
                
                <div class="option-choices">
                  <label 
                    v-for="choice in option.choices" 
                    :key="choice.label" 
                    class="choice-label"
                    :class="{ active: selectedOptions[option.name] === choice }"
                  >
                    <input 
                      type="radio" 
                      :name="option.name" 
                      :value="choice" 
                      v-model="selectedOptions[option.name]"
                      class="hidden-radio"
                    >
                    <span class="choice-text">{{ choice.label }}</span>
                    <span v-if="choice.price" class="choice-price">${{ choice.price }}</span>
                    <span v-if="choice.extraPrice" class="choice-extra">+${{ choice.extraPrice }}</span>
                  </label>
                </div>
              </div>
              
              <hr class="separator" />
            </div>
            
            <div class="notes-section">
              <label for="product-notes" class="notes-label">Notas (Opcional)</label>
              <textarea 
                id="product-notes" 
                v-model="notes" 
                placeholder="Ej. Sin cebolla, extra picante..."
                class="notes-input"
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Add Button Only -->
        <div class="actions-footer">
          <Transition name="fade-up">
            <button v-show="isScrolledToBottom" class="add-btn" @click="addToCart">
              <span>Agregar {{ quantity }} al pedido</span>
              <span>${{ totalPrice.toFixed(2) }}</span>
            </button>
          </Transition>
          <div v-show="!isScrolledToBottom" class="scroll-hint">
             <p>Por favor revisa todas las opciones</p>
             <svg class="animate-bounce" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
             </svg>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh; /* Ensure full viewport height */
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center; /* Center vertically on desktop */
  justify-content: center;
  padding: 1rem;
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 500px; /* Comfortable max width */
  max-height: 90vh; /* Don't overflow screen height */
  border-radius: 20px;
  overflow: hidden; /* contain child scroll */
  position: relative;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}

.scroll-container {
  overflow-y: auto;
  flex: 1; /* Take available space */
  display: flex;
  flex-direction: column;
  -webkit-overflow-scrolling: touch; /* smooth scroll ios */
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  color: #333;
  transition: background 0.2s;
}
.close-btn:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.image-container {
  width: 100%;
  height: 250px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 0.5rem; /* Reduced bottom padding */
}


.category-pill {
  display: inline-block;
  padding: 4px 12px;
  background-color: var(--color-background-soft, #f3e8ff);
  color: var(--color-brand, #6b21a8);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.product-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
}

.product-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0.5rem 0;
}

/* Quantity in Header styles */
.header-quantity-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 12px;
}

.qty-label {
  font-weight: 600;
  color: #4b5563;
  font-size: 0.95rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-brand, #6b21a8);
  margin: 0;
}

.separator {
  border: none;
  border-top: 1px solid #eee;
  margin: 0.5rem 0;
  width: 100%;
}

.option-group {
  margin-bottom: 1.25rem;
}

.option-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #333;
}

.option-choices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}


.choice-label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.hidden-radio {
  display: none;
}

.choice-label.active {
  background-color: var(--color-background-soft, #f8f5ff);
  border-color: var(--color-brand, #6b21a8);
  color: var(--color-brand, #6b21a8);
  box-shadow: 0 0 0 1px var(--color-brand, #6b21a8);
}

.choice-text {
  font-weight: 500;
}

.choice-price, .choice-extra {
  font-size: 0.85rem;
  opacity: 0.8;
}

.notes-section {
  margin-top: 0.5rem;
}

.notes-label {
  display: block;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.notes-input {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  font-family: inherit;
  font-size: 0.95rem;
  resize: none;
  background-color: #f9fafb;
  color: #1a1a1a; /* Ensure text is visible */
  transition: border-color 0.2s;
}

.notes-input:focus {
  outline: none;
  border-color: var(--color-brand);
  background-color: white;
}

.actions-footer {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: white;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0; /* Sticky footer behavior */
  z-index: 20;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #d1d5db; /* Stronger border for visibility in body */
  background: white;
  border-radius: 50%;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  margin: 0;
  touch-action: manipulation; /* Prevents double-tap zoom */
}

.qty-btn:active {
  background-color: #f3f4f6;
  transform: scale(0.95);
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #e5e7eb;
}

.qty-value {
  width: 30px;
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: #1a1a1a;
}

.add-btn {
  flex: 1;
  background-color: var(--color-brand, #376167);
  color: white;
  border: none;
  padding: 0 1.5rem;
  height: 56px;
  border-radius: 50px; /* Fully oval/pill shape */
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(55, 97, 103, 0.2);
}

.add-btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}


/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.scroll-hint {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #9ca3af;
    font-size: 0.85rem;
    gap: 4px;
    padding: 0.5rem;
}

.animate-bounce {
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
  50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
}

/* Mobile full width styles */
@media (max-width: 640px) {
  .modal-backdrop {
    align-items: flex-end; /* Ensure it starts from bottom/fills */
    padding: 0;
  }
  
  .modal-content {
    border-radius: 0;
    max-height: none;
    height: 100%; /* Fallback */
    height: 100dvh; /* Dynamic viewport, but handled better with fixed container */
    width: 100vw;
  }
  
  .image-container {
    height: 250px;
  }

  .actions-footer {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }
}
</style>
