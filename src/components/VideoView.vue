<template>
  <div class="container m-auto" :class="{ 'align-items-start': !resource }">
    <div v-if="loading" class="text-align-left">
      Loading... <i class="fa fa-spinner" />
    </div>
    <div v-if="resource" class="video-and-notes w-full">
      <div class="video-container flex justify-content-center">
        <youtube ref="youtube" :video-id="resource.videoId"
                 width="480" :fit-parent="true"
                 @ready="onReady"
                 @ended="onEnded"
                 @playing="onPlaying"
                 @paused="onPaused"
                 @buffering="onBuffering"
                 @cued="onCued"
                 @error="onError"
        />
      </div>
      <div class="notes-container">
        <div class="notes-header">
          <span class="video-actions">
            <button class="play-pause cursor-pointer" :disabled="['loading'].includes(state)"
                    @click="onTogglePlay"
            >
              <i v-if="showNewComment || ['ready','paused','ended','cued','error','comment'].includes(state)" class="fas fa-play" />
              <i v-if="state === 'playing'" class="fas fa-pause" />
              <i v-if="['buffering','loading', null].includes(state)" class="fa fa-spinner" />
            </button>
            <button class="add-comment cursor-pointer" :disabled="['loading'].includes(state)"
                    @click="onShowNewComment"
            >
              <i class="far fa-comment" />
            </button>
          </span>
          <span v-if="!showNewComment" class="title capitalize cursor-pointer">{{ state }}</span>
          <span v-else class="title capitalize cursor-pointer">Add comment @
            <i v-if="currentTime === null" class="fa fa-spinner" />
            <span v-else>{{ String(currentTime.toFixed(2)) }}</span>
          </span>
        </div>
        <transition v-if="showNewComment"
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut"
        >
          <div class="new-comment">
            <textarea v-model="commentText" id="comment-text"
                      class="bg-grey-lighter appearance-none border-2 border-grey-lighter rounded w-full py-2 px-4 text-grey-darker leading-tight focus:outline-none focus:bg-white focus:border-white resize-none" type="text"
                      placeholder="Add comment text" rows="3"
            />
            <div class="flex items-center justify-between mt-3">
              <a class="inline-block align-baseline font-bold text-sm text-blue hover:text-white no-underline" href="#">
                Cancel
              </a>
              <button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" :class="{ 'opacity-50 cursor-not-allowed': commentText.length <= 3 }"
                      :disabled="commentText.length <= 3"
                      @click="onAddComment"
              >
                Add comment
              </button>
            </div>
          </div>
        </transition>
        <ul class="notes-list">
          <li v-for="(comment, idx) in comments" :key="idx"
              class="list-unstyled"
          >
            <span class="text-white">{{ comment }}</span>
            <span class="timelapse"><small>{{ comment.timestamp }}</small></span>
            <span class="comment">{{ comment.text }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { clearTimeout } from 'timers';

export default {
  data: () => ({
    commentText: '',
    currentTime: null,
    showNewComment: false,
    state: 'loading',
    resource: null,
    loading: true
  }),
  computed: {
    ...mapGetters(['user', 'comments']),
    player() {
      return this.$refs.youtube.player
    }
  },
  async created() {
    this.resource = await this.getResource({ resourceId: this.resourceId })
    this.loading = false

    await this.bindResourceComments({ resourceId: this.resourceId })
  },
  methods: {
    ...mapActions(['addComment', 'bindResourceComments', 'getResource', 'updateComment']),

    async onAddComment() {
      const createRes = await this.addComment({ videoId: this.resource.videoId, type: 'youtube', timestamp: this.currentTime.toFixed(4) })
      const updateRes = await this.updateComment({ path: createRes.path, text: this.commentText })

      if (updateRes) {
        this.showNewComment = false
        this.player.playVideo()
      }
    },
    async onShowNewComment() {
      if (!this.showNewComment) {
        this.showNewComment = true
        this.player.pauseVideo()
      } else {
        this.showNewComment = false
        this.player.playVideo()
      }
    },
    onTogglePlay() {
      if (this.state === 'playing') {
        this.player.pauseVideo()
      } else {
        this.player.playVideo()
      }
    },

    async bookmark() {
      const currentTime = await this.$refs.youtube.player.getCurrentTime()
      console.log(Number(currentTime).toFixed(2));
    },
    printDetail() {
      console.log(this.player.getVideoData());
    },

    // YOUTUBE API VIDEO STATES
    onReady() {
      this.state = 'ready'
    },
    onEnded() {
      this.state = 'ended'
    },
    onPlaying() {
      this.state = 'playing'
    },
    onPaused() {
      this.state = 'paused'
    },
    onBuffering() {
      this.state = 'buffering'
    },
    onCued() {
      this.state = 'cued'
    },
    onError() {
      this.state = 'error'
    },
  },
  props: {
    resourceId: String
  },
  watch: {
    async showNewComment(newVal) {
      if (newVal) {
        this.currentTime = await this.player.getCurrentTime()
      } else {
        this.currentTime = null
      }
    },
    state(val) {
      // hide new comment if video is playing
      if (val === 'playing') {
        this.showNewComment = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;

  &.align-items-start {
    align-items: flex-start;
  }

  .video-and-notes {
    min-height: 370px;
    position: relative;
    background: #333;

    .video-container {
      width: 70%;
      background: #333;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .notes-container {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;

      width: 30%;
      background: #333;
      border-left: 1px solid #eee;

      .notes-header {
        width: 100%;
        border-bottom: 1px solid #eee;
        position: relative;
        height: 42px;

        .video-actions {
          width: 100%;

          .play-pause, .add-comment {
            width: 3em;
            height: 100%;
            border-right: 1px solid #eee;
            color: white;

            display: inline-flex;
            justify-content: center;
            align-items: center;
            vertical-align: top;
            outline: none;

            &:disabled {
              opacity: 0.5;
            }
          }

          .play-pause {
            background: red;
          }

          .add-comment {
            background: blue;
          }
        }

        .title {
          line-height: 42px;
          margin-left: 0.75rem;
          color: white;
          opacity: 0.75;
          font-size: 14px;
        }
      }
      .new-comment {
        position: absolute;
        top: 40px;
        z-index: 1;
        width: 100%;
        height: 165px;
        padding: 15px;
        background: blue;

        .comment-text {
          font-size: 14px;
        }
      }
      .notes-list {
        position: absolute;
        top: 42px;
        bottom: 0;
        width: 100%;
        overflow: scroll;
        margin-bottom: 0;
        padding: 0;

        li {
          display: grid;
          grid-template-columns: 1fr 5fr;

          .timelapse {
            color: #438ee2;
            padding: 10px;
            cursor: pointer;
          }
          .comment {
            color: white;
            padding: 10px;
            font-size: 14px;
          }
        }
      }
    }
  }

}
</style>