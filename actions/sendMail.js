'use strict'

exports.action = {
  name: 'sendMail',
  description: 'an actionhero action',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],

  inputs: {
    to: {require: true},
    message: {require: true}
  },

  run: function (api, data, next) {
    var params = {to: data.params.to, message: data.params.message}
    api.tasks.enqueue('sendMail', params, 'mail', function (error, toRun) {
      if (!error && toRun) {
        data.response.success = true
        api.log('Mail successfully enqueued %j', 'info', params)
        next()
      } else {
        api.log('An error ocured %s', 'error', error)
        next(new Error(error))
      }
    })
  }
}
