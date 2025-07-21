# Masterpiece Merchandising Audit & Replenishment App

## Project Setup

- This project includes a backend Node.js API connected to a PostgreSQL database, and a React frontend. I set up my Database in Supabase
---

## Database Setup with Supabase

To set up the PostgreSQL database on Supabase and import the schema:

1. **Create a Supabase account:**  
   Visit [https://supabase.com/](https://supabase.com/) and sign up or log in.

2. **Create a new project:**  
   - Click **Start your Project**  
   - Sign in (or create an account) - You can directly connect it to GitHub to make it easier
   - Create a new Organization, enter org name (e.g., `masterpiece-app`) and Project Name
   - Set a strong password (remember this for your database connection)  
   - Select your region and click **Create new project**

3. **Import the database schema:**  
   - Once the project is ready, go to **SQL Editor** in the left sidebar  
   - Copy and paste the contents of `database/schema.sql` (or your SQL script file) into the editor  
   - Click **RUN** to create tables and seed initial data

4. **Get the database connection string:**  
   - Navigate to **Connect** (on the top bar)  
   - Copy the **Connection string** (a URL starting with `postgresql://`)
   - Currently, I have copied the Session pooler connection string 

5. **Configure your environment:**  
   - Create a `.env` file in the project root (or update it)  
   - Add the following line with your connection string:  
     ```
     DATABASE_URL=postgresql://username:password@host:port/database
     ```
     remember to change the [YOUR-PASSWORD] with your own password

6. **Start the backend server:**  
   - Install dependencies:  
     ```bash
     npm install
     ```  
   - Run the server:  
     ```bash
     npm start
     ```  
   - The server will connect to the Supabase PostgreSQL database using the connection string

---

## C# app setup

- appsettings.json file holds the key to the supabase database
- enter you password to the [YOUR-PASSWORD] area.
- Run these commands:
  ```bash
     sudo snap install dotnet --classic
     dotnet add package Npgsql
     dotnet add package Microsoft.Extensions.Configuration
     dotnet add package Microsoft.Extensions.Configuration.Json
     dotnet run
     dotnet build
  ```
- A csv file for stores should have been created

## React App setup
- npm install to download all dependencies
- Run these:
   ```bash
      npm run build
      npx vite
   ```
- The react app will run on `http://localhost:5173/`
## Running the Application

- Backend API will run on `http://localhost:3009` (default port). /api-docs endpoint will lead to the swagger documentation  
- Use the provided API endpoints to fetch stores, audit logs, and submit audit data

---
## Environment Variables

Use a `.env` file with the following variables:
PORT and DATABASE_URL

---

## Notes and Assumptions

- IDs are generated as UUIDs for audit logs and replenishment orders  
- Thresholds are shared across all stores for simplicity  
- The audit logs only has the information about the store, sku, quantity and product (no user info)
- Store selection is by name and address  
- The four possible conditions are: Excellent, good, fair, poor

---

## Future Improvements

- Add the storeID in the primary key for Thresholds in that way, we can make it more flexible
- Add a sign in page for users so it is logged who created a particular log (for accountability and tracking)
- Enhance the UI
- Store Selection is by one store each -- add it to include a region so regional managers can look at the entire region's audit history
- Backup the database
- Create a docker to containerize the system
- CI/CD
- make quantity component better

