// sadasant.com/license

//  Libraries
var express = require('express')
  , Markdown = require('node-markdown').Markdown

//  Variables
  , talk = module.exports = express.createServer()
  , TODAY = (new Date()).getDay()
  , CHATS = {}
  , COUNT = { chats: 0, users: 0 }
  , FORBIDDEN = ['new', 'join']
  , validCharacters = /[^ a-zA-Z0-9]/
  , port = process.env['app_port'] || 3000

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
  talk.use(express.session({ secret : "1337" }))
  talk.use(talk.router)
  talk.use(express.static(__dirname + '/public'))
  talk.use(express.errorHandler())
})

// Index
talk.get('/', reset, function(req, res) {
  var user = req.session.user
  if (!user) {
    user = req.session.user = {
      chats : []
    , id : COUNT.users
    , name : "User " + COUNT.users++
    , date : new Date()
    }
  }
  res.render('index', { user : user })
})

// New Chat
talk.post('/new', function(req, res) {
  var name = req.body.name
    , pass = req.body.password
    , user_name = req.body.user_name.replace(/</g,'&#60;') // XSS fix
    , user = req.session.user
    , chat
  // User shall exist
  // and the requested chat must be not forbidden
  if (!user || ~FORBIDDEN.indexOf(name)) {
    return res.render('error', { ERROR: 'FORBIDDEN' })
  } else
  // Fail if the requested chat exists
  if (CHATS[name]) {
    return res.render('error', { ERROR: 'I have a chat with that name' })
  }
  // Invalid characters
  if (~name.search(validCharacters)) {
    return res.render('error', { ERROR: 'Invalid characters in the chat name' })
  }
  // Chat Scheme
  chat = {
    id : COUNT.chats++
  , name : name
  , pass : pass
  , posts : []
  , n_of_users : 1
  , date : new Date()
  }
  CHATS[name] = chat
  // Replace the user name
  if (user_name) user.name = user_name
  user.chats.push(chat.id)
  res.redirect("/"+name)
})

// Join Chat
talk.post('/join', reset, function(req, res) {
  var name = req.body.name
    , pass = req.body.password
    , user_name = req.body.user_name.replace(/</g,'&#60;') // XSS fix
    , user = req.session.user
    , chat = CHATS[name]
  // Nor the user nor the chat exist
  if (!(user && chat)) {
    return res.render('error', { ERROR: 'FORBIDDEN' })
  } else
  // The user have been in this chat
  // redirecting to the chat
  if (~user.chats.indexOf(chat.id)) {
    return res.redirect("/"+name)
  } else
  // The user wants to log in
  // check the pass
  if (chat.pass === pass) {
    user.chats.push(chat.id)
    chat.n_of_users++
    // Changing the user's name
    if (user_name) user.name = user_name
    // Redirecting to the chat
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
    // The user have been in this chat
    if (user && ~user.chats.indexOf(chat.id)) {
      return res.render('chat', { title : 'TALK', chat : chat, user : user })
    } else {
      // New user?
      if (!user) {
        user = req.session.user = {
          chats : []
        , id : COUNT.users
        , name : "User "+COUNT.users++
        , date : new Date()
        }
      }
      // Join the chat
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
    , post
    , removable
  // The user is in this chat?
  if (chat && user && ~user.chats.indexOf(chat.id) && new_post) {
    // Limit post's lenght
    if (new_post.length > 1024) {
      return res.send({ error: 'too long'})
    }
    // Post Schema
    post = {
      date : date
    , post : Markdown(new_post.replace(/</g,'&#60;')).replace(/&amp;#60;/g,'&#60;') // XSS fix
    , user : user
    , pos  : chat.posts.length
    }
    // Pushing the new post
    chat.posts.push(post)
    // Removing too old posts
    // according to the ammount of users
    removable = chat.posts.length - (3*chat.n_of_users)
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
  // The user is in this chat?
  if (chat && user && ~user.chats.indexOf(chat.id)) {
    slicePosts(req, res, name, user, last, loop)
  } else {
    return res.send({ error : 'FORBIDDEN' })
  }
})

// Slice the last posts according to the request
function slicePosts(req, res, name, user, last, loop) {
  var chat = CHATS[name]
    , last_limit
    , posts
  // The chat was removed while waiting?
  if (loop && !chat) {
    return res.send({ error : 'removed' })
  }
  // Send only the last posts
  last_limit = 3 * chat.n_of_users
  if (last == 0 && chat.posts.length > last_limit) {
    last += chat.posts.length - last_limit
  }
  posts = chat.posts.slice(last)
  // Send posts or continue the queue
  if (posts.length || !loop) {
    return res.send(posts)
  } else {
    setTimeout(slicePosts.bind(undefined, req, res, name, user, last, loop), 1000)
  }
}

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

talk.listen(port)
console.log("Running at http://localhost:"+port+"/")
