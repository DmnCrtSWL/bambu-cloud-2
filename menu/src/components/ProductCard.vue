<script setup>
import { Plus, Trophy } from 'lucide-vue-next';

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
  },
  isBestSeller: {
    type: Boolean,
    default: false
  }
});

defineEmits(['add']);
</script>

<template>
  <article 
    class="product-card" 
    :class="{ 'best-seller': isBestSeller }"
    @click="$emit('add')"
  >
    <!-- Content (Left Side on Desktop - 70%) -->
    <div class="card-content">
      <!-- Title -->
      <h3 class="product-title">{{ title }}</h3>
      
      <!-- Description -->
      <p class="product-description">
        {{ description }}
      </p>

      <!-- Price Row -->
      <div class="price-row desktop-only">
        <span class="price-tag">
          <span v-if="hasVariations" class="from-text">Desde</span>
          ${{ price.toFixed(2) }}
        </span>
        
        <!-- Desktop Add Button (Now here) -->
        <button class="add-btn desktop-btn" :class="{ 'btn-highlight': isBestSeller }" @click.stop="$emit('add')">
           <Plus :size="24" color="white" stroke-width="3" />
        </button>
      </div>
      
      <!-- Mobile: Footer (Price + Button) -->
      <div class="card-footer mobile-only-footer">
        <span class="price-tag">
          <span v-if="hasVariations" class="from-text">Desde</span>
          ${{ price.toFixed(2) }}
        </span>
        
        <button class="add-btn mobile-btn" :class="{ 'btn-highlight': isBestSeller }" aria-label="Agregar">
          <Plus :size="20" color="white" stroke-width="3" />
        </button>
      </div>
    </div>

    <!-- Desktop: Image Container (Right Side - 30%) -->
    <div class="image-container">
      <div v-if="isBestSeller" class="favorite-badge-desktop">
        <Trophy :size="12" class="trophy-icon" />
        <span>Favorito</span>
      </div>
      
      <img v-if="image" :src="image" :alt="title" class="product-image" loading="lazy" />
      <div v-else class="placeholder-image">
        <span class="placeholder-text">{{ title.charAt(0) }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  height: auto;
  display: flex;
  flex-direction: column; /* Default Mobile */
  width: 100%;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
  border: 1px solid transparent;
}

/* Best Seller Highlight */
.product-card.best-seller {
  background-color: #fffbeb;
  border: 1px solid #fbbf24;
  box-shadow: 0 4px 6px -1px rgba(251, 191, 36, 0.2), 0 2px 4px -1px rgba(251, 191, 36, 0.1);
}

.product-card:hover {
  background-color: #f0f4f4;
  transform: translateY(-2px);
  border-color: rgba(55, 97, 103, 0.1);
}

.product-card.best-seller:hover {
  background-color: #fff8dc;
  border-color: #f59e0b;
}

.product-card:active {
  transform: scale(0.99);
}

/* Base Components (Mobile First) */
.image-container {
  display: none; 
}

.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.product-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2rem; /* Slightly larger */
  font-weight: 700; /* Reduced from 900 */
  color: var(--color-brand);
  margin: 0;
  line-height: 1.1;
}

/* Removed meta-row styling */
/* Removed pills-container styling */

.category-pill {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  color: #6b4c9a;
  background-color: #f3e8ff;
  padding: 2px 8px;
  border-radius: 12px;
  white-space: nowrap;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.category-pill.favorite-pill {
  background-color: #fbbf24;
  color: #78350f;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-description {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
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
  color: var(--color-brand);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  line-height: 1.1;
  font-family: 'Montserrat', sans-serif;
}

/* Specific overwrite for desktop price */
@media (min-width: 768px) {
  .price-row {
     display: flex;
     margin-top: auto; /* Push to bottom of content area if needed, or just let it flow */
     margin-bottom: 0.5rem;
     align-items: center; /* Center vertically */
     justify-content: space-between; /* Space out price and button */
     width: 100%;
  }

  .price-row .price-tag {
     font-size: 1.1rem; /* Slightly larger */
     font-weight: 600; /* Reduced from 800 */
     color: var(--color-brand); /* Brand color */
     flex-direction: row; 
     align-items: baseline; /* Align 'Desde' baseline with price */
     gap: 0.35rem;
     margin-right: auto; /* Push price to left, button to right if flex container */
  }

  .product-description {
    font-size: 14px;
    margin-top: 0.25rem;
    margin-bottom: 1rem; /* Add spacing between desc and price */
  }
}

.from-text {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500; /* Boldness for visibility */
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

.add-btn.btn-highlight {
  background-color: #f59e0b; /* Amber */
}

.add-btn:active {
  transform: scale(0.95);
}

/* Visibility toggles */
.desktop-btn,
.favorite-badge-desktop,
.desktop-only {
  display: none !important;
}

.mobile-only, .mobile-only-footer {
  display: flex; 
}

/* DESKTOP STYLES */
@media (min-width: 768px) {
  .product-card {
    flex-direction: row; /* Horizontal layout */
    min-height: 170px; /* Reduced height for balance */
    height: auto; 
    align-items: stretch;
    background-color: #ffffff; 
    box-shadow: 0 4px 20px rgba(0,0,0,0.05); 
    border: 1px solid #f3f4f6;
    padding: 10px; /* Reduced padding as requested */
    gap: 15px; /* Use gap for separation instead of reliance on margins */
  }

  /* Content (Right Side) */
  .card-content {
    order: 2;
    flex: 1; /* Take available space */
    max-width: none; /* Reset max-width since we use flex-grow */
    padding: 0; /* Clear internal padding since container has padding */
    padding-right: 0; 
    justify-content: flex-start;
    gap: 0.25rem;
  }
  
  /* Image on Left (Order 1 - Fixed Width) */
  .image-container {
    display: block;
    width: 140px; /* Fixed width for consistency */
    flex: 0 0 140px;
    height: 100%;
    position: relative;
    order: 1; 
    background-color: #e0e6e7;
    border-radius: 12px; /* Add radius to image container to match design aesthetics */
    overflow: hidden; /* Ensure image stays inside rounded corners */
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .product-image:hover {
    transform: scale(1.05);
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

  /* Desktop Add Button (Now in flex row) */
  .desktop-btn {
    display: flex !important;
    position: static; /* Reset absolute */
    width: 36px; /* Slightly larger */
    height: 36px;
    background-color: var(--color-brand); 
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    margin-left: 1rem;
    flex-shrink: 0;
  }
  
  .desktop-btn.btn-highlight {
      background-color: #f59e0b;
  }

  /* Badge on Image */
  .favorite-badge-desktop {
    display: flex !important;
    position: absolute;
    top: 10px;
    left: 10px;
    margin: 0;
    padding: 4px 12px;
    background-color: #fbbf24;
    color: #78350f;
    font-size: 0.7rem;
    font-weight: 700;
    border-radius: 20px;
    align-items: center;
    gap: 4px;
    z-index: 5;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  /* Text Styling */
  .product-title {
    font-size: 1.15rem; 
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }


  


  /* Hide Mobile Elements */
  .mobile-only, .mobile-only-footer {
    display: none !important;
  }
  
  .desktop-only {
    display: inline-flex !important;
  }
}
</style>
