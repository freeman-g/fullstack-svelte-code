import Home from './views/public/Home.svelte'
import LunchMenuView from './views/public/LunchMenuView.svelte'
import LunchMenuAdmin from './views/admin/LunchMenuAdmin.svelte'
import LunchMenuAdminDetails from './views/admin/LunchMenuAdminDetails.svelte' // IMPORT THE NEW COMPONENT

const routes = [
  { name: '/', component: Home },
  { name: '/lunch-menu/:customer', component: LunchMenuView },
  {
    name: '/admin/manage-menus/:customer',
    nestedRoutes: [
      { name: 'index', component: LunchMenuAdmin },
      { name: 'week-details/:lunchWeekId', component: LunchMenuAdminDetails },
    ],
  },
]

export { routes }
