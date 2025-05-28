<template>
  <div class="login-container">
    <div class="header">
      <h2>Witaj ponownie</h2>
    </div>
    <div class="loging-bar">
      <div class="login-form">
        <div class="input-group">
          <span class="icon">📧</span>
          <input v-model="email" type="email" placeholder="Email" required/>
        </div>
        <div class="input-group">
          <span class="icon">🔒</span>
          <input v-model="password" type="password" placeholder="Hasło" />
        </div>
      </div>
      <div class="login-footer">
        <button class="button1" @click="handleSubmit">Zaloguj się</button>
        <router-link to="/reset_hasła">Zapomniałeś hasła?</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import emitter from '../eventBus'
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async handleSubmit() {
      const apiUrl = import.meta.env.VITE_API_URL + '/auth/login';
      


      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("Błąd logowania:", error);
          alert("Nieprawidłowy login lub hasło");
          return;
        }

        const data = await response.json();

        console.log("Zalogowano pomyślnie:", data);

        // Zapisz dane do localStorage
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        emitter.emit('auth-change', true)


        // Przekierowanie do dashboard
        this.$router.push("/dashboard");

      } catch (err) {
        console.error("Błąd połączenia z API:", err);
        alert("Wystąpił błąd połączenia z serwerem");
      }
    }
  }
};
</script>

<style src="../assets/logowanie.css"></style>
