# Backend API endpoints

## Users

| Method | Endpoint                   | Description                     |
| ------ | -------------------------- | ------------------------------- |
| GET    | /health                    | API Health check (no DB checks) |
| POST   | /api/v1/users/signup       | Register a new user             |
| POST   | /api/v1/users/login        | Login a user                    |
| GET    | /api/v1/users/             | Get all users                   |
| GET    | /api/v1/users/:id          | Get a user by id                |
| GET    | /api/v1/users/search?name= | Search users by name            |
| DELETE | /api/v1/users/:id          | Delete a user                   |
| PATCH  | /api/v1/users/:id          | Update a user                   |

## Roles

| Method | Endpoint      | Description   |
| ------ | ------------- | ------------- |
| GET    | /api/v1/roles | Get all roles |

## Password reset

| Method | Endpoint                                | Description                 |
| ------ | --------------------------------------- | --------------------------- |
| POST   | /api/v1/password-reset/send-reset-email | Send a password reset email |
| POST   | /api/v1/password-reset/set-new-password | Reset a password            |

## Listings

| Method | Endpoint                       | Description             |
| ------ | ------------------------------ | ----------------------- |
| GET    | /api/v1/listings/              | Get all listings        |
| GET    | /api/v1/listings/:id           | Get a listing by id     |
| GET    | /api/v1/listings/user/:id      | Get listings by user id |
| POST   | /api/v1/listings/              | Create a new listing    |
| PUT    | /api/v1/listings/:id           | Update a listing        |
| DELETE | /api/v1/listings/:id           | Delete a listing        |
| GET    | /api/v1/listings/search?query= | Search listings         |
| GET    | /api/v1/listings/categories    | Get all categories      |

Responses are returned as JSON.
