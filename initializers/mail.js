'use strict'

var nodemailer = require('nodemailer')

module.exports = {
  loadPriority: 1000,
  startPriority: 1000,
  stopPriority: 1000,
  initialize: function (api, next) {
    var transport = nodemailer.createTransport(api.config.mail.settings)

    api.mail = {
      transport: transport,
      send: function (to, msg) {
        var message = {
          from: 'action@hero.org',
          to: to,
          subject: 'Message from ActionHero',
          text: msg
        }

        return transport.sendMail(message)
      }
    }

    return next()
  },
  start: function (api, next) {
    api.mail.transport.verify(function (error, success) {
      if (error) {
        next(error)
      } else {
        api.log('SMTP Verify OK', 'notice')
        next()
      }
    })
  },
  stop: function (api, next) {
    return next()
  }
}
