# Calories Tracking app

### Project description:

Purpose of this project is to let users track their calorie consumption.

## Frontend

Fronted is built on react and has 2 user roles

#### Admin:

A superuser with permissions to modify all other users entries and view reports.

#### User:

A user can add entries and view statistics of consumtion in last 7 days.

#### Used technologies:

-   bootstrap
-   chart.js
-   redux
-   redux-thunk
-   react-toastify

## Backend

Backend code contains all the CRUD operations made in frontend

### Used technologies:

-   express
-   bcryptjs
-   jsonwebtoken
-   pg

# Setting up

you will need docker to start the backend.

to start the backend service you should run the following commands:

```bash
    docker-compose build
    docker-compose up -d
```

to start frontend:

```bash
    cd client
    npm install
    npm run start
```
