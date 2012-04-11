// TALK / server.js
// By Daniel R. (sadasant.com)
// License: http://opensource.org/licenses/mit-license.php

  // Libraries
var express = require('express')
  , Markdown = require('node-markdown').Markdown

  // Variables
  , talk = module.exports = express.createServer()
  , TODAY = (new Date()).getDay()
  , CHATS = {}
  , COUNT = { chats: 0, users: 0 }
  , FORBIDDEN = ['new', 'join']

// Reset Main Variables
function reset(req, res, next) {
  if ((new Date()).getDay() !== TODAY) {
    TODAY = (new Date()).getDay()
    CHATS = {}
    COUNT = { chats: 0, users: 0 }
  }
  return next()
}

// conf
talk.configure(function() {
  talk.set('views', __dirname + '/views')
  talk.set('view engine', 'jade')
  talk.use(express.bodyParser())
  talk.use(express.methodOverride())
  talk.use(require('stylus').middleware({ src: __dirname + '/public' }))
  talk.use(express.cookieParser())
  talk.use(express.session({ secret : "1337" /*, store: sessions*/ }))
  talk.use(talk.router)
  talk.use(express.static(__dirname + '/public'))
  talk.use(express.errorHandler())
})

// Index
talk.get('/', reset, function(req, res) {
  var user = req.session.user
  if (!user) {
    var date = new Date()
    user = req.session.user = {
      chats : []
    , id : COUNT.users
    , name : "User "+COUNT.users++
    , date : date
    }
  }
  res.render('index', { user : user })
})

// New Chat
talk.post('/new', function(req, res) {
  var name = req.body.name
    , pass = req.body.password
    , user_name = req.body.user_name.replace(/</g,'&#60;') // Amateur XSS fix
    , user = req.session.user
  // Must be in
  if (!user || ~FORBIDDEN.indexOf(name)) {
    return res.render('error', { ERROR: 'FORBIDDEN' })
  } else
  // This chat exists
  if (CHATS[name]) {
    return res.render('error', { ERROR: 'I have a chat with that name' })
  }
  // Invalid characters
  if (~name.indexOf('/')) {
    return res.render('error', { ERROR: 'Invalid characters in the chat name' })
  }
  // Chat Scheme
  var chat = {
    id : COUNT.chats++
  , name : name
  , pass : pass
  , posts : []
  , n_of_users : 1
  , date : new Date()
  }
  CHATS[name] = chat
  if (user_name) user.name = user_name
  user.chats.push(chat.id)
  res.redirect("/"+name)
})

// Join Chat
talk.post('/join', reset, function(req, res) {
  var name = req.body.name
    , pass = req.body.password
    , user_name = req.body.user_name.replace(/</g,'&#60;') // Amateur XSS fix
    , user = req.session.user
    , chat = CHATS[name]
  if (!(user && chat)) {
    return res.render('error', { ERROR: 'FORBIDDEN' })
  } else
  if (~user.chats.indexOf(chat.id)) {
    return res.redirect("/"+name)
  } else
  if (chat.pass === pass) {
    user.chats.push(chat.id)
    chat.n_of_users++
    if (user_name) user.name = user_name
    res.redirect("/"+name)
  } else {
    return res.render('error', { ERROR: 'FORBIDDEN' })
  }
})

// Show Chat
talk.get('/:name', function(req, res) {
  var chat = CHATS[req.params.name]
    , user = req.session.user
  if (chat) {
    if (user && ~user.chats.indexOf(chat.id)) {
      return res.render('chat', { title : 'TALK', chat : chat, user : user })
    } else {
      if (!user) {
        var date = new Date()
        user = req.session.user = {
          chats : []
        , id : COUNT.users
        , name : "User "+COUNT.users++
        , date : date
        }
      }
      return res.render('join', { chat : chat, user : user })
    }
  } else {
    return res.render('error', { ERROR: 'NOT FOUND' })
  }
})

// New Post
talk.post('/:name/post', reset, function(req, res) {
  var chat = CHATS[req.params.name]
    , user = req.session.user
    , new_post = req.body.post
    , date = req.body.date
  if (chat && user && ~user.chats.indexOf(chat.id) && new_post) {
    // Limit posts lenght
    if (new_post.length > 1024) {
      return res.send({ error: 'too long'})
    }
    // Post Schema
    var post = {
      date : date
    , post : Markdown(new_post.replace(/</g,'&#60;')).replace(/&amp;#60;/g,'&#60;') // Amateur XSS fix
    , user : user
    , pos  : chat.posts.length
    }
    // Pushing new post
    chat.posts.push(post)
    // removing too old posts
    var removable = chat.posts.length - (3*chat.n_of_users) // According to the ammount of users
    if (removable > 0) delete chat.posts[removable-1]
    res.send('ok')
  } else {
    return res.send({ error : 'not found' })
  }
})

// Load Posts
talk.post('/:name/load', function(req, res) {
  var name = req.params.name
    , user = req.session.user
    , last = req.body.last
    , loop = req.body.loop == "true"
    , chat = CHATS[name]
  if (chat && user && ~user.chats.indexOf(chat.id)) {
    slicePosts()
    function slicePosts() {
      // If the chat was removed while waiting...
      var chat = CHATS[name]
      if (loop && !chat) {
        return res.send({ error : 'removed' })
      }
      // Send only the last posts
      var last_limit = 3 * chat.n_of_users
      if (last == 0 && chat.posts.length > last_limit) {
        last += chat.posts.length - last_limit
      }
      var posts = chat.posts.slice(last)
      // Send posts or continue the queue
      if (posts.length || !loop) {
        return res.send(posts)
      } else {
        setTimeout(slicePosts, 1000)
      }
    }
  } else {
    return res.send({ error : 'FORBIDDEN' })
  }
})

// Remove Chat
talk.get('/:name/rm', function(req, res) {
  var chat = CHATS[req.params.name]
    , user = req.session.user
  if (chat && user && ~user.chats.indexOf(chat.id)) {
    delete CHATS[req.params.name]
    delete user.chats[user.chats.indexOf(chat.id)]
    user.chats.filter(function(e) { return e })
    return res.send('ok')
  } else {
    return res.render('error', { ERROR: 'FORBIDDEN' })
  }
})

// 404
talk.error(function(req, res) {
  return res.render('error', { ERROR: 'FORBIDDEN' })
})

var port = process.env['app_port'] || 3000
talk.listen(port)
console.log("Running at http://localhost:"+port+"/")
