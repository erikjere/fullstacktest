# About

Fullstack developer test (v1.2)

Username and password authentication website, that lists beer names from Punk API v2

# Instructions

Simple insturctions on how to start using this project.

## Frontend

Navigate to /frontend

Use `npm install` and then `npm start` to start development server.

## Database

First start a postgres server

Make a new test user:
`CREATE USER test WITH PASSWORD 'test' CREATEDB`
or configure `.env` file with your user data.

Create a new database:
`createdb test`

## Backend

Navigate to /server

Create `.env` file with the following structure: (with presumed default values)

```
PGUSER = 'test
PGHOST = 'localhost'
PGDATABASE='test'
PGPASSWORD='test'
PGPORT=5432 TOKEN_SECRET='ag4a1bi5r19u67m0yqnzqdozux0mlolbjan133s75gnwtfphx51kcvem7e862xf9'
```

Use `npm run dev` to start development server.

## Endpoints not accessible with frontend

- Delete user: /delete (POST)
- Update password: /updatePassword (POST)

# Help for postgres

I am using WSL2, so I was using the following commands for postgres server:

Check if server is running:

`sudo service postgresql status`

Start the server:

`sudo service postgresql start`

Stop the server:

`sudo service postgresql stop`

If your postgres server does't have any users beside default one, use the following command:
`sudo -u postgres psql`

Now you can add a new user:
`CREATE USER your_username WITH PASSWORD 'choose_a_password' SUPERUSER;`

To exit use:
`\q`
