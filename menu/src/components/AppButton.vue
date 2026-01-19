<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary', // primary, secondary, outline, whatsapp
    validator: (value) => ['primary', 'secondary', 'outline', 'whatsapp'].includes(value)
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <button 
    class="app-btn" 
    :class="[`btn-${variant}`, { 'btn-block': block }]"
    :disabled="isDisabled"
    v-bind="$attrs"
  >
    <slot name="icon"></slot>
    <slot></slot>
  </button>
</template>

<style scoped>
.app-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 1.25rem;
  border-radius: 50px;
  font-family: inherit;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: transform 0.2s, opacity 0.2s, background-color 0.2s;
  text-decoration: none;
}

.app-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.app-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Variants */
.btn-primary {
  background-color: var(--color-brand);
  color: white;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-outline {
  background-color: transparent;
  border: 2px solid var(--color-brand);
  color: var(--color-brand);
}

.btn-whatsapp {
  background-color: #25D366; /* Specific WA Green, or var(--color-brand) if requested */
  color: white;
}

/* User asked for "Verde Brand" for WhatsApp. 
   If var(--color-brand) is the teal, maybe they want that?
   I'll stick to WA green for now as it's standard UX, 
   but if they really want 'brand' I can change this. 
   Actually, I'll use var(--color-brand) since they explicitly said "verde brand".
*/
.btn-whatsapp {
  background-color: var(--color-brand); 
  color: white;
}

.btn-block {
  width: 100%;
}
</style>
