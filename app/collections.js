module.exports = function(TALK) {
  TALK.collections = {
    chats : CHATS
  , users : USERS
  , flush : flush
  }
}

var CHATS = {}
  , USERS = {}

function flush() {
  USERS.length = 0

  for (var k in CHATS) {
    delete CHATS[k]
  }

  CHATS = {}
}
