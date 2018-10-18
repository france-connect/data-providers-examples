/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';
import app from '../src/app';
import { fcHost, checkTokenPath } from '../config/config';
import {
  validTokenConf, malformedTokenConf, expiredTokenConf, initializeMock,
} from '../mock/france-connect';

chai.use(chaiHttp);
const { expect } = chai;

describe('checkAccessToken middleware', () => {
  beforeEach(() => {
    initializeMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('should return 400 when no token is provided', (done) => {
    chai.request(app)
      .get('/api/undefined-route')
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should return 400 when the token type is not Bearer', (done) => {
    chai.request(app)
      .get('/api/undefined-route')
      .set('Authorization', `Basic ${validTokenConf.token}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should return 502 when not able to connect to FranceConnect', (done) => {
    nock.cleanAll();
    nock(fcHost)
      .post(checkTokenPath, { token: validTokenConf.token })
      .replyWithError({ code: 'ECONNREFUSED' });

    chai.request(app)
      .get('/api/undefined-route')
      .set('Authorization', `Bearer ${validTokenConf.token}`)
      .end((err, res) => {
        expect(res).to.have.status(502);
        done();
      });
  });

  it('should return 401 when an invalid token is provided', (done) => {
    chai.request(app)
      .get('/api/undefined-route')
      .set('Authorization', `Bearer ${malformedTokenConf.token}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should return 401 when an invalid token is provided', (done) => {
    chai.request(app)
      .get('/api/undefined-route')
      .set('Authorization', `Bearer ${expiredTokenConf.token}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should return 404 when a valid token is provided', (done) => {
    chai.request(app)
      .get('/api/undefined-route')
      .set('Authorization', `Bearer ${validTokenConf.token}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
