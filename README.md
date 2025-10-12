# AgroData SOA API

Cloud Functions backend for AgroData Peru, providing weather, price, and agricultural recommendations via REST API.

## Features

- Weather forecast integration (Open-Meteo)
- Agricultural price series (DKAN API or sample CSV)
- Practical sowing recommendations
- Firebase Functions deployment

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

```sh
npm install
```

### Local Development

Start the local emulator for functions:

```sh
npm run serve
```

Base URL http://127.0.0.1:5001/agro-data-soa-app/us-central1/api

### Firebase Shell

Interactive shell for testing functions:

```sh
npm run shell
```

or

```sh
npm start
```

### Deploy to Firebase

Deploy functions to your Firebase project:

```sh
npm run deploy
```

### View Logs

Show function logs:

```sh
npm run logs
```

## API Endpoints

- `GET /health` — Service status
- `GET /weather?lat={lat}&lon={lon}&days={days}` — Weather forecast
- `GET /prices?product={product}&region={region}&days={days}` — Price series
- `POST /recommendations` — Sowing recommendations

## Environment Variables

Configure DKAN API fields in `.env` (see [`src/config.js`](src/config.js)):

```
PRICES_RESOURCE_ID=
PRICES_PRODUCT_FIELD=
PRICES_REGION_FIELD=
PRICES_DATE_FIELD=
PRICES_AVG_FIELD=
PRICES_UNIT_FIELD=
PRICES_MARKET_FIELD=
```

## License

Private project.