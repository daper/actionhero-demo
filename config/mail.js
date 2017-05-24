exports['default'] = {
  mail: function (api) {
    return {
      settings: {
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: '<SMTP USER>',
          pass: '<SMTP PASS>'
        }
      }
    }
  }
}
