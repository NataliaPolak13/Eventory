<template>
  <div class="form-wrapper">
    <div class="form-container">
      <div class="header">
        <h2>Zarejestruj się</h2>
      </div>
      <form @submit.prevent="handleSubmit" class="form-content">
        <div class="form-row">
          <input class="regInput" v-model="firstName" type="text" placeholder="Imię *" required />
          <input class="regInput" v-model="password" type="password" placeholder="Hasło *" required />
        </div>
        <div class="form-row">
          <input class="regInput" v-model="lastName" type="text" placeholder="Nazwisko *" required />
          <input class="regInput" v-model="confirmPassword" type="password" placeholder="Powtórz hasło *" required />
        </div>
        <div class="form-row">
          <input class="regInput" v-model="email" type="email" placeholder="Email *" required />
          <label class="upload-btn">
            <span>📷 Załaduj zdjęcie profilowe</span>
            <input class="regInput" type="file" @change="handleFileUpload" hidden />
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
      profileImage: null,
    };
  },
  methods: {
    async handleSubmit() {
      if (this.password !== this.confirmPassword) {
        alert("Hasła nie pasują do siebie!");
        return;
      }

      const adres = import.meta.env.VITE_API_URL;

      // Tworzymy payload zgodny z wymaganiami backendu
      const payload = {
        username: this.email.split('@')[0], // np. wyciągamy nazwę z maila
        firstname: this.firstName,
        lastname: this.lastName,
        email: this.email,
        confirm_email: this.email,
        password: this.password,
        confirm_password: this.confirmPassword
      };

      try {
        const response = await fetch(`${adres}/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          // Spróbuj odebrać błąd z backendu
          const errorData = await response.json();
          throw new Error(errorData.message || "Błąd podczas rejestracji.");
        }

        const result = await response.json();
        console.log("Odpowiedź z serwera:", result);
        alert("Rejestracja zakończona sukcesem! Potwierdź email.");
        localStorage.setItem("email", this.email);
        this.$router.push('/confirmEmail');
      } catch (error) {
        console.error(error);
        console.log(error);
        //alert("Nie udało się zarejestrować: " + error.message);
      }
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
