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
To hit the actual fcp.integ01.dev-franceconnect.fr remote server, run the server with:

```bash
LOCAL_LOOP=false npm start
```

## Run the tests

Run the tests with:
```bash
npm test
```
