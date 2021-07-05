import createRepository from '~/services/Repository'
export default ({ $axios }, inject) => {
  // And in the Vue instances (this.$repository in your components)
  const repositoryWithAxios = createRepository($axios)
  inject('authRepository', repositoryWithAxios('auth'))
  inject('fileRepository', repositoryWithAxios('files'))

  // You can reuse the repositoryWithAxios object with:
  // inject("someRepository", repositoryWithAxios('/something'));
}
