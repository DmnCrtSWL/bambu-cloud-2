<script setup>
import { X, Info } from 'lucide-vue-next';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close']);
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">
        <X :size="20" />
      </button>

      <div class="modal-body">
        <div class="icon-container">
          <Info :size="48" color="var(--color-brand)" stroke-width="1.5" />
        </div>
        <h3 class="modal-title">Próximamente</h3>
        <p class="modal-message">
          Módulo en desarrollo, disponible próximamente.
        </p>
        <button class="action-btn" @click="$emit('close')">
          Entendido
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-content {
  background-color: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 320px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease-out;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-body {
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon-container {
  background-color: #ecfdf5; /* Light green/teal to match brand if possible, or generic */
  padding: 1rem;
  border-radius: 50%;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.modal-message {
  color: #4b5563;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.action-btn {
  background-color: var(--color-brand);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 2rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.action-btn:hover {
  opacity: 0.9;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
