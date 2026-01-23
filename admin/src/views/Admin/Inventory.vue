<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      
      <!-- Header & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
           <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">Inventario</h2>
        </div>
        <div class="flex gap-3">
             <Button variant="primary" size="sm" @click="printInventory">
                Imprimir Inventario
             </Button>
            <Button variant="primary" size="sm">
                Lista de Compras
             </Button>
        </div>
      </div>

      <!-- Table Container (Screen Only) -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] print:hidden">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Producto</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Cantidad</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">U/M</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Costo Promedio</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                   <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Última Compra</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                   <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Stock</p>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="paginatedInventory.length === 0">
                <td colspan="6" class="px-5 py-8 text-center text-gray-500 text-sm">No hay inventario registrado</td>
              </tr>
              <tr v-for="(item, index) in paginatedInventory" :key="index" class="border-t border-gray-100 dark:border-gray-800">
                <td class="px-5 py-4 sm:px-6">
                  <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {{ item.productName }}
                  </span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                   <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ item.quantity }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                   <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ item.unit }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                   <p class="text-gray-500 text-theme-sm dark:text-gray-400">${{ item.averageCost }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                   <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ item.lastPurchase }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                   <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                       {{ item.stock }}
                   </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
         <!-- Pagination Controls -->
         <div class="flex items-center justify-between border-t border-gray-200 px-5 py-3 dark:border-gray-800" v-if="inventory.length > itemsPerPage">
             <div class="text-sm text-gray-500">
                 Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, inventory.length) }} de {{ inventory.length }} resultados
             </div>
             <div class="flex gap-2">
                 <button 
                    @click="currentPage--" 
                    :disabled="currentPage === 1"
                    class="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                 >
                     Anterior
                 </button>
                 <button 
                    @click="currentPage++" 
                    :disabled="currentPage === totalPages"
                    class="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                 >
                     Siguiente
                 </button>
             </div>
         </div>
      </div>

       <!-- Print Template (Visible only on print) -->
       <div class="hidden print:block print-container">
            <!-- Header -->
            <div class="flex items-center justify-between mb-8 border-b pb-4">
                <div class="w-1/3 text-left">
                    <img src="/logo-bambu.png" alt="Logo" class="h-16 object-contain" />
                </div>
                <div class="w-1/3 text-center">
                    <h1 class="text-3xl font-bold text-gray-900 tracking-wide">INVENTARIO</h1>
                </div>
                <div class="w-1/3 text-right">
                    <p class="text-sm text-gray-600 font-medium">{{ new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
                </div>
            </div>

            <!-- Items Columns -->
             <div class="columns-2 gap-8">
                 <div v-for="(item, index) in inventory" :key="index" class="break-inside-avoid mb-3 border-b border-gray-200 pb-2">
                     <div class="flex items-center justify-between">
                         <div class="flex-1 pr-4">
                             <div class="font-bold text-gray-900 text-base mb-1">{{ item.productName }}</div>
                             <div class="text-xs text-gray-500 font-medium">
                                 Última compra: {{ item.lastPurchase }} <span class="mx-1">|</span> Stock Sist: {{ item.stock }} {{ item.unit }}
                             </div>
                         </div>
                         <div class="w-24 border border-gray-400 h-10 rounded bg-white relative">
                             <!-- Checkbox/writing area -->
                         </div>
                     </div>
                 </div>
             </div>
       </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import Button from "@/components/ui/Button.vue";

const inventory = ref<any[]>([]);
const currentPage = ref(1);
const itemsPerPage = 10;

const fetchInventory = async () => {
  try {
    const response = await fetch('${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/inventory');
    if (response.ok) {
      inventory.value = await response.json();
    }
  } catch (error) {
    console.error('Error fetching inventory:', error);
  }
};

// Pagination Logic
const totalPages = computed(() => Math.ceil(inventory.value.length / itemsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => currentPage.value * itemsPerPage);
const paginatedInventory = computed(() => {
    return inventory.value.slice(startIndex.value, endIndex.value);
});

const printInventory = () => {
    window.print();
};

onMounted(() => {
  fetchInventory();
});
</script>

<style>
@media print {
  @page {
      size: letter;
      margin: 0.5in;
  }
  
  /* Hide everything by default */
  body * {
    visibility: hidden;
  }

  /* Show only the print container and its children */
  .print-container, .print-container * {
    visibility: visible;
  }

  /* Position the print container to fill the page */
  .print-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: white;
    z-index: 9999;
  }
  
  /* Hide browser header/footers if possible (controlled by browser, but this helps layout) */
  /* Remove layout paddings/margins impacting print */
  html, body {
      margin: 0;
      padding: 0;
      overflow: visible;
  }
}
</style>
