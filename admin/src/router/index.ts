import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Ecommerce',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    // Admin Routes
    {
      path: '/users',
      name: 'Users',
      component: () => import('../views/Admin/Users.vue'),
      meta: { title: 'Usuarios' },
    },
    {
      path: '/purchases',
      name: 'Purchases',
      component: () => import('../views/Admin/Purchases.vue'),
      meta: { title: 'Compras' },
    },
    {
      path: '/expenses',
      name: 'Expenses',
      component: () => import('../views/Admin/Expenses.vue'),
      meta: { title: 'Gastos' },
    },
    {
      path: '/inventory',
      name: 'Inventory',
      component: () => import('../views/Admin/Inventory.vue'),
      meta: { title: 'Inventario' },
    },
    {
      path: '/recipes',
      name: 'Recipes',
      component: () => import('../views/Admin/Recipes.vue'),
      meta: { title: 'Recetas' },
    },
    {
      path: '/patients',
      name: 'Patients',
      component: () => import('../views/Admin/Patients.vue'),
      meta: { title: 'Pacientes' },
    },
    {
      path: '/loyalty',
      name: 'Loyalty',
      component: () => import('../views/Admin/Loyalty.vue'),
      meta: { title: 'Fidelidad' },
    },
    {
      path: '/menu',
      name: 'Menu',
      component: () => import('../views/Admin/Menu.vue'),
      meta: { title: 'Carta' },
    },
    {
      path: '/clients',
      name: 'Clients',
      component: () => import('../views/Admin/Clients.vue'),
      meta: { title: 'Clientes' },
    },
    {
      path: '/receivables',
      name: 'Receivables',
      component: () => import('../views/Admin/Receivables.vue'),
      meta: { title: 'Cuentas por Cobrar' },
    },

    // Cash Routes
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('../views/Cash/Orders.vue'),
      meta: { title: 'Órdenes' },
    },
    {
      path: '/pos',
      name: 'POS',
      component: () => import('../views/Cash/POS.vue'),
      meta: { title: 'Punto de Venta' },
    },
    {
      path: '/reports',
      name: 'Reports',
      component: () => import('../views/Cash/Reports.vue'),
      meta: { title: 'Reportes' },
    },
    {
      path: '/history',
      name: 'History',
      component: () => import('../views/Cash/History.vue'),
      meta: { title: 'Historial' },
    },

    {
      path: '/login',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Login',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  next()
})
