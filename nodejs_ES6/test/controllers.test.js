/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';
import app from '../src/app';
import { validTokenConf, validTokenWithoutTheRightScopesConf, initializeMock } from '../mock/france-connect';


chai.use(chaiHttp);
const { expect } = chai;

describe('GET /', () => {
  it('should return a 200 OK', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('GET /api/dgfip', () => {
  beforeEach(() => {
    initializeMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('should return 403 when user has not the right scope', (done) => {
    chai.request(app)
      .get('/api/dgfip')
      .set('Authorization', `Bearer ${validTokenWithoutTheRightScopesConf.token}`)
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it('should return 200 with data according to user scopes', (done) => {
    chai.request(app)
      .get('/api/dgfip')
      .set('Authorization', `Bearer ${validTokenConf.token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({
          RFR: '15000',
          enfantsAChargeEnGardeAlternee: '0',
          enfantsMajeursCelibataires: '0',
          enfantsMajeursMariesOuChargeDeFamille: '0',
          nbPacP: '0',
          nombreDEnfantsACharge: '0',
          nombreDePersonnesACharge: '0',
          personnesInvalidesACharge: '0',
        });
        done();
      });
  });
});
