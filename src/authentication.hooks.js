const lastLogin = require('./hooks/last-login')

module.exports = {
  after: {
    create: [
      lastLogin(),
    ],
  },
}
