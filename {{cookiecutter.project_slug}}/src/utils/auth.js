import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

// {
//   iss: 'https://dev-rn5wavki.us.auth0.com/',
//   sub: 'github|2963800',
//   aud: [
//     'https://api.compada.dev/graphql',
//     'https://dev-rn5wavki.us.auth0.com/userinfo'
//   ],
//   iat: 1667367777,
//   exp: 1667454177,
//   azp: 'mXYOfDVP09PygHlpOPa48i7cfLzVUc0J',
//   scope: 'openid profile email read:all write:all',
//   'https://api.compada.io/roles': [ 'postgres' ],
//   permissions: [ 'read:all', 'write:all' ],
//   person_id: '9d662ab9-70e4-4009-aeb9-b9b5c9615bd0'
// }

export const checkJwt = expressjwt({
  credentialsRequired: false,
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

export const authErrors = (err, _req, res, _next) => {
  if (err.name === "UnauthorizedError") {
    console.error(err); // You will still want to log the error...
    // but we don't want to send back internal operation details
    // like a stack trace to the client!
    res.status(err.status).json({ errors: [{ message: err.message }] });
    res.end();
  }
};
