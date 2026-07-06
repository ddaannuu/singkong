<template>
  <router-view />
</template>

<script>
import { initSiteContent, initRealtimeSync } from './composables/useSiteContent'

export default {
  name: 'App',

  created() {
    initSiteContent()
  },

  mounted() {
    this._unsubscribeRealtime = initRealtimeSync()
  },

  beforeUnmount() {
    if (this._unsubscribeRealtime) this._unsubscribeRealtime()
  }
}
</script>
