<script>
  import { onMount } from 'svelte'
  import axios from '../../axios-global'
  import Icon from 'svelte-awesome'
  import { refresh } from 'svelte-awesome/icons'
  import { add, parseISO, format } from 'date-fns'
  import { user } from '../../stores.js'

  export let currentRoute
  let routeLunchWeekId = currentRoute.namedParams.lunchWeekId
  let lunchWeek = {}
  let loading = true
  let saving = false
  let publishing = false

  onMount(async () => {
    try {
      const response = await axios.get(`${process.env.API_ROOT}/api/lunch-week/${routeLunchWeekId}`)
      lunchWeek = response.data
      seedLunchDays()
      loading = false
    } catch (e) {
      console.error(e)
    }
  })

  const getPublicLink = () => {
    const schoolPath = $user.schoolName.toLowerCase().replace(/ /g, '-')
    return `${window.location.origin}/lunch-menu/${schoolPath}/${lunchWeek.weekOf}`
  }

  const seedLunchDays = () => {
    const weekOfDate = parseISO(lunchWeek.weekOf)
    for (let i = 0; i < 5; i++) {
      const calculatedDay = add(weekOfDate, { days: i })
      const formattedDay = format(calculatedDay, 'yyyy-MM-dd')

      if (lunchWeek.lunchDays.some(x => x.day === formattedDay)) {
        continue
      }

      const lunchDay = {
        day: formattedDay,
        lunchWeekId: lunchWeek.lunchWeekId,
        menuDetails: null,
      }

      lunchWeek.lunchDays.splice(i, 0, lunchDay)
    }
  }

  const save = async () => {
    saving = true
    for (let i = 0; i < lunchWeek.lunchDays.length; i++) {
      const lunchDay = lunchWeek.lunchDays[i]
      if (lunchDay.lunchDayId) {
        await axios.put(`${process.env.API_ROOT}/api/lunch-week/${routeLunchWeekId}/lunch-day/${lunchDay.lunchDayId}`, lunchDay)
      } else {
        const response = await axios.post(`${process.env.API_ROOT}/api/lunch-week/${routeLunchWeekId}/lunch-day`, lunchDay)
        lunchDay.lunchDayId = response.data.lunchDayId
      }
    }
    saving = false
  }

  const togglePublish = async () => {
    publishing = true
    let tempLunchWeek = JSON.parse(JSON.stringify(lunchWeek))
    tempLunchWeek.isPublished = !tempLunchWeek.isPublished
    delete tempLunchWeek.lunchDays

    await axios.put(`${process.env.API_ROOT}/api/lunch-week/${routeLunchWeekId}`, tempLunchWeek)
    lunchWeek.isPublished = !lunchWeek.isPublished
    publishing = false
  }
</script>

<style>
  #link-dropdown-menu {
    min-width: 32rem;
  }
</style>

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
    <section>
      <div class="buttons">
        <button class="{saving ? 'button is-link is-small is-loading' : 'button is-link is-small'}" on:click="{() => save()}">Save</button>
        <button class="{publishing ? 'button is-text is-small is-loading' : 'button is-text is-small'}" on:click="{() => togglePublish()}">{lunchWeek.isPublished ? 'Unpublish' : 'Publish'}</button>
        <!-- Add the Bulma Dropdown here -->
        <div class="dropdown is-hoverable">
          <div class="dropdown-trigger">
            <button class="button is-text is-small">Link</button>
          </div>
          <div class="dropdown-menu" id="link-dropdown-menu">
            <div class="dropdown-content">
              <div class="dropdown-item">
                <p>Public Lunch Menu Link</p>
                <p class="mt-2">
                  <a href="{getPublicLink()}" target="_blank">{getPublicLink()}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- end of bulma dropdown -->
      </div>
    </section>
    <section class="mt-2">
      <div class="columns">
        {#each lunchWeek.lunchDays as lunchDay}
          <div class="column">
            <div class="field">
              <label class="label">{format(parseISO(lunchDay.day), 'EEE MM/dd/yyyy')}</label>
              <div class="control">
                <textarea bind:value="{lunchDay.menuDetails}" class="textarea" rows="10"></textarea>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}
</div>
