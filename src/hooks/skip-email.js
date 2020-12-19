const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => async (context) => {
  const {
    params,
  } = context

  const {
    query,
  } = params

  if (!query) {
    return context
  }

  const {
    $skipEmail,
  } = query

  if ($skipEmail) {
    context.params.query = _.omit(query, '$skipEmail')
    context.skipEmail = true
  }

  return context
}
