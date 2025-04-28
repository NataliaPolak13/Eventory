<template>
  <div class="login-container">
    <div class="header">
      <h2>Witaj ponownie</h2>
    </div>
    <div class="loging-bar">
      <div class="login-form">
        <div style="margin-bottom: 30px" class="input-group">
          <span class="icon">📧</span>
          <input v-model="email" type="email" placeholder="Email" />
        </div>
        <div class="input-group">
          <span class="icon">🔒</span>
          <input v-model="password" type="password" placeholder="Hasło" />
        </div>
      </div>
      <div class="login-footer">
        <button @click="handleSubmit">Zaloguj się</button>
        <router-link to="/reset_hasła">Zapomniałeś hasła?</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    handleSubmit() {
      // Możesz tu dodać logikę logowania
      console.log("Email:", this.email);
      console.log("Hasło:", this.password);
    }
  }
};
</script>

<style src="../assets/logowanie.css"></style>
