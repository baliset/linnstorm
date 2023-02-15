import base64 from 'base64-js';
// credit to author https://github.com/tschaub/jwt-claims
// too small to bring in as library especially using it in a reducer

/**
 * Decode the claims in a JWT payload.
 * @param {string} token The JWT string.
 * @return {Object} The claims from the payload.
 */
export function decode(token) {
  let payload = token.split('.')[1];
  switch (payload.length % 4) {
    case 0:
      break;
    case 2:
      payload += '==';
      break;
    case 3:
      payload += '=';
      break;
    default:
      throw new Error('Invalid base64 payload length: ' + payload);
  }
  const bytes = base64.toByteArray(payload);
  const size = 0x8000;
  const chunks = [];
  for (let i = 0, ii = bytes.length; i < ii; i += size) {
    chunks.push(
      String.fromCharCode.apply(String, bytes.subarray(i, i + size)));
  }
  const str = decodeURIComponent(escape(chunks.join('')));
  return JSON.parse(str);
}
