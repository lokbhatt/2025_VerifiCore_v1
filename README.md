# 2025_VerifiCore_v1

A full-stack web application built with **Laravel (Backend)** and **React + Vite (Frontend)**.  
This project aims to Verify KYC (Know Your Customer).

---

## 🚀 Features

- 🖥️ **Frontend**: React 18 + Vite for blazing-fast builds
- ⚙️ **Backend**: Laravel 11 with RESTful API
- 🔐 Authentication with Laravel Sanctum
- 🎨 Tailwind CSS for styling
- 🧪 Unit and Feature Tests
- 📦 Modern package management (Composer + npm)

---

## 📂 Project Structure
2025_VerifiCore_v1/
├── app/ # Laravel backend logic (Models, Controllers, Middleware)
├── bootstrap/ # Laravel bootstrap files
├── config/ # Configuration files
├── database/ # Migrations, seeders, factories
├── public/ # Public assets & entry point (index.php)
├── resources/ # Laravel resources
│ ├── js/ # React + Vite frontend source
│ │ ├── components/ # React components
│ │ ├── pages/ # React pages
│ │ ├── App.jsx # Main React component
│ │ └── main.jsx # React entry point
│ └── views/ # Blade templates (e.g., welcome.blade.php)
├── routes/ # API & Web routes
├── storage/ # Logs, cache, file storage
├── tests/ # PHPUnit and frontend tests
├── vite.config.js # Vite config file
├── package.json # Frontend dependencies
├── composer.json # Backend dependencies
└── README.md

