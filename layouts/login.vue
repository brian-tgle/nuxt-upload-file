<template>
  <v-app :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }" dark id="inspire">
    <v-container>
      <v-layout wrap>
        <nuxt/>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {

}
</script>
