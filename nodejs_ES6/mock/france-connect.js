// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import config from '../config/configManager';

const defaultResponseBody = {
  identity: {
    name: 'Seize François',
    family_name: 'Seize',
    given_name: 'François',
    nickname: '',
    gender: 'male',
    preferred_username: 'François',
    birthdate: '1950-01-06',
    birthplace: '',
    birthcountry: '99100',
    address: {
      country: 'France',
      formatted: '26 rue Desaix, 75015 Paris',
      locality: 'Paris',
      postal_code: '75015',
      region: 'Ile-de-France',
      street_address: '26 rue Desaix',
    },
    _claim_names: {},
    _claim_sources: {
      src1: {
        JWT: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.Int9Ig.uJPwtftRcQEhR2JYi4rIetaSA1nVt2g0oI3dZnB3yts',
      },
    },
  },
  client: {
    client_id: 'a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc',
    client_name: 'FSP1',
  },
  identity_provider_id: 'dgfip',
  identity_provider_host: 'fip1.dev.dev-franceconnect.fr',
  acr: 'eidas2',
};

export const validTokenConf = {
  token: '9af033eb295d0fe113988d29a26527f920114973b3a1ca7bdb44768fd0c73937',
  reponseHttpStatusCode: 200,
  responseBody: {
    scope: ['openid', 'profile', 'birth', 'dgfip_revenu_fiscal_de_reference_n_moins_1', 'dgfip_nbpac', 'dgfip_nbpacf'],
    ...defaultResponseBody,
  },
};

// In this case, the token is valid but the required scope will not match the authorized scope of
// this data provider.
export const validTokenWithoutTheRightScopesConf = {
  token: '9af033eb295d0fe113988d29a26527f920114973b3a1ca7bdb44768fd0c73938',
  responseHttpStatusCode: 200,
  responseBody: {
    scope: ['openid', 'profile', 'birth'],
    ...defaultResponseBody,
  },
};

export const validTokenRfrScopeConf = {
  token: '9af033eb295d0fe113988d29a26527f920114973b3a1ca7bdb44768fd0c73939',
  responseHttpStatusCode: 200,
  responseBody: {
    scope: ['dgfip_revenu_fiscal_de_reference_n_moins_1'],
    ...defaultResponseBody,
  },
};

export const validTokenAftScopeConf = {
  token: '9af033eb295d0fe113988d29a26527f920114973b3a1ca7bdb44768fd0c73940',
  responseHttpStatusCode: 200,
  responseBody: {
    scope: ['dgfip_adresse_fiscale_de_taxation_n_moins_1'],
    ...defaultResponseBody,
  },
};

export const malformedTokenConf = {
  token: 'malformed-token',
  responseHttpStatusCode: 401,
  responseBody: { status: 'fail', message: 'Malformed access token.' },
};

export const expiredTokenConf = {
  token: '9af033eb295d0fe113988d29a26527f920114973b3a1ca7bdb44768fd0c73936',
  responseHttpStatusCode: 401,
  responseBody: { status: 'fail', message: 'token_not_found_or_expired' },
};

// This will intercepts every calls made to france connect server and returns a mocked response
export const initializeMock = () => {
  [
    validTokenConf, validTokenWithoutTheRightScopesConf, validTokenRfrScopeConf,
    validTokenAftScopeConf, malformedTokenConf, expiredTokenConf,
  ]
    .forEach(({ token, responseHttpStatusCode, responseBody }) => {
      nock(config.fcHost)
        .persist()
        .post(config.checkTokenPath, { token })
        .reply(responseHttpStatusCode, responseBody);
    });
};
