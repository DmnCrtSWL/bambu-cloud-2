<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Object,
    default: null
  }
});

defineEmits(['click']);
</script>

<template>
  <button 
    class="category-btn" 
    :class="{ 'active': isActive }"
    @click="$emit('click')"
  >
    <component :is="icon" v-if="icon" :size="16" class="btn-icon" />
    <span>{{ label }}</span>
  </button>
</template>

<style scoped>
.category-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  border: none;
  background-color: rgba(55, 97, 103, 0.08); /* Slightly darker than bar background (0.04) */
  color: var(--color-brand);
  font-family: inherit;
  font-size: 0.95rem; /* Slightly larger for Nunito readability */
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
}

.category-btn:hover {
  background-color: rgba(55, 97, 103, 0.15);
}

.category-btn.active {
  background-color: var(--color-brand);
  color: white;
}

.btn-icon {
  stroke-width: 2.5;
}
</style>
