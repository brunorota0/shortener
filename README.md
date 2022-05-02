# Bruno Rota - Shortener
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Have NodeJS installed (12 or later)
- Have TypeScript installed
- Have PostgreSQL installed (Once you installed postgresql you should create the `shortener' db)

### Installing

- Run `npm install`
- Go to the ROOT of the project and create a new file called `.env` containing:

```
PORT=3000
BASE_URL=http://localhost:3000
POSTGRES_DB_URL=postgresql://postgres:postgres@localhost:5432/shortener
DB_LOCAL=true
DEBUG=true
```

## Running the app
- To run the app enter `npm run start:dev` in terminal
