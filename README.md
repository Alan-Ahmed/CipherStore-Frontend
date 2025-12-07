# CipherStore - Frontend ⚛️

![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-Fast-purple) ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-teal)

Detta är klientapplikationen (Frontend) för **CipherStore**, en e-handel för säkerhetshårdvara. Applikationen är byggd som en SPA (Single Page Application) med **React** och **Vite**.

Den kommunicerar med ett **.NET 8 Web API** (Backend) för datahantering och Stripe för betalningar.

## 🚀 Funktioner

### Kundvy
- **Produktkatalog:** Responsiv grid-layout som visar produkter.
- **Filtrering:** UI för att filtrera produkter baserat på kategori (Hardware, Privacy, Network).
- **Varukorg:** Dynamisk varukorg som hanteras via Global State (Context API).
- **Kassa:** Integrerad betalning med Stripe.

### Adminvy (CMS)
- **Dashboard:** Skyddad route (`/admin`) för administratörer.
- **Orderhantering:** Överblick över ordrar och deras status.
- **Lagerstyrning:** Gränssnitt för att manuellt justera lagersaldo (VG-krav). Frontend uppdateras direkt när saldo ändras.

## 🛠 Teknikstack

- **Ramverk:** React 18 (via Vite).
- **Styling:** TailwindCSS.
- **State Management:** React Context API (för varukorg).
- **HTTP-klient:** Axios.
- **Routing:** React Router DOM.
- **Betalning:** Stripe.js.

## ⚙️ Installation & Körning

För att starta frontend-applikationen lokalt:

### 1. Förutsättningar
* Node.js (v16 eller högre)
* npm
* Backend-API:et måste vara igång (vanligtvis på `https://localhost:7091`).

### 2. Installera beroenden
Öppna terminalen i projektmappen och kör:
```bash
npm install
