## Project setup

```bash
$ npm install
```

add values to env as shown in .env.example

Run the following command to create a database

```bash
$ npx prisma migrate dev
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests currently only cover url shortener service
$ npm run test

# test coverage
$ npm run test:cov
```

## Resources

API documentation avalible via swagger at http://localhost:3000/api
