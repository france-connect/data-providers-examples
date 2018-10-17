// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import config from '../config/configManager';

const { checkTokenPath, fcHost } = config;

export const validTokenConf = {
  token: '9af033eb295d0fe113988d29a26527f920114973b3a1ca7bdb44768fd0c73937',
  reponseHttpStatusCode: 200,
  responseBody: {
    scope: ['openid', 'profile', 'birth', 'dgfip_revenu_fiscal_de_reference', 'dgfip_nbpac', 'dgfip_nbpacf'],
    identity: {
      given_name: 'François',
      family_name: 'Seize',
      birthdate: '1950-01-06',
      gender: 'male',
      birthplace: '91272',
      birthdepartment: '48',
      birthcountry: '99100',
      email: 'francois.seize@france.fr',
      address: {
        formatted: '26 rue Desaix, 75015 Paris',
        street_address: '26 rue Desaix',
        locality: 'Paris',
        region: 'Ile-de-France',
        postal_code: '75015',
        country: 'France',
      },
      _claim_names: {},
      _claim_sources: { src1: {} },
    },
    client: {
      client_id: 'c48ff5ae96e870f507507555f7bc4dd361d2aac31df219fe6e92bbcca65f73f5',
      client_name: 'Ville de chilly FC test',
    },
    identity_provider_id: 'dgfip',
    identity_provider_host: 'fip1.integ01.dev-franceconnect.fr',
    acr: 'eidas2',
  },
};

// In this case, the token is valid but the required scope will not match the authorized scope of
// this data provider.
export const validTokenWithoutTheRightScopesConf = {
  token: '9af033eb295d0fe113988d29a26527f920114973b3a1ca7bdb44768fd0c73938',
  responseHttpStatusCode: 200,
  responseBody: {
    scope: ['openid', 'profile', 'birth'],
    identity: {
      given_name: 'François',
      family_name: 'Seize',
      birthdate: '1950-01-06',
      gender: 'male',
      birthplace: '91272',
      birthdepartment: '48',
      birthcountry: '99100',
      email: 'eric.mercier@france.fr',
      address: {
        formatted: '26 rue Desaix, 75015 Paris',
        street_address: '26 rue Desaix',
        locality: 'Paris',
        region: 'Ile-de-France',
        postal_code: '75015',
        country: 'France',
      },
      _claim_names: {},
      _claim_sources: { src1: {} },
    },
    client: {
      client_id: 'c48ff5ae96e870f507507555f7bc4dd361d2aac31df219fe6e92bbcca65f73f5',
      client_name: 'Ville de chilly FC test',
    },
    identity_provider_id: 'dgfip',
    identity_provider_host: 'fip1.integ01.dev-franceconnect.fr',
    acr: 'eidas2',
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
  [validTokenConf, expiredTokenConf, validTokenWithoutTheRightScopesConf, malformedTokenConf]
    .forEach(({ token, responseHttpStatusCode, responseBody }) => {
      nock(fcHost)
        .persist()
        .post(checkTokenPath, { token })
        .reply(responseHttpStatusCode, responseBody);
    });
};
