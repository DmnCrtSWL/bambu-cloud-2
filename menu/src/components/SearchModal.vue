<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import { Search, X } from 'lucide-vue-next';
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  products: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'search', 'select-product']);

const query = ref('');
const inputRef = ref(null);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
    nextTick(() => {
      inputRef.value?.focus();
    });
  } else {
    document.body.style.overflow = '';
  }
});

const results = computed(() => {
  if (!query.value) return [];
  const lower = query.value.toLowerCase();
  return props.products.filter(p => 
    p.title.toLowerCase().includes(lower) || 
    p.description.toLowerCase().includes(lower)
  );
});

const handleClose = () => {
  emit('close');
  query.value = '';
};

const selectProduct = (p) => {
  emit('select-product', p);
  handleClose();
};
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="search-modal-wrapper">
      <div class="search-modal-content">
        <div class="search-header">
          <div class="search-input-wrapper">
            <Search :size="20" class="search-icon" />
            <input 
              ref="inputRef"
              v-model="query"
              type="text" 
              placeholder="Buscar en el menú..." 
              class="search-input"
            />
            <button v-if="query" @click="query = ''" class="clear-btn">
              <X :size="16" />
            </button>
          </div>
          <button @click="handleClose" class="close-modal-btn" aria-label="Cerrar">
            <X :size="24" color="#6b7280" />
          </button>
        </div>
        
        <div class="search-suggestions" v-if="!query">
          <p class="suggestion-title">Sugerencias</p>
          <div class="chips">
            <span class="chip" @click="query='Cappuccino'">Cappuccino</span>
            <span class="chip" @click="query='Sandwich'">Sandwich</span>
            <span class="chip" @click="query='Jugo'">Jugo</span>
          </div>
        </div>
        
        <div class="results-list" v-else>
          <div v-if="results.length === 0" class="no-results">
            No se encontraron productos
          </div>
          <div 
            v-for="product in results" 
            :key="product.id" 
            class="result-item"
            @click="selectProduct(product)"
          >
            <img :src="product.image" class="result-img" />
            <div class="result-info">
              <h4 class="result-title">{{ product.title }}</h4>
              <p class="result-price">${{ product.price }}</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.search-modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: white;
  z-index: 2000;
  display: flex;
  flex-direction: column;
}

.search-modal-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow-y: auto; /* Allow scroll of results */
}

.search-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f3f4f6;
  border-radius: 50px;
  padding: 0 16px;
  height: 48px;
}

.search-icon {
  color: #9ca3af;
  margin-right: 8px;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  font-size: 1rem;
  color: #1f2937;
  outline: none;
  height: 100%;
}

.clear-btn {
  background: #d1d5db;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 0;
  cursor: pointer;
}

.close-modal-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-modal-btn:active {
  background-color: #f3f4f6;
}

/* Results Styles */
.results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 12px;
  transition: background-color 0.2s;
  cursor: pointer;
}

.result-item:active {
  background-color: #f9fafb;
}

.result-img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.result-info {
  display: flex;
  flex-direction: column;
}

.result-title {
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
  color: #1a1a1a;
}

.result-price {
  color: var(--color-brand);
  font-weight: 700;
  margin: 4px 0 0 0;
}

.no-results {
  text-align: center;
  color: #6b7280;
  margin-top: 2rem;
}

.search-suggestions {
  margin-top: 1rem;
}

.suggestion-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 1rem;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.chip {
  background-color: #f3f4f6;
  color: #374151;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
