const convict = require('convict');

const config = convict({
  http: {
    port: {
      doc: 'The port to listen on',
      default: 3000,
      env: process.env.PORT || 3000,
    },
  },
  authentication: {
    google: {
      clientId: {
        doc: 'The Client ID from Google to use for authentication',
        default:
          '1010179090786-iquiuhpl5fbg0gicdu89je8ura4fvqgg.apps.googleusercontent.com',
        env: process.env.GOOGLE_CLIENTID,
      },
      clientSecret: {
        doc: 'The Client Secret from Google to use for authentication',
        default: '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',
        env: process.env.GOOGLE_CLIENTSECRET,
      },
    },
    facebook: {
      clientId: {
        doc: 'The Client ID from Facebook to use for authentication',
        default: '380989097569545',
        env: process.env.FACEBOOK_CLIENTID,
      },
      clientSecret: {
        doc: 'The Client Secret from Facebook to use for authentication',
        default: '709f7a0684f59440749dffb84062724e',
        env: process.env.FACEBOOK_CLIENTSECRET,
      },
    },
    token: {
      secret: {
        doc: 'The signing key for the JWT',
        default: 'never-gonna-give-you-up-never-gonna-let-you-down',
        env: process.env.JWT_SECRET,
      },
      issuer: {
        doc: 'The issuer for the JWT',
        default: 'social-logins-spa',
      },
      audience: {
        doc: 'The audience for the JWT',
        default: 'social-logins-spa',
      },
    },
  },
});

config.validate();

module.exports = config;
