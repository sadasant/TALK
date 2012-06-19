var Markdown = require('node-markdown').Markdown
  , models = {}
  , TALK

module.exports = function(_TALK) {
  TALK = _TALK
  TALK.models = models
}

// Chat Model
// ----------

// Each time a user creates a chat room,
// a new Chat Model is created within the
// chats collection.
models.Chat = (function() {

  // ### Chat Constructor
  // This function will be the chat generator
  // it receives the chat name and password
  // and adds the new chat scheme to the
  // chats collection.
  return function(name, pass) {
    // **The Chat Schema**
    //  stores the given name and password
    //  inside an object literal, with other
    //  attributes we care and with functions
    //  inside the scope.
    var chat = {
      id      : TALK.stats.chats.count++
    , name    : name
    , pass    : pass
    , posts   : []
    , users   : 0
    , date    : new Date()
    , addPost : addPost
    }
    TALK.collections.chats[chat.name] = chat
    return chat
  }

  // ### Adding posts to the current chat
  // This method of the Chat Model creates
  // a new post and stores it inside the
  // chat posts array.
  function addPost(client_date, post, user) {
    var removable

    post = new TALK.models.Post(client_date, post, user)
    post.position = this.posts.length
    this.posts.push(post)

    // If the current stored posts exceed
    // the max ammount of stored posts per user
    // we must remove the last stored post.
    removable = this.posts.length - (TALK.settings.stored_posts_per_user*this.users)
    if (removable > 0) delete this.posts[removable-1]
  }

})()


// User Model
// ----------

// When any given client reaches TALK,
// we create a new user and store it in the
// users collection.
models.User = (function() {

  return function(name) {
    var count = TALK.stats.users.count++
    var user = {
      id      : ''+count
    , name    : name || "User "+count
    , chats   : {}
    , date    : new Date()
    , addChat : addChat
    }
    TALK.collections.users[user.id] = user
    return user
  }

  function addChat(chat) {
    var user_chat = {
      id : chat.id
    }
    this.chats[chat.name] = user_chat
    chat.users++
  }

})()


// Post Model
// ----------

// Each time a user post a new comment,
// we create a new post, the controller
// then will pass this object to the `addPost`
// function inside the Chat model.
models.Post = (function() {

  return function(date, post, user) {
    var post = {
      post     : Markdown(post.replace(/</g,'&#60;')).replace(/&amp;#60;/g,'&#60;') // Amateur XSS fix
    , client   : {
        date   : date
      }
    , user     : {
        id     : user.id
      , name   : user.name
      }
    , date     : new Date()
    , position : 0
    }
    return post
  }

})()
