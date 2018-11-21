<template>
  <div class="container m-auto mt-3">
    <div v-if="loading">
      <p>Fetching videos... <i class="fa fa-spinner" /></p>
    </div>
    <div v-else>
      <div v-if="resources.length">
        <h1>My Videos</h1>
        <pre>{{ resources }}</pre>
      </div>
      <div v-else class="flex justify-between">
        <p>You have no videos</p>
        <button class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded" @click="$router.push('/new')">
          New video
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'resources',
      'user',
    ])
  },
  async created() {
    if (this.user) {
      await this.bindUserResources()
      this.loading = false
    }
  },
  data:() => ({
    loading: true
  }),
  methods: {
    ...mapActions(['bindUserResources'])
  }
}
</script>

<style>

</style>
