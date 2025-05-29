<template>
    
    <div class="section">
    <h2>📞 Kontakt</h2>
    <p>Projekt został zrealizowany przez zespół studentów kierunku <strong>Cyberbezpieczeństwo</strong>:</p>
    <ul class="student-list">
        <li>Natalia Polak</li>
        <li>Kacper Jahl</li>
        <li>Konrad Bąchór</li>
        <li>Mikołaj Klint</li>
        <li>Mikołaj Grodecki</li>
    </ul>

    <h2>Koniecznie odwiedź nasz projekt na GitHub!</h2>
    <div class="github-links">
        <a href="https://github.com/NataliaPolak13/Eventory" target="_blank" class="github-btn">🌐 Frontend</a>
        <a href="https://github.com/kajahl/eventory-api" target="_blank" class="github-btn">🛠️ Backend</a>
    </div>
</div>

</template>

<script>
export default {
  name: 'FooterComponent'
}
</script>

<style src="../assets/home.css"></style>

<style>
.student-list {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
  color: #333;
  font-size: 1rem;
}

.github-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.github-btn {
  display: inline-block;
  background-color: #24292e;
  color: #ffffff;
  padding: 0.6rem 1.2rem;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  border: 2px solid transparent;
}

.github-btn:hover {
  background-color: #0366d6;
  color: #fff;
  border-color: #024ea2;
}
</style>