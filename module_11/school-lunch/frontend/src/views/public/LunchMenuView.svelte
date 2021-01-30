<script>
  import { onMount } from 'svelte'
  import axios from 'axios'
  import Icon from 'svelte-awesome'
  import { refresh } from 'svelte-awesome/icons'
  import { parseISO, format } from 'date-fns'

  export let currentRoute

  let loading = true
  let errorMessage
  let lunchWeek = {
    lunchDays: [],
  }

  // helper function to parse the school name from the frontend route
  const getSchoolName = () => {
    let parts = currentRoute.namedParams.school.split('-')
    let upper = parts.map(x => {
      return x.charAt(0).toUpperCase() + x.slice(1)
    })
    return upper.join(' ')
  }

  onMount(async () => {
    errorMessage = null
    try {
      const response = await axios.get(`${process.env.API_ROOT}/api/lunch-week-public/${currentRoute.namedParams.school}/${currentRoute.namedParams.weekOf}`)
      lunchWeek = response.data
      loading = false
    } catch (e) {
      errorMessage = e.response.data.message
      loading = false
      console.error(e)
    }
  })
</script>

<div>
  <h1 class="title is-4">{getSchoolName()} Lunch Menu for the Week of {currentRoute.namedParams.weekOf}</h1>
  {#if loading}
    <div class="section">
      <Icon spin data="{refresh}" scale="3" />
    </div>
  {/if}
  {#if errorMessage}
    <div class="notification">{errorMessage}</div>
  {/if}

  <table class="table">
    {#each lunchWeek.lunchDays as lunchDay}
      <tr>
        <td>{format(parseISO(lunchDay.day), 'EEE MM/dd/yyyy')}</td>
        <td>{lunchDay.menuDetails}</td>
      </tr>
    {/each}
  </table>
</div>
