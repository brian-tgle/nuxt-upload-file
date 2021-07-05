<template>
  <v-alert
    dense
    text
    :type="type"
  >
    {{message}}
  </v-alert>
</template>
<script>
export default {
  props: ['message', 'type', 'onHide'],
  created () {
    // Hide alert after 2s
    setTimeout(() => {
      if (typeof this.onHide === 'function' && this.onHide) {
        this.onHide()
      }
    }, 3000)
  }
}
</script>
