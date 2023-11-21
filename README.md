# medical

This project is a NodeJS/Express web application REST API that utilizes a
relational database MySQL for its data and persistence.

### Endpoints
#### Admin Only (ROLE_ADMIN + JWT Auth)
- /medical/v1/prescriptions GET
- /medical/v1/prescriptions POST
- /medical/v1/prescriptions DELETE
- /medical/v1/prescriptions/{id} GET
- /medical/v1/prescriptions/{id} PUT
- /medical/v1/prescriptions/{id} DELETE

#### User (ROLE_OWNER/AGENT/MONITOR? + JWT Auth)
- /medical/v1/owner/prescriptions GET
- /medical/v1/owner/prescriptions POST
- /medical/v1/owner/prescriptions DELETE
- /medical/v1/owner/prescriptions/{id} GET
- /medical/v1/owner/prescriptions/{id} PUT
- /medical/v1/owner/prescriptions/{id} DELETE

#### No Auth
- /api-docs Swagger API Specification

### Prerequisites

Node and NPM are required on your system prior to building or running this
application locally. You can however, download NodeJS and with that installation
you get of Node Package Manager (NPM).

If you do not have NodeJS, you can get it here: https://nodejs.org/en/download/

### Build

A NodeJS/Express application has NPM dependencies but this software repository
is not the venue to host them. This project however, has a `package.json` file
that specifies these dependencies and the NPM utility can be used to populate
your `medical` code base with the dependencies it needs.

```shell
npm install
```

This command when run at the parent directory Node Package Manager (NPM) will
download and install all the application's dependencies locally in a folder
or directory called `node-modules`. Once everything is in place, you need to
establish a database for the application to use for persistence.

Assign the following ENV variables for our localhost testing.

```shell
export DB_HOST='localhost'
export DB_USERNAME='root'
export DB_PASSWORD='example'
export DB_SCHEMA='medical'
```

With our exports in place and the Node dependencies downloaded, we can now start
the `medical` application on localhost.

```shell
npm start
```

You should see output like so:

```shell
> node server.js

Server is running on port 3007.
```

# administration
