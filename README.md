# Tax Calculation Application

This project is a simple web-based tax calculation application consisting of a backend (built with Laravel) and a frontend (using HTML, CSS, JavaScript).

## Project Structure

├── tax_calculation_back  
│    └── laravel scaffolding  
├── tax_calculation_front      
│   ├── node_modules           
│   ├── index.html             
│   ├── script.js              
│   ├── style.css              
│   └── package-lock.json


## Prerequisites

### Backend:
- PHP 8.x or later
- Composer
- MySQL (or any other database supported by Laravel)
- Laravel (installable via Composer)

### Frontend:
- Node.js and npm (Node Package Manager)
- http-server (Node.js package for serving static files)
- Any modern web browser (Google Chrome, Firefox, etc.)

## Setup Instructions

### Backend (Laravel)

1. **Navigate to the backend directory**:
   ```bash
   cd tax_calculation_back

2. **Install dependencies using Composer**:

   ```bash
   composer install

3. **Set up environment variables**:

   ```bash
   cp .env.example .env

4. **Generate the application key**:

   ```bash
   php artisan key:generate

5. **Set up the database**:

   Ensure your database (e.g., MySQL) is running and configured in the .env file.

6. **Run the migrations to set up the database schema**:

   ```bash
   php artisan migrate

7. **Run the seeding**:

   ```bash
   php artisan db:seed

8. **Start the backend server**:

   ```bash
   php artisan serve

The backend will be available at http://127.0.0.1:8000/.

### Frontend Setup (using http-server)

We will use http-server, a simple, zero-configuration command-line HTTP server, to serve the frontend files locally.

**Steps to Set Up the Frontend**:

1. **Navigate to the frontend directory**:

   ```bash
   cd tax_calculation_front

2. **Install frontend dependencies**:

   ```bash
   npm install

3. **If you haven't installed http-server globally, run**:

   ```bash
   npm install -g http-server

4. **Start the frontend server: In the tax_calculation_front directory, run the following command**:

   ```bash
   http-server -p 8080

This will serve your frontend at http://localhost:8080.

### Access the application: 

Open your browser and go to http://localhost:8080 to access the frontend.

API Endpoints
The backend exposes the following API endpoints:

- **GET /api/products**: 

Retrieve the list of products with optional filters (search, category, min_price, max_price).

- **POST /api/calculate**: 

Calculate the tax for the selected products.

- **POST /api/imported**: 

Update the "imported" status of a product.

These endpoints are used by the frontend to display products and generate a receipt.

### How to Use

Open the frontend in your browser (http://localhost:8080).
Use the filters to search and filter products by category or price range.
Add products to the cart.
Toggle the "Apply import duty" option for imported products.
Generate a receipt, which will show the total price including taxes.





