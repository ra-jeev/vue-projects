const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const cognitoPoolId = process.env.COGNITO_USER_POOL_ID || '';
const cognitoAppClientId = process.env.COGNITO_APP_CLIENT_ID || '';
const region = process.env.AWS_REGION || '';
const cognitoIssuer = `https://cognito-idp.${region}.amazonaws.com/${cognitoPoolId}`;
let cacheKeys = null;

const isValidToken = async (token) => {
  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.decode(token, { complete: true });
    console.log('decoded jsonwebtoken: ', decoded);
    if (
      !decoded ||
      !decoded.header ||
      !decoded.payload ||
      !decoded.header.kid
    ) {
      console.log('Error: Invalid token');
      return false;
    }

    if (
      decoded.payload.iss !== cognitoIssuer ||
      decoded.payload.client_id !== cognitoAppClientId
    ) {
      console.log('invalid issuer or client_id');
      return false;
    }

    // const claimedUserGroups = decoded.payload['cognito:groups'];
    // if (!claimedUserGroups || !claimedUserGroups.length) {
    //   console.log('restricted resources requested without any user groups');
    //   return false;
    // }

    if (!cacheKeys) {
      const url = `${cognitoIssuer}/.well-known/jwks.json`;
      const response = await axios.default.get(url);
      cacheKeys = {};
      response.data.keys.forEach((key) => {
        cacheKeys[key.kid] = {
          ...key,
          pem: jwkToPem(key),
        };
      });
    }

    console.log('public keys: ', cacheKeys);
    const key = cacheKeys[decoded.header.kid];
    if (key === undefined) {
      console.log('claim made for unknown kid');
      return false;
    }

    const claim = jwt.verify(token, key.pem, {
      issuer: cognitoIssuer,
    });

    console.log('claim is: ', claim);
    if (claim.token_use !== 'access') {
      console.log('claim use is not access');
      return false;
    }

    if (claim.client_id !== cognitoAppClientId) {
      console.log("Client id doesn't match");
      return false;
    }

    // const verifiedUserGroups = claim['cognito:groups'];
    // if (!verifiedUserGroups || !verifiedUserGroups.length) {
    //   console.log('restricted resources requested without any user groups');
    //   return false;
    // }

    return claim.username;
    // if (
    //   verifiedUserGroups.includes('SU') ||
    //   verifiedUserGroups.includes('Admin')
    // ) {
    //   return claim.username;
    //   // const statements = [
    //   //   {
    //   //     Action: 'execute-api:Invoke',
    //   //     Effect: 'Allow',
    //   //     Resource: [`${methodParts[0]}/*/*`],
    //   //   },
    //   // ];

    //   // return getResponseObject(claim.username, statements, {
    //   //   role: 'SU',
    //   //   id: claim.username,
    //   // });
    // }
  } catch (error) {
    console.log('auth failed with: ', error);
  }

  return false;
};

exports.handler = async (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const tokenUser = await isValidToken(
    event.queryStringParameters.authorization
  );

  if (tokenUser) {
    console.log('Claim is valid, generating allow policy');
    return generateAllow(tokenUser, event.methodArn);
  } else {
    console.log('Invalid claim, returning Unauthorized');
    throw new Error('Unauthorized');
  }
};

// Helper function to generate an IAM policy
const generatePolicy = (principalId, effect, resource) => {
  // Required output:
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17'; // default version
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke'; // default action
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    user: principalId,
  };

  return authResponse;
};

var generateAllow = function (principalId, resource) {
  return generatePolicy(principalId, 'Allow', resource);
};

var generateDeny = function (principalId, resource) {
  return generatePolicy(principalId, 'Deny', resource);
};
