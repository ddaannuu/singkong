<template>
  <div class="adm-login-page">
    <div class="adm-login-box">
      <!-- <div class="adm-login-logo"><i class="fas fa-recycle"></i></div> -->
      <h1 class="adm-login-title">Admin Login</h1>
      <p class="adm-login-sub">Masuk untuk mengelola konten Second Chance Market.</p>

      <form @submit.prevent="$emit('submit')">
        <div class="adm-field">
          <label class="adm-label">Email admin</label>
          <input
            class="adm-input"
            type="email"
            autofocus
            autocomplete="username"
            :value="email"
            @input="$emit('update:email', $event.target.value)"
          />
        </div>
        <div class="adm-field">
          <label class="adm-label">Password</label>
          <input
            class="adm-input"
            type="password"
            autocomplete="current-password"
            :value="password"
            @input="$emit('update:password', $event.target.value)"
          />
        </div>
        <button type="submit" class="adm-btn adm-btn-primary adm-login-btn" :disabled="loggingIn">
          <i class="fas" :class="loggingIn ? '' : ''"></i>
          {{ loggingIn ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>

      <p v-if="loginError" class="adm-status-text adm-status-error">{{ loginError }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  email: { type: String, default: '' },
  password: { type: String, default: '' },
  loginError: { type: String, default: '' },
  loggingIn: { type: Boolean, default: false }
})
defineEmits(['update:email', 'update:password', 'submit'])
</script>

<style scoped>
.adm-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--adm-sidebar-bg);
  background-image: radial-gradient(circle at 20% 20%, rgba(201,154,63,0.12), transparent 45%),
                     radial-gradient(circle at 80% 80%, rgba(15,111,102,0.35), transparent 50%);
  padding: 20px;
}

.adm-login-box {
  width: 100%;
  max-width: 380px;
  background: var(--adm-card-bg);
  border-radius: var(--adm-radius-lg);
  box-shadow: var(--adm-shadow-lg);
  padding: 36px 32px;
}

@media (max-width: 420px) {
  .adm-login-box { padding: 28px 22px; }
}

.adm-login-logo {
  width: 44px;
  height: 44px;
  border-radius: var(--adm-radius-sm);
  background: var(--adm-accent);
  color: #2a1e05;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-bottom: 16px;
}

.adm-login-title {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 6px;
}

.adm-login-sub {
  font-size: 13.5px;
  color: var(--adm-text-muted);
  margin: 0 0 22px;
}

.adm-login-btn {
  width: 100%;
  justify-content: center;
  padding: 11px 16px;
  margin-top: 4px;
}
</style>