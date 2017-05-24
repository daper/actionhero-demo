'use strict'

exports.task = {
  name: 'sendMail',
  description: 'an actionhero task',
  frequency: 0,
  queue: 'mail',
  middleware: [],

  run: function (api, params, next) {
    if ('to' in params && 'message' in params) {
      api.mail.send(params.to, params.message)
        .then(function (resp) {
          next(null, resp)
        }, function (error) {
          next(new Error(error))
        })
    } else {
      next(new Error('Invalid params'))
    }
  }
}
