const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => async (context) => {
  const id = _.get(context, 'result.user._id')

  if (!id) {
    return context
  }

  await context.app.service('users').patch(id, {
    lastLogin: Date.now(),
  })

  return context
}
