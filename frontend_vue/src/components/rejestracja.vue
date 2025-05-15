<template>
  <div class="form-wrapper">
    <div class="form-container">
      <div class="header">
        <h2>Zarejestruj się</h2>
      </div>
      <form @submit.prevent="handleSubmit" class="form-content">
        <div class="form-row">
          <input v-model="firstName" type="text" placeholder="Imię *" required />
          <input v-model="password" type="password" placeholder="Hasło *" required />
        </div>
        <div class="form-row">
          <input v-model="lastName" type="text" placeholder="Nazwisko *" required />
          <input v-model="confirmPassword" type="password" placeholder="Powtórz hasło *" required />
        </div>
        <div class="form-row">
          <input v-model="email" type="email" placeholder="Email *" required />
          <label class="upload-btn">
            <span>📷 Załaduj zdjęcie profilowe</span>
            <input type="file" @change="handleFileUpload" hidden />
          </label>
        </div>
        <div class="form-submit">
          <button class="button1" type="submit">Zarejestruj się</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImage: null
    };
  },
  methods: {
    handleSubmit() {
      if (this.password !== this.confirmPassword) {
        alert("Hasła nie pasują do siebie!");
        return;
      }

      console.log("Rejestracja:", {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        profileImage: this.profileImage
      });

      alert("Rejestracja zakończona sukcesem!");
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.profileImage = file;
        console.log("Załadowano zdjęcie:", file);
      }
    }
  }
};
</script>

<style src="../assets/formularz_rejestracyjny.css"></style>
