var Twitter = require('twitter')
var md5 = require('md5')

var initialize = function (api, options, next) {
  // ////////
  // INIT //
  // ////////

  var type = 'twitter'
  var attributes = {
    canChat: true,
    logConnections: false,
    logExits: false,
    sendWelcomeMessage: false,
    verbs: [
      'say'
    ]
  }

  var server = new api.GenericServer(type, options, attributes)

  // ////////////////////
  // REQUIRED METHODS //
  // ////////////////////

  server.start = function (next) {
    var self = this

    if (api.env !== 'test') {
      api.twitter = new Twitter({
        consumer_key: api.config.servers.twitter.consumer_key,
        consumer_secret: api.config.servers.twitter.consumer_secret,
        access_token_key: api.config.servers.twitter.access_token_key,
        access_token_secret: api.config.servers.twitter.access_token_secret
      })

      api.log('twitter tracking: #' + api.config.servers.twitter.hashtag)
      api.twitter.stream('statuses/filter', {track: api.config.servers.twitter.hashtag}, function (stream) {
        api.twitterStream = stream
        stream.on('data', function (tweet) {
          self.addTweet(tweet)
        })

        stream.on('error', function (error) {
          api.log(error, 'error')
          throw error
        })
      })
    }

    next()
  }

  server.addTweet = function (tweet) {
    var twitterUser
    try {
      twitterUser = tweet.user.screen_name
    } catch (e) {
      twitterUser = 'unknown'
    }
    server.buildConnection({
      id: tweet.id,
      rawConnection: {
        hashtag: api.config.servers.twitter.hashtag,
        clientId: tweet.id,
        message: tweet.text,
        twitterUser: twitterUser
      },
      remoteAddress: 0,
      remotePort: 0
    }) // will emit "connection"
  }

  server.stop = function (next) {
    try {
      api.twitterStream.destroy()
    } catch (e) {
      api.log('[twitter] %s', 'error', e)
    }
    next()
  }

  server.sendMessage = function (connection, message) {
    var lockKey = 'twitter-' + md5(message.message)
    var time = 1 * 60 * 1000 // m * s * ms

    api.cache.lock(lockKey, time, function (err, lockOk) {
      if (!err && lockOk) {
        api.chatRoom.broadcast(connection, 'twitter', message.message)
        api.log('[tweet] %j', 'info', [lockKey, message.message])
      } else {
        api.log('[tweet:lockFail] %j', 'notice', [lockKey, message.message])
      }
      connection.destroy()
    })
  }

  server.goodbye = function (connection, reason) {
    //
  }

  // //////////
  // EVENTS //
  // //////////

  server.on('connection', function (connection) {
    // connection.rooms.push("twitter");
    api.chatRoom.addMember(connection.id, 'twitter', function () {
      connection.sendMessage({
        message: connection.rawConnection.message,
        twitterUser: connection.rawConnection.twitterUser,
        hashtag: connection.rawConnection.hashtag
      })
    })
  })

  // ///////////
  // HELPERS //
  // ///////////

  next(server)
}

// ///////////////////////////////////////////////////////////////////
// exports
exports.initialize = initialize
