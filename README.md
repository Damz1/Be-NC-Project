# Introduction to Northcoders House of Games API

The Northcoders House of Games API is a powerful web API built with Node.js and PostgreSQL, providing a backend interface for a board game reviews website.
It offers users access to game categories, reviews, and comments, along with the ability to add comments, update review votes, and delete comments. The API is designed to be maintainable and secure, with robust input validation and error handling features.

Follow the instructions below to set up a local copy of the project and start exploring the API.

- link to hosted version: https://nc-games-pro.onrender.com/api

**Getting Started**

To get a local copy of the project up and running, follow these steps:

- clone the repo to your local machine.

Install Node.js and PostgreSQL

- Node.js: v19.5.0 or later, you can download from the official website:
  https://nodejs.org/
- PostgreSQL: v14 or later, you can download from the official website:
  https://www.postgresql.org/

- Setting up the Local Database
  We'll have two databases in this project. One for real looking dev data and another for simpler test data.

You will need to create two environment variables to access them:

1. create .env.test and have it written inside: PGDATABASE=nc_games_test
2. create .env.development and have it written inside: PGDATABASE=nc_games

Once you have created the .env files, run the following command to set up the local database:

- npm run setup-dbs
  This will create the necessary tables and schemas in both the development and test databases.

**Seeding the Database**
To seed the database with sample data, run the following command:

- npm run seed
  This will populate the development database with sample data.

**Testing**
To run tests you will need to install a few Dev-dependencies:

1. Jest ---> npm install --save-dev jest
2. Supertest ---> npm install --save-dev supertest
3. Jest Sorted ---> npm install --save-dev jest-sorted
