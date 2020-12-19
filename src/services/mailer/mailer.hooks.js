const { disallow } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [disallow('external')],
    find: [disallow()],
    get: [disallow()],
    create: [(context) => {
      if (context.skipEmail || context.app.get('$skipEmail')) {
        context.result = {
          message: 'Email creation skipped.',
        }
      }

      return context
    }],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
}
