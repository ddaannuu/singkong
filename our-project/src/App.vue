<template>
  <router-view />
</template>

<script>
import { initSiteContent } from './composables/useSiteContent'

export default {
  name: 'App',

  created() {
    initSiteContent()
  }
}
</script>
