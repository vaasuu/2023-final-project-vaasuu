# Automated Testing

Backend has automated tests for the api endpoints. Using Jest and Supertest.

Frontend has automated tests for some of the components and pages. Using React Testing Library and Vitest.

End to end testing is done with Cypress.

Github Actions is used to run the tests on PR and every push to the main branch.

## Running tests

### Backend

Run `npm run test` to run the tests.

### Frontend

Run `npm run test` to run the tests.

### End to end

Run `npx cypress run` to run the tests.

## Test environment variables

There is a `.env.test` file in the backend folder.

> **Note**
> Do not blindly modify `.env.test` file. As some values are hardcoded in the tests.
