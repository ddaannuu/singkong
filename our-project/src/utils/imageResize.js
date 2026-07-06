// ---------------------------------------------------------------------------
// Resize gambar di sisi browser sebelum di-upload, supaya ukuran file di
// Supabase Storage tetap ringan (foto dari HP seringkali beberapa MB /
// terlalu besar untuk sebuah website).
// ---------------------------------------------------------------------------

/**
 * @param {File} file - file gambar dari <input type="file">
 * @param {Object} opts
 * @param {number} opts.maxWidth - lebar maksimum hasil resize
 * @param {number} opts.quality - kualitas kompresi untuk JPEG (0-1)
 * @returns {Promise<{ blob: Blob, previewUrl: string, mimeType: string, extension: string }>}
 */
export function resizeImage(file, { maxWidth = 1600, quality = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'))

    reader.onload = () => {
      const img = new Image()

      img.onerror = () => reject(new Error('File yang dipilih bukan gambar yang valid.'))

      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const targetWidth = Math.round(img.width * scale)
        const targetHeight = Math.round(img.height * scale)

        const canvas = document.createElement('canvas')
        canvas.width = targetWidth
        canvas.height = targetHeight

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

        // PNG dipertahankan sebagai PNG (supaya transparansi logo tidak
        // hilang), format lain dikompres sebagai JPEG untuk hemat ukuran.
        const isPng = file.type === 'image/png'
        const mimeType = isPng ? 'image/png' : 'image/jpeg'
        const extension = isPng ? 'png' : 'jpg'

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Gagal memproses gambar.'))
              return
            }
            const previewUrl = canvas.toDataURL(mimeType, isPng ? undefined : quality)
            resolve({ blob, previewUrl, mimeType, extension })
          },
          mimeType,
          isPng ? undefined : quality
        )
      }

      img.src = reader.result
    }

    reader.readAsDataURL(file)
  })
}
