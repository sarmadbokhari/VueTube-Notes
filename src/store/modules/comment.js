import _ from 'lodash'

export default {
  state: {
    comments: []
  },
  getters: {
    comments: state => state.comments
  },
  mutations: {
    ADD_COMMENT(state, comment) {
      const index = _.findIndex(state.comments, { id: comment.id })

      if (index === -1) {
        state.comments.push(comment)
      }
    },
    MODIFY_COMMENT(state, comment) {
      const index = _.findIndex(state.comments, { id: comment.id })

      if (index !== -1) {
        state.comments.splice(index, 1, comment)
      }
    },
    REMOVE_COMMENT(state, comment) {
      const index = _.findIndex(state.comments, { id: comment.id })

      if (index !== -1) {
        state.comments.splice(index, 1)
      }
    }
  },
  actions: {
    async bindResourceComments({ commit }, { resourceId }) {
      const user = this.state.user.uid

      await this.state.db.collection('resources').doc(resourceId).collection('comments')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(function(change) {
            if (change.type === 'added') {
              console.log('New document: ', change.doc.data())
              commit('ADD_COMMENT', change.doc.data())
            }
            if (change.type === 'modified') {
              console.log('Modified document: ', change.doc.data())
              commit('MODIFY_COMMENT', change.doc.data())
            }
            if (change.type === 'removed') {
              console.log('Removed document: ', change.doc.data())
              commit('REMOVE_COMMENT', change.doc.data())
            }
          })
        })

    },
    async createComment({ dispatch }, { resourceId, timestamp }) {
      console.log('creating comment!', timestamp)
      const user = this.state.user.uid
      const commentRef = this.state.db.collection(`resources/${resourceId}/comments`)

      try {
        return await commentRef.add({
          created: Date.now(),
          createdBy: user,
          timestamp
        })
      } catch (e) {
        console.log('Error createComment action: ', e);
      }
    },
    async addComment({ state, dispatch }, { videoId, type, timestamp }) {
      const user = this.state.user.uid
      const resourceRef = this.state.db.collection('resources').where('videoId', '==', videoId).where('createdBy', '==', user)

      // check if resource already exists
      return resourceRef.get()
        .then(async snapshot => {
          if (snapshot.exists) {
            console.log(videoId, ' exists!')

            const commentCreated = await dispatch('createComment', { timestamp })

            if (commentCreated) {
              console.log('comment created', commentCreated)
            }
          } else {
            console.log(videoId, ' does not exist!')

            const res = await dispatch('addResource', { videoId, type })

            if (res) {
              const commentCreated = await dispatch('createComment', { resourceId: res.id, timestamp })

              if (commentCreated) {
                console.log('comment created', commentCreated)
                return commentCreated
              }
            }
          }
        })
    },
    async updateComment({}, { path, text }) {
      const ids = path.split('/')
      const commentRef = this.state.db.collection('resources').doc(ids[1]).collection('comments').doc(ids[3])

      try {
        await commentRef.set({
          text
        }, { merge: true })

        return true
      } catch (e) {
        console.log('Error updateComment action: ', e);
      }
    }
  }
}