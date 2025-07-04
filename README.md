# Frontend dla Eventory API

Ten projekt to frontendowa aplikacja dla [Eventory API](https://github.com/kajahl/eventory-api.git) zbudowana w Vue.js.

## 🔧 Wymagania

- Zainstalowany **Node.js** (zalecana wersja 18+)
- Zainstalowany **Visual Studio Code** (lub inny edytor kodu)
- Docker i Docker Compose

---

## 🚀 Jak uruchomić?

### 1. Backend – Eventory API

Najpierw uruchom backend przy pomocy Dockera:

```bash
git clone https://github.com/kajahl/eventory-api.git
cd eventory-api
docker-compose -f docker-compose.full.yml up --build


---
```

### 2. Frontend – Vue.js

W nowym katalogu/terminalu:

```bash
git clone https://github.com/NataliaPolak13/Eventory.git
cd Eventory/frontend_vue
npm install
npm run dev
```

---

### 3. Otwórz aplikację

Po uruchomieniu frontendowej aplikacji, odwiedź stronę:

[http://localhost:5173/](http://localhost:5173/)

---

## 📁 Struktura projektu

* `frontend_vue/` – kod źródłowy frontendowej aplikacji
* `components/dashboard/` – komponenty do obsługi panelu użytkownika
* `router/` – konfiguracja tras
* `assets/` – style CSS i zasoby statyczne

---

## 💡 Uwagi

* Domyślnie aplikacja komunikuje się z API przy użyciu zmiennej środowiskowej `VITE_API_URL`.
* Upewnij się, że API i frontend działają jednocześnie.
* Konto użytkownika domyślnego do testowania to  L: admin@example.com H: DefaultPassword123*

---

## 🛠 Technologie

* [Vue 3](https://vuejs.org/)
* [Vite](https://vitejs.dev/)
* [Docker](https://www.docker.com/)
* [Eventory API (Express + PostgreSQL)](https://github.com/kajahl/eventory-api.git)

---

## 🧑‍💻 Autorzy

* Frontend: [NataliaPolak13](https://github.com/NataliaPolak13)
* Frontend: [Konradiks](https://github.com/Konradiks)
* Backend: [kajahl](https://github.com/kajahl)

