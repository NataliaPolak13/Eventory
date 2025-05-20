<template>
  <div id="app">
    <div class="app-container">
      <HeaderComponent />
      
      <main>
        <router-view />
      </main>
      
      <FooterComponent />
    </div>
  </div>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'

export default {
  name: 'App',
  components: {
    HeaderComponent,
    FooterComponent
  }
}
</script>

<style src="./assets/main.css"></style>