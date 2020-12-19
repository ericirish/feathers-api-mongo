const {
  ObjectID,
} = require('mongodb')
const _ = require('lodash')

const convertId = (id) => (ObjectID.isValid(id) ? new ObjectID(id) : id)

const convert = (query, key) => {
  const value = query[key]

  if (ObjectID.isValid(value)) {
    query[key] = new ObjectID(value)

    return
  }

  if (_.isArray(value)) {
    query[key] = value.map((nid) => convertId(nid))

    return
  }

  if (_.isObjectLike(value)) {
    for (const k of Object.keys(value)) {
      const v = value[k]

      if ([
        '$lt',
        '$lte',
        '$gt',
        '$gte',
      ].includes(k)) {
        query[key][k] = convertId(v)

        continue
      }

      if ([
        '$nin',
        '$in',
      ].includes(k)) {
        query[key][k] = v.map((nid) => convertId(nid))

        continue
      }
    }
  }
}

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => async (context) => {
  const {
    data,
    id,
    params,
  } = context

  const {
    query,
  } = params

  if (ObjectID.isValid(id)) {
    context.id = new ObjectID(id)
  }

  if (query) {
    const keys = Object.keys(query)

    for (const key of keys) {
      if (
        key !== '_id'
        && !_.endsWith(key, 'Id')
        && !_.endsWith(key, 'Ids')
      ) {
        continue
      }

      convert(query, key)
    }

    context.params.query = query
  }

  if (data) {
    const keys = Object.keys(data)

    for (const key of keys) {
      if (
        key !== '_id'
        && !_.endsWith(key, 'Id')
        && !_.endsWith(key, 'Ids')
      ) {
        continue
      }

      convert(data, key)
    }

    context.data = data
  }

  return context
}
