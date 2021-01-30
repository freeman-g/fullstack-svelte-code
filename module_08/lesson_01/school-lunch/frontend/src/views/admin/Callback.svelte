<script>
  import { onMount } from 'svelte'
  import createAuth0Client from '@auth0/auth0-spa-js'
  import auth0Config from '../../auth0-config'

  onMount(async () => {
    const auth0 = await createAuth0Client(auth0Config)
    const result = await auth0.handleRedirectCallback()
    const redirectPath = result.appState

    // Redirect the user to the path they were going to prior to the auth0 login sequence
    if (redirectPath) {
      window.history.replaceState(null, null, redirectPath)
      window.location.reload()
    }
  })
</script>

<h1>Redirecting...Please wait</h1>
