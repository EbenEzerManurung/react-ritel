# React Ritel

A modern retail management system built with React.js 19.2 and Vite, designed to help businesses manage customers, products, and sales transactions efficiently through a responsive and user-friendly interface.

## Backend API

This application is designed to work with a Golang REST API backend for data management, authentication, and database operations.

To connect this frontend application to the backend service, please refer to the following repository:

Backend API Repository:
https://github.com/EbenEzerManurung/API_GOLANG

The Golang API provides database connectivity, authentication services, customer management, product management, transaction processing, and other business-related operations required by the React Ritel application.

![React](https://img.shields.io/badge/React-19.2-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38BDF8)
![PWA](https://img.shields.io/badge/PWA-Enabled-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Project Overview

React Ritel is a Progressive Web Application (PWA) that provides a complete retail management solution for small and medium-sized businesses. The application offers customer management, product inventory management, transaction processing, reporting, and role-based authentication.

The project aims to demonstrate modern frontend development practices using React.js, Vite, Tailwind CSS, and Progressive Web App technologies while delivering practical business functionality.

---

## Objectives

The main goals of React Ritel are:

* Simplify daily retail operations.
* Improve transaction efficiency.
* Provide secure role-based access.
* Support mobile and desktop devices.
* Deliver a fast and responsive user experience.
* Demonstrate modern React application architecture.
* Enable offline-capable Progressive Web App functionality.

---

## Technology Stack

### Frontend

* React.js 19.2
* Vite
* React Router
* Tailwind CSS
* Heroicons
* SweetAlert2

### Progressive Web App

* Service Workers
* Manifest.json
* Offline Support
* Installable Application

### Data Export

* XLSX Excel Export

---

## Features

### Multi-Role Authentication

Supports two user roles:

* Admin
* Cashier

Features:

* Secure Login
* Role-Based Route Protection
* Session Management
* Protected Pages

---

### Dashboard

Real-time business statistics:

* Total Customers
* Total Products
* Total Transactions
* Total Revenue

---

### Customer Management (Admin & Cashier)

Features:

* Create Customer
* View Customer
* Update Customer
* Delete Customer
* Customer Search
* Pagination (10 records per page)
* Export to Excel
* Form Validation
* Soft Delete (Inactive Customer)

Search by:

* Customer Name
* Customer Code
* Phone Number

---

### Features:

* Create Product
* View Product
* Update Product
* Delete Product
* Product Search
* Pagination
* Export to Excel

Pricing Types:

| Code | Type            | Discount |
| ---- | --------------- | -------- |
| R    | Regular         | 0%       |
| SW   | Special Weekday | 25%      |
| D    | Discount        | 35%      |

---

### Transaction Management

Available for Admin and Cashier.

Features:

* Select Customer
* Add Multiple Products
* Shopping Cart
* Quantity Update
* Remove Products
* Automatic Total Calculation
* Stock Validation
* Multiple Payment Methods

Payment Methods:

* Cash
* QRIS
* Bank Transfer

---

### Transaction History

Features:

* View Transaction Records
* Search Transactions
* Pagination
* Export to Excel

---

### Progressive Web App (PWA)

Features:

* Installable on Desktop
* Installable on Mobile Devices
* Offline Support
* Service Workers
* Manifest Configuration
* Custom "R" Application Icon

---

### Modern UI/UX

Features:

* Responsive Design
* Mobile Friendly
* Tailwind CSS Styling
* Loading Spinner
* SweetAlert2 Notifications
* Heroicons
* Modern Gradient Design

---

## Application Modules

```text
Authentication
├── Admin
└── Cashier


Progressive Web App
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/EbenEzerManurung/react-ritel.git
```

Navigate to the project directory:

```bash
cd react-ritel
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

## Screenshots

Add screenshots of:

* Login Page
* Dashboard
* Customer Management
* Product Management
* Transaction Page
* Transaction History

screenshots:

# \# Dashboard

PWA:
# <img width="1911" height="873" alt="image" src="https://github.com/user-attachments/assets/9fcdee6f-be9d-4923-abe4-66df79da4361" />
<img width="1888" height="886" alt="image" src="https://github.com/user-attachments/assets/f52387c2-61b3-4cb0-8d7b-670e5443495b" />


# \# Customer

# <img width="1888" height="948" alt="image" src="https://github.com/user-attachments/assets/2ae44abc-9142-4a77-b915-44764e575cd2" />

# \# Produk
<img width="1896" height="952" alt="image" src="https://github.com/user-attachments/assets/642c1f4c-9350-441d-82c3-6aee2d18a28d" />

# \# Transaksi
<img width="1893" height="951" alt="image" src="https://github.com/user-attachments/assets/e3467735-7584-44fb-8dc8-73a14206957f" />

# \# Riwayat Transaksi (Transaction history)
<img width="1888" height="943" alt="image" src="https://github.com/user-attachments/assets/2f41fb3a-e1f8-4c3f-81b2-cc95d0fe4a26" />

```



