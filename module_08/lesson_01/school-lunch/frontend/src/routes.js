import Home from './views/public/Home.svelte'
import LunchMenuView from './views/public/LunchMenuView.svelte'
import LunchMenuAdmin from './views/admin/LunchMenuAdmin.svelte'
import AdminLayout from './views/admin/AdminLayout.svelte'
import LunchMenuAdminDetails from './views/admin/LunchMenuAdminDetails.svelte'
import Callback from './views/admin/Callback.svelte' // IMPORT

const routes = [
  { name: '/', component: Home },
  { name: '/lunch-menu', component: LunchMenuView },
  { name: '/callback', component: Callback }, // ADD THE ROUTE
  {
    name: '/admin/manage-menus',
    component: AdminLayout,
    nestedRoutes: [
      { name: 'index', component: LunchMenuAdmin },
      { name: 'week-details/:lunchWeekId', component: LunchMenuAdminDetails },
    ],
  },
]

export { routes }
