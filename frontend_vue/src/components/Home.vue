<template>
    <div class="wrapper">
        <header class="headerHome">
            <div class="logo">Eventory</div>
            <nav>
                <ul>
                    <li><router-link to="/">Home</router-link></li>
                    <li><router-link to="/about">O nas</router-link></li>
                    <li><router-link to="/contact">Kontakt</router-link></li>
                </ul>
            </nav>
            <div class="user-actions">
                <router-link to="/rejestracja"><button class="home-button">Zarejestruj się</button></router-link>
                <router-link to="/logowanie"><button class="home-button">Zaloguj się</button></router-link>
            </div>
        </header>

        <main class="main-content">
            <ul class="slider">
                <li class="slider-item active">
                    <section class="info">
                        <div class="left-side">
                            <h1 class="fade-in-text">Twórz i zarządzaj swoimi wydarzeniami</h1>
                            <h2 class="fade-in-text" style="animation-delay: 0.3s;">Prościej niż myślisz, wszelkie wydarznia w zasięgu ręki!</h2>
                        </div>

                        <div class="image-holder2">
                            <img src="../assets/zdj1.jpg" alt="Eventory" class="home-image fade-in-img" />                
                        </div>
                    </section>    
                </li>

                <li class="slider-item" active>
                    <section class="info">
                        <div class="left-side">
                            <h1 class="fade-in-text">Dołącz do społeczności organizatorów</h1>
                            <h2 class="fade-in-text" style="animation-delay: 0.3s;">Twórz wydarzenia, zapraszaj gości i zarządzaj wszystkim w jednym miejscu</h2>
                        </div>

                        <div class="image-holder2">
                            <img src="../assets/zdj2.jpg" alt="Eventory" class="home-image fade-in-img" />                
                        </div>
                    </section>
                </li>
                
                <li class="slider-item" active>
                    <section class="info">
                        <div class="left-side">
                            <h1 class="fade-in-text">Twoje wydarzenia, Twoje zasady</h1>
                            <h2 class="fade-in-text" style="animation-delay: 0.3s;">Rejestracja jest szybka i darmowa – zacznij już teraz!</h2>
                        </div>

                        <div class="image-holder">
                            <img src="../assets/zdj3.jpg" alt="Eventory" class="home-image fade-in-img" />                
                        </div>
                    </section>
                </li>
                
                <li class="slider-item" active>
                    <section class="info">
                        <div class="left-side">
                            <h1 class="fade-in-text">Masz pomysł na wydarzenie?</h1>
                            <h2 class="fade-in-text" style="animation-delay: 0.3s;">Załóż konto i zrealizuj go z pomocą naszej platformy w kilka minut!</h2>
                            <router-link to="/rejestracja"><button class="home-button fade-in-text" style="animation-delay: 0.6s; margin-top: 30px">Zarejestruj się</button></router-link>
                        </div>

                        <div class="image-holder">
                            <img src="../assets/zdj2.jpg" alt="Eventory" class="home-image fade-in-img" />                
                        </div>
                    </section>
                </li>



            </ul>
            <div class="controls">
                    <a>
                        <button class="previous">
                            <span class="visually-hidden">Previous</span>
                            <span class="icon arrow-left" aria-hidden="true"></span>
                        </button>
                    </a>
                    <a>
                        <button class="next">
                            <span class="visually-hidden">Next</span>
                            <span class="icon arrow-right" aria-hidden="true"></span>
                        </button>
                    </a>
                </div>
        </main>

        <footer class="footer">
            <p>&copy; Eventory 2025</p>
        </footer>
    </div>
</template>

<script>
export default {
  mounted() {
    const sliderItems = document.querySelectorAll('.slider-item');
    const prevBtn = document.querySelector('.previous');
    const nextBtn = document.querySelector('.next');

    let currentIndex = 0;

    function showSlide(index) {
      sliderItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + sliderItems.length) % sliderItems.length;
      showSlide(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % sliderItems.length;
      showSlide(currentIndex);
    });

    showSlide(currentIndex);
  }
}
</script>



<style src="../assets/home.css"></style>