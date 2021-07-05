<template>
  <v-card>
    <v-card-title class="headline"> Upload new file </v-card-title>
    <v-card-text>
      <v-file-input
        show-size
        label="Select file"
        :rules="fileRules"
        @change="onFileChange"
        :value="currentFile"
      ></v-file-input>
    </v-card-text>
    <v-btn
      color="success"
      dark
      small
      :disabled="!currentFile"
      @click="upload"
    >
      Upload
      <v-icon right dark>mdi-cloud-upload</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
export default {
  props: ['upload', 'currentFile', 'onFileChange', 'fileRules']
}
</script>
