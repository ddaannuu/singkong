<template>
  <div>
    <h2 class="adm-page-title">Gambar</h2>
    <p class="adm-page-subtitle">Logo dan foto hero yang tampil di website.</p>

    <section class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-image"></i> Gambar Website</div>
      </div>
      <div class="adm-panel-body">
        <p class="adm-hint" style="margin-bottom: 18px;">
          Gambar langsung ter-upload ke Supabase Storage begitu dipilih. Tetap klik
          <strong>Publish</strong> di kanan atas supaya perubahan referensinya tersimpan dan terlihat pengunjung.
        </p>

        <div v-for="img in imageFields" :key="img.key" class="adm-image-block">
          <label class="adm-label">{{ img.label }}</label>
          <div class="adm-image-row">
            <img :src="content.images[img.key]" :alt="img.label" class="adm-image-preview" />
            <div style="flex:1;">
              <input type="file" accept="image/*" @change="(e) => handleImageUpload(img.key, img.maxWidth, e)" />
              <p v-if="imageState[img.key].uploading" class="adm-hint" style="margin-top:8px;">
                <i class="fas fa-spinner fa-spin"></i> Mengunggah &amp; mengompres gambar...
              </p>
              <p
                v-if="imageState[img.key].result"
                class="adm-status-text"
                :class="imageState[img.key].result.ok ? 'adm-status-success' : 'adm-status-error'"
              >
                {{ imageState[img.key].result.message }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { content } from '../../../composables/useSiteContent'
import { uploadImageToStorage } from '../../../services/supabaseApi'
import { resizeImage } from '../../../utils/imageResize'

const imageFields = [
  { key: 'logo', label: 'Logo', maxWidth: 400 },
  { key: 'hero', label: 'Foto Hero', maxWidth: 1600 }
]

const imageState = reactive({
  logo: { uploading: false, result: null },
  hero: { uploading: false, result: null }
})

async function handleImageUpload(key, maxWidth, event) {
  const file = event.target.files[0]
  if (!file) return

  imageState[key] = { uploading: true, result: null }

  try {
    const { blob, extension } = await resizeImage(file, { maxWidth })
    const url = await uploadImageToStorage(key, blob, extension)

    content.images[key] = url
    imageState[key] = {
      uploading: false,
      result: { ok: true, message: 'Gambar terupload. Klik Publish supaya perubahan ini terlihat pengunjung.' }
    }
  } catch (e) {
    imageState[key] = { uploading: false, result: { ok: false, message: e.message } }
  } finally {
    event.target.value = ''
  }
}
</script>

<style scoped>
.adm-image-block { margin-bottom: 22px; }
.adm-image-block:last-child { margin-bottom: 0; }

.adm-image-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-top: 8px;
}

.adm-image-preview {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: var(--adm-radius-md);
  border: 1px solid var(--adm-border);
  background: var(--adm-bg);
}
</style>
