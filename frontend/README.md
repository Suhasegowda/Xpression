# Xpression Mens Wear - Frontend

This is the frontend codebase for the Xpression Mens Wear e-commerce application.

## Prerequisites

- Node.js installed on your machine.

## Setup Instructions

1.  Open your terminal or command prompt.
2.  Navigate to this directory:
    ```bash
    cd "C:\Users\SRI\OneDrive\Desktop\Web AAT\frontend"
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
5.  Open the link shown in the terminal (usually `http://localhost:5173`) in your browser.

## Project Structure

- `src/components`: Contains all React components (Header, Hero, Shop, Cart, etc.)
- `src/context`: Contains the CartContext for state management.
- `src/data`: Contains the static product data.
- `src/App.jsx`: Main application component with routing.
- `src/main.jsx`: Entry point.

## Features

- **Home Page**: Hero section and new arrivals.
- **Shop Page**: Filter by category, sort products, and pagination.
- **Product Details**: View product info, select size, add to cart/wishlist.
- **Cart**: Myntra-style cart with price breakdown.
- **Wishlist**: Save items for later.
- **User Profile**: Mock login functionality.
- **Static Pages**: About Us, Contact Us, FAQ, Exchange Policy.
