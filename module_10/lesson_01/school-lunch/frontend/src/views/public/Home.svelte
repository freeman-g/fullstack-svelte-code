<script>
  import { Navigate } from 'svelte-router-spa'
  import { fly } from 'svelte/transition'
  import axios from 'axios'
  import Icon from 'svelte-awesome'
  import { refresh } from 'svelte-awesome/icons'

  let step = 1
  let emailMessage
  let passwordMessage
  let registrationErrorMessage
  let registrationSuccessMessage
  let registrationLoading = false

  // organize the registration form state in an object
  let registrationForm = {
    email: null,
    schoolName: null,
    password: null,
    passwordConfirm: null,
  }

  const checkEmail = () => {
    const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!registrationForm.email.match(regEx)) {
      return { valid: false, message: 'Email address is invalid' }
    }
    return {
      valid: true,
    }
  }

  const checkPassword = () => {
    const regEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
    if (!registrationForm.password.match(regEx)) {
      return {
        valid: false,
        message: 'Password must be 8 characters in length and contain a combination of upper case letters, lower case letters and numbers or special characters',
      }
    }
    if (registrationForm.password !== registrationForm.passwordConfirm) {
      return {
        valid: false,
        message: 'Passwords do not match',
      }
    }
    return {
      valid: true,
    }
  }

  const completeStep1 = () => {
    emailMessage = null
    const { valid, message } = checkEmail()
    if (!valid) {
      emailMessage = message
      return
    }
    step = 2
  }

  const register = async () => {
    passwordMessage = null
    const { valid, message } = checkPassword()

    if (!valid) {
      passwordMessage = message
      return
    }

    try {
      registrationLoading = true
      await axios.post(`${process.env.API_ROOT}/api/users`, registrationForm)
      registrationLoading = false

      registrationSuccessMessage = 'Thank you for registering, redirecting to login...'
      await new Promise(f => setTimeout(f, 1800)) // 1.8 second timeout

      // redirect the user
      window.history.replaceState(null, null, '/admin/manage-menus')
      window.location.reload()
    } catch (e) {
      registrationLoading = false
      registrationErrorMessage = e.response.data.message
    }
  }
</script>

<div class="notification">
  <div class="columns">
    <div class="column">
      <div class="content">
        <h1>Easily Publish Your School Lunch Menus</h1>
        <p>We make it easy to publish weekly school lunch menus on the web and provide them to students and parents in a mobile friendly format.</p>
        <p>Just set the details and hit publish! Register and get started today.</p>
      </div>
    </div>
    <div class="column">
      <div class="content">

        <h3>Register Now</h3>
        {#if step === 1}
          <div class="field">
            <label class="label">Email Address</label>
            <div class="control">
              <input bind:value="{registrationForm.email}" type="text" placeholder="Enter your email address" class="input" />
            </div>
            <!-- ADD THE IF BLOCK HERE -->
            {#if emailMessage}
              <p class="help is-danger">{emailMessage}</p>
            {/if}
          </div>
          <div class="field">
            <label class="label">School Name</label>
            <div class="control">
              <input bind:value="{registrationForm.schoolName}" type="text" placeholder="Enter your school's name" class="input" />
            </div>
          </div>

          <div class="field is-grouped">
            <div class="control">
              <button on:click="{() => completeStep1()}" class="button is-link is-outlined">Next</button>
            </div>
          </div>
        {:else if step === 2}
          <div id="passwordBlock" in:fly="{{ x: 400, duration: 1000 }}">
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input bind:value="{registrationForm.password}" type="password" placeholder="Enter your password" class="input" />
              </div>
            </div>
            <div class="field">
              <label class="label">Confirm Password</label>
              <div class="control">
                <input bind:value="{registrationForm.passwordConfirm}" type="password" placeholder="Confirm your password" class="input" />
              </div>
              {#if passwordMessage}
                <p class="help is-danger">{passwordMessage}</p>
              {/if}
            </div>
            {#if registrationLoading}
              <Icon spin data="{refresh}" scale="3" />
            {/if}
            {#if registrationErrorMessage}
              <div class="notification is-warning">{registrationErrorMessage}</div>
            {/if}
            {#if registrationSuccessMessage}
              <div class="notification is-info">{registrationSuccessMessage}</div>
            {/if}
            <div class="field is-grouped">
              <div class="control">
                <button on:click="{register}" class="button is-link is-outlined">Submit</button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
<div class="container">
  <div class="content" style="line-height: 30px;">
    <center>
      <span>Already registered?</span>
      <Navigate.default to="/admin/manage-menus">
        <button class="button is-small is-text">Log in</button>
      </Navigate.default>
    </center>
  </div>
</div>
