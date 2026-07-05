<template>
  <footer>
    <p style="align-items: center; gap: 8px; margin: 0;">
      <img
        :src="content.images.logo"
        alt="Logo"
        style="width: 15px; height: 15px;"
      />
      {{ content.footer.line1 }}
    </p>

    <p style="margin-top: 12px;">
      {{ content.footer.line2 }}
    </p>
  </footer>
</template>

<script>
import { content } from '../composables/useSiteContent'

export default {
  name: 'Footer',

  data() {
    return { content }
  }
}
</script>
