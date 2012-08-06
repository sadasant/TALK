var TALK
  , controller = {}
  , invalidChars = /[^a-z0-9]/i

function getUser(req) {
  return req.session.user && TALK.collections.users[req.session.user.id]
}

function getChat(name) {
  return TALK.collections.chats[name]
}

module.exports = function(_TALK) {
  TALK = _TALK
  return controller
}


// Index
controller.index = function(req, res) {
  var user = getUser(req)
    , json = req.query.json

  if (!user) {
    user = req.session.user = new TALK.models.User()
  }

  if (json) {
    return res.json(user)
  }

  res.render('index', { user : user })
}


// New Chat
controller.chat_new = function(req, res) {
  var name      = req.body.name
    , pass      = req.body.password
    , user_name = req.body.user_name.replace(/</g,'&#60;') // Amateur XSS fix
    , user      = getUser(req)

  // Must be in
  if (!user || ~TALK.settings.forbidden.indexOf(name)) {
    return res.render('error', { ERROR: 'FORBIDDEN' })
  }

  // This chat exists
  if (TALK.collections.chats[name]) {
    return res.render('error', { ERROR: 'I have a chat with that name' })
  }

  // Invalid characters
  if (~name.search(invalidChars)) {
    return res.render('error', { ERROR: 'Invalid characters in the chat name' })
  }

  // Chat Scheme
  user.addChat(new TALK.models.Chat(name, pass))

  // Replace current user name
  if (user_name) user.name = user_name

  res.redirect("/"+name)
}


// /join
controller.chat_join = function(req, res) {
  var name      = req.body.name
    , pass      = req.body.password
    , user_name = req.body.user_name.replace(/</g,'&#60;') // Silly XSS fix
    , user      = getUser(req)
    , chat      = getChat(name)

  if (!(user && chat)) {
    return res.render('error', { ERROR: 'FORBIDDEN' })
  }

  else if (user.chats[chat.name]) {
    return res.redirect("/"+name)
  }

  else if (chat.pass === pass) {
    user.addChat(chat)
    if (user_name) user.name = user_name
    res.redirect("/"+name)
  }

  else {
    return res.render('error', { ERROR: 'FORBIDDEN' })
  }
}


controller.chat_show = function(req, res) {
  var name = req.params.name
    , user = getUser(req)
    , chat = getChat(name)

  if (!chat) {
    return res.render('error', { ERROR: 'NOT FOUND' })
  }

  if (!user) {
    user = req.session.user = new TALK.models.User()
    return res.render('join', { chat : chat, user : user })
  }

  if (user.chats[chat.name]) {
    return res.render('chat', { title : 'TALK', chat : chat, user : user })
  } else {
    return res.render('join', { chat : chat, user : user })
  }

}


controller.chat_post = function(req, res) {
  var new_post    = req.body.post
    , client_date = req.body.date
    , name = req.params.name
    , user = getUser(req)
    , chat = getChat(name)

  if (chat && user && user.chats[chat.name] && new_post) {
    // Limit posts lenght
    if (new_post.length > TALK.settings.max_length_of_post) {
      return res.send({ error: 'too long'})
    }
    chat.addPost(client_date, new_post, user)
    res.send('ok')
  } else {
    return res.send({ error : 'not found' })
  }
}


controller.chat_load = function(req, res) {
  var name = req.params.name
    , last = req.body.last
    , loop = req.body.loop == "true"
    , time = TALK.settings.loop_initial_time
    , user = getUser(req)
    , chat = getChat(name)
    , last_limit
    , posts

  if (!(chat && user && user.chats[chat.name])) {
    return res.send({ error : 'FORBIDDEN' })
  }

  slicePosts()

  function slicePosts() {

    // If the chat was removed while waiting...
    chat = getChat(name)

    if (loop && !chat) {
      return res.send({ error : 'removed' })
    }

    // Send only the last posts
    last_limit = TALK.settings.stored_posts_per_user * chat.users
    if (last == 0 && chat.posts.length > last_limit) {
      last += chat.posts.length - last_limit
    }
    posts = chat.posts.slice(last)

    // Send posts or continue the queue
    if (posts.length || !loop || time > TALK.settings.loop_limit) {
      return res.send(posts)
    }

    time += TALK.settings.loop_scale_factor
    setTimeout(slicePosts, time)
  }

}


controller.chat_rm = function(req, res) {
  var name      = req.params.name
    , user      = getUser(req)
    , user_chat = user.chats[name]

  if (!(user && user_chat)) {
    return res.render('error', { ERROR: 'FORBIDDEN' })
  }

  delete TALK.collections.chats[name]
  delete user.chats[name]
  return res.send('ok')
}

// 404
controller.error = function(req, res) {
  return res.render('error', { ERROR: 'FORBIDDEN' })
}
