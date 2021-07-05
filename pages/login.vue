<template>
  <v-flex sm12 md6 offset-md3>
    <v-card elevation="4" light tag="section">
      <v-card-title>
        <v-layout align-center justify-space-between>
          <h3 class="headline">
            {{ platformName }}
          </h3>
          <v-flex>
            <v-img
              :alt="platformName"
              class="ml-3"
              contain height="48px"
              position="center right"
              src="logo.jpeg"
            />
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <p>Sign in with your username and password:</p>
        <v-form>
          <v-text-field
            outline
            label="Username"
            type="text"
            v-model="username"
            :rules="[rules.required, rules.counter]"
          />
          <v-text-field
            outline
            hide-details
            label="Password"
            type="password"
            v-model="password"
            :rules="[rules.required, rules.counter]"
          />
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
        <v-alert v-if="error" type="error">{{error}}</v-alert>
        <v-spacer></v-spacer>
        <v-btn color="info" :large="$vuetify.breakpoint.smAndUp" @click="login">
          <v-icon left>mdi-arrow-right</v-icon>
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import { ROUTES, TOKEN_TYPE } from '../constants'
export default {
  layout: 'login',
  data () {
    return {
      platformName: 'Platform',
      password: null,
      username: null,
      error: '',
      rules: {
        required: value => !!value || 'Required.',
        counter: value => !value || value.length <= 50 || 'Max 50 characters'
      }
    }
  },
  beforeCreate () {
    if (this.$store.state.auth) {
      this.$router.replace('/')
    }
  },
  methods: {
    login () {
      const credential = {
        username: this.username,
        password: this.password
      }
      this.$authRepository.login(credential).then((response) => {
        const { success, data } = response
        if (success) {
          this.$store.commit('setAuth', data)
          // Attach Authorization header after successful login
          this.$axios.setHeader('Authorization', `${TOKEN_TYPE} ${data.token}`)
          // Navigate to dashboard
          this.$router.replace(ROUTES.BASE)
        } else {
          this.error = 'Username or password was wrong!'
        }
      }).catch((error) => {
        console.log('error', error)
        this.error = 'Account was not exist!'
      })
    }
  },
  head () {
    return {
      title: 'Login'
    }
  }
}
</script>

<style>

</style>
