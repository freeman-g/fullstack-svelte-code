<script>
  import { onMount } from 'svelte'
  import { navigateTo } from 'svelte-router-spa'
  import axios from 'axios'
  import Icon from 'svelte-awesome'
  import { refresh } from 'svelte-awesome/icons'
  import { user } from '../../stores.js'

  let lunchWeekList = []
  let loading = true // intialize variable

  onMount(async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/lunch-week')
      lunchWeekList = response.data
      loading = false // toggle it to false after the network call is complete
    } catch (e) {
      console.error(e)
    }
  })

  const openLunchWeekDetails = lunchWeek => {
    const route = `/admin/manage-menus/week-details/${lunchWeek.lunchWeekId}`
    navigateTo(route)
  }
</script>

<div>
  <nav class="breadcrumb" aria-label="breadcrumbs">
    <ul>
      <li>
        <a href="/">Home</a>
      </li>
      <li>
        <a href="/admin/manage-menus">Lunch Menu Administration</a>
      </li>
      <li class="is-active">
        <a href="/#">{$user.schoolName}</a>
      </li>
    </ul>
  </nav>
  {#if loading}
    <div class="section">
      <Icon spin data="{refresh}" scale="3" />
    </div>
  {:else}
    <table class="table">
      <thead>
        <tr>
          <th>Week Of</th>
          <th>Published</th>
        </tr>
      </thead>
      {#each lunchWeekList as lunchWeek}
        <tr class="has-text-link" style="cursor: pointer" on:click="{openLunchWeekDetails(lunchWeek)}">
          <td>{lunchWeek.weekOf}</td>
          <td>{lunchWeek.isPublished}</td>
        </tr>
      {/each}
    </table>
  {/if}
</div>
