// Initializes the `emails` service on path `/emails`
const { Emailer } = require('./mailer.class')
const hooks = require('./mailer.hooks')

module.exports = (app) => {
  const options = {
    fonts: 'Roboto',
    keepComments: true,
    ignoreIncludes: false,
    beautify: false,
    minify: false,
    validationLevel: 'soft',
    filePath: '.',
    preprocessors: [],
  }

  // Initialize our service with any options it requires
  app.use('/mailer', new Emailer(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('mailer')
  service.hooks(hooks)
}
