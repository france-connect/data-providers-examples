import express from 'express';
import logger from 'morgan';

import checkAccessToken from './middlewares';
import { initializeMock } from '../mock/france-connect';
import { healthCheck, getDgfipData } from './controllers';
import config from '../config/configManager';

if (config.env === 'local' && config.useFcMock === true) {
  initializeMock();
} else {
  console.log('\x1b[31m%s\x1b[0m', `Remote loop mode activated: this server will hit ${config.fcHost}`); // eslint-disable-line no-console
}

const app = express();

// Setup express middlewares (see https://expressjs.com/en/guide/writing-middleware.html)
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', checkAccessToken);

// Setup routing (see https://expressjs.com/en/guide/routing.html)
app.get('/', healthCheck);
app.get('/api/dgfip', getDgfipData);

// Starting server
const port = process.env.PORT || '4000';
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`
\x1b[32mServer listening on http://localhost:${port}\x1b[0m


You can test it with curl:

  curl -X GET \\
  http://localhost:4000/api/dgfip \\
  -H 'authorization: Bearer 9af033eb295d0fe113988d29a26527f920114973b3a1ca7bdb44768fd0c73937'
  `);
});

export default server;
