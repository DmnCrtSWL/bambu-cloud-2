<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <!-- Date & Controls Header -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90 whitespace-nowrap">Estadísticas</h2>
        
        <div class="flex flex-row flex-wrap items-center gap-4">
          <!-- Filter Tabs -->
          <div class="flex p-1 bg-gray-100 rounded-lg dark:bg-gray-800 w-fit">
            <button 
                v-for="filter in dateFilters" 
                :key="filter.value"
                @click="setDateFilter(filter.value)"
                :class="[
                    'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                    activeDateFilter === filter.value 
                        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                ]"
            >
                {{ filter.label }}
            </button>
          </div>

          <!-- Date Pickers Row (conditional) -->
          <div v-if="activeDateFilter === 'month' || activeDateFilter === 'range'" class="flex items-center">
            <!-- Month Picker (for Mes filter) -->
          <div v-if="activeDateFilter === 'month'" class="relative group">
            <div class="h-[34px] min-w-[150px] flex items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:hover:bg-gray-800">
                <span class="font-medium">{{ formattedMonth }}</span>
                <ChevronDownIcon class="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300" />
            </div>
            <input 
                type="month" 
                v-model="selectedMonth"
                @change="fetchStats"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>

          <!-- Range Picker (for Rango filter) -->
          <div v-if="activeDateFilter === 'range'" class="flex items-center gap-2">
              <input 
                  type="date" 
                  v-model="rangeStart"
                  @change="fetchStats"
                  class="h-[34px] rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
              <span class="text-gray-400">-</span>
              <input 
                  type="date" 
                  v-model="rangeEnd"
                  @change="fetchStats"
                  class="h-[34px] rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
          </div>
          </div>
        </div>
      </div>

      <!-- Overview Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Card 1: Utilidad Neta (Spans 2 cols) -->
        <div class="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
            <div class="flex justify-between items-start z-10 relative">
                <div>
                     <div class="flex items-center gap-2 mb-1">
                        <div class="p-1.5 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                           <DollarSignIcon class="w-4 h-4" />
                        </div>
                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Utilidad Neta del Periodo</h3>
                     </div>
                     
                     <div class="mt-4 flex items-baseline gap-2">
                        <span class="text-4xl font-bold text-gray-900 dark:text-white">
                            {{ formatCurrency(stats.netProfit) }}
                        </span>
                     </div>

                     <div class="mt-2 flex items-center gap-2">
                         <span 
                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                            :class="profitChange >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'"
                         >
                            <TrendingUpIcon v-if="profitChange >= 0" class="w-3 h-3 mr-1" />
                            <TrendingDownIcon v-else class="w-3 h-3 mr-1" />
                            {{ Math.abs(profitChange).toFixed(1) }}%
                         </span>
                         <span class="text-xs text-gray-500 dark:text-gray-400">vs periodo anterior</span>
                     </div>
                     
                     <p class="mt-4 text-xs text-brand-500 font-medium">
                        {{ stats.netProfit >= 0 ? '¡Ganaste dinero!' : 'Pérdida en el periodo' }}
                     </p>
                </div>

                <!-- Sparkline Chart -->
                <div class="w-[200px] h-[100px] absolute right-0 bottom-0 opacity-90">
                    <apexchart
                        type="area"
                        height="120"
                        width="100%"
                        :options="chartOptions"
                        :series="chartSeries"
                    ></apexchart>
                </div>
            </div>
        </div>

        <!-- Card 2: CXC Total (1 col) -->
        <div class="col-span-1 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div class="flex items-center gap-2 mb-3">
                <div class="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                   <FileTextIcon class="w-4 h-4" />
                </div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">CXC Pendientes</h3>
            </div>
            
            <div class="mt-2">
                <span class="text-3xl font-bold text-gray-900 dark:text-white">
                    {{ formatCurrency(stats.totalCXC) }}
                </span>
            </div>

            <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Total por cobrar
            </p>
        </div>

        <!-- Card 3: Profit Margin (1 col) -->
        <div class="col-span-1 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative">
            <div class="flex items-center gap-2 mb-3">
                <div class="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                   <TrendingUpIcon class="w-4 h-4" />
                </div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Margen de Utilidad</h3>
            </div>
            
            <div class="flex items-center justify-between">
                <div>
                    <div class="flex items-baseline gap-1">
                        <span class="text-3xl font-bold text-gray-900 dark:text-white">
                            {{ stats.profitMargin.current.toFixed(1) }}
                        </span>
                        <span class="text-lg text-gray-500 dark:text-gray-400">%</span>
                    </div>
                    
                    <div class="mt-2 flex items-center gap-1">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Promedio histórico:</span>
                        <span class="text-xs font-semibold" :class="stats.profitMargin.current >= stats.profitMargin.historical ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'">
                            {{ stats.profitMargin.historical.toFixed(1) }}%
                        </span>
                    </div>

                    <p class="mt-3 text-xs font-medium" :class="getMarginHealthColor(stats.profitMargin.current)">
                        {{ getMarginHealthText(stats.profitMargin.current) }}
                    </p>
                </div>

                <!-- Radial Gauge -->
                <div class="w-20 h-20">
                    <apexchart
                        type="radialBar"
                        height="80"
                        :options="gaugeOptions"
                        :series="[Math.min(stats.profitMargin.current, 100)]"
                    ></apexchart>
                </div>
            </div>
        </div>

        <!-- Card 4: Top Selling Items (2 cols) -->
        <div class="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div class="flex items-center gap-2 mb-4">
                <div class="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                   <TrendingUpIcon class="w-4 h-4" />
                </div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Top 5 Platillos Más Vendidos</h3>
            </div>
            
            <div v-if="stats.topSellingItems.length > 0" class="mt-4">
                <apexchart
                    type="bar"
                    height="200"
                    :options="topItemsChartOptions"
                    :series="topItemsChartSeries"
                ></apexchart>
            </div>
            <div v-else class="flex items-center justify-center h-40 text-gray-400 text-sm">
                No hay datos de ventas en este periodo
            </div>

            <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Ayuda a decisiones de menú, precios y enfoque comercial
            </p>
        </div>

        <!-- Card 5: Top Profitable Items (2 cols) -->
        <div class="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div class="flex items-center gap-2 mb-4">
                <div class="p-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                   <DollarSignIcon class="w-4 h-4" />
                </div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Top 5 Platillos Más Rentables</h3>
            </div>
            
            <div v-if="stats.topProfitableItems.length > 0" class="mt-4">
                <apexchart
                    type="bar"
                    height="200"
                    :options="topProfitableChartOptions"
                    :series="topProfitableChartSeries"
                ></apexchart>
            </div>
            <div v-else class="flex items-center justify-center h-40 text-gray-400 text-sm">
                No hay datos de ventas en este periodo
            </div>

            <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Guía decisiones estratégicas, no emocionales
            </p>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { DollarSignIcon, TrendingUpIcon, TrendingDownIcon, FileTextIcon, ChevronDownIcon } from 'lucide-vue-next';
import VueApexCharts from "vue3-apexcharts";

// Components for chart
const apexchart = VueApexCharts;

const stats = ref({
    netProfit: 0,
    prevNetProfit: 0,
    trend: [],
    totalCXC: 0,
    profitMargin: {
        current: 0,
        historical: 0
    },
    topSellingItems: [],
    topProfitableItems: []
});

const loading = ref(false);

// Date filter state
const dateFilters = [
    { label: 'Hoy', value: 'today' },
    { label: 'Rango', value: 'range' },
    { label: 'Mes', value: 'month' }
];

const activeDateFilter = ref('today');
const selectedMonth = ref(new Date().toISOString().slice(0, 7)); // YYYY-MM format
const rangeStart = ref(new Date().toISOString().split('T')[0]);
const rangeEnd = ref(new Date().toISOString().split('T')[0]);

const formattedMonth = computed(() => {
    if (!selectedMonth.value) return '';
    const [year, month] = selectedMonth.value.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    const str = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(date);
    return str.charAt(0).toUpperCase() + str.slice(1);
});

const profitChange = computed(() => {
    if (stats.value.prevNetProfit === 0) return 0; // Avoid infinity
    return ((stats.value.netProfit - stats.value.prevNetProfit) / Math.abs(stats.value.prevNetProfit)) * 100;
});

const chartSeries = computed(() => [{
    name: 'Utilidad',
    data: stats.value.trend.map(t => t.value)
}]);

const chartOptions = computed(() => ({
    chart: {
        type: 'area',
        toolbar: { show: false },
        sparkline: { enabled: true }
    },
    stroke: {
        curve: 'smooth',
        width: 2,
        colors: ['#0EB325'] // Brand Green or similar
    },
    fill: {
        type: 'gradient',
        gradient: {
            opacityFrom: 0.5,
            opacityTo: 0.0,
        },
        colors: ['#0EB325']
    },
    tooltip: {
        theme: 'dark', // consistent with app
        x: { show: false },
        y: {
            formatter: function (val) {
                return "$" + val.toFixed(2);
            }
        }
    }
}));

const topItemsChartSeries = computed(() => [{
    name: 'Cantidad Vendida',
    data: stats.value.topSellingItems.map(item => item.quantity)
}]);

const topItemsChartOptions = computed(() => ({
    chart: {
        type: 'bar',
        toolbar: { show: false },
        height: 200
    },
    plotOptions: {
        bar: {
            horizontal: true,
            borderRadius: 4,
            distributed: true
        }
    },
    colors: ['#0EB325', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'],
    dataLabels: {
        enabled: true,
        style: {
            colors: ['#fff']
        }
    },
    xaxis: {
        categories: stats.value.topSellingItems.map(item => item.name),
        labels: {
            style: {
                colors: '#9CA3AF',
                fontSize: '12px'
            }
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: '#9CA3AF',
                fontSize: '12px'
            }
        }
    },
    grid: {
        borderColor: '#374151',
        strokeDashArray: 4
    },
    tooltip: {
        theme: 'dark',
        y: {
            formatter: function (val) {
                return val + ' unidades';
            }
        }
    },
    legend: {
        show: false
    }
}));

const topProfitableChartSeries = computed(() => [{
    name: 'Utilidad Generada',
    data: stats.value.topProfitableItems.map(item => item.profit)
}]);

const topProfitableChartOptions = computed(() => ({
    chart: {
        type: 'bar',
        toolbar: { show: false },
        height: 200
    },
    plotOptions: {
        bar: {
            horizontal: true,
            borderRadius: 4,
            distributed: true
        }
    },
    colors: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7'],
    dataLabels: {
        enabled: true,
        formatter: function (val) {
            return '$' + val.toFixed(0);
        },
        style: {
            colors: ['#fff']
        }
    },
    xaxis: {
        categories: stats.value.topProfitableItems.map(item => item.name),
        labels: {
            style: {
                colors: '#9CA3AF',
                fontSize: '12px'
            }
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: '#9CA3AF',
                fontSize: '12px'
            }
        }
    },
    grid: {
        borderColor: '#374151',
        strokeDashArray: 4
    },
    tooltip: {
        theme: 'dark',
        y: {
            formatter: function (val) {
                return '$' + val.toFixed(2);
            }
        }
    },
    legend: {
        show: false
    }
}));

const gaugeOptions = computed(() => ({
    chart: {
        type: 'radialBar',
        sparkline: { enabled: true }
    },
    plotOptions: {
        radialBar: {
            hollow: {
                size: '60%'
            },
            track: {
                background: '#e7e7e7',
                strokeWidth: '100%'
            },
            dataLabels: {
                show: false
            }
        }
    },
    colors: [getMarginColor(stats.value.profitMargin.current)],
    stroke: {
        lineCap: 'round'
    }
}));

const getMarginColor = (margin) => {
    if (margin >= 30) return '#0EB325'; // Green - Excellent
    if (margin >= 20) return '#3B82F6'; // Blue - Good
    if (margin >= 10) return '#F59E0B'; // Orange - Fair
    return '#EF4444'; // Red - Poor
};

const getMarginHealthColor = (margin) => {
    if (margin >= 30) return 'text-green-600 dark:text-green-400';
    if (margin >= 20) return 'text-blue-600 dark:text-blue-400';
    if (margin >= 10) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
};

const getMarginHealthText = (margin) => {
    if (margin >= 30) return '¡Excelente salud!';
    if (margin >= 20) return 'Negocio saludable';
    if (margin >= 10) return 'Requiere atención';
    return 'Problema estructural';
};

const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

const setDateFilter = (filter) => {
    activeDateFilter.value = filter;
    fetchStats();
};

const fetchStats = async () => {
    loading.value = true;
    try {
        let startDate, endDate;
        
        // Calculate dates based on active filter
        if (activeDateFilter.value === 'today') {
            const today = new Date().toISOString().split('T')[0];
            startDate = today;
            endDate = today;
        } else if (activeDateFilter.value === 'range') {
            startDate = rangeStart.value;
            endDate = rangeEnd.value;
        } else if (activeDateFilter.value === 'month') {
            // selectedMonth is in YYYY-MM format
            const [year, month] = selectedMonth.value.split('-');
            const firstDay = new Date(year, month - 1, 1);
            const lastDay = new Date(year, month, 0);
            startDate = firstDay.toISOString().split('T')[0];
            endDate = lastDay.toISOString().split('T')[0];
        }
        
        const params = new URLSearchParams({ startDate, endDate });
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/reports/dashboard-stats?${params}`);
        if (res.ok) {
            stats.value = await res.json();
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchStats();
});
</script>
