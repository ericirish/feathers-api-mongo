const {
  ObjectID,
} = require('mongodb')

const mapItem = async (app, path, item) => {
  const {
    userId,
  } = item

  const result = { ...item }

  try {
    if (ObjectID.isValid(userId)) {
      result.user = await app.service('users').get(userId)
    }
  } catch (error) {
    // stub
  }

  return result
}

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => async (context) => {
  const {
    app,
    path,
    result,
  } = context

  if (!result) {
    return context
  }

  const {
    data,
  } = result

  if (Array.isArray(data)) {
    context.result.data = await Promise.all(
      data.map(async (item) => mapItem(app, path, item)),
    )
  } else if (Array.isArray(result)) {
    context.result = await Promise.all(
      result.map(async (item) => mapItem(app, path, item)),
    )
  } else {
    context.result = await mapItem(app, path, result)
  }

  return context
}
