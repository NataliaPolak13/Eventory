<template>
  <nav class="dashboard-nav borderBox">
    <div class="nav-buttons">
      <router-link to="/dashboard">
        <button class="nav-item smallBorderBox">Home</button>
      </router-link>
      <router-link to="/dashboard/eventList">
        <button class="nav-item smallBorderBox">Lista Wydarzeń</button>
      </router-link>
      <router-link to="/dashboard/myEvents">
        <button class="nav-item smallBorderBox">Twoje Wydarzenia</button>
      </router-link>
      <router-link to="/dashboard/userProfile">
        <button class="nav-item smallBorderBox">O mnie</button>
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBarComponent'
}
</script>

<style src="../../assets/dashboard.css"></style>
