<template>
  <div class="container m-auto">
    Add new video
    <div class="video-input sm:w-full md:w-1/2 mb-6">
      <input v-model="url" id="inline-full-name"
             class="bg-grey-lighter appearance-none border-2 border-grey-lighter rounded w-full py-2 px-4 text-grey-darker leading-tight focus:outline-none focus:bg-white focus:border-purple" type="text"
             placeholder="YouTube link"
      >
    </div>

    <div v-if="url">
      <youtube ref="youtube" :video-id="videoId"
               class="block"
               width="480" :fit-parent="true"
      />

      <button class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded mt-3" @click="onBookmarkVideo">
        Bookmark video
      </button>
      <p class="mt-3"><small>Bookmarking videos allows you to add comments</small></p>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  computed: {
    player() {
      return this.$refs.youtube.player
    },
    videoId() {
      return this.$youtube.getIdFromUrl(this.url)
    }
  },
  data: () => ({
    url: ''
  }),
  methods: {
    ...mapActions(['addResource']),

    async onBookmarkVideo() {
      try {
        const res = await this.addResource({ videoId: this.videoId, type: 'youtube' })
        this.$router.push(`/videos/${res.id}`)
      } catch (e) {
        console.log('NewVideo component onBookMarkVideo failed', e);
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
