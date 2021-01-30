<script>
  import { Router } from 'svelte-router-spa'
  import { routes } from './routes'
</script>

<main>
  <Router.default {routes} />
</main>
