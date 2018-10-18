# data-providers-examples

An example of Data Provider for FranceConnect.

The way a data provider works is explained in [FranceConnect documentation](https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-donnees).

## Install

Run the following commands:

```bash
git clone git@github.com:france-connect/data-providers-examples.git
cd data-providers-examples
npm install
```

You can then start the server with:

```bash
npm start
```

Note that when calling the application this will call an internal mock of FranceConnect integration server.
To hit the actual integration remote server, set `"useFcMock": true,` in config/config.json then relaunch the serverrun the server.

## Run the tests

Run the tests with:
```bash
npm test
```

## Run the linter

Run the linter with:
```bash
npm run lint
```
