import firebase from 'firebase'
import firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import store from './store'

firebase.initializeApp({
  // API KEYS HERE
})

export const ui = new firebaseui.auth.AuthUI(firebase.auth())

/**
 * Sync store.state.user with firebase.auth().currentUser
 *
 * This callback is called when firebase.auth() detects user changes,
 * so just update the vuex store with the new user object.
 */
firebase.auth().onAuthStateChanged(user => {
  store.commit('UPDATE_USER', user)
})

const firestore = firebase.firestore();

const settings = { timestampsInSnapshots: true };
firestore.settings(settings);