# Project structure

The project is split into two main parts: backend and frontend in monorepo style.

## Backend

The backend is a Node.js application that uses Express.js as the web server and MySQL as the database.

The backend is split into three main parts: routes, controllers and models + middleware and utils.

## Frontend

The frontend is a React application that uses React Router for routing. Vite is used as the bundler.

The frontend is split into two main parts: pages and components.

## Database

The database is a MySQL database. The database schema is defined in the `db/init-scripts/prod/init_prod.sql` file.
