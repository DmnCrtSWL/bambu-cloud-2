<template>
  <AdminLayout>

    <div class="space-y-6">
      
      <!-- Top Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: Cashier Info -->
          <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
              <span class="text-sm text-gray-500 font-medium">Cajero</span>
              <h3 class="text-lg font-bold text-gray-800 dark:text-white truncate">{{ currentUser?.name || 'Usuario' }}</h3>
              <p class="text-xs text-brand-500 font-medium">{{ currentUser?.role || 'Operador' }}</p>
          </div>

          <!-- Card 2: Date Selector -->
          <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
              <span class="text-sm text-gray-500 font-medium mb-1">Fecha del Reporte</span>
              <input 
                    v-model="selectedDate" 
                    type="date" 
                    class="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    @change="fetchReport"
                >
          </div>

          <!-- Card 3: CXC Generated -->
          <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
              <div class="relative z-10">
                <span class="text-sm text-gray-500 font-medium">CXC Generados</span>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white mt-1">${{ formatCurrency(reportData.cxcGenerated) }}</h3>
                <p class="text-xs text-gray-400">Créditos otrogados</p>
              </div>
              <FileTextIcon class="absolute right-[-10px] bottom-[-10px] w-20 h-20 text-blue-50 dark:text-gray-700 group-hover:scale-110 transition-transform" />
          </div>

           <!-- Card 4: Courtesy Total -->
          <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
              <div class="relative z-10">
                <span class="text-sm text-gray-500 font-medium">Cortesías</span>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white mt-1">${{ formatCurrency(reportData.courtesyTotal) }}</h3>
                <p class="text-xs text-gray-400">Total en cortesías</p>
              </div>
              <GiftIcon class="absolute right-[-10px] bottom-[-10px] w-20 h-20 text-pink-50 dark:text-gray-700 group-hover:scale-110 transition-transform" />
          </div>
      </div>

      <!-- Sales Table -->
      <div class="overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 class="font-bold text-gray-800 dark:text-white">Movimientos del Día</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 font-semibold">
                    <tr>
                        <th class="px-6 py-4">Concepto</th>
                        <th class="px-6 py-4 text-right">Monto</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr v-if="loading" class="animate-pulse">
                        <td colspan="2" class="px-6 py-8 text-center text-gray-400">Calculando reporte...</td>
                    </tr>
                    
                    <template v-else>
                         <!-- Dynamic Rows -->
                        <tr v-for="(amount, method) in reportData.incomeByMethod" :key="method" class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                             <!-- Filter out 0 amounts? User might want to see 0s for standard methods, but usually we show what exists. 
                                  User mockup showed 0s. 
                                  Let's show all keys returned by backend. 
                             -->
                            <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                                <component :is="getIconForMethod(method)" class="w-4 h-4" :class="getColorForMethod(method)" />
                                {{ method }}
                            </td>
                            <td class="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                                ${{ formatCurrency(amount) }}
                            </td>
                        </tr>

                        <!-- Total Row -->
                        <tr class="bg-gray-50 dark:bg-gray-900/50 font-bold text-lg border-t-2 border-gray-100 dark:border-gray-600">
                            <td class="px-6 py-5 text-gray-800 dark:text-white">Total Venta</td>
                            <td class="px-6 py-5 text-right text-brand-600 dark:text-brand-400">
                                ${{ formatCurrency(reportData.totalIncome) }}
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
          </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { 
    BanknoteIcon, 
    CreditCardIcon, 
    SmartphoneIcon, 
    TruckIcon, 
    FileTextIcon, 
    GiftIcon
} from 'lucide-vue-next';

const selectedDate = ref(new Date().toLocaleDateString('en-CA')); // YYYY-MM-DD local time works better for input[type="date"] default match logic
const loading = ref(false);
const reportData = ref({
    incomeByMethod: {},
    totalIncome: 0,
    cxcGenerated: 0,
    courtesyTotal: 0
});

const currentUser = computed(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
});

const getIconForMethod = (method) => {
    switch(method) {
        case 'Efectivo': return BanknoteIcon;
        case 'Tarjeta': return CreditCardIcon;
        case 'Transferencia': 
        case 'En Linea': return SmartphoneIcon;
        case 'Uber Eats': return TruckIcon;
        default: return BanknoteIcon;
    }
};

const getColorForMethod = (method) => {
    switch(method) {
        case 'Efectivo': return 'text-green-500';
        case 'Tarjeta': return 'text-blue-500';
        case 'Transferencia': 
        case 'En Linea': return 'text-purple-500';
        case 'Uber Eats': return 'text-orange-500';
        default: return 'text-gray-500';
    }
};

const fetchReport = async () => {
    loading.value = true;
    try {
        const userIdForReport = currentUser.value ? currentUser.value.id : '';
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/reports/daily-sales?date=${selectedDate.value}&userId=${userIdForReport}`);
        if (res.ok) {
            reportData.value = await res.json();
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

onMounted(() => {
    fetchReport();
});
</script>
