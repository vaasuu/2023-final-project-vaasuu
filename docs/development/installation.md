# Installation for development

### Requirements

- Docker

and/or

- [Node.js and npm](https://nodejs.org/) (tested with v18)
- [MySQL](https://www.mysql.com/) (tested with v8)

### Dev environment installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/TiTe-5G00EV16/2023-final-project-vaasuu
cd 2023-final-project-vaasuu
```

#### Docker

```bash
docker compose up
```

#### Manual

backend and frontend:

```bash
cd backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev
```

You also need a MySQL database. You can either use the provided docker-compose file or install it manually.

```bash
cd db
docker compose up # automatically runs the SQL init script
```

Adds the necessary tables and sample data to the database.

Sample users:

| Name        | Email                   | Password      |
| ----------- | ----------------------- | ------------- |
| John Smith  | john.smith@example.com  | `john.smith`  |
| Jane Doe    | jane.doe@example.com    | `jane.doe`    |
| Bob Johnson | bob.johnson@example.com | `bob.johnson` |

Sample users passwords are `firstname.lastname` and user `Bob Johnson` has admin privileges.

#### Environment variables

There are example environment variables in `.env.example` files in the backend and frontend folders. You can copy them to `.env` files and modify them to your liking.
