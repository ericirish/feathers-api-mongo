const {
  AuthenticationService,
  JWTStrategy,
} = require('@feathersjs/authentication')
const {
  LocalStrategy,
} = require('@feathersjs/authentication-local')
const {
  expressOauth,
} = require('@feathersjs/authentication-oauth')
const authManagement = require('feathers-authentication-management')

const authenticationHooks = require('./authentication.hooks')
const authManagementHooks = require('./auth-management.hooks')

module.exports = (app) => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())

  app.use('/authentication', authentication)
  app.configure(expressOauth())
  app.service('authentication').hooks(authenticationHooks)

  const config = app.get('authentication').mgmt
  const {
    baseUrl,
  } = config

  app.configure(authManagement({
    identifyUserProps: [
      'id',
      'email',
    ],
    notifier: async (type, user, notifierOptions) => {
      const {
        email,
        firstName,
        resetToken,
        verifyToken,
      } = user

      const {
        preferredComm,
      } = notifierOptions

      const shouldEmail = email && (!preferredComm || preferredComm === 'email')

      const emailer = app.service('emailer')

      switch (type) {
        case 'resendVerifySignup': {
          const url = `${baseUrl}/verify?token=${verifyToken}&email=${email}`

          if (shouldEmail) {
            emailer.create({
              to: email,
              subject: 'Verify Email',
              template: 'parent-verify',
              params: {
                url,
              },
            })
          }
        } break
        case 'sendResetPwd': {
          const url = `${baseUrl}/reset-password?token=${resetToken}&email=${email}`

          emailer.create({
            to: email,
            subject: 'Avila password reset',
            template: 'password-reset',
            params: {
              url,
            },
          })
        } break
        case 'verifySignup':
          if (shouldEmail) {
            return emailer.create({
              params: {
                FIRST_NAME: firstName,
              },
              templateId: '4',
              to: [{
                email,
              }],
            })
          }
          break
        default:
      }

      return null
    },
  }))

  app.service('authManagement').hooks(authManagementHooks)
}
