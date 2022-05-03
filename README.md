# Bruno Rota - Shortener
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Have NodeJS installed (14 or later)
- Have TypeScript installed
- Have PostgreSQL installed (Once you installed postgresql you should create the `shortener' db)

### Installing

- Run `npm install`
- Go to the ROOT of the project and create a new file called `.env` containing (with your postgresql user/pass for both DBs):

```
PORT=3000
BASE_URL=http://localhost:3000
POSTGRES_DB_URL=postgresql://postgres:postgres@localhost:5432/shortener
TEST_POSTGRES_DB_URL=postgresql://postgres:postgres@localhost:5432/shortener-test
DB_LOCAL=true
DEBUG=true
DEFAULT_TOKEN_EXPIRATION=30s
```

- Create both databases (shortener & shortener-test) in PostgresSql.

## Running the app
- To run the app enter `npm run start:dev` for dev (watch mode) or just `npm start` in terminal.


## How to possibly scale the App
- We can separate this app in two microservices (Shorten-ms and Redirect-ms). Being that the Redirect-ms will have more request than the shorten, i would setup that microservice to have more resources. For example, i would add more memory (or EC2 Memory Optimized instance in AWS) being that this will use memory caching.
- Another option could be setup the Redirect-ms to have a better DB response time. In this approach i would remove the memory caching and create a EC2 Storage Optimized instance in AWS.