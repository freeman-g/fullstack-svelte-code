<script>
  import { Route } from 'svelte-router-spa'
  import { onMount } from 'svelte'
  import createAuth0Client from '@auth0/auth0-spa-js'
  import auth0Config from '../../auth0-config'
  import { user } from '../../stores.js'

  export let currentRoute
  let initialized = false
  let auth0

  const parseJwt = token => {
    var base64Url = token.split('.')[1]
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )

    return JSON.parse(jsonPayload)
  }

  const logout = async () => {
    window.localStorage.removeItem('access_token')
    auth0.logout({
      returnTo: window.location.origin,
    })
  }

  onMount(async () => {
    auth0 = await createAuth0Client(auth0Config)
    const authenticated = await auth0.isAuthenticated()

    if (!authenticated) {
      await auth0.loginWithRedirect({
        redirect_uri: `${window.location.origin}/callback`,
        appState: window.location.pathname,
      })
    } else {
      const token = await auth0.getTokenSilently()

      const parsedJwt = parseJwt(token)
      user.set({ schoolName: parsedJwt['https://school-lunch/school_name'] })
      initialized = true
    }
  })
</script>

<div>
  {#if initialized}
    <button class="button is-light is-small" style="float: right;" on:click="{() => logout()}">Logout</button>
    <Route {currentRoute} />
  {/if}
</div>
