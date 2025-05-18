<template>
  <nav class="dashboard-nav borderBox">
    <ul class="nav-ul">
      <li class="nav-item smallBorderBox">
        <router-link to="/dashboard" class="nav-link">Home</router-link>
      </li>
      <li class="nav-item smallBorderBox">
        <router-link to="/dashboard/eventList" class="nav-link">Lista Wydarzeń</router-link>
      </li>
      <li class="nav-item smallBorderBox">
        <router-link to="/dashboard/myEvents" class="nav-link">Twoje Wydarzenia</router-link>
      </li>
      <li class="nav-item smallBorderBox">
        <router-link to="/dashboard/about" class="nav-link">O mnie</router-link>
      </li>
    </ul>
  </nav>
</template>


<script>
export default {
  name: 'NavBarComponent'
}
</script>

<style src="../../assets/dashboard.css"></style>