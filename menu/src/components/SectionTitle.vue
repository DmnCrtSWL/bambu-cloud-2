<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="section-title-container">
    <div class="decorative-line"></div>
    <h2 class="section-title">{{ title }}</h2>
  </div>
</template>

<style scoped>
.section-title-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 1.5rem 0 1.5rem 0;
}

.decorative-line {
  width: 4px;
  height: 32px; /* Mismo alto que el texto de 32px */
  background-color: var(--color-brand);
  border-radius: 4px;
  flex-shrink: 0;
}

.section-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-brand);
  line-height: 1;
  margin: 0;
}
</style>
