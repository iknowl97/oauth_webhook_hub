const crypto = require('crypto');
const axios = require('axios');

function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

async function exchangeToken(tokenUrl, code, clientId, clientSecret, redirectUri, codeVerifier) {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirectUri);
  params.append('client_id', clientId);
  if (clientSecret) {
    params.append('client_secret', clientSecret);
  }
  if (codeVerifier) {
    params.append('code_verifier', codeVerifier);
  }

  // Some providers require Basic Auth header instead of body params
  // But standard OAuth2 supports body. We'll use body + optional header if needed.
  // For now, assuming body.
  
  const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
  };

  const response = await axios.post(tokenUrl, params, { headers });
  return response.data;
}

async function refreshTokenExchange(tokenUrl, refreshToken, clientId, clientSecret) {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);
  params.append('client_id', clientId);
  if (clientSecret) {
    params.append('client_secret', clientSecret);
  }

  const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
  };

  const response = await axios.post(tokenUrl, params, { headers });
  return response.data;
}

module.exports = { generateState, generatePKCE, exchangeToken, refreshTokenExchange };
