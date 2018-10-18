import _, {
  clone, intersection, isEmpty, zipObject,
} from 'lodash';
import database from './database';
import {
  cleanUpAccentedChars, getDay, getMonth, getTitle, getYear,
} from './utils';

const SCOPE_TO_PROPERTIES = {
  // These 2 scopes are fictitious and are meant to be used for experimentation purpose.
  dgfip_nbpac: ['nombreDePersonnesACharge', 'nombreDePersonnesAChargeF', 'nombreDePersonnesAChargeH', 'nombreDePersonnesAChargeR', 'nombreDePersonnesAChargeJ', 'nombreDePersonnesAChargeN', 'nombreDePersonnesAChargeP'],
  dgfip_nbpacf: ['nombreDePersonnesAChargeF'],
  // These 2 scopes are the official DGFIP scopes
  dgfip_revenu_fiscal_de_reference_n_moins_1: ['nombreDeParts', 'revenuFiscalDeReference'],
  dgfip_adresse_fiscale_de_taxation_n_moins_1: ['adresseFiscaleDeTaxation'],
};

/**
 * A user is authorized to access our data if his scopes intersect the scopes of our application
 *
 * @param { scope }
 * @returns boolean
 */
export const isAuthorized = ({ scope }) => {
  const authorizedScopes = Object.keys(SCOPE_TO_PROPERTIES);

  return !isEmpty(intersection(scope, authorizedScopes));
};

/**
 * Returns a copy of databaseEntry with the allowed properties only.
 *
 * @param userScopes
 * @param databaseEntry
 */
export const filter = (userScopes, databaseEntry) => {
  const authorizedScopes = Object.keys(SCOPE_TO_PROPERTIES);

  const filteringScopes = intersection(userScopes, authorizedScopes);

  const propertiesToReturn = _(filteringScopes)
    // ['dgfip_nbpac',  'dgfip_nbpacf']
    .map(scope => SCOPE_TO_PROPERTIES[scope])
    // [
    //   ['nombreDePersonnesACharge', ..., 'nombreDePersonnesAChargeP'],
    //   ['nombreDePersonnesAChargeF']
    // ]
    .flatten()
    // ['nombreDePersonnesACharge', ..., 'nombreDePersonnesAChargeP', 'nombreDePersonnesAChargeF']
    .uniq()
    // ['nombreDePersonnesACharge', ..., 'nombreDePersonnesAChargeP']
    .value();

  // This will return the properties in databaseEntry listed in the propertiesToReturn array
  return _.pick(databaseEntry, propertiesToReturn);
};

export const format = (databaseEntry) => {
  if (!databaseEntry.adresseFiscaleDeTaxation) {
    return databaseEntry;
  }

  const formatedDatabaseEntry = clone(databaseEntry);

  formatedDatabaseEntry.adresseFiscaleDeTaxationDetail = zipObject(
    ['voie', 'complementAdresse', 'codePostal', 'commune'],
    databaseEntry.adresseFiscaleDeTaxation.split(','),
  );

  return formatedDatabaseEntry;
};

/**
 * This is the most important part of the Fournisseur de Données.
 * It associates the user returned by FranceConnect with the corresponding
 * entry in our database. We call this step the "reconciliation".
 * If the result is a miss, the final user will not be able to get his data.
 * If the checks are not strict enough we might mix returned data between users.
 * So we must be careful that this function is both strict and will match in most of the cases.
 *
 * @param userFromFranceConnect
 * @returns Promise<any>
 */
export const reconcile = (userFromFranceConnect) => {
  /*
   * We make sure to have enough data from FranceConnect to make a reconciliation.
   * This is not useful in production environment because FranceConnect has already validated the
   * user at this point. We keep this as an helper for development purpose.
   */
  if (!userFromFranceConnect
    || !userFromFranceConnect.given_name
    || !userFromFranceConnect.family_name
    || !userFromFranceConnect.birthdate
    || !userFromFranceConnect.gender
    || !userFromFranceConnect.birthcountry
  ) {
    return Promise.resolve(null);
  }

  return database.connection.find({
    /*
     * In this example, we have a database where names have no accents and are capitalized.
     * We have to remove accent from names and capitalised them.
     * This creates more collision between distinct people.
     * For example, "Cårløs Nunez" and "Carlós Nuñez" will match the same database entry
     * So, we have to make additional check to make sure we address the right person.
     */
    prenom: cleanUpAccentedChars(userFromFranceConnect.given_name).toUpperCase(),
    nomDeNaissance: cleanUpAccentedChars(userFromFranceConnect.family_name).toUpperCase(),
    /*
     * In this implementation, we also check the birth date, the gender and the birth country.
     */
    AAAA: getYear(userFromFranceConnect.birthdate),
    MM: getMonth(userFromFranceConnect.birthdate),
    JJ: getDay(userFromFranceConnect.birthdate),
    titre: getTitle(userFromFranceConnect.gender),
    codePaysDeNaissance: userFromFranceConnect.birthcountry,
  }).then((results) => {
    /*
     * We must be certain that we have one match and one match only.
     * If we got 2 people who have the same accent-less capitalized name and the same birth date and
     * place, we indeed have more than one result. In this particular rare case, we are not sure
     * what to return, so we return none of the results.
     *
     * We will deal with this cases manually and if they occur often, we will add an additional test
     * to differentiate these colliding people.
     */
    if (results.length !== 1) {
      return null;
    }

    return results[0];
  });
};
