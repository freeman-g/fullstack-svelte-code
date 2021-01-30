import Home from './views/public/Home.svelte'
import LunchMenuView from './views/public/LunchMenuView.svelte'
import LunchMenuAdmin from './views/admin/LunchMenuAdmin.svelte'

const routes = [
  { name: '/', component: Home },
  { name: '/lunch-menu/:customer', component: LunchMenuView },
  { name: '/admin/manage-menus/:customer', component: LunchMenuAdmin },
]

export { routes }
