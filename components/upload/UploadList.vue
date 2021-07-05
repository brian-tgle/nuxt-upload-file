<template>
  <div>
    <v-simple-table fixed-header height="200px" dark>
      <template v-slot:default>
        <thead>
          <tr>
            <th>#</th>
            <th>File name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="fileList.length">
          <tr v-for="(file, index) in fileList" :key="file.id">
            <td>{{ index + 1 }}</td>
            <td>{{ file.originalName }}</td>
            <td>
              <a :href="`${apiUrl}/files/${file.url}`" target="_blank"
                >Download</a
              >
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="3" class="text-center"><i>Empty list</i></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div class="text-center">
      <v-pagination
        v-model="page"
        circle
        :length="totalPages"
        :total-visible="5"
        @input="onChange"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { API_ENDPOINT } from '../../constants'
export default {
  props: ['fileList', 'totalPages', 'onChange'],
  data () {
    return {
      page: 1,
      apiUrl: API_ENDPOINT
    }
  }
}
</script>
