# Northcoders House of Games API

link to hosted version: https://nc-games-pro.onrender.com/api

**Getting Started**
To get a local copy of the project up and running, follow these steps:

- clone the repo to your local machine.

- Install Dependencies
  After cloning the project, navigate to the project directory in your terminal and run the following command to install the necessary dependencies:

- Node.js: v19.5.0 or later
- PostgreSQL: v14 or later

- Setting up the Local Database
  We'll have two databases in this project. One for real looking dev data and another for simpler test data.

You will need to create two environment variables to access them:

1. create .env.test and have it written inside: PGDATABASE=nc_games_test
2. create .env.development and have it written inside: PGDATABASE=nc_games

The .env.development file should contain the following variables:

Once you have created the .env files, run the following command to set up the local database:

- npm run setup-dbs
  This will create the necessary tables and schemas in both the development and test databases.

**Seeding the Database**
To seed the database with sample data, run the following command:

- npm run seed
  This will populate the development database with sample data.
