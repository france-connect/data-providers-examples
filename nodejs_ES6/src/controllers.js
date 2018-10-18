import { isEmpty } from 'lodash';
import {
  isAuthorized, filter, format, reconcile,
} from './services';

export const healthCheck = (req, res) => res.sendStatus(200);

export const getDgfipData = async (req, res) => {
  // First step: we make sure the user is authorized to read data from DGFIP
  if (!isAuthorized(req.fcToken)) {
    // In this case, the Fournisseur de Service as call the Fournisseur de Données with a user that
    // does not have enough scopes to access any data
    return res.sendStatus(403);
  }

  // Second step: we get the data that match the France Connect user
  const matchedDatabaseEntry = await reconcile(req.fcToken.identity);

  if (isEmpty(matchedDatabaseEntry)) {
    // In this case, our database did not find any matching data
    return res.sendStatus(404);
  }

  // Third step: we filter the data so it returns only the data allowed for the given scope
  const allowedDatabaseEntry = filter(
    req.fcToken.scope,
    matchedDatabaseEntry,
  );

  // Optional step : we format the final json to be more developer friendly
  const formatedDatabaseEntry = format(allowedDatabaseEntry);

  return res.json(formatedDatabaseEntry);
};
