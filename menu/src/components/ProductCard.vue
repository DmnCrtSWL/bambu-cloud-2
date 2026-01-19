<script setup>
import { Plus } from 'lucide-vue-next';

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  category: {
    type: String,
    default: 'General'
  },
  hasVariations: {
    type: Boolean,
    default: false
  }
});

defineEmits(['add']);
</script>

<template>
  <article class="product-card" @click="$emit('add')">
    <div class="image-container">
      <img v-if="image" :src="image" :alt="title" class="product-image" loading="lazy" />
      <div v-else class="placeholder-image">
        <span class="placeholder-text">{{ title.charAt(0) }}</span>
      </div>
    </div>

    <div class="card-content">
      <div class="header-row">
        <h3 class="product-title">{{ title }}</h3>
        <span class="category-pill">{{ category }}</span>
      </div>
      
      <p class="product-description">
        {{ description }}
      </p>
      
      <div class="card-footer">
        <span class="price-tag">
          <span v-if="hasVariations" class="from-text">Desde</span>
          ${{ price.toFixed(2) }}
        </span>
        
        <button class="add-btn" aria-label="Agregar">
          <Plus :size="20" color="white" stroke-width="3" />
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  background-color: #f7f9f9;
  border-radius: 16px;
  overflow: hidden;
  height: auto;
  display: flex;
  flex-direction: row;
  width: 100%;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  border: 1px solid transparent; /* Prepare for hover border */
}

/* Hover effect for desktop mainly */
.product-card:hover {
  background-color: #f0f4f4;
  transform: translateY(-2px);
  border-color: rgba(55, 97, 103, 0.1);
}

.product-card:active {
  transform: scale(0.99);
}

.image-container {
  display: none; /* Hidden on mobile */
}

/* Mobile Content Styles */
.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.product-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-brand);
  margin: 0;
  line-height: 1.2;
  flex: 1;
}

.category-pill {
  font-size: 0.7rem;
  font-weight: 600;
  color: #6b4c9a;
  background-color: #f3e8ff;
  padding: 2px 8px;
  border-radius: 12px;
  white-space: nowrap;
  flex-shrink: 0;
}

.product-description {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 0.25rem;
}

.price-tag {
  font-weight: 700;
  font-size: 1rem;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  line-height: 1.1;
}

.from-text {
  font-size: 0.75rem;
  color: #666;
  font-weight: 400;
}

.add-btn {
  background-color: var(--color-brand);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s;
}

.add-btn:active {
  transform: scale(0.95);
}

/* DESKTOP STYLES */
@media (min-width: 768px) {
  .product-card {
    flex-direction: column; /* Vertical stack */
    height: 100%;
  }

  .image-container {
    display: block; /* Show image */
    width: 100%;
    aspect-ratio: 4/3;
    overflow: hidden;
    background-color: #e0e6e7;
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .product-image:hover {
    transform: scale(1.05); /* Zoom effect on desktop hover */
  }

  .placeholder-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(55, 97, 103, 0.1);
    color: var(--color-brand);
  }

  .placeholder-text {
    font-size: 2rem;
    font-weight: 700;
    opacity: 0.5;
  }
  
  .card-content {
    flex-grow: 1; /* Fill remaining height */
    justify-content: space-between; /* Space out content nicely */
  }

  /* Adjust title for desktop */
  .header-row {
    flex-direction: column-reverse; /* Put title below category in desktop or keep same? 
                                       Previous design had category tag then title. 
                                       Current mobile has title then pill. 
                                       Let's keep consistent order but adjust styling if needed.
                                       Let's keep title and pill on same row or stack them.
                                     */
    align-items: flex-start;
  }
  
  .category-pill {
    /* Maybe make it look more like a tag on top of image? 
       Or just keep it as is. The user liked the "pill".
       Let's keep the header-row as is for simplicity unless specifed. */
     order: -1; /* Move category above title on desktop if desired, 
                   or keep it side-by-side. 
                   Typically desktop cards have category above title. */
     margin-bottom: 0.5rem;
  }
  
  .header-row {
     flex-direction: column; /* Stack them */
     gap: 0;
  }
}
</style>
