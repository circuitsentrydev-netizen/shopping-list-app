# 🛒 Shopping List App

A modern, responsive single-page application built for organizing shopping lists, tracking items, and managing user profiles. Designed with an intuitive dashboard and secure authentication workflows.

---

## 🚀 Key Features

* **User Authentication:** Secure login and registration workflows with session state handling.
* **Dashboard Navigation:** Seamless routing between user profiles, saved shopping lists, and individual item management.
* **Dynamic Inventory Control:** Full interactive support to add, edit, delete, search, and sort items within any list.
* **Modern UI/UX:** Styled cleanly using **Tailwind CSS** for an optimal experience across mobile and desktop devices.

---

## 🛠️ Built With

* **Frontend Framework:** React (with TypeScript)
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Data Layer / Backend Mock:** REST API integration (e.g., json-server or backend services)

---

## 🏁 Getting Started

Follow these steps to set up and run the application locally on your machine.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org) installed on your system.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com
   cd shopping-list-app
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and configure your API endpoint base URL if necessary:
   ```env
   VITE_API_URL=http://localhost:3000               
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   *Open your browser and navigate to the local development URL provided by Vite (typically `http://localhost:5173`).*

---

## 🗺️ Application Architecture & Flows

### 1. Authentication Flow
* **Login / Register:** Users can log in with existing credentials or register a new account.
* **Session Management:** Successful authentication grants access to the main dashboard and stores session metadata.

### 2. Dashboard Navigation
* **Home Dashboard:** Access profile settings, log out, or dive into your personal shopping lists.
* **Shopping Lists:** View all active lists, pick a specific list to inspect, or create a new directory.

### 3. Item Management (`CRUD`)
* **Add / Edit / Delete:** Manage item attributes (name, quantity, categories) directly inside any selected list.
* **Search & Sort:** Quickly filter through items in large lists to save time while shopping.

---

## 🧪 Development Scripts

* `npm run dev` — Starts the local Vite development server with hot module replacement (HMR).
* `npm run build` — Compiles and bundles TypeScript and React code for production deployment.
* `npm run preview` — Locally previews the production build.
