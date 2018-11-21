<template>
  <div class="home container m-auto">
    Welcome to VueTube Notes

    <UserVideos v-if="user" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserVideos from '../components/UserVideos.vue'

export default {
  components: {
    UserVideos
  },

  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style lang="scss" scoped>

</style>

