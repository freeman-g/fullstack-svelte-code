<script>
  import { Router } from 'svelte-router-spa'
  import { routes } from './routes'
  import Icon from 'svelte-awesome'
  import { cutlery } from 'svelte-awesome/icons'
</script>

<main style="min-height: 70vh">
  <section class="section">
    <div class="container">
      <Router {routes} />
    </div>
  </section>
</main>

<section class="section">
  <div class="container">
    <footer class="has-text-link">
      <hr />
      <Icon data="{cutlery}" scale="2" />
      <span style="font-size: 16px; margin-left: 10px;">School Lunch App {new Date().getFullYear()}</span>
    </footer>
  </div>
</section>
