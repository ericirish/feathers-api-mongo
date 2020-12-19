const {
  authenticate,
} = require('@feathersjs/authentication').hooks
const {
  iff,
} = require('feathers-hooks-common')

const isAction = require('./hooks/is-action')

module.exports = {
  before: {
    create: [iff(
      isAction('passwordChange', 'identityChange'),
      authenticate('jwt'),
    )],
  },
}
