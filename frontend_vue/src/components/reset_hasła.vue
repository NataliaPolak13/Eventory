<template>
  <div class="login-container">
    <div class="header">
      <h2>Zapomniałeś hasła?</h2>
    </div>
    <div class="loging-bar">
      <div class="login-form">
        <div style="margin-bottom: 30px" class="input-group">
          <span class="icon">📧</span>
          <input v-model="email" type="email" placeholder="Wpisz swój email" required />
        </div>
        <div class="input-group">
          <span class="icon">📧</span>
          <input v-model="confirmEmail" type="email" placeholder="Potwierdź email" required />
        </div>
      </div>
      <div class="button-container">
        <button @click="resetPassword" type="submit">Resetuj</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      confirmEmail: ''
    };
  },
  methods: {
    resetPassword() {
      if (this.email === this.confirmEmail) {
        alert('Email został wysłany.');
      } else {
        alert('Wprowadzone maile nie są zgodne!');
      }
    }
  }
};
</script>

<style src="../assets/reset_hasła.css"></style>

