<template>
  <div
    class="flex flex-col bg-white dark:bg-gray-800 rounded-xl p-4 shadow-card hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer group"
    @click="$emit('click')"
  >
    <!-- Header: Customer Name & Time -->
    <div class="flex justify-between items-start mb-2">
      <div class="flex-1 min-w-0 mr-2">
         <h3 class="font-medium text-gray-800 dark:text-white truncate" :title="order.customerName">
           {{ order.customerName }}
         </h3>
      </div>
      
      <!-- Time Badge -->
      <div 
        class="shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold"
        :class="timeBadgeClasses"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        {{ order.deliveryTime || order.time }}
      </div>
    </div>

    <!-- Row 2: Location & Payment -->
    <div class="flex items-center gap-2 mb-3 flex-wrap">
      <!-- Location Badge -->
      <div v-if="order.location" class="flex items-center gap-1 px-2 py-0.5 bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400 rounded text-xs font-medium border border-brand-100 dark:border-brand-800/30">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
        {{ order.location }}
      </div>

       <!-- Payment Badge -->
      <div class="flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded text-xs font-semibold border border-gray-200 dark:border-gray-600 capitalize">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
        {{ order.paymentMethod }}
      </div>
    </div>

    <!-- Footer: Total & Action -->
    <div class="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
      <div class="text-lg font-bold text-gray-900 dark:text-white">
        ${{ order.total.toFixed(2) }}
      </div>
      
      <button 
        @click.stop="$emit('advance')"
        class="flex items-center gap-1 pl-4 pr-3 py-2 rounded-lg text-sm font-medium transition-colors border shadow-sm bg-brand-600 hover:bg-brand-700 text-white border-transparent"
      >
        {{ actionLabel }}
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  actionLabel: {
    type: String,
    default: 'Avanzar'
  }
});

defineEmits(['click', 'advance']);

const timeBadgeClasses = computed(() => {
  // If order is very recent (e.g. < 10 mins) use red/pink, else maybe distinct?
  // For now matching the mockup's red style for "Nuevo" or general time.
  return 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400';
});
</script>
