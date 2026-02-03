<script setup>
import { Search, X } from 'lucide-vue-next';

defineProps({
  placeholder: {
    type: String,
    default: 'Buscar...'
  },
  modelValue: {
    type: String,
    default: ''
  },
  iconPosition: {
    type: String,
    default: 'right', // 'left' or 'right'
    validator: (value) => ['left', 'right'].includes(value)
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue', 'focus', 'click']);
</script>

<template>
  <div 
    class="search-bar-pill" 
    :class="{ 'has-icon-left': iconPosition === 'left' }"
    @click="$emit('click')"
  >
    <Search :size="18" class="search-icon" />
    <input 
      type="text" 
      :placeholder="placeholder" 
      :value="modelValue"
      :readonly="readonly"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="$emit('focus')"
      class="search-input"
      :style="{ cursor: readonly ? 'pointer' : 'text' }"
    />
    <button 
      v-if="modelValue && !readonly" 
      class="clear-btn" 
      @click.stop="$emit('update:modelValue', '')"
      aria-label="Borrar"
    >
      <X :size="14" />
    </button>
  </div>
</template>

<style scoped>
.search-bar-pill {
  display: flex;
  align-items: center;
  background-color: #f3f4f6;
  border-radius: 50px;
  padding: 0 1rem;
  height: 100%; /* Fill parent height */
  width: 100%; /* Fill parent width */
  transition: all 0.2s;
  border: 1px solid transparent;
  position: relative;
}

.search-bar-pill:focus-within {
  background-color: #fff;
  border-color: var(--color-brand, #376167);
  box-shadow: 0 0 0 2px rgba(55, 97, 103, 0.1);
}

.search-input {
  border: none;
  background: transparent;
  flex: 1;
  width: 100%;
  font-size: 0.9rem;
  outline: none;
  color: #374151;
  height: 100%;
}

.search-icon {
  color: #9ca3af;
  flex-shrink: 0;
}

.clear-btn {
  order: 2;
  background: #d1d5db;
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 0;
  cursor: pointer;
  margin-left: 0.5rem;
  flex-shrink: 0;
}

.clear-btn:hover {
  background: #9ca3af;
}

/* Default (Icon Right) */
.search-icon {
  order: 3;
  margin-left: 0.5rem;
}
.search-input {
  order: 1;
}

/* Icon Left Variant */
.has-icon-left .search-icon {
  order: 0;
  margin-left: 0;
  margin-right: 0.5rem;
}
.has-icon-left .search-input {
  order: 1;
}
</style>
