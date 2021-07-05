<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <div class="text-center">
        <logo />
        <vuetify-logo />
      </div>
    </v-col>
    <v-col cols="4" sm="6" md="6">
      <upload-file
        :upload="upload"
        :currentFile="currentFile"
        :onFileChange="onFileChange"
        :fileRules="fileRules"
      ></upload-file>
    </v-col>
    <v-col cols="8" sm="6" md="6">
      <alert
        v-if="alert.open"
        :type="alert.type"
        :message="alert.message"
        :onHide="onHideAlert"
      ></alert>
      <upload-list
        :fileList="fileList"
        :totalPages="totalPages"
        :onChange="onChangePage"
        ></upload-list>
    </v-col>
  </v-row>
</template>

<script>
import Vue from 'vue'
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import UploadFile from '~/components/upload/UploadFile.vue'
import UploadList from '~/components/upload/UploadList.vue'
import Alert from '~/components/upload/Alert.vue'
import { ALERT_TYPES, PAGINATION } from '../constants'
export default Vue.extend({
  middleware: ['authentication'],
  components: {
    Logo,
    VuetifyLogo,
    UploadFile,
    UploadList,
    Alert
  },
  data: () => ({
    alert: ALERT_TYPES.HIDDEN,
    valid: true,
    currentFile: null,
    fileList: [],
    totalPages: 0,
    fileRules: [
      (file) =>
        !file || file.size < 2000000 || 'Image size should be less than 2 MB!'
    ]
  }),
  mounted () {
    this.fetch(PAGINATION.DEFAULT_PAGE)
  },
  methods: {
    fetch (page, size = PAGINATION.SIZE) {
      this.$fileRepository.getAll(page, size).then(response => {
        const { data, totalPages } = response.data
        this.fileList = data
        this.totalPages = totalPages
      })
    },
    onChangePage (page) {
      this.fetch(page)
    },
    onFileChange (file) {
      if (file) {
        this.currentFile = file
      } else {
        this.currentFile = null
      }
    },
    upload () {
      if (this.currentFile) {
        const formData = new FormData()
        formData.append('file', this.currentFile)
        this.$fileRepository.upload(formData).then((response) => {
          const { success } = response.data
          if (success) {
            this.onSuccessfullyUploaded()
          }
        }).catch(() => {
          this.alert = ALERT_TYPES.FAILED
        })
      }
    },
    onSuccessfullyUploaded () {
      this.fetch(PAGINATION.DEFAULT_PAGE)
      this.currentFile = null
      this.alert = ALERT_TYPES.SUCCESS
    },
    onHideAlert () {
      this.alert = ALERT_TYPES.HIDDEN
    }
  },
  head () {
    return {
      title: 'File management'
    }
  }
})
</script>
