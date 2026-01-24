<script setup>
import { defineProps, defineEmits } from 'vue';
import CategoryButton from './CategoryButton.vue';
import SearchBar from './SearchBar.vue';

const props = defineProps({
  activeId: {
    type: String,
    default: 'bebidas'
  },
  isScrolled: {
    type: Boolean,
    default: false
  },
  searchQuery: {
    type: String,
    default: ''
  },
  categories: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['selected', 'update:searchQuery', 'open-search']);

const selectCategory = (id) => {
  emit('selected', id);
};
</script>

<template>
  <div class="filter-bar-container" :class="{ 'scrolled-layout': isScrolled }">
    
    <div class="filter-main-row">
      <div class="filter-scroll-wrapper">
        <div class="filter-scroll-area">
          <CategoryButton 
            v-for="cat in categories" 
            :key="cat.id"
            :label="cat.title"
            :icon="cat.icon"
            :is-active="activeId === cat.id"
            @click="selectCategory(cat.id)"
          />
          <!-- Spacer-->
          <div style="width: 1px; flex-shrink: 0;"></div>
        </div>
        <div class="scroll-fade-right"></div>
      </div>

      <!-- Desktop Sticky Search (Right side) -->
      <transition name="fade">
        <div v-if="isScrolled" class="desktop-sticky-search">
          <SearchBar 
            placeholder="Buscar..." 
            icon-position="right"
            :model-value="searchQuery"
            @update:model-value="$emit('update:searchQuery', $event)" 
          />
        </div>
      </transition>
    </div>

    <!-- Mobile Sticky Search (Bottom Row) -->


  </div>
</template>

<style scoped>
.filter-bar-container {
  background-color: #fcfdfe;
  padding: 0.25rem 0; /* Reduced vertical padding */
  width: 100%;
  position: sticky;
  top: 0; 
  z-index: 90;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.filter-main-row {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}

.filter-scroll-wrapper {
  position: relative;
  flex: 1; /* Take remaining space */
  overflow: hidden;
}

.filter-scroll-area {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding: 0.25rem 1rem; /* Reduced padding */
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; 
}

.filter-scroll-area::-webkit-scrollbar {
  display: none;
}

/* Visual hint for scrolling */
.scroll-fade-right {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 40px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
  pointer-events: none;
  display: block;
  z-index: 10;
}

/* Desktop Sticky Search */
.desktop-sticky-search {
  display: none; /* Hidden on mobile by default */
  width: 220px;
  height: 40px;
  margin-right: 1.5rem;
  margin-left: 0.5rem;
  flex-shrink: 0;
}



/* Responsive Logic */
@media (min-width: 768px) {
  .filter-bar-container {
    top: 73px;
  }

  .desktop-sticky-search {
    display: none;
  }
  
  }
}

@media (max-width: 767px) {
  .desktop-sticky-search {
    display: none; /* Hide desktop search on mobile */
  }
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
