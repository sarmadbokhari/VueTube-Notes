import _ from 'lodash'

export default {
  state: {
    resources: []
  },
  getters: {
    resources: state => state.resources
  },
  mutations: {
    ADD_RESOURCE(state, resource) {
      const index = _.findIndex(state.resources, { id: resource.id })

      if (index === -1) {
        state.resources.push(resource)
      }
    },
    MODIFY_RESOURCE(state, resource) {
      const index = _.findIndex(state.resources, { id: resource.id })

      if (index !== -1) {
        state.resources.splice(index, 1, resource)
      }
    },
    REMOVE_RESOURCE(state, resource) {
      const index = _.findIndex(state.resources, { id: resource.id })

      if (index !== -1) {
        state.resources.splice(index, 1)
      }
    },

    // RESOURCES
    UPDATE_RESOURCES(state, resources) {
      state.resources = resources
    }
  },
  actions: {
    async bindUserResources({ commit }) {
      const user = this.state.user.uid

      this.state.db.collection('resources').where('createdBy', '==', user)
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(function(change) {
            if (change.type === 'added') {
              console.log('New document: ', change.doc.data())
              commit('ADD_RESOURCE', change.doc.data())
            }
            if (change.type === 'modified') {
              console.log('Modified document: ', change.doc.data())
              commit('MODIFY_RESOURCE', change.doc.data())
            }
            if (change.type === 'removed') {
              console.log('Removed document: ', change.doc.data())
              commit('REMOVE_RESOURCE', change.doc.data())
            }
          })
        })
    },
    async getResources({ commit }) {
      const user = this.state.user.uid
      const resourceRef = this.state.db.collection('resources')

      const query = await resourceRef.where('createdBy', '==', user).get()

      const resources = []
      query.docs.forEach(item => {
        resources.push(item.data())
      })

      commit('UPDATE_RESOURCES', resources)
      return true
    },
    async getResource({ commit }, { resourceId }) {
      const resourceRef = await this.state.db.collection('resources').doc(resourceId).get()

      return resourceRef.data()
    },
    async addResource ({}, { videoId, type }) {
      console.log('we here');
      const user = this.state.user.uid
      const resourceRef = this.state.db.collection('resources')

      try {
        return await resourceRef.add({
          created: Date.now(),
          createdBy: user,
          type,
          videoId,
        })
      } catch (e) {
        console.log('Error addResource action: ', e);
      }
    }
  }
}