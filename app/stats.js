module.exports = function(TALK) {

  TALK.stats = {
    chats : CHATS
  , users : USERS
  , flush : flush
  }
}

var CHATS = {
    count : 0
  }
  , USERS = {
    count : 0
  }

function flush() {
  CHATS.count = 0
  USERS.count = 0
}
