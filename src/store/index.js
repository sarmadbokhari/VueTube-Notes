import Vue from 'vue'
import Vuex from 'vuex'
import VueYoutube from 'vue-youtube'

import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'
import Firebase from 'firebase'

import comment from './modules/comment'
import resource from './modules/resource'

Vue.use(Vuex)
Vue.use(VueYoutube)

// firebase
import '../initFirebase'

const modules = {
  comment,
  resource
}

const state = {
  db: Firebase.firestore(),
  user: null,
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules,
})
