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
            <section class="info">
                <div class="left-side">
                    <h1>Twórz i zarządzaj swoimi wydarzeniami</h1>
                    <h2>Prościej niż myślisz, wszelkie wydarznia w zasięgu ręki!</h2>
                </div>

                <div class="right-side">
                    <img src="../assets/zdj1.jpg" alt="Eventory" class="home-image" />                
                </div>

            </section>
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

<style src="../assets/home.css"></style>