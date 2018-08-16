import axios from 'axios';
import { fcHost, checkTokenPath } from '../config/config';
import { getAuthorizationToken } from './utils';

const checkAccessToken = async (req, res, next) => {
  const accessToken = getAuthorizationToken(req);
  if (!accessToken) {
    return res.sendStatus(400);
  }

  try {
    const { data: fcToken } = await axios({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: { token: accessToken },
      url: `${fcHost}${checkTokenPath}`,
    });

    req.fcToken = fcToken;

    return next();
  } catch (error) {
    // the server may be down or did not respond
    if (!error.response) {
      return res.sendStatus(502);
    }

    if (error.response && error.response.status >= 400) {
      return res.status(error.response.status).send(error.response.data);
    }

    return next(error);
  }
};

export default checkAccessToken;
