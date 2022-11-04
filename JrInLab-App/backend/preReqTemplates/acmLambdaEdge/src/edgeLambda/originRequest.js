'use strict';

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  console.log('request: ', JSON.stringify(request, null, 2));
  const headers = request.headers;

  const host = headers.host[0].value;
  const urlSuffix = request.origin.s3.customHeaders['domain-suffix'][0].value;
  const suffixParts = urlSuffix.split('.');
  const subdomainRegex = new RegExp(
    `([0-9a-z-]+)\.${suffixParts.slice(1).join('.')}`
  );
  const hash = subdomainRegex.exec(host);
  console.log('hash: ', hash);

  if (
    hash &&
    hash[1] &&
    !['/favicon.ico', '/403.html', '/404.html', '/jrinlab.js'].includes(
      request.uri
    )
  ) {
    request.uri = '/' + hash[1] + request.uri;
  }

  headers.host[0].value = request.origin.s3.domainName;

  console.log('final request', JSON.stringify(request));
  return callback(null, request);
};
