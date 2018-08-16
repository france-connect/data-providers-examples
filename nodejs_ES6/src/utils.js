import moment from 'moment';

export const getAuthorizationToken = (req) => {
  if (!req.header('Authorization')) {
    return null;
  }

  const authorizationHeaderParts = req.header('Authorization').split(' ');
  if (authorizationHeaderParts.length !== 2 || authorizationHeaderParts[0] !== 'Bearer') {
    return null;
  }

  return authorizationHeaderParts[1];
};

export const cleanUpAccentedChars = str => str
  .replace(/[ÀÁÂÃÄÅ]/g, 'A')
  .replace(/[àáâãäå]/g, 'a')
  .replace(/[ÈÉÊË]/g, 'E')
  .replace(/[èéêë]/g, 'e')
  .replace(/[Æ]/g, 'AE')
  .replace(/[æ]/g, 'ae')
  .replace(/[Ç]/g, 'C')
  .replace(/[ç]/g, 'c')
  .replace(/[ÌÍÎÏ]/g, 'I')
  .replace(/[ìíîï]/g, 'i')
  .replace(/[Ñ]/g, 'N')
  .replace(/[ñ]/g, 'n')
  .replace(/[ÒÓÔÕÖØ]/g, 'O')
  .replace(/[òóôõöø]/g, 'o')
  .replace(/[Œ]/g, 'OE')
  .replace(/[œ]/g, 'oe')
  .replace(/[ÙÚÛÜ]/g, 'U')
  .replace(/[ùúûü]/g, 'u')
  .replace(/[ÝŸ]/g, 'Y')
  .replace(/[ýÿ]/g, 'y') // this function is incomplete but stand as an example
  .replace(/[^a-z0-9]/gi, ''); // final clean up


export const getDay = date => moment(date, 'YYYY-MM-DD').format('DD');
export const getMonth = date => moment(date, 'YYYY-MM-DD').format('MM');
export const getYear = date => moment(date, 'YYYY-MM-DD').format('YYYY');
export const getTitle = gender => ({ male: 'M', female: 'MME' }[gender]);
