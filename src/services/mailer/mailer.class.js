const { Service } = require('feathers-mongodb')
const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY || 'seedDoesNotReaddotenv',
  domain: process.env.MAILGUN_DOMAIN,
})
const fs = require('fs')
const mjml2html = require('mjml')
const mustache = require('mustache')
const logger = require('../../logger')

function functionCallError(methodName) {
  logger(`ERROR: Mailer does not expect a call to ${methodName}()`)
}

exports.Mailer = class Emailer extends Service {
  constructor(options) {
    super(options)
    this.options = options
    this.mailgun = mailgun
  }

  async create(data) {
    data = this.setDataDefaults(data)
    data = this.buildEmailFromTemplate(data)

    await this.mailgun.messages().send(data)
  }

  buildEmailFromTemplate(data) {
    const mjmlTemplate = fs.readFileSync(`src/emails/${data.template}.mjml`, 'utf8')
    const renderedHTML = mjml2html(mjmlTemplate, this.options)

    data.html = mustache.render(renderedHTML.html, data.params)
    delete data.params
    delete data.template

    return data
  }

  setDataDefaults(data) {
    data.from = data.from || 'Noreply <help@avilasoccer.com>'
    return data
  }

  async find() { functionCallError('find') }

  async get() { functionCallError('get') }
}
