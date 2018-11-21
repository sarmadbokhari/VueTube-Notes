<template>
  <nav class="flex items-center justify-between flex-wrap bg-teal p-6 mb-8">
    <div class="flex items-center flex-no-shrink text-white mr-6">
      <svg class="fill-current h-8 w-8 mr-2" width="54"
           height="54" viewBox="0 0 54 54"
           xmlns="http://www.w3.org/2000/svg"
      ><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" /></svg>
      <span class="font-semibold text-xl tracking-tight">VueTube Notes</span>
    </div>
    <div class="block lg:hidden">
      <button class="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-white hover:border-white">
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20"
             xmlns="http://www.w3.org/2000/svg"
        ><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
      </button>
    </div>
    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div class="text-sm lg:flex-grow">
        <a class="block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-white no-underline cursor-pointer mr-4"
           @click="$router.push('/')"
        >Home</a>
        <!-- <a v-if="user" class="block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-white no-underline cursor-pointer"
           @click="$router.push('/videos')"
        >My videos</a> -->
      </div>
      <div>
        <a v-if="getLoginStatus" class="inline-block cursor-pointer text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal hover:bg-white mt-4 lg:mt-0"
           @click="loginAction"
        >{{ getLoginStatus }}</a>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['user']),

    getLoginStatus() {
      return this.user ? 'logout' : 'login'
    }
  },

  methods: {
    loginAction() {
      if (this.user) {
        this.$router.push('/logout')
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style>

</style>
