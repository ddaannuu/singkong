// ---------------------------------------------------------------------------
// GitHub Contents API helper
// ---------------------------------------------------------------------------
// Dipakai oleh halaman /admin untuk "Publish": menulis ulang isi
// src/content/site-content.json langsung di GitHub repo. Setelah commit
// berhasil, Vercel (yang sudah terhubung ke repo) akan otomatis membangun
// ulang & men-deploy versi terbaru.
//
// CATATAN KEAMANAN:
// Personal Access Token TIDAK PERNAH ditulis ke source code / dibundle.
// Token hanya disimpan di localStorage browser admin (lihat AdminView.vue)
// dan dikirim langsung dari browser ke api.github.com.
// ---------------------------------------------------------------------------

const GITHUB_API = 'https://api.github.com'

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  bytes.forEach((b) => { binary += String.fromCharCode(b) })
  return btoa(binary)
}

function base64ToUtf8(b64) {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

async function githubRequest(url, token, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {})
    }
  })

  if (!res.ok) {
    let detail = ''
    try {
      const body = await res.json()
      detail = body.message || ''
    } catch (e) {
      // ignore
    }
    if (res.status === 401) {
      throw new Error('Token tidak valid atau sudah kedaluwarsa. Periksa kembali Personal Access Token Anda.')
    }
    if (res.status === 404) {
      throw new Error('Repo/file tidak ditemukan. Periksa kembali Owner, Repo, Branch, dan Path file.')
    }
    if (res.status === 403) {
      throw new Error('Akses ditolak. Pastikan token punya permission "Contents: Read and write" untuk repo ini.')
    }
    throw new Error(detail || `GitHub API error (status ${res.status})`)
  }

  return res.json()
}

/**
 * Ambil isi file saat ini dari GitHub (dibutuhkan untuk mendapatkan `sha`
 * sebelum bisa melakukan update / commit baru).
 */
export async function getFile({ owner, repo, path, branch, token }) {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`
  const data = await githubRequest(url, token)
  return {
    sha: data.sha,
    content: base64ToUtf8(data.content.replace(/\n/g, ''))
  }
}

/**
 * Commit isi baru ke file di GitHub. Vercel akan otomatis re-deploy
 * setelah commit ini masuk ke branch yang dipantau (biasanya `main`).
 */
export async function updateFile({ owner, repo, path, branch, token, content, message, sha }) {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`
  return githubRequest(url, token, {
    method: 'PUT',
    body: JSON.stringify({
      message: message || 'chore: update konten website via Admin CMS',
      content: utf8ToBase64(content),
      branch,
      sha
    })
  })
}

/**
 * Ambil sha file saat ini (kalau ada) tanpa mendekode isinya — dipakai
 * untuk file binary (gambar) supaya tidak error saat isi file bukan teks
 * UTF-8 yang valid. Mengembalikan `undefined` kalau file belum ada
 * (artinya ini akan jadi file baru, bukan update).
 */
export async function getFileSha({ owner, repo, path, branch, token }) {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`
  try {
    const data = await githubRequest(url, token)
    return data.sha
  } catch (e) {
    if (e.message.includes('tidak ditemukan')) return undefined
    throw e
  }
}

/**
 * Upload/update file binary (gambar) ke GitHub. `base64Content` harus
 * sudah dalam bentuk base64 mentah (tanpa prefix "data:image/...;base64,").
 */
export async function publishImage({ owner, repo, path, branch, token, base64Content, commitMessage }) {
  const sha = await getFileSha({ owner, repo, path, branch, token })
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`
  return githubRequest(url, token, {
    method: 'PUT',
    body: JSON.stringify({
      message: commitMessage || 'chore: upload gambar via Admin CMS',
      content: base64Content,
      branch,
      sha
    })
  })
}

/**
 * Alur lengkap publish: ambil sha terbaru dulu (untuk menghindari konflik
 * jika file berubah di tempat lain), lalu commit isi baru.
 */
export async function publishContent({ owner, repo, path, branch, token, jsonString, commitMessage }) {
  const current = await getFile({ owner, repo, path, branch, token })
  return updateFile({
    owner,
    repo,
    path,
    branch,
    token,
    content: jsonString,
    message: commitMessage,
    sha: current.sha
  })
}

/**
 * Validasi cepat: cek apakah token & repo config valid, tanpa melakukan
 * perubahan apapun. Dipakai untuk tombol "Tes Koneksi" di admin.
 */
export async function testConnection({ owner, repo, branch, token }) {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/branches/${encodeURIComponent(branch)}`
  await githubRequest(url, token)
  return true
}
