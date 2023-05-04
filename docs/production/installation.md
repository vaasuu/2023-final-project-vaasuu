### Installation

#### Docker

There are Dockerfiles in the backend and frontend folders. You can build and run them with Docker.
Feel free to modify them to your liking.

#### Manual

Configure the environment variables in `.env.production` file in the backend and frontend folders.

Install the dependencies with `npm install --production`.
Run the backend with `npm run start`.

Build the frontend static site with `npm run build` and serve the generated `dist` directory with your favorite web server.

#### Render.com

There's a `render.yaml` file in the root of the repository. You can use it to deploy the project to Render.com.
Then just add the environment variables (or `.env.production` secret file) to the services and you're good to go.

#### Database

You can use the [`db/init-scripts/prod/init_prod.sql`](../../db/init-scripts/prod/init_prod.sql) script to initialize the database with the correct tables and data.

##### Terraform script for AWS RDS

There's a terraform script in `terraform` folder that you can use to create a MySQL database in AWS RDS.
