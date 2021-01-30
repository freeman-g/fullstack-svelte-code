import Home from './views/public/Home.svelte'
import LunchMenuView from './views/public/LunchMenuView.svelte'
import AdminLayout from './views/admin/AdminLayout.svelte'

const routes = [
  { name: '/', component: Home },
  { name: '/lunch-menu', component: LunchMenuView },
  {
    name: '/admin/manage-menus',
    component: AdminLayout,
    nestedRoutes: [
      { name: 'index', component: LunchMenuAdmin },
    ],
  },
]

export { routes }
