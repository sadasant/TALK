
// Dependencies
const express = require('express')

// Module
module.exports = function(settings) {

  var TALK   = {}
    , server = express.createServer()

  // conf
  server.configure(function() {
    server.set('views', __dirname + '/../views')
    server.set('view engine', 'jade')
    server.use(express.bodyParser())
    server.use(express.methodOverride())
    server.use(require('stylus').middleware({ src: __dirname + '/../public' }))
    server.use(express.cookieParser())
    server.use(express.session({ secret : "1337" }))
    server.use(server.router)
    server.use(express.static(__dirname + '/../public'))
    server.use(express.errorHandler())
  })

  TALK.server   = server
  TALK.settings = settings

  // App modules
  require('./stats'      )(TALK)
  require('./models'     )(TALK)
  require('./collections')(TALK)
  require('./routes'     )(TALK)

  TALK.server.listen(TALK.settings.port);
  console.log("TALK listening on port %d in %s mode", TALK.server.address().port, TALK.server.settings.env)

  return TALK
}

