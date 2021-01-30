<script>
  import { onMount } from 'svelte'
  import { navigateTo } from 'svelte-router-spa' // IMPORT THE navigateTo method
  import axios from 'axios'
  import { user } from '../../stores.js'

  let lunchWeekList = []

  onMount(async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/lunch-week')
      lunchWeekList = response.data
    } catch (e) {
      console.error(e)
    }
  })

  // ADD THE CLICK HANDLER FUNCTION
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
</div>
