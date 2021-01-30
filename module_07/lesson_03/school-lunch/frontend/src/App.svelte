<script>
  import { Router } from 'svelte-router-spa'
  import { routes } from './routes'
</script>

<main>
  <section class="section">
    <div class="container">
      <Router.default {routes} />
    </div>
  </section>
</main>
